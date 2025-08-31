/**
 * Called by a judge when submitting scores
 */

import Invite from '~/server/models/invite';
import ShadowResult from '../../../../models/shadow-result';

export default defineEventHandler(async (event) => {
  const invite = getRouterParam(event, 'invite');
  const matNumber = parseInt(getRouterParam(event, 'mat'));

  const tournament = await Invite.getTournament(invite);
  const { match } = tournament.getNextMatch(matNumber);
  if (!match) {
    return createError({ statusCode: 404, statusMessage: 'no more matches' })
  }

  const { matchId, judgeId, judgeName, scores } = await readBody(event);
  if (matchId !== match.id) {
    return createError({ statusCode: 400, statusMessage: 'submission aborted, incorrect match' });
  }

  const shadowResult = { id: `${matchId}+${judgeId}`, name: judgeName, scores };
  try {
    return await ShadowResult.create(shadowResult);
  } catch (err) {
    return createError({ statusCode: 400, statusMessage: 'Match already submitted' });
  }
});
