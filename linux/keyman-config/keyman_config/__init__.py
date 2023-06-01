import gettext

from keyman_config.sentry_handling import SentryErrorHandling

from keyman_config.version import (
  __version__,
  __versionwithtag__,
  __versiongittag__,
  __majorversion__,
  __releaseversion__,
  __tier__,
  __pkgversion__,
  __environment__,
  __uploadsentry__
)


def _(txt):
    translation = gettext.dgettext('keyman-config', txt)
    if translation == txt:
        translation = gettext.gettext(txt)
    return translation


def secure_lookup(data, key1, key2=None):
    """
    Return data[key1][key2] while dealing with data being None or key1 or key2 not existing
    """
    if not data:
        return None
    if key1 in data:
        if not key2:
            return data[key1]
        if key2 in data[key1]:
            return data[key1][key2]
    return None


gettext.bindtextdomain('keyman-config', '/usr/share/locale')
gettext.textdomain('keyman-config')


#if __tier__ == 'alpha' or __tier__ == 'beta':  // #7227 disabling:
    # Alpha and beta versions will work against the staging server so that they
    # can access new APIs etc that will only be available there. The staging
    # servers have resource constraints but should be okay for limited use.
#    KeymanComUrl = 'https://keyman-staging.com'
#    KeymanApiUrl = 'https://api.keyman-staging.com'
#else:
KeymanComUrl = 'https://keyman.com'
KeymanApiUrl = 'https://api.keyman.com'


# There's no staging site for downloads
KeymanDownloadsUrl = 'https://downloads.keyman.com'

SentryErrorHandling().initialize_sentry()
