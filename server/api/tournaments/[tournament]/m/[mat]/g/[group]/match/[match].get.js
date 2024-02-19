import Match from '~/server/models/match';
import Tournament from '~/server/models/tournament';
import { createReport, getAuth, getToken, matchDataToScores } from '~/server/utils';

export default defineEventHandler(async (event) => {
  const token = getToken(event);
  if (!token) {
    return createError({ statusCode: 401, message: 'unauthorized' });
  }
  if (!getAuth(token)) {
    return createError({ statusCode: 403, message: 'forbidden' });
  }
  const tournamentId = getRouterParam(event, 'tournament');
  const matNumber = parseInt(getRouterParam(event, 'mat'));
  const groupNumber = parseInt(getRouterParam(event, 'group'));
  const matchNumber = parseInt(getRouterParam(event, 'match'));
  const tournament = await Tournament.get(tournamentId);
  const group = tournament.getGroup(matNumber, groupNumber);
  const match = tournament.getMatch(matNumber, groupNumber, matchNumber);
  const matchData = await Match.get(match.id);
  match.scores = matchDataToScores(matchData);
  match.results = createReport(group, match);
  return match;
});
