import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  FormGroup,
  Input,
 } from 'reactstrap';
import * as MyAPI from '../utils/MyAPI'
import { LOCAL_STRAGE_KEY } from '../utils/Settings'
import Alert from 'react-s-alert';
import {
  loginSuccess,
  walletPrepared,
} from '../actions/UserActions'
import { createNewWallet, makeSignatureOnMessage } from '../utils/WalletHelpers'

// form to create a new account
class CreateAccontForm extends Component {

  state = {
    email: '',
    password: '',
    loading: false,
  }

  // create account
  onSubmit = () => {

    const { email, password } = this.state

    if (!email || !password) {
      Alert.error("Invalid email id or password", {
        position: 'top-right',
        effect: 'slide',
        timeout: 5000
      });
      return;
    }

    this.setState({
      loading: true,
    })

    let userId = null;
    // let seed_text = null

    let web3_2 = null
    let wallet_2 = null
    let seed_text_2 = null

    // create account
    createNewWallet({ password: password })
    .then(({web3, wallet, seed_text}) => {

      web3_2 = web3
      wallet_2 = wallet
      seed_text_2 = seed_text

      // update redux
      const params = {
        wallet: wallet,
        web3: web3,
      }
      this.props.walletPrepared(params)
    })
    .then(() => {
      // make a signature on message

      const addresses = wallet_2.getAddresses()
      const address = addresses[0]

      const params = {
        web3: web3_2,
        address: address,
        wallet: wallet_2,
        password: password,
        message: 'ratel network is going to democratize AI ICO startup',
      }
      return makeSignatureOnMessage(params)
    })
    .then(({signedHash}) => {
      // create account on server

      // const addresses = wallet_2.getAddresses()
      // const address = addresses[0]

      const params = {
        email: email,
        password: password,
        signedHash: signedHash,
        seed_text: seed_text_2,
      }
      return MyAPI.createAccount(params)
    })
    .then((results) => {

      if (results.status === 'error') {
        return Promise.reject(Error(results.message))
      }

      // success

      userId = results.user._id
      if (!userId){
        return Promise.reject(Error("invalid user id"))
      }

      const params = {
        user: results.user,
        login_token: results.login_token,
        app_info: results.app_info,
      }

      // save token and profile
      localStorage.setItem(LOCAL_STRAGE_KEY, JSON.stringify(params))
      this.props.loginSuccess(params)

      // save keystore of ether wallet
      const WALLET_STRAGE_KEY = "WALLET-"+userId
      const serialized_keystore = wallet_2.serialize()
      localStorage.setItem(WALLET_STRAGE_KEY, serialized_keystore )
    })
    .then(() => {
      // redirect
      this.props.history.push("/dashboard")
    })
    .catch((err) => {
      console.log("err:", err)

      this.setState({
        loading: false,
      })

      Alert.error(err.message, {
        position: 'top-right',
        effect: 'slide',
        timeout: 5000
      });
    })
  }

  // handle input
  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }

  // render view
  render() {

    const { email, password } = this.state

    return(
      <Container className='create_acount_form'>

        <Form style={{marginTop:60}}>

          <Row>
            <Col md="3" xs="12" />
            <Col md="6" xs="12" style={{textAlign: 'left'}}>
              <FormGroup>
                <label>
                  Email
                </label>
                <Input
                  style={{width: '100%'}}
                  name='email'
                  onChange={this.handleChange}
                  value={email}
                  placeholder='yourname@example.com' />
              </FormGroup>
            </Col>
            <Col md="3" xs="12" />
          </Row>

          <Row>
            <Col md="3" xs="12" />
            <Col md="6" xs="12" style={{textAlign: 'left'}}>
              <FormGroup>
                <label>Password</label>
                <Input
                  style={{width: '100%'}}
                  name='password'
                  onChange={this.handleChange}
                  value={password}
                  placeholder='********' />
              </FormGroup>
            </Col>
            <Col md="3" xs="12" />
          </Row>


          <Row>
            <Col md="3" xs="12" />
            <Col md="6" xs="12">
              <Button
                color="success"
                style={{width: '100%'}}
                onClick={this.onSubmit}
                >
                Create an account
              </Button>
            </Col>
            <Col md="3" xs="12" />
          </Row>

        </Form>

      </Container>
    )
  }
}


function mapDispatchToProps (dispatch) {
  return {
    loginSuccess: (data) => dispatch(loginSuccess({ params: data})),
    walletPrepared: (data) => dispatch(walletPrepared({ params: data})),
  }
}

// export default withRouter(MainPage);
export default withRouter( connect( null, mapDispatchToProps )(CreateAccontForm) )
