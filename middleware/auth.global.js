export default defineNuxtRouteMiddleware(async (to, from) => {
  const auth = useAuth();
  if (to.path !== '/code' && to.path !== '/setup') {
    if (auth.value === '') {
      await navigateTo({
        path: '/code',
        query: {
          from: to.path,
        }
      });
    }
  }
})
