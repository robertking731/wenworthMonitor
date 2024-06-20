// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
};

// ----------------------------------------------------------------------

export const paths = {
  minimalUI: 'https://mui.com/store/items/minimal-dashboard/',
  // AUTH
  auth: {
    jwt: {
      login: `${ROOTS.AUTH}/jwt/login`,
      register: `${ROOTS.AUTH}/jwt/register`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    build: `${ROOTS.DASHBOARD}/build`,
    monitor: `${ROOTS.DASHBOARD}/monitor`,
    research: `${ROOTS.DASHBOARD}/research`,
    watchlists: `${ROOTS.DASHBOARD}/watchlists`,
  },
};
