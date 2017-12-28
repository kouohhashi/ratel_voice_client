import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import {
  Container,
  Row,
  Col,
  Button,
} from 'reactstrap';
// import { LOCAL_STRAGE_KEY } from '../utils/Settings'
import Alert from 'react-s-alert';
import Loading from './Loading'
import HeaderAfterLogin from './HeaderAfterLogin'
import { checkTokenBalance, recoverWalletFromSeed, destroyWallet } from '../utils/WalletHelpers'
import * as MyAPI from '../utils/MyAPI'
import {
  walletPrepared,
} from '../actions/UserActions'

// dashboard: this is home after login
class Dashboard extends Component {

  state = {
    tokenBalance: 0,
  }

  componentDidMount() {

    // if address is ready, get token count
    if ( this.props && this.props.address &&  this.props.web3 ){
      this._retrieveTokenBalance({ address: this.props.address, web3: this.props.web3 })
    }
  }

  // detect props changed
  componentWillReceiveProps(nextProps) {

    // current state
    let current_address = null
    if ( this.props && this.props.address ){
      current_address = this.props.address
    }

    // next state
    let next_address = null
    if (nextProps && nextProps.address) {
      next_address = nextProps.address
    }

    if ( current_address !==  next_address){
      this._retrieveTokenBalance({ address: next_address, web3: nextProps.web3 })
    }
  }

  // retrieve token balance
  _retrieveTokenBalance = ({ address, web3 }) => {
    // export const checkTokenBalance = ({web3, address}) => {

    checkTokenBalance({ address: address, web3: web3 })
    .then((results) => {
      this.setState({
        tokenBalance: parseInt(results, 10)
      })
    })
    .catch((err) => {
      console.log("err:",err)
    })
  }

  // go to task
  _goNextTask  = () => {
    this.props.history.push("/task_view")
  }

  // restore wallet address from seed
  _restoreWallet = () => {

    console.log("_restoreWallet:1")
    const { userId } = this.props

    const email = 'kouohhashi@gmail.com'
    const password = '12345678'

    const params = {
      email: email,
      password: password,
    }

    let web3_2
    let wallet_2
    // let seed_text_2

    MyAPI.retrieveSeedText(params)
    .then((results) => {
      if (!results){
        return Promise.reject(Error("no results found"))
      }
      if (results.status !== 'success'){
        return Promise.reject(Error(results.message))
      }
      return Promise.resolve(results)
    })
    .then((results) => {

      console.log("restoreWallet:", results)
      if (!results.seed_text) {
        return Promise.reject(Error("something must be wrong"))
      }

      console.log("_restoreWallet:2")
      // return Promise.reject(Error("stopped"))

      // restore wallet
      const params = {
        seed_text: results.seed_text,
        password: password,
      }
      return recoverWalletFromSeed(params)
    })
    .then(({web3, wallet, seed_text}) => {

      web3_2 = web3
      wallet_2 = wallet
      // seed_text_2 = seed_text

      console.log("_restoreWallet:3")

      // update redux
      const params = {
        wallet: wallet,
        web3: web3,
      }
      this.props.walletPrepared(params)
    })
    .then(() => {
      // save wallet on local storage

      // save keystore of ether wallet
      const WALLET_STRAGE_KEY = "WALLET-"+userId
      const serialized_keystore = wallet_2.serialize()
      localStorage.setItem(WALLET_STRAGE_KEY, serialized_keystore )

    })
    .then(() => {
      // success lets get balance

      console.log("_restoreWallet:4")

      Alert.success("Your wallet is restored", {
        position: 'top-right',
        effect: 'slide',
        timeout: 5000
      });

      const addresses = wallet_2.getAddresses()
      const address = addresses[0]
      this._retrieveTokenBalance({ address: address, web3: web3_2 })

    })
    .catch((err) => {
      console.log("err:", err)

      Alert.error(err.message, {
        position: 'top-right',
        effect: 'slide',
        timeout: 5000
      });
    })
  }

  // destroy wallet
  _destroyWallet = () => {
    const { userId } = this.props
    destroyWallet({ userId: userId })
  }

  // render view
  render() {

    const {
      // ready,
      profile,
      // reader_id,
      login_token,
      chapter_id,
      reading,
      can_task_flg,
      app_issue_token_flg,
      // app_issue_token_flg,
    } = this.props

    const { tokenBalance } = this.state

    if ( !profile || !login_token ){
      return (<Loading text="loading..." />)
    }

    return(
      <Container className='dashboard' style={{textAlign: 'center'}}>

        {/* header */}
        {can_task_flg && (
          <HeaderAfterLogin />
        ) }

        <Row style={{ marginTop:30, marginBottom:30, }}>

          {can_task_flg === true && app_issue_token_flg === true && (
            <Col>

              <span>You have</span>
              <br/>
              <span style={{fontSize: 36, color: 'orange'}}>
                {tokenBalance}
              </span>
              <span style={{ color: 'orange', fontSize: 24 }}> token </span>

              {/*<Button color="primary" onClick={this._destroyWallet}>
                Destroy wallet
              </Button>*/}

            </Col>
          )}

          {can_task_flg === false && (
            <Col>
              We can not detect your address.
              <br/>
              If you switch browers or device, you need to restore your wallet.
              <br/>
              <Button color="primary" onClick={this._restoreWallet}>Recreate wallet</Button>
            </Col>
          )}
          
        </Row>

        <Row style={{ marginTop:30, marginBottom:30, }}>
          <Col>

            {chapter_id ? (
              <span>
                Your material<br/>
                <span style={{
                  fontWeight: 'bold',
                  color: 'green',
                  fontSize: 28,
                }}>{reading.reading_material_title}</span>
              </span>
            ) : (
              <span>
                Please select a reading material
              </span>
            )}

          </Col>
        </Row>

        {can_task_flg && (
          <Row style={{ marginTop:30, marginBottom:30, }}>
            <Col>
              <Button onClick={this._goNextTask} type="button">Go to next task</Button>
            </Col>
          </Row>
        )}

      </Container>
    )
  }
}

// react-redux
function mapStateToProps ( { user } ) {
  if (user){

    let chapter_id = null
    let reading = {}
    if ( user.profile && user.profile.chapter_id ){
      chapter_id = user.profile.chapter_id
      reading = user.profile.reading
    }
    if (!reading) {
      chapter_id = null
    }

    let address = null
    if (user.wallet){
      const addresses = user.wallet.getAddresses()
      address = addresses[0]
    }

    let can_task_flg = false
    console.log("user.app_issue_token_flg: ", user.app_issue_token_flg)
    console.log("address: ", address)
    if (user.app_issue_token_flg === false) {
      can_task_flg = true
    } else {
      if (address){
        can_task_flg = true
      }
    }

    return {
      userId: user._id,
      address: address,
      web3: user.web3,
      wallet: user.wallet,
      ready: user.ready,
      profile: user.profile,
      reader_id: user.reader_id,
      login_token: user.login_token,
      chapter_id: chapter_id,
      reading: reading,
      can_task_flg: can_task_flg,
      app_issue_token_flg: user.app_issue_token_flg,
    }
  } else {
    return {}
  }
}

function mapDispatchToProps (dispatch) {
  return {
    walletPrepared: (data) => dispatch(walletPrepared({ params: data})),
  }
}

export default withRouter( connect( mapStateToProps, mapDispatchToProps )(Dashboard) )
