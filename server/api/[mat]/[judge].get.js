import { pick } from 'lodash-es';

import db from '../../db';
import { getTournamentToken, moveList } from '../../utils';

export default defineEventHandler(async (event) => {
    console.log('get judge info');
    const token = getTournamentToken(event);
    if (!token) {
        return;
    }

    const mat = parseInt(event.context.params.mat - 1);
    const judge = parseInt(event.context.params.judge - 1);

    const tournament = await db.tournament(token);
    const matchInfo = tournament.getMatch(mat);
    if (!matchInfo) {
        throw createError({ statusCode: 400, statusMessage: 'no more matches' })
    }
    const judgeInfo = matchInfo.judges[judge];
    return judgeInfo;
});
