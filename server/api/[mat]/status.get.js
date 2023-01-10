import db from '../../db';

export default defineEventHandler((event) => {
  const mat = parseInt(event.context.params.mat - 1);
  const { numberOfJudges, clients } = db.getMatch(mat);
  return { numberOfJudges, numberOfClients: clients.count };
});
