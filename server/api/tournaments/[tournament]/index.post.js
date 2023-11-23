import Tournament from '~/server/models/tournament';
import { getAuth, getToken } from '~/server/utils';

export default defineEventHandler(async (event) => {
  const token = getToken(event);
  if (!token) {
    return createError({ statusCode: 401, message: 'unauthorized' });
  }
  if (token !== getAuth()) {
    return createError({ statusCode: 403, message: 'forbidden' });
  }
  const tournamentId = getRouterParam(event, 'tournament');
  if (!tournamentId) {
    return createError({ statusCode: 404, message: 'Tournament not found' });
  }
  const { name, org, showJudgeTotals, mats } = await readBody(event);
  const tournament = await Tournament.get(tournamentId);
  if (!tournament) {
    return createError({ statusCode: 404, message: 'Tournament not found' });
  }
  if (tournament.data.version !== 3) {
    tournament.upgrade();
    await tournament.save();
    return { ...tournament.data, upgrade: true };
  } else {
    tournament.update({ name, org, showJudgeTotals, mats });
    await tournament.save();
    return tournament.data;
  }

});
