import React, { Component } from 'react'
import Slider from 'rc-slider'
import {assign, findIndex, isArray} from 'lodash'
import d3 from 'd3'
import moment from 'moment'
import Transition from 'react-addons-css-transition-group'
import {countries} from 'country-data'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import IconButton from 'material-ui/IconButton'
import CropFreeIcon from 'material-ui/svg-icons/image/crop-free'
import FileIcon from 'material-ui/svg-icons/editor/insert-drive-file'

import countryLatlng from 'util/Country-latlng'
import IncidentSocket from 'util/socket/IncidentSocket'
import ThreatItemModal from './ThreatItemModal'

import { format } from 'shared/Global'

const handleStyle = {
  position: 'absolute',
  transform: 'translate(-50%, -50%)',
  cursor: 'pointer',
  padding: '2px',
  border: '2px solid #94EE2E',
  borderRadius: '3px',
  background: '#94EE2E',
  fontSize: '14px',
  textAlign: 'center',
  zIndex: 3,

  minHeight: '24px',
  marginTop: '3px'
}

export default class ThreatMap extends Component {

  constructor (props) {
    super(props)
    this.state = {
      mode: 'demo',
      settings: false,

      playing: false,
      sliderPos: 0,
      sliderMin: 0,
      sliderMax: 1,

      latestAttacks: [],

      popup: false,
      popupX: 0,
      popupY: 0,
      popupObject: null,

      speed: 20,

      maximized: false
    }

    assign(this, {
      vmap: null,
      svg: null,

      slider: null,

      attackers: [],
      devices: [],
      connections: [],
      blasts: [],

      scenario: [],
      countryNamesDisplayed: {},
      currentPlay: {
        scene: null,
        stopped: true,
        pause: false,
        screen: 0,
        frame: 0
      },

      buffer: [],
      buffertimer: 0,
      severities: ['HIGH', 'MEDIUM', 'LOW'],
      lastIncidentId: 0,

      incidentTimer: 0,
      realIncidentTimers: [],

      mode: null,

      scope: {
        maxSize: 6,
        animationSpeed: 2000,
        arcThickness: '2',
        borderColor: '#63233d',
        fadeOutSpeed: 1500
      },
      cancelled: false
    })

    this.initDemoScenario()
  }
  componentDidMount () {
    const me = this

    this.incidentSocket = new IncidentSocket({
      listeners: {
        'threat': this.onAddThreat.bind(this)
      }
    })
    this.incidentSocket.connect()

    me.vmap = $(this.refs.mapDiv).vectorMap({ // eslint-disable-line no-undef
      map: 'world_mill_en',

      backgroundColor: '#3C6A81',
      zoomMax: 1,

      regionStyle: {
        initial: {
          'fill': '#E8E8E9',
          'fill-opacity': 1,
          'stroke': 'none',
          'stroke-width': 1,
          'stroke-opacity': 1
        }
      },

      onViewportChange: () => {
        setTimeout(() => {
          me.onViewportChange()
        }, 1)
      }
    }).vectorMap('get', 'mapObject')

    const $svg = $(this.refs.mapDiv).find('svg') // eslint-disable-line no-undef
    me.svg = d3.select($svg[0])
    me.svg.append('text').attr('class', 'layer')
    me.buffertimer = setInterval(() => {
      // let $scope = me.scope

      if (!me.buffer.length) return
      let row = me.buffer[0]
      me.buffer.splice(0, 1)

      let {latestAttacks} = this.state

      latestAttacks.unshift(row)
      // if (latestAttacks.length > $scope.maxSize) {
      //   latestAttacks.pop()
      // }

      this.setState({ latestAttacks })
    }, 500)

    const {query} = this.props.location
    if (query && query.mode === 'replay') {
      this.onChangeMode(null, null, 'replay')
    }
  }

  componentWillUnmount () {
    const me = this
    this.incidentSocket.close()

    me.cancelled = true
    me.stop()
    clearInterval(me.buffertimer)

    me.reset()

    me.vmap.remove()
  }

  onAddThreat (msg) {
    const me = this
    console.log(msg)
    if (me.state.mode !== 'replay') return

    const incidents = isArray(msg) ? msg : [msg]
    incidents.sort((a, b) => {
      if (a.timestamp < b.timestamp) return -1
      if (a.timestamp > b.timestamp) return 1
      return 0
    })
    const scenes = me.buildScene(incidents)

    me.currentPlay.scene = scenes
    this.onClickPlay()
  }

  renderHandle (props) {
    const style = assign({left: `${props.offset}%`}, handleStyle)
    return (
      <div style={style} />
    )
  }

  renderSlider () {
    return (
            <Slider min={this.state.sliderMin} max={this.state.sliderMax}
              value={this.state.sliderPos} handle={this.renderHandle}
              onChange={this.onChangeSlider.bind(this)}/>
    )
  }

