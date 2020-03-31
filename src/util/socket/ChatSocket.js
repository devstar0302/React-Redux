export default class ChatSocket {
  // constructor(props) {

  // }
  connect () {
    const me = this

    if (me.ws) {
      me.close()
      return
    }

    try {
      me.ws = new WebSocket(`ws://imchat.dev.securegion.com/incidentchat`) // eslint-disable-line no-undef
      me.ws.onopen = me.onOpen.bind(me)
      me.ws.onmessage = me.onMessage.bind(me)
      me.ws.onclose = me.onClose.bind(me)
      me.reconnectOnClose = true
    } catch (e) {
      console.log(e)

      setTimeout(me.connect.bind(me), 3000)
    }
  }
}

export const chatSocket = {

  ws: null,

  mappings: {},
  reconnectOnClose: false,
  connected: false,

  id: '',

  init: function (id) {
    this.id = id
  },

  connect: function () {
    let me = this

    if (me.ws) {
      me.close()
      return
    }

    try {
      me.ws = new WebSocket(`ws://${getServerDomain()}/incidentchat`) // eslint-disable-line no-undef
      me.ws.onopen = me.onOpen.bind(me)
      me.ws.onmessage = me.onMessage.bind(me)
      me.ws.onclose = me.onClose.bind(me)
      me.reconnectOnClose = true
    } catch (e) {
      console.log(e)

      setTimeout(me.connect.bind(me), 3000)
    }
  },

  getId: function () {
    return this.id
  },

  addListener: function (msg, cb) {
    const me = this
    if (!msg || !cb) return
    if (!me.mappings[msg]) me.mappings[msg] = []

    me.mappings[msg].push(cb)
  },

  removeListener: function (msg, cb) {
    const me = this
    if (!msg || !cb) return

    let mappings = me.mappings[msg]
    if (!mappings) return

    const index = mappings.indexOf(cb)
    if (index >= 0) {
      mappings.splice(index, 1)
    }

    return true
  },

  close: function () {
    let me = this
    me.reconnectOnClose = false
    if (!me.ws) return
    me.ws.close()
    me.ws = null
  },

    // /////////////////////////////////

  onOpen: function (e) {
    this.connected = true
    this.notifyListeners('open')
  },

  onMessage: function (e) {
    try {
      let msgObj = JSON.parse(e.data)
      this.notifyListeners('message', msgObj)
    } catch (e) {
      console.log(e)
    }
  },

  notifyListeners: function (event, data) {
    let mapping = this.mappings[event]

    if (!mapping) return
    mapping.forEach(cb => {
      cb(data)
    })
  },

  onClose: function (e) {
    let me = this
    if (this.connected) {
      this.notifyListeners('close')
    }
    this.connected = false
    me.ws = null

    if (me.reconnectOnClose) {
            // Retry connection
      console.log('Chat Socket Retrying To Connect...')
      setTimeout(me.connect.bind(me), 5000)
    }
  },

    // ////////////////////////////////////

  send: function (obj) {
    let me = this
    if (!me.ws) return false
    let str = JSON.stringify(obj)
    me.ws.send(str)
    return true
  }
}
