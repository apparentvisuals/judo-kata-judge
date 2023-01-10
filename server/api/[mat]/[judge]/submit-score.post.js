import db from '../../../db';
import { notifyAllClients, createUpdateMessage, createReportMessage, createReport } from '../../../utils';

export default defineEventHandler(async (event) => {
  const mat = parseInt(event.context.params.mat - 1);
  const judge = parseInt(event.context.params.judge - 1);
  const { move, deductions, total } = await readBody(event);

  const matInfo = db.getMat(mat);
  const matchInfo = db.getMatch(mat);
  if (!matchInfo) {
    return {};
  }
  const judgeInfo = matchInfo.judges[judge];
  const [_small1, _small2, _medium, _big, forgotten, _correction] = deductions.split(':');
  judgeInfo.scores[move].value = total;
  judgeInfo.scores[move].deductions = deductions;
  if (forgotten === '1') {
    judgeInfo.majorIndex[move] = move + 1;
  }
  matchInfo.results = createReport(matchInfo);

  notifyAllClients(matInfo.clients.clients, createUpdateMessage(judgeInfo));
  notifyAllClients(matInfo.reportClients.clients, createReportMessage(matchInfo.results));

  return {};
});