  renderTime () {
    let me = this
    let tx = new Date('2016-1-1 00:00:00') - 0
    return (
      <div className="inline-block valign-middle margin-md-left margin-md-right" style={{color: 'white'}}>
          <span>{moment(tx + me.state.sliderPos * 1000).format('HH:mm:ss')}</span>
          <span>/</span>
          <span>{moment(tx + me.state.sliderMax * 1000).format('HH:mm:ss')}</span>
      </div>
    )
  }

  renderRow (item) {
    return (
      <div className="attackRow visible" key={item.id}>
        <div className="timeCol">
          <Transition
            transitionName="example" transitionEnterTimeout={500} transitionLeaveTimeout={0}
            transitionAppear transitionAppearTimeout={500}>
            <p>{item.time}</p>
          </Transition>
        </div>
        <div className="attackCol">
          <Transition
            transitionName="example" transitionEnterTimeout={500} transitionLeaveTimeout={0}
            transitionAppear transitionAppearTimeout={500}>
            <p className="attackContainer">{item.type}</p>
          </Transition>
        </div>
        <div className="severityCol">
          <Transition
            transitionName="example" transitionEnterTimeout={500} transitionLeaveTimeout={0}
            transitionAppear transitionAppearTimeout={500}>
            <p>{item.severity}</p>
          </Transition>
        </div>
        <div className="sourceCol">
          <Transition
            transitionName="example" transitionEnterTimeout={500} transitionLeaveTimeout={0}
            transitionAppear transitionAppearTimeout={500}>
            <p>{item.attacker}</p>
            <img
              src={`/images/flags/${item.attackerCountry.code}.png`}
              title={item.attackerCountry.name}
              width="28"
              style={{marginTop: '-5px', maxHeight: '24px'}}
              alt=""/>
          </Transition>
        </div>
        <div className="destCol">
          <Transition
            transitionName="example" transitionEnterTimeout={500} transitionLeaveTimeout={0}
            transitionAppear transitionAppearTimeout={500}>
            <p>{item.target}</p>
            <img
              src={`/images/flags/${item.targetCountry.code}.png`}
              title={item.targetCountry.name}
              width="28"
              className="hidden"
              style={{marginTop: '-5px', maxHeight: '24px'}}
              alt=""/>
            <IconButton
              style={{padding: 0, width: 32, height: 32}}
              iconStyle={{padding: 0}}
              onTouchTap={this.onClickData.bind(this, item.data)}>
              <FileIcon color="#fff"/>
            </IconButton>
          </Transition>
        </div>
      </div>
    )
  }

  renderInfoPopup () {
    let { popupObject } = this.state

    if (!popupObject) return

    return (
            <div id="countryDrillDownContainer"
              className={`pinkBorder active ${this.state.popup ? '' : 'hidden'}`}
              style={{left: `${this.state.popupX}px`, top: `${this.state.popupY}px`}}>
                    <div onClick={this.onClickPopupClose.bind(this)} className="linnk">
                        <span className="modalCloseBtn">
                            <i className="fa fa-times" />
                        </span>
                    </div>
                <div id="countryDrillDowntitleContainer">
                    <div style={{marginRight: '5px'}} />Info
                </div>

                <div id="mostAttackingCountryContainer">
                    <span className="sectionHeadline">Name: {popupObject.name}</span>

                    <span className="sectionHeadline">Country: {popupObject.country}</span>

                    <span className="sectionHeadline">IP: {popupObject.ip}</span>
                </div>
            </div>
    )
  }

    // ///////////////////////////////////////////////////////////////

