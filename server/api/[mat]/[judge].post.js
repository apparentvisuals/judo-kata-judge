import db from '../../db';
import { notifyAllClients, createUpdateMessage, createReportMessage, createReport } from '../../utils';

export default defineEventHandler(async (event) => {
    const authorization = getHeader(event, 'authorization');
    if (!authorization) {
        return;
    }
    const [_header, token] = authorization.split(' ');
    if (_header !== 'Bearer' || !token) {
        return;
    }

    const mat = parseInt(event.context.params.mat - 1);
    const judge = parseInt(event.context.params.judge - 1);
    const { move, deductions, total } = await readBody(event);

    const tournament = await db.tournament(token);
    const matchInfo = tournament.getMatch(mat);
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
    await tournament.save();

    const clients = db.clients(`${token}-${mat}`);
    notifyAllClients(clients.match.list, createUpdateMessage(judgeInfo));
    notifyAllClients(clients.report.list, createReportMessage(matchInfo.results));

    return {};
});
