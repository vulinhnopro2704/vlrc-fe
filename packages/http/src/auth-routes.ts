export const DEFAULT_AUTH_ROUTE_PATHS = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/auth/callback',
] as const;

export const DEFAULT_AUTH_API_PATHS = [
  '/auth/login',
  '/auth/register',
  '/auth/refresh',
  '/auth/logout',
  '/auth/verify-email',
  '/auth/forgot-password',
  '/auth/reset-password',
] as const;

export const isAuthRoutePath = (
  pathname: string,
  authPaths: readonly string[] = DEFAULT_AUTH_ROUTE_PATHS,
): boolean => authPaths.some((route) => pathname === route || pathname.startsWith(`${route}/`));

export const shouldRedirectToLogin = (
  routerPathname: string,
  authPaths: readonly string[] = DEFAULT_AUTH_ROUTE_PATHS,
): boolean => {
  const browserPathname = typeof window !== 'undefined' ? window.location.pathname : routerPathname;
  return (
    !isAuthRoutePath(routerPathname, authPaths) && !isAuthRoutePath(browserPathname, authPaths)
  );
};

export const subscribeUnauthorized = (
  handler: () => void,
  eventName = 'auth:unauthorized',
): (() => void) => {
  if (typeof window === 'undefined') {
    return () => undefined;
  }
  window.addEventListener(eventName, handler);
  return () => window.removeEventListener(eventName, handler);
};