  initDemoScenario () {
    const me = this
    me.addAttackers()
    me.addDevices()

    let scene1 = [{
      time: new Date('2015-06-01 05:01:22') - 0,
      attacks: [{
        from: me.attackers[0],
        to: me.devices[0],
        type: 'Possible Bot HTTP Request.AA',
        count: 1,

        linetype: 'curve',
        color: 'red',
        severity: 'High'
      }, {
        from: me.attackers[0],
        to: me.devices[0],
        type: 'Possible Bot HTTP Request.AB',
        count: 1,

        linetype: 'curve',
        color: 'red',
        severity: 'High'
      }, {
        from: me.attackers[0],
        to: me.devices[0],
        type: 'Possible Bot HTTP Request.AC',
        count: 1,

        linetype: 'curve',
        color: 'red',
        severity: 'High'
      }, {
        from: me.attackers[0],
        to: me.devices[0],
        type: 'Possible Bot HTTP Request.AD',
        count: 1,

        linetype: 'curve',
        color: 'red',
        severity: 'High'
      }, {
        from: me.attackers[0],
        to: me.devices[0],
        type: 'Possible Bot HTTP Request.AE',
        count: 1,

        linetype: 'curve',
        color: 'red',
        severity: 'High'
      }, {
        from: me.attackers[0],
        to: me.devices[0],
        type: 'Possible Bot HTTP Request.AF',
        count: 1,

        linetype: 'curve',
        color: 'red',
        severity: 'High'
      }]
    }, {
      time: new Date('2015-06-01 05:01:25') - 0,
      attacks: [{
        from: me.attackers[0],
        to: me.devices[1],
        type: 'Possible Bot HTTP Request.AA',
        count: 3,

        linetype: 'curve',
        color: 'blue',
        severity: 'Low'
      }]
    }, {
      time: new Date('2015-06-01 05:01:29') - 0,
      attacks: [{
        from: me.attackers[1],
        to: me.devices[1],
        type: 'Possible Bot HTTP Request.AA',
        count: 1,

        linetype: 'straight',
        color: 'yellow',
        severity: 'Medium'
      }]
    }, {
      time: new Date('2015-06-01 05:01:31') - 0,
      attacks: [{
        from: me.attackers[1],
        to: me.devices[2],
        count: 1,
        type: '',

        linetype: 'straight',
        color: 'green',
        severity: 'Audit'
      }]
    }]

    let id = parseInt(Math.random() * 1000000, 10)
    scene1.forEach(screen => {
      screen.attacks.forEach(item => {
        item.id = id++
      })
    })

    me.scenario.push(scene1)
  }

  addDevices () {
    let me = this

    let demoCountries = ['Russian Federation', 'Japan', 'Australia']

    for (let i = 0; i < 10; i++) {
      let device = {
        id: 100 + i,
        name: `Device ${i}`,

        ip: `${Math.ceil(Math.random() * 255)}.${Math.ceil(Math.random() * 255)
                 }.${Math.ceil(Math.random() * 255)}.${Math.ceil(Math.random() * 255)}`,

        country: demoCountries[i % 3],

        img: '/resources/images/sidebar/threatmap/RoundedPin.png',

        visible: false,
        bubbles: []
      }
      me.devices.push(device)
    }
  }

  addAttackers () {
    let me = this

    let demoCountries = ['Germany', 'France', 'China']

    for (let i = 0; i < 8; i++) {
      let attacker = {
        id: 300 + i,
        name: `Attacker${i}`,

        ip: `${Math.ceil(Math.random() * 255)}.${Math.ceil(Math.random() * 255)
                 }.${Math.ceil(Math.random() * 255)}.${Math.ceil(Math.random() * 255)}`,
        country: demoCountries[i % 3],

        img: '/resources/images/sidebar/threatmap/SquarePin.png',

        visible: false,
        bubbles: []
      }

      me.attackers.push(attacker)
    }
  }

    // ///////////////////////////////////////////////////////////////

  onChangeMode (e, index, value) {
    this.onClickStop()
    this.clear()

    this.setState({
      mode: value
    }, () => {
      if (this.state.mode === 'real') {
        this.onClickPlay()
      }
    })
  }

  onChangeSpeed (e, index, value) {
    this.onClickPause()
    this.setState({
      speed: parseInt(value, 10)
    }, () => {
      this.onClickPlay()
    })
  }

  onClickSettings () {
    this.setState({
      settings: !this.state.settings
    })
  }

  onChangeSlider (value) {
    this.onSeek(value)
  }

    // ///////////////////////////////////////////////////////////////

  onClickPlay () {
    const me = this
    const {mode} = me.state
    if (mode === 'demo') {
      me.play(me.scenario[0])
      me.setState({ playing: true })
    } else if (mode === 'replay') {
      if (!me.currentPlay.scene) return
      me.play(me.currentPlay.scene)
      me.setState({ playing: true })
    }
  }

  onClickPause () {
    const me = this
    me.pause()
    me.pauseAnimation()
    me.setState({ playing: false })
  }

  onClickStop () {
    let me = this
    if (me.currentPlay && !me.currentPlay.stopped) {
      me.cancelled = true
      me.onPlayEnd()
    }
  }

  onViewportChange () {
    let me = this
    if (!me.currentPlay || !me.currentPlay.scene) return
    let scenes = me.currentPlay.scene

        // Device
    let alldevices = []
    scenes.forEach(scene => {
      scene.attacks.forEach(attack => {
        if (alldevices.indexOf(attack.from) < 0) {
          me.updateObjectPosition(attack.from)
          alldevices.push(attack.from)
        }
        if (alldevices.indexOf(attack.to) < 0) {
          me.updateObjectPosition(attack.to)
          alldevices.push(attack.to)
        }
      })
    })

        // Line
    me.connections.forEach(line => {
      me.updateLinePosition(line)
    })

        // Blast
    me.blasts.forEach(blast => {
      me.updateBlastPosition(blast)
    })
  }

