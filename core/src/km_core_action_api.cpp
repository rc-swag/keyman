/*
  Copyright:    © 2023 SIL International.
  Description:  Implementation of the action API functions using internal
                data structures and functions.
  Create Date:  23 Oct 2023
  Authors:      Marc Durdin (MCD)
  History:      23 Oct 2023 - MCD - Initial implementation.
*/
#include <cassert>
#include <algorithm>
#include <sstream>

#include "keyman_core.h"

#include "jsonpp.hpp"

#include "processor.hpp"
#include "state.hpp"
#include "action.hpp"

using namespace km::core;

km_core_actions const * km_core_state_get_actions(
  km_core_state const *state
) {
  assert(state);
  if(!state) {
    return nullptr;
  }

  auto action_items = km_core_state_action_items(state, nullptr);
  if(!action_items) {
    return nullptr;
  }

  km_core_actions * result = action_item_list_to_actions_object(action_items);

  if(state->processor().supports_normalization()) {
    // Normalize to NFC for those keyboard processors that support it
    if(!actions_normalize(km_core_state_context(state), km_core_state_app_context(state), result)) {
      km_core_actions_dispose(result);
      return nullptr;
    }
  }
  return result;
}

km_core_status km_core_actions_dispose(
  km_core_actions const * actions
) {
  if(actions == nullptr) {
    return KM_CORE_STATUS_OK;
  }

  if(actions->output) {
    delete[] actions->output;
  }

  if(actions->persist_options) {
    for(auto option = actions->persist_options; option->scope; option++) {
      delete[] option->key;
      delete[] option->value;
    }
    delete[] actions->persist_options;
  }

  delete actions;

  return KM_CORE_STATUS_OK;
}


