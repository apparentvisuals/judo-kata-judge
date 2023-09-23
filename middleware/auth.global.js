export default defineNuxtRouteMiddleware((to, from) => {
  const cookie = useCookie('jkj', { default: () => ({}) });
  const auth = useAuth();
  if (to.path.startsWith('/admin')) {
    if (to.path === '/admin/code') {
      return;
    }
    if (!cookie.value.adminCode) {
      return navigateTo(
        {
          path: '/admin/code',
          query: {
            from: to.path,
          }
        },
        { replace: true }
      );
    }
  }
  else if (to.path !== '/code' && to.path !== '/setup') {
    if (!cookie.value.tCode) {
      return navigateTo(
        {
          path: '/code',
          query: {
            from: to.path,
          }
        },
        { replace: true }
      );
    }
  }
})
