/**
 * Created by Cheng on 6/25/17.
 */
import React from 'react'
import { Switch } from 'react-router'
import { Route, BrowserRouter } from 'react-router-dom'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import MainpageContainer from './containers/MainpageContainer'
import SigninContainer from './containers/auth/SigninContainer'

import RequireAuth from './components/auth/RequireAuth'

export default class App extends React.Component {
  render () {
    return (
      <MuiThemeProvider>
        <BrowserRouter>
          <Switch>
            <Route exact path="/signin" component={SigninContainer}/>
            <Route path="/" component={RequireAuth(MainpageContainer)}/>
          </Switch>
        </BrowserRouter>
      </MuiThemeProvider>
    )
  }
}
