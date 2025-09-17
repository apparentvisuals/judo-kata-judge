import Match from '~/server/models/match';
import Tournament from '~/server/models/tournament';
import { getToken, getAuth, matchDataToScores } from '~/server/utils';

export default defineEventHandler(async (event) => {
  const token = getToken(event);
  if (!token) {
    return createError({ statusCode: 401, message: 'unauthorized' });
  }
  if (!getAuth(token)) {
    return createError({ statusCode: 403, message: 'forbidden' });
  }
  try {
    const tournamentId = getRouterParam(event, 'tournament');
    if (!tournamentId) {
      return createError({ statusCode: 404, message: 'Tournament not found' });
    }
    const tournament = await Tournament.get(tournamentId);
    if (!tournament) {
      return createError({ statusCode: 404, message: 'Tournament not found' });
    }
    for (const mat of tournament.data.mats) {
      for (const group of mat.groups) {
        for (const match of group.matches.filter(match => match.completed)) {
          const matchData = await Match.get(match.id);
          if (matchData) {
            const scores = matchDataToScores(matchData, group);
            Object.assign(match, { scores });
          }
        }
      }
    }
    return tournament.data;
  } catch (err) {
    return createError({ statusCode: 400, message: err.message });
  }

});
