import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  // Container,
  Row,
  Col,
} from 'reactstrap';
// import * as MyAPI from '../../utils/MyAPI'
// import { LOCAL_STRAGE_KEY } from '../../utils/Settings'

class AdminHeader extends Component {

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

          <Link to="/admin/dashboard" style={{
              color: location.pathname === '/dashboard' ? 'orange' : '#000000',
              marginRight: 16,
              textDecoration: 'none',
            }}>Dashboard</Link>

          <Link to="/admin/upload_epub" style={{
              color: location.pathname === '/completed_task_list' ? 'orange' : '#000000',
              marginRight: 16,
              textDecoration: 'none',
            }}>Upload epub</Link>

        </Col>

        <Col xs="12" md="6" style={{textAlign: 'right'}}>
          <Link to="/" style={{
              color: location.pathname === '/completed_task_list' ? 'orange' : '#000000',
              marginRight: 16,
              textDecoration: 'none',
            }}>Back to user home</Link>
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

export default withRouter( connect(mapStateToProps)( AdminHeader ) )
