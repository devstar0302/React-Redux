export default (deviceId, templateName) => {
  const items = [{
    title: 'Monitors',
    path: `/device/${deviceId}/monitor`
  }, {
    title: 'Event Logs',
    path: `/device/${deviceId}/monitor/eventlog`,
    exclude: ['Linux Server']
  }, {
    title: 'Applications',
    path: `/device/${deviceId}/monitor/app`,
    exclude: ['Linux Server']
  }, {
    title: 'Processes',
    path: `/device/${deviceId}/monitor/process`
  }, {
    title: 'Services',
    path: `/device/${deviceId}/monitor/service`
  }, {
    title: 'Users',
    path: `/device/${deviceId}/monitor/user`
  }, {
    title: 'Firewall',
    path: `/device/${deviceId}/monitor/firewall`
  }, {
    title: 'Network',
    path: `/device/${deviceId}/monitor/network`
  }, {
    title: 'Command',
    path: `/device/${deviceId}/monitor/command`
  }]

  if (templateName) {
    return items.filter(p => !p.exclude || p.exclude.indexOf(templateName) < 0)
  }
  return items
}
