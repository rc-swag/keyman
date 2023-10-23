/*
  Copyright:    © 2023 SIL International.
  Description:  Internal actions methods for Keyman Core
  Create Date:  23 Oct 2023
  Authors:      Marc Durdin (MCD)
  History:      23 Oct 2023 - MCD - Initial implementation
*/

#pragma once

#include <keyman/keyman_core_api.h>

namespace km {
namespace kbp
{
  km_core_actions* action_items_to_actions(
    km_core_action_item const *action_items
  );
} // namespace kbp
} // namespace km
