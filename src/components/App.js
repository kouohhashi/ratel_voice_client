import React, { Component } from 'react';
import '../App.css';
import { Route, Switch } from 'react-router-dom'
import Dashboard from './Dashboard'
import Home from './Home'
import NoMatch from './NoMatch'
import CreateAccont from './CreateAccont'
import SignIn from './SignIn'
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';
import * as MyAPI from '../utils/MyAPI'
import { connect } from 'react-redux'
import { withRouter } from 'react-router';
import { LOCAL_STRAGE_KEY } from '../utils/Settings'
import { loginSuccess, loginFailedRedux, walletPrepared } from '../actions/UserActions'
import TaskView from './TaskView'
import CompletedTaskList from './CompletedTaskList'
import TaskList from './TaskList'
import AdminDashboard from './admin/AdminDashboard'
import AdminUploadEpub from './admin/AdminUploadEpub'
import { deserializeWallet, setWeb3Provider } from '../utils/WalletHelpers'

class App extends Component {

  // check if signin data is stored in local storage
  // if so, then signin
  componentDidMount() {

    // check if we have auth data on local storage
    const storage_data = localStorage.getItem(LOCAL_STRAGE_KEY)
    if (!storage_data) {
      // no token was found...
      return;
    }

    // parse it
    let storage_json = null
    try {
      storage_json = JSON.parse(storage_data)
    } catch (err) {
      // parse error
      console.log("err:", err)
    }

    let wallet = null
    let userId = null

    if ( storage_json && storage_json.login_token ) {
      this.signinWithTokenRequest(storage_json.login_token)
      .then(({ user }) => {
        // get wallet form storage

        userId = user._id

        const WALLET_STRAGE_KEY = "WALLET-"+userId
        const serialized_keystore = localStorage.getItem(WALLET_STRAGE_KEY)
        if (!serialized_keystore) {
          return Promise.reject(Error("no key found"))
        }

        wallet = deserializeWallet({serialized_keystore: serialized_keystore})
        return setWeb3Provider({ wallet: wallet })
      })
      .then(( { web3 } ) => {
        // update redux
        const params = {
          wallet: wallet,
          web3: web3,
        }
        this.props.walletPrepared(params)
      })
      .catch((err) => {
        console.log("err:", err)
        if ( userId ) {
          const WALLET_STRAGE_KEY = "WALLET-"+userId
          localStorage.removeItem(WALLET_STRAGE_KEY);
        }
      })
    } else {
      // stored file did not contain login_token...
    }
  }

  // login with token
  signinWithTokenRequest = (login_token) => {

    const param = {
      login_token: login_token
    }
    return MyAPI.signinWithToken(param)
    .then((data) => {
      if (data.status !== 'success'){
        return Promise.reject('error')
      } else {
        // success
        const params = {
          user: data.user,
          login_token: data.login_token,
          app_info: data.app_info,
        }
        localStorage.setItem(LOCAL_STRAGE_KEY, JSON.stringify(params))
        this.props.loginSuccess(params)
        return Promise.resolve(params)
      }
    })
    .catch((err) => {
      console.log("err:", err)
      localStorage.removeItem(LOCAL_STRAGE_KEY);
      this.props.mapDispatchToLoginFailed()
    })
  }

  // render view
  render() {

    return (
      <div className="App">

        <Switch>

          <Route exact path='/' render={() => (
            <Home />
          )} />

          <Route exact path='/dashboard' render={() => (
            <Dashboard />
          )} />

          <Route exact path='/create_acount' render={() => (
            <CreateAccont />
          )} />

          <Route exact path='/signin' render={() => (
            <SignIn />
          )} />

          <Route exact path='/task_view' render={() => (
            <TaskView />
          )} />

          <Route exact path='/completed_task_list' render={() => (
            <CompletedTaskList />
          )} />

          <Route exact path='/task_list' render={() => (
            <TaskList />
          )} />

          <Route exact path='/admin/dashboard' render={() => (
            <AdminDashboard />
          )} />

          <Route exact path='/admin/upload_epub' render={() => (
            <AdminUploadEpub />
          )} />


          <Route exact path='/notfound' component={NoMatch} />

          <Route component={NoMatch} />

        </Switch>

        <Alert stack={{limit: 3}} />

      </div>
    );
  }
}


function mapDispatchToProps (dispatch) {
  return {
    loginSuccess: (data) => dispatch(loginSuccess({ params: data})),
    mapDispatchToLoginFailed: () => dispatch(loginFailedRedux()),
    walletPrepared: (data) => dispatch(walletPrepared({ params: data})),
  }
}

export default withRouter(connect( null, mapDispatchToProps )(App))
