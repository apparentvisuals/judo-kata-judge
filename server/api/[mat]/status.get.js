import db from '../../db';

export default defineEventHandler(async (event) => {
  const token = getToken(event);
  if (!token) {
    return;
  }

  const mat = parseInt(event.context.params.mat - 1);
  const tournament = await db.tournament(token);
  const { numberOfJudges, clients } = tournament.getMatch(mat);

  return { numberOfJudges, numberOfClients: clients.count };
});
