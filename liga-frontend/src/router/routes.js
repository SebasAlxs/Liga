const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/administracion/inicios/IndexPage.vue'), meta: { roles: ['PUBLIC', 'VOCAL', 'SUPERADMIN'] } },
      {
        path: 'admin-dashboard',
        name: 'admin-dashboard',
        component: () => import('pages/admin/DashboardPage.vue'),
        meta: { roles: ['SUPERADMIN'] }
      },
      {
        path: 'referees',
        name: 'referees',
        component: () => import('pages/administracion/referees/IndexPage.vue'),
        meta: { roles: ['SUPERADMIN'] }
      },
      {
        path: 'referees/:id',
        name: 'referee-details',
        component: () => import('pages/administracion/referees/DetailPage.vue'),
        meta: { roles: ['SUPERADMIN'] }
      },
      {
        path: 'usuario',
        name: 'usuario',
        component: () => import('pages/administracion/usuarios/IndexPage.vue'),
        meta: { roles: ['VOCAL', 'SUPERADMIN'] }
      },
      {
        path: 'inicio',
        name: 'inicio',
        component: () => import('pages/administracion/inicios/IndexPage.vue'),
        meta: { roles: ['PUBLIC', 'VOCAL', 'SUPERADMIN'] }
      },
      {
        path: 'inicio/edit/:id',
        name: 'edit-inicio',
        component: () => import('pages/administracion/inicios/EditPage.vue'),
        meta: { roles: ['SUPERADMIN'] }
      },
      {
        path: 'admin',
        name: 'admin',
        component: () => import('pages/administracion/admins/IndexPage.vue'),
        meta: { roles: ['PUBLIC', 'VOCAL', 'SUPERADMIN'] }
      },
      {
        path: 'admin/details/:id',
        name: 'team-details',
        component: () => import('pages/administracion/admins/TeamDetailsPage.vue'),
        meta: { roles: ['PUBLIC', 'VOCAL', 'SUPERADMIN'] }
      },
      {
        path: 'tournaments',
        name: 'tournaments',
        component: () => import('pages/administracion/tournaments/IndexPage.vue'),
        meta: { roles: ['SUPERADMIN'] }
      },
      {
        path: 'matches',
        name: 'matches',
        component: () => import('pages/administracion/matches/IndexPage.vue'),
        meta: { roles: ['PUBLIC', 'VOCAL', 'SUPERADMIN'] }
      },
      {
        path: 'matches/:id',
        name: 'match-details',
        component: () => import('pages/administracion/matches/MatchDetailsPage.vue'),
        meta: { roles: ['PUBLIC', 'VOCAL', 'SUPERADMIN'] }
      },
      {
        path: 'headquarters',
        name: 'headquarters',
        component: () => import('pages/administracion/headquarters/IndexPage.vue'),
        meta: { roles: ['SUPERADMIN'] }
      },
      {
        path: 'groups',
        name: 'groups',
        component: () => import('pages/administracion/groups/IndexPage.vue'),
        meta: { roles: ['PUBLIC', 'VOCAL', 'SUPERADMIN'] }
      },
      {
        path: 'vocal-matches',
        name: 'vocal-matches',
        component: () => import('pages/administracion/matches/IndexPage.vue'),
        meta: { roles: ['VOCAL', 'SUPERADMIN'] }
      },
      {
        path: 'vocal-matches/:id/sheet',
        name: 'vocal-sheet',
        component: () => import('pages/vocal/VocalMatchSheetPage.vue'),
        meta: { roles: ['VOCAL', 'SUPERADMIN'] }
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