  onToggleMaximize () {
    this.setState({
      maximized: !this.state.maximized
    })
  }
  onClickData (data) {
    this.props.showThreatItemModal(true, data)
  }
    // ///////////////////////////////////////////////////////////////////

  play (scene) {
    let me = this

    if (me.state.mode === 'real') {
      me.currentPlay.stopped = false
      me.currentPlay.pause = false
      me.cancelled = false
      me.onTickReal()
    } else {
      if (!me.currentPlay.stopped) {
        if (me.currentPlay.paused) {
          me.currentPlay.paused = false

          me.resumeAnimation()
          me.enableTimer(true)
          return
        } else {
          me.stop()
          setTimeout(() => {
            me.play(scene)
          }, 1000 / me.state.speed)
          return
        }
      }

      me.reset()

      let diff = 1
      if (scene.length >= 2) {
        diff = scene[scene.length - 1].time - scene[0].time
        diff = parseInt(diff / 1000, 10)
      }

      me.currentPlay.duration = diff
      me.currentPlay.scene = scene
      me.currentPlay.stopped = false
      me.currentPlay.screen = 0
      me.currentPlay.paused = false

      this.setState({
        sliderMax: diff,
        sliderPos: 0
      }, () => {
        me.enableTimer(true)
        me.onPlayFrame()
      })
    }
  }

  pause () {
    let me = this
    if (me.state.mode === 'real') {
      me.stop()
      return
    }
    if (!me.currentPlay) return
    me.currentPlay.paused = true
    me.enableTimer(false)
  }

  stop () {
    let me = this
    me.enableTimer(false)

    if (!me.currentPlay) return
    me.currentPlay.stopped = true
    clearTimeout(me.currentPlay.timer)
  }

  reset () {
    let me = this
    let p = $(this.refs.mapDiv) // eslint-disable-line no-undef

    p.find('.map-item').remove()
    p.find('.attacker-popup').remove()

    me.connections.forEach(line => {
      line.remove()
    })
    p.find('.connection').remove()

    me.connections = []

    me.blasts.forEach(item => {
      item.remove()
    })
    me.blasts = []

    me.setState({
      sliderPos: 0,
      latestAttacks: []
    })

    me.devices.forEach(device => {
      device.visible = false
      device.attacks = 0
      device.bubbles = []
    })

    me.attackers.forEach(attacker => {
      attacker.visible = false
      attacker.attacks = 0
      attacker.bubbles = []
    })

    me.realIncidentTimers.forEach(timer => {
      clearTimeout(timer)
    })
    me.realIncidentTimers = []

    me.buffer = []
  }

  clear () {
    let me = this
    me.cancelled = true
    me.onPlayEnd()
    me.reset()

    this.setState({
      sliderMax: 1,
      sliderPos: 0
    })

    me.currentPlay.scene = null
  }

    // ///////////////////////////////////////////////////////////////////

  resumeAnimation () {
    let me = this
    let $scope = me.scope
        // Line
    me.connections.forEach(line => {
      let obj = line
      let trans = parseFloat(obj.attr('trans'))
      if (trans < 1) {
        obj = obj.transition().duration($scope.fadeOutSpeed * 2 * (1 - trans))
                    .style('stroke-dashoffset', 0)
                    .attr('trans', 1)
      }

      if (trans < 2) {
        obj.transition()
                    .duration($scope.fadeOutSpeed / 2 * (trans <= 1 ? 1 : (2 - trans)))
                    .style('opacity', 0)
                    .attr('trans', 2)
                    .remove()
                    .each('end', function (d) {
                      let callback = d.callback
                      let index = me.connections.indexOf(line)
                      if (index >= 0) me.connections.splice(index, 1)
                      if (callback) callback()
                    })
      }

            // Label
      let labelObj = line.data()[0].labelObj
      if (!labelObj) return
      obj = labelObj
      trans = parseFloat(obj.attr('trans'))

      if (trans < 1) {
        obj = obj.transition().duration($scope.fadeOutSpeed * 2 * (1 - trans))
                    .style('opacity', 1)
                    .attr('trans', 1)
      }

      if (trans < 2) {
        obj.transition()
                    .duration($scope.fadeOutSpeed / 2 * (trans <= 1 ? 1 : (2 - trans)))
                    .style('opacity', 0)
                    .attr('trans', 2)
                    .remove()
      }
    })

        // Blast
    me.blasts.forEach(item => {
      let obj = item
      let trans = parseFloat(obj.attr('trans'))
      if (trans < 1) {
        obj = obj.transition().duration(($scope.fadeOutSpeed * 2 - 200) * (1 - trans))
                    .attr('trans', 1)
                    .transition().duration(100)
                    .style('opacity', 1)
      }

      if (trans < 2) {
        if (trans >= 1) {
          obj = obj.style('opacity', 2 - trans)
        }
        obj.transition()
                    .duration($scope.fadeOutSpeed / 2 * (trans <= 1 ? 1 : (2 - trans)))
                    .style('opacity', 0)
                    .attr('trans', 2)
                    .remove()
                    .each('end', function (d) {
                      let callback = d.callback
                      let index = me.connections.indexOf(item)
                      if (index >= 0) me.connections.splice(index, 1)
                      if (callback) callback()
                    })
      }
    })
  }

