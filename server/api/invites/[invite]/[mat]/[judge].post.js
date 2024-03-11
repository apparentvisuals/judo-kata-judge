/**
 * Called by a judge when submitting scores
 */
import db from '~/server/db';
import { notifyAllClients, createSummaryMessage, matchDataToScores, createReport, createUpdateEvent, objectToEventString, createSummaryEvent } from '~/server/utils';
import Match from '~/server/models/match';
import Invite from '~/server/models/invite';

export default defineEventHandler(async (event) => {
  const invite = getRouterParam(event, 'invite');
  const matNumber = parseInt(getRouterParam(event, 'mat'));
  const judgeNumber = parseInt(getRouterParam(event, 'judge'));

  const tournament = await Invite.getTournament(invite);
  const { match, group, matchIndex, groupIndex } = tournament.getNextMatch(matNumber);
  if (!match) {
    return createError({ statusCode: 404, message: 'no more matches' })
  }

  const { id, judge } = await readBody(event);
  if (id !== match.id) {
    return createError({ statusCode: 400, zmessage: 'submission aborted, incorrect match' });
  }

  let matchData = await Match.get(id);
  if (matchData[judgeNumber] && matchData[judgeNumber].id) {
    return createError({ statusCode: 400, statusMessage: 'submission aborted, judge has already submitted' });
  }

  matchData[judgeNumber] = judge;
  const scores = matchDataToScores(matchData, group);
  const completed = scores.every((score) => score.id != null);
  const changes = { completed, [judgeNumber]: judge };
  matchData = await Match.update(id, changes, { _etag: matchData._etag });

  if (matchData.completed) {
    const results = createReport(group, { completed, scores });
    const summary = { scores: results.summary.values, total: results.summary.total };
    tournament.updateMatch(matNumber, groupIndex, matchIndex, { id, completed, summary });
    await tournament.save();
  }

  const message = objectToEventString(await createUpdateEvent(tournament, matNumber));
  const updates = db.notifications(`updates-${invite}-${matNumber}`);
  updates.notify(() => {
    const clients = db.clients(`${invite}-${matNumber}`);
    notifyAllClients(clients.match.list, message);
  });

  const summary = db.notifications('summary-${invite}');
  summary.notify(() => {
    if (matchData.completed) {
      const summaryClients = db.clients(`${invite}--1`);
      notifyAllClients(summaryClients.summary.list, objectToEventString(createSummaryEvent(tournament.data)));
    }
  });

  return scores.map((judgeScore) => !!judgeScore.name);
});
