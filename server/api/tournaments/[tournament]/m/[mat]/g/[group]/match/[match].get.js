import { pick } from 'lodash-es';

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
  if (!tournamentId) {
    return createError({ statusCode: 404, message: 'Tournament not found' });
  }

  const matNumber = parseInt(getRouterParam(event, 'mat'));
  const groupNumber = parseInt(getRouterParam(event, 'group'));
  const matchNumber = parseInt(getRouterParam(event, 'match'));

  const tournament = await Tournament.get(tournamentId);
  if (!tournament) {
    return createError({ statusCode: 404, message: 'Tournament not found' });
  }

  const group = tournament.getGroup(matNumber, groupNumber);
  const match = tournament.getMatch(matNumber, groupNumber, matchNumber);

  const matchData = await Match.get(match.id);
  if (!matchData) {
    return createError({ statusCode: 404, message: 'Match info not found' });
  }
  const scores = matchDataToScores(matchData, group);
  const results = createReport(group, { ...match, scores });
  return {
    ...match,
    scores,
    results,
    tournament: pick(tournament.data, ['name', 'org']),
    kata: group.kata,
    numberOfJudges: match.completed ? scores.length : group.numberOfJudges,
  };
});