  pauseAnimation () {
    let me = this

    me.connections.forEach(line => {
      if (line) {
        line.transition().duration(0)

                // Label
        let labelObj = line.data()[0].labelObj
        if (labelObj) labelObj.transition().duration(0)
      }
    })

    me.blasts.forEach(item => {
      if (item) {
        item.transition().duration(0)
      }
    })
  }

  enableTimer (enable) {
    let me = this
    if (enable) {
      me.incidentTimer = setInterval(me.updateTimer.bind(me), 1000 / me.state.speed)
    } else {
      clearInterval(me.incidentTimer)
    }
  }

  updateTimer () {
    let me = this
    if (me.currentPlay && !me.currentPlay.paused && !me.currentPlay.stopped) {
      me.setState({
        sliderPos: me.state.sliderPos + 1
      }, () => {
        if (me.currentPlay.scene.length > me.currentPlay.screen) {
          let screen = me.currentPlay.scene[me.currentPlay.screen]
          if (me.state.sliderPos === parseInt((screen.time - me.currentPlay.scene[0].time) / 1000, 10)) {
            me.onPlayFrame()
          }
        }
        if (me.currentPlay.scene.length <= me.currentPlay.screen) {
          me.onPlayEnd()
        }
      })
    }
  }

  updateLinePosition (line) {
    let me = this
    let data = line.data()[0]

    line.attr('d', () => {
      return me.drawConnection(data.from, data.to, data.type, data.arcSharpness)
    })
  }

  updateBlastPosition (blast) {
    let data = blast.data()[0]

    blast.attr('x', data.device.x - parseFloat(blast.attr('width')) / 2)
            .attr('y', data.device.y - parseFloat(blast.attr('height')) / 2)
  }

  updateObjectPosition (device) {
    const me = this

    if (!device.visible) return
    let img = device.imgObj
    if (img) {
      let latlng = me.getCountryLatLng(device.country)
      if (!latlng) return
      let xy = me.latLngToXY(latlng[0], latlng[1])
      device.x = xy[0]
      device.y = xy[1]

      img.attr('x', device.x - 10)
                .attr('y', device.y - 10)
    }

    let txt = device.labelObj
    if (txt) {
      txt.attr('x', device.x)
                .attr('y', device.y + 30)
    }
  }

    // ///////////////////////////////////////////////////////////////////

  onPlayFrame () {
    const me = this

    if (me.currentPlay.stopped || me.currentPlay.paused) return
    if (me.currentPlay.screen >= me.currentPlay.scene.length) return

    let screen = me.currentPlay.scene[me.currentPlay.screen++]

    screen.attacks.forEach(attack => {
      // if (me.severities.indexOf(attack.severity) < 0) return
      me.addAttackRow(
                attack.id,
                attack.from,
                attack.to,
                moment(screen.time).format('HH:mm:ss'),
                attack.type || (((parseInt(Math.random() * 10, 10) % 3) === 0)
                  ? 'Possible Bot HTTP Request.AA'
                  : 'Trojan-Banker.Win32.Bancos.N'
                ),
                attack.action || '',
                attack.severity,
                attack.data)
      me.showObject(attack.from, true, () => {
        me.showObject(attack.to, true, () => {
          me.showAttack(attack.from, attack.to, attack.color, attack.linetype, attack.count)
          me.showBlast(attack.to, attack.color)
        })
      })
    })
  }

  onPlayEnd () {
    const me = this
    me.stop()
    me.setState({ playing: false })
  }

  onTickReal () {
    const me = this
    if (me.currentPlay.stopped) return
    me.reset()
  }

  onSeek (newpos) {
    const me = this

    if (!me.currentPlay || !me.currentPlay.scene) return
    me.currentPlay.stopped = false
    me.pause()
    this.setState({playing: false})

    let scene = me.currentPlay.scene

    me.reset()

    let pos
    for (let i = 0; i < scene.length; i++) {
      let screen = scene[i]
      pos = parseInt((screen.time - scene[0].time) / 1000, 10)

      me.currentPlay.screen = i
      if (pos < newpos) {
        screen.attacks.forEach(attack => {
          // if (me.severities.indexOf(attack.severity) < 0) return
          me.addAttackRow(
            attack.id,
            attack.from,
            attack.to,
            moment(screen.time).format('HH:mm:ss'),
            attack.type,
            attack.action || '',
            attack.severity,
            attack.data
          )
          me.showObject(attack.from, false)
          me.showObject(attack.to, false)
        })
      } else {
        break
      }
    }

    setTimeout(() => {
      this.setState({
        sliderPos: newpos,
        playing: true
      })

      me.currentPlay.paused = true
      me.play()
      if (pos === newpos) me.onPlayFrame()
    }, 0)
  }
    // ///////////////////////////////////////////////////////////////////

