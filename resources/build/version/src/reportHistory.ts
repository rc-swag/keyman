import { warning as logWarning } from '@actions/core';

import { GitHub } from '@actions/github';

import { findLastHistoryPR, getAssociatedPR} from './graphql/queries';
import { spawnChild } from './util/spawnAwait';

const getPullRequestInformation = async (
  octokit: GitHub, base: string
): Promise<string | undefined> => {
  const response = await octokit.graphql(
    findLastHistoryPR(base)
  );

  if (response === null) {
    return undefined;
  }

  const {
    search: {
      nodes: [
        {
          mergeCommit: {
            oid: commit_id
          }
        }
      ]
    }
  } = response;

  return commit_id;
};

interface PRInformation {
  title: string;
  number: number;
}

const getAssociatedPRInformation = async (
  octokit: GitHub,
  commit_id: string
): Promise<PRInformation | undefined> => {
  const response = await octokit.graphql(
    getAssociatedPR,
    { sha: commit_id }
  );

  if (response === null || response.repository.commit === null) {
    return undefined;
  }

  //console.log(JSON.stringify(response));

  const {
    repository: {
      commit: {
        parents: {
          nodes: [
            {
              associatedPullRequests: {
                nodes: [
                  {
                    title: title,
                    number: number
                  }
                ]
              }
            }
          ]
        }
      }
    }
  } = response;

  return { title, number };
};

/**
 * Retrieves any  outstanding pull request titles to HISTORY.md for the
 * current version. Retrieves pull request details from GitHub.
 * @returns array of pull requests
 */

export const reportHistory = async (
  octokit: GitHub, base: string, force: boolean, useGitHubPRInfo: boolean
): Promise<PRInformation[]> => {

  //
  // Get the last auto history merge commit ref
  //

  const commit_id = await getPullRequestInformation(octokit, base);
  if (commit_id === undefined) {
    throw 'Unable to fetch pull request information.';
  }

  //
  // Now, use git log to retrieve list of merge commit refs since then
  //

  const git_result = (await spawnChild('git', ['log', '--merges', '--first-parent', '--format=%H', `origin/${base}`, `${commit_id}..origin/${base}`])).trim();
  if(git_result.length == 0 && !force) {
    // We won't throw on this
    logWarning('No pull requests found since previous increment');
    return [];
  }

  const new_commits = git_result.split(/\r?\n/g);

  //
  // Retrieve the pull requests associated with each merge
  //
  let pulls: PRInformation[] = [];

  if(git_result.length == 0) {
    pulls.push({
      title: 'No changes made',
      number: 0
    });
  } else {
    const re = /#(\d+)/;
    for(const commit of new_commits) {
      if(!useGitHubPRInfo) {
        const git_pr_title = (await spawnChild('git', ['log', '--format=%b', '-n', '1', commit])).trim();
        const git_pr_data = (await spawnChild('git', ['log', '--format=%s', '-n', '1', commit])).trim();
        const e = re.exec(git_pr_data);
        if(e) {
          const pr: PRInformation = {
            title: git_pr_title,
            number: parseInt(e[1], 10)
          };
          if(pulls.find(p => p.number == pr.number) == undefined) {
            pulls.push(pr);
          }
        }
      } else {
        const pr = await getAssociatedPRInformation(octokit, commit);
        if(pr === undefined) {
          logWarning(`commit ref ${commit} has no associated pull request.`);
          continue;
        }
        if(pulls.find(p => p.number == pr.number) == undefined) {
          pulls.push(pr);
        }
      }
    }
  }
  return pulls;
};
