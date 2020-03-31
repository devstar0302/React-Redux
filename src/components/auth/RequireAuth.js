import React, { Component } from 'react'
import { connect } from 'react-redux'
import {withRouter} from 'react-router'

export default function (ComposedComponent) {
  class Authentication extends Component {
    componentWillMount () {
      if (!this.props.authenticated) {
        this.gotoLogin()
      }
    }

    componentWillUpdate (nextProps) {
      if (!nextProps.authenticated) {
        this.gotoLogin()
      }
    }

    gotoLogin () {
      const { location } = this.props

      const p = location.pathname
      const q = location.search
      let search = null
      if (p !== '/' && p !== '/signout') {
        const redirect = JSON.stringify({
          p, q
        })
        search = `?redirect=${encodeURIComponent(redirect)}`
      }

      this.props.history.push({
        pathname: '/signin',
        search
      })
    }

    render () {
      if (!this.props.authenticated) return null
      return <ComposedComponent {...this.props} />
    }
  }

  return connect(state => ({
    authenticated: state.auth.authenticated
  }))(withRouter(Authentication))
}