  addAttackRow (id, attacker, target, time, type, action, severity, data) {
    const me = this
    me.buffer.push({
      id: id,
      time: time,
      type: type,
      action: action,
      severity: severity,
      attacker: attacker.name || attacker.ip,
      attackerCountry: me.findCountry(attacker),
      target: target.name || target.ip,
      targetCountry: me.findCountry(target),
      data
    })
  }

  findCountry (attack) {
    const index = findIndex(countries.all, {name: attack.country})
    if (index < 0) {
      return {
        name: '',
        code: '_European Union'
      }
    }

    return {
      name: countries.all[index].name,
      code: countries.all[index].alpha2.toLowerCase()
    }
  }

    // ///////////////////////////////////////////////////////////////////

  showObject (device, anim, callback) {
    let me = this
    let s = me.svg
    let $scope = me.scope

    let img, txt
    if (device.visible) {
      img = device.imgObj
      txt = device.labelObj
    } else {
      let latlng = me.getCountryLatLng(device.country)
      if (!latlng) {
        console.log(`Location not found: ${device.country}`)
        return
      }

      let xy = me.latLngToXY(latlng[0], latlng[1])
      device.x = xy[0]
      device.y = xy[1]

      img = s.append('svg:image')
      img.attr('x', device.x - 10)
                .attr('y', device.y - 10)
                .attr('width', 21)
                .attr('height', 21)
                .style('cursor', 'pointer')
                .style('opacity', 0)
                .attr('class', 'map-item')
                .attr('xlink:href', device.img)
                .data([{device: device}])
                .on('click', (d) => {
                  this.setState({
                    popup: true,
                    popupX: d.device.x,
                    popupY: d.device.y,
                    popupObject: d.device
                  })
                })

      if (anim) {
        img.transition().duration($scope.fadeOutSpeed / 6)
                    .style('opacity', 1)
                    .each('end', () => {
                      if (callback) callback()
                    })
      } else {
        img.style('opacity', 1)
        if (callback) callback()
      }
      device.imgObj = img

      if (device.name) {
        txt = s.append('text')
        txt.attr('text-anchor', 'middle')
                    .attr('x', device.x)
                    .attr('y', device.y + 30)
                    .attr('width', 80)
                    .attr('height', 24)
                    .text(device.name)
                    .attr('class', 'map-item')
                    .attr('fill', 'black')
                    .attr('font-size', '0.9em')

        if (anim) {
          txt.style('opacity', 0)
                        .transition().duration($scope.fadeOutSpeed / 6)
                        .style('opacity', 1)
        } else {

        }
        device.labelObj = txt
      }
    }

    if (device.visible) {
      if (callback) callback()
      return
    }

    device.visible = true
  }

  showAttack (from, to, color, type, attacks, callback) {
    let me = this
    let s = me.svg
    let $scope = me.scope

    let arcSharpness = 4 * Math.random()
    let line = s.insert('svg:path', 'text.layer')
            .attr('class', 'connection')
            .style('stroke-linecap', 'round')
            .style('stroke', color || 'red')
            .style('fill', 'none')
            .style('stroke-width', $scope.arcThickness)
            .attr('d', (datum) => {
              return me.drawConnection(from, to, type, arcSharpness)
            }).data([{
              callback: callback,
              from: from,
              to: to,
              type: type,
              arcSharpness: arcSharpness
            }])

    let length = line.node().getTotalLength()
    line.style('stroke-dasharray', `${length} ${length}`)
            .style('stroke-dashoffset', length)
            .attr('trans', 0)
            .transition().duration($scope.fadeOutSpeed * 2)
            .style('stroke-dashoffset', 0)
            .attr('trans', 1)
            .transition().duration($scope.fadeOutSpeed / 2)
            .style('opacity', 0)
            .attr('trans', 2)
            .remove()
            .each('end', (d) => {
              let callback = d.callback
              let index = me.connections.indexOf(line)
              if (index >= 0) me.connections.splice(index, 1)
              if (callback) callback()
            })

    me.connections.push(line)
  }

