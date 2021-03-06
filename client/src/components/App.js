import React, { Component } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import '@fortawesome/react-fontawesome'
import '@fortawesome/free-solid-svg-icons'
import '@fortawesome/fontawesome-svg-core'
import './App.css'

import AuthService from './../service/AuthService'

import { Switch, Route, Redirect } from 'react-router-dom'

import Navigation from './ui/navbar'
import Message from './ui/CustomToast'

import Home from './pages/home/index'
import PageChefs from './pages/chefs/index'
import ChefDetails from './pages/chefs/chefDetails/index'
import SignupForm from './pages/auth/Signup-form/'
import LoginForm from './pages/auth/Login-form/'
import Profile from './pages/profile/index'

class App extends Component {

  constructor() {
    super()
    this.state = {
      loggedInUser: null,
      toast: {
        visible: false,
        text: ''
      }
    }
    this.AuthService = new AuthService()
  }

  setTheUser = user => this.setState({ loggedInUser: user }, () => console.log("El estado de App ha cambiado:", this.state))

  fetchUser = () => {
    this.AuthService
      .isLoggedIn()
      .then(response => this.state.loggedInUser === null && this.setState({ loggedInUser: response.data }))
      .catch(err => console.log({ err }))
  }

  handleToast = (visible, text = '') => {
    let toastCopy = { ...this.state.toast }
    toastCopy = { visible, text }
    this.setState({ toast: toastCopy })
  }

  render() {

    this.fetchUser()

    return (

      <>

        <Navigation setTheUser={this.setTheUser} loggedInUser={this.state.loggedInUser} handleToast={this.handleToast} />

        <Switch>
          <Route exact path="/" render={props => <Home {...props} />} />
          <Route path="/profile" render={() => this.state.loggedInUser ? <Profile loggedInUser={this.state.loggedInUser} setTheUser={this.setTheUser} /> : <Redirect to='/signup' />} />
          <Route path="/signup" render={props => <SignupForm {...props} setTheUser={this.setTheUser} handleToast={this.handleToast} />} />
          <Route path="/login" render={props => <LoginForm {...props} setTheUser={this.setTheUser} handleToast={this.handleToast} />} />
          <Route exact path="/chefs" render={() => <PageChefs setTheUser={this.setTheUser} loggedInUser={this.state.loggedInUser} />} />
          <Route path="/chefs/:id" render= {props => <ChefDetails {...props} />} />
        </Switch>

        <Message {...this.state.toast} handleToast={this.handleToast} />


      </>

    )
  }
}

export default App;
