export default defineNuxtRouteMiddleware((to, from) => {
  const cookie = useCookie('jkj', { default: () => ({}) });
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
})