  showBlast (device, color, callback) {
    let me = this
    let s = me.svg
    let $scope = me.scope

    let suffix = ''
    if (color === 'green') color = 'blue'
    if (color !== 'red') suffix = `-${color}`

    let images = {
      'low': {
        src: `/resources/images/sidebar/threatmap/tinyExplosion${suffix}.png`,
        width: 16,
        height: 16
      },

      'medium': {
        src: `/resources/images/sidebar/threatmap/smallExplosion${suffix}.png`,
        width: 46,
        height: 45
      },

      'high': {
        src: `/resources/images/sidebar/threatmap/bigExplosion${suffix}.png`,
        width: 57,
        height: 57
      }
    }

    let image = images['medium']
    if (!image) return

    let img = s.append('svg:image')
    img.attr('x', device.x - image.width / 2)
            .attr('y', device.y - image.height / 2)
            .attr('width', image.width)
            .attr('height', image.height)
            .style('cursor', 'pointer')
            .style('opacity', 0)
            .attr('class', 'map-item')
            .attr('xlink:href', image.src)
            .data([{
              callback: callback,
              device: device
            }])
            .on('click', (d) => {
              this.setState({
                popup: true,
                popupX: d.device.x,
                popupY: d.device.y,
                popupObject: d.device
              })
            })

            .attr('trans', 0)
            .style('opacity', 0)

            .transition().duration($scope.fadeOutSpeed * 2 - 200)
            .attr('trans', 1)
            .transition().duration(100)
            .style('opacity', 1)

            .transition().duration($scope.fadeOutSpeed * 2)
            .style('opacity', 0)
            .attr('trans', 2)
            .remove()
            .each('end', (d) => {
              let callback = d.callback
              let index = me.blasts.indexOf(img)
              if (index >= 0) me.blasts.splice(index, 1)
              if (callback) callback()
            })
    me.blasts.push(img)
  }

  drawConnection (from, to, type, arcSharpness) {
    let midXY = [(from.x + to.x) / 2, (from.y + to.y) / 2]
    let sameCountry = (to.x === from.x && to.y === from.y)
    let x = from.x
    let y = from.y
    let tx = to.x
    let ty = to.y
    let mx = midXY[0]
    let my = midXY[1]
    let cx = mx + (50 * arcSharpness)
    let cy = Math.abs(my - (50 * arcSharpness))

    if (type === 'straight') {
      const str = 'M{0},{1}L{2},{3}'
      return format(str, from.x, from.y, to.x, to.y)
    }

    if (type === 'curve') {
      if (sameCountry) {
        let widthConst = 10
        let heightConst = 10
        const str = 'M{0},{1}T{2},{3}T{4},{5}T{6},{7}T{8},{9}'
        return format(str, x, y, x + widthConst, y - heightConst, x, y - (2 * heightConst), x - widthConst, y - heightConst, x, y)
      }

      const str = 'M{0},{1}S{2},{3},{4},{5}'
      return format(str, x, y, cx, cy, tx, ty)
    }

    return ''
  }

    // ///////////////////////////////////////////////////////////////////

  buildScene (incidents) {
    let scene = []

    let devices = {}
    let attackers = {}
    let colors = {
      'high': 'red',
      'medium': 'yellow',
      'low': 'blue',
      'audit': 'green'
    }

    let screen
    incidents.forEach(item => {
      let deviceIP = item['targetIP']
      let device = devices[deviceIP]

      if (!device) {
        device = {
          id: deviceIP,

          ip: deviceIP,
          name: item['targetIP'],

          country: countries[item['targetCountry'] || 'US'].name,

          img: '/resources/images/sidebar/threatmap/RoundedPin.png',

          visible: false,
          bubbles: []
        }
        devices[deviceIP] = device
      }

      let attackerIP = item['attackerIP']
      let attacker = attackers[attackerIP]
      if (!attacker) {
        attacker = {
          id: attackerIP,

          ip: attackerIP,
          name: item['attackerIP'],

          country: countries[item['attackerCountry'] || 'US'].name,

          img: '/resources/images/sidebar/threatmap/SquarePin.png',

          visible: false,
          bubbles: []
        }
        attackers[attackerIP] = attacker
      }

      let time = item['timestamp']
      if (!screen || screen.time !== time) {
        screen = {
          time: time,
          attacks: []
        }
        scene.push(screen)
      }

      let severity = item['severity']

      screen.attacks.push({
        from: attacker,
        to: device,
        type: item['attack'],
        action: item['action'],
        count: 1,

        linetype: 'curve',
        color: colors[severity.toLowerCase()] || 'red',
        severity: severity,

        data: item.data
      })
    })

    return scene
  }

    // /////////////////////////////////////////////////////////////////////

  onClickPopupClose () {
    this.setState({
      popup: false
    })
  }

    // /////////////////////////////////////////////////////////////////////

  latLngToXY (lat, lng) {
    let me = this
    let pos = me.vmap.latLngToPoint(lat, lng)
    return [pos.x, pos.y]
  }

