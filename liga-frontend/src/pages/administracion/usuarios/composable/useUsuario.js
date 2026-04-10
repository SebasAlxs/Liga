const columns = [
  { name: 'photo', align: 'center', label: 'Photo', field: 'photo' },
  {
    name: 'name',
    required: true,
    label: 'Member name',
    align: 'left',
    field: 'name',
    sortable: true,
  },
  { name: 'mobile', label: 'Mobile', align: 'left', field: 'mobile' },
  { name: 'email', label: 'Email', align: 'left', field: 'email' },
  { name: 'status', label: 'Status', align: 'center', field: 'status', sortable: true },
  { name: 'operation', label: 'Operation', align: 'center', field: 'operation' },
  { name: 'action', label: 'Action', align: 'center', field: 'action' },
]

export const useUsuario = () => {
  return {
    columns,
  }
}
