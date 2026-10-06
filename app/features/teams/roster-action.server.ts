import { type ActionResult, fail } from '~/lib/action-result'
import { optionalInt, text } from '~/lib/form-data'
import {
  addPlayer,
  deletePlayer,
  renewInvite,
  toggleCaptain,
  unlinkPlayer,
  updatePlayer,
} from './roster.server'
import { toPosition } from './team'

export async function rosterAction(
  teamId: string,
  form: FormData
): Promise<ActionResult> {
  const playerId = text(form, 'playerId')
  const player = {
    nickname: text(form, 'nickname'),
    position: toPosition(optionalInt(form, 'position')),
  }

  switch (text(form, 'intent')) {
    case 'addPlayer':
      return addPlayer(teamId, player)
    case 'updatePlayer':
      return updatePlayer(teamId, playerId, player)
    case 'toggleCaptain':
      return toggleCaptain(teamId, playerId)
    case 'newInvite':
      return renewInvite(teamId, playerId)
    case 'unlinkPlayer':
      return unlinkPlayer(teamId, playerId)
    case 'deletePlayer':
      return deletePlayer(teamId, playerId)
    default:
      return fail('Неизвестное действие')
  }
}