  getCountryLatLng (name) {
    const index = findIndex(countries.all, {name})
    if (index < 0) return null
    const code = countries.all[index].alpha2
    if (!code) return null

    const latlng = countryLatlng[code]
    if (!latlng || !latlng.length) return null

    return latlng
  }

  renderTable () {
    const {maximized} = this.state
    const style = {}
    if (maximized) style.height = '100%'
    return (
      <div id="latestAttacksContainerLeft" className="pinkBorder" style={style}>
        <div id="tableContainer">
          <div id="tableHeaderRow">
            <div id="latestAttacksTimeCol">TIME</div>
            <div id="latestAttacksAttackCol">ATTACK</div>
            <div id="latestSeverityCol">SEVERITY</div>
            <div id="latestAttacksSourceCol">ATTACKING COUNTRY</div>
            <div id="latestAttacksDestCol">
              TARGET DEVICE
              <div style={{position: 'absolute', right: 12, top: 2}}>
                <IconButton
                  style={{padding: 0, width: 32, height: 32}}
                  iconStyle={{padding: 0}}
                  onTouchTap={this.onToggleMaximize.bind(this)}>
                  <CropFreeIcon color="#545454"/>
                </IconButton>
              </div>
            </div>
          </div>
          {
            this.state.latestAttacks.map(item => this.renderRow(item))
          }
        </div>
      </div>
    )
  }

  renderThreatItemModal () {
    if (!this.props.threatItemModalOpen) return
    return (
      <ThreatItemModal {...this.props}/>
    )
  }

  render () {
    const {mode, speed, maximized} = this.state

    const maximizedTable = maximized ? (
      <div className="flex-1">
        <div id="latestAttacksContainer" style={{height: '100%'}}>
          {this.renderTable()}
        </div>
      </div>
    ) : null
    return (
      <div className="flex-vertical flex-1">
        <div className={`flex-vertical flex-1 ${maximized ? 'hidden' : ''}`}>
          <div className="form-inline padding-sm" style={{background: '#CECECE'}}>
            <SelectField value={mode} onChange={this.onChangeMode.bind(this)} style={{width: '120px', marginLeft: '20px'}}>
              <MenuItem value="real" primaryText="Real" />
              <MenuItem value="replay" primaryText="Replay" />
              <MenuItem value="demo" primaryText="Demo" />
            </SelectField>&nbsp;
            <SelectField value={speed} onChange={this.onChangeSpeed.bind(this)} className={mode === 'replay' ? '' : 'hidden'} style={{width: '120px'}}>
              <MenuItem value={1} primaryText="Normal" />
              <MenuItem value={2} primaryText="2x" />
              <MenuItem value={5} primaryText="5x"/>
              <MenuItem value={10} primaryText="10x"/>
              <MenuItem value={20} primaryText="20x"/>
              <MenuItem value={50} primaryText="50x"/>
              <MenuItem value={100} primaryText="100x"/>
            </SelectField>
            <div className="form-group pull-right inline hidden">
              <div className="link" onClick={this.onClickSettings.bind(this)}>
                <i className="fa fa-x fa-cog valign-middle" />
              </div>
            </div>

          </div>
          <div style={{position: 'relative'}} className={`flex-1 flex-vertical ${(mode === 'demo' || mode === 'replay') ? 'slider-visible' : ''}`}>
            <div className="flex-1" style={{position: 'relative'}}>
              <div ref="mapDiv" style={{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0}}/>
            </div>

            <div id="latestAttacksContainer">
              <div className="play-controls">
                <div className="inline-block">
                  {
                    this.state.playing
                      ? (<div className="link" style={{padding: '2px'}}>
                      <img src="/resources/images/sidebar/threatmap/btn_pause.png" width="32" onClick={this.onClickPause.bind(this)} alt=""/>
                    </div>)
                      : (<div className="link" style={{padding: '2px'}}>
                      <img src="/resources/images/sidebar/threatmap/btn_play.png" width="32" onClick={this.onClickPlay.bind(this)} alt=""/>
                    </div>)
                  }

                  <div className="link" style={{padding: '2px'}}>
                    <img src="/resources/images/sidebar/threatmap/btn_stop.png" width="32" onClick={this.onClickStop.bind(this)} alt=""/>
                  </div>

                  {this.renderTime()}

                </div>
                <div className="incident-time hidden" style={{color: 'white', paddingTop: '3px'}} />

                <div className="play-timeline" style={{flex: 1, padding: '12px'}}>
                  {this.renderSlider()}
                </div>
              </div>
              {this.renderTable()}
            </div>
            {this.renderInfoPopup()}
          </div>
        </div>
        {maximizedTable}
        {this.renderThreatItemModal()}
      </div>
    )
  }
}
