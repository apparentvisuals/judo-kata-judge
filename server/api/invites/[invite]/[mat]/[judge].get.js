import Invite from '~/server/models/invite';
import Judge from '~/server/models/judge';

export default defineEventHandler(async (event) => {
  const invite = getRouterParam(event, 'invite');
  const judgeId = getRouterParam(event, 'judge');
  if (!judgeId) {
    return createError({ statusCode: 404, message: 'Judge not found' });
  }

  const inviteData = await Invite.get(invite);
  if (!inviteData) {
    return createError({ statusCode: 404, message: 'Judge not found' });
  }

  try {
    const judge = await Judge.get(judgeId.toUpperCase());
    if (!judge) {
      return createError({ statusCode: 404, message: 'Judge not found' });
    }
    return judge;
  } catch (err) {
    return createError({ statusCode: 400, message: err.message });
  }
});
