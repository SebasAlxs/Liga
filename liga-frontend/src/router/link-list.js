export const linksList = [
  {
    title: 'Pantalla de Inicio',
    caption: 'Lanzamiento y Novedades',
    icon: 'las la-home',
    link: 'inicio',
    roles: ['PUBLIC', 'VOCAL', 'SUPERADMIN']
  },
  {
    title: 'Posiciones',
    caption: 'Tabla de Clasificación',
    icon: 'las la-table',
    link: 'admin',
    roles: ['PUBLIC', 'VOCAL', 'SUPERADMIN']
  },
  {
    title: 'Equipos',
    caption: 'Participantes de la Liga',
    icon: 'las la-users',
    link: 'groups',
    roles: ['PUBLIC', 'VOCAL', 'SUPERADMIN']
  },
  {
    title: 'Partidos',
    caption: 'Calendario y Resultados',
    icon: 'las la-futbol',
    link: 'matches',
    roles: ['PUBLIC', 'VOCAL', 'SUPERADMIN']
  },
  {
    title: 'Vocalía de Turno',
    caption: 'Gestión de Planillas',
    icon: 'las la-file-signature',
    link: 'vocal-matches',
    roles: ['VOCAL', 'SUPERADMIN']
  },
  {
    title: 'Panel de Control',
    caption: 'Configuración Maestra',
    icon: 'las la-cog',
    link: 'admin-dashboard',
    roles: ['SUPERADMIN']
  }
]
