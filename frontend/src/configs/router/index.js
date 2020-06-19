export const UnauthenticatedRoutes = [
  {
    exact: true,
    path: '/login',
    component: 'login'
  },
  {
    exact: true,
    path: '/register',
    component: 'register'
  }
]

export const AuthenticatedRoutes = [
  {
    exact: true,
    path: '/lun',
    component: 'home'
  },
  {
    exact: true,
    path: '/sites',
    component: 'siteManager'
  },
  {
    exact: true,
    path: '/shops',
    component: 'shopManager'
  },
  {
    exact: true,
    path: '/shops/dishes/:id',
    component: 'dishManager'
  },
  {
    exact: true,
    path: '/menu',
    component: 'menuManager'
  },
  {
    exact: true,
    path: '/report',
    component: 'report'
  },
  {
    exact: true,
    path: '/users',
    component: 'userManage'
  },
  {
    exact: true,
    path: '/order',
    component: 'order'
  },
  {
    exact: true,
    path: '/menu/:id/:shopId',
    component: 'menuDetail'
  }
]
