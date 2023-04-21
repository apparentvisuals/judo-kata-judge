export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useAuth();
  const admin = useAdmin();
  if (to.path.startsWith('/admin')) {
    if (to.path === '/admin/code') {
      return;
    }
    if (admin.value === '') {
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
    if (auth.value === '') {
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
