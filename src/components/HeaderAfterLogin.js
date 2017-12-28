import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  // Container,
  Row,
  Col,
} from 'reactstrap';
import * as MyAPI from '../utils/MyAPI'
import { LOCAL_STRAGE_KEY } from '../utils/Settings'

class HeaderAfterLogin extends Component {

  // try to logout
  _logoutRequest = () => {

    const { login_token } = this.props

    const param = {
      login_token: login_token
    }

    MyAPI.logout(param)
    .then((results) => {
      localStorage.removeItem(LOCAL_STRAGE_KEY);
      this.props.history.push("/")
    })
    .catch((err) => {
      console.log("err:", err)
      localStorage.removeItem(LOCAL_STRAGE_KEY);
      this.props.history.push("/")
    })
  }

  render() {

    const { location } = this.props

    return(
      <Row style={{
          marginTop:60,
          marginBottom: 60,
          borderBottomWidth: 1,
          borderBottomStyle: 'solid',
          borderBottomColor: '#cccccc',
        }}>
        <Col xs="12" md="6" style={{textAlign: 'left'}}>

          <Link to="/dashboard" style={{
              color: location.pathname === '/dashboard' ? 'orange' : '#000000',
              marginRight: 16,
              textDecoration: 'none',
            }}>Dashboard</Link>

          <Link to="/completed_task_list" style={{
              color: location.pathname === '/completed_task_list' ? 'orange' : '#000000',
              marginRight: 16,
              textDecoration: 'none',
            }}>History</Link>

          <Link to="/task_list" style={{
              color: location.pathname === '/task_list' ? 'orange' : '#000000',
              marginRight: 16,
              textDecoration: 'none',
            }}>Select material</Link>

          <Link to="/task_view" style={{
              color: location.pathname === '/task_view' ? 'orange' : '#000000',
              textDecoration: 'none',
            }}>Go to task</Link>

        </Col>

        <Col xs="12" md="6" style={{textAlign: 'right'}}>
          <span style={{cursor: 'pointer'}} onClick={() => this._logoutRequest()}>Logout</span>
        </Col>
      </Row>
    )
  }
}

// react-redux
function mapStateToProps ( { user } ) {
  if (user){
    return {
      login_token: user.login_token,
    }
  } else {
    return {}
  }
}

export default withRouter( connect(mapStateToProps)( HeaderAfterLogin ) )
