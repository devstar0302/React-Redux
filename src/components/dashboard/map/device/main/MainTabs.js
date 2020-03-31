export default (deviceId) => {
  return [{
    title: 'Incidents',
    path: `/device/${deviceId}/main`
  },
  {
    title: 'Workflows',
    path: `/device/${deviceId}/main/workflows`
  },
  {
    title: 'Advanced',
    path: `/device/${deviceId}/main/advanced`
  }]
}
