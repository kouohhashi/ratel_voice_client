import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import {
  Container,
  Row,
  Col,
  Button,
} from 'reactstrap';
import Ionicon from 'react-ionicons'

class TaskCompleted extends Component {

  goDashboard = () => {
    this.props.history.push("/dashboard")
  }

  render() {

    const { onNextTaskPushed, coins, app_issue_token_flg } = this.props

    return(
      <Container className='task_completed' style={{
          textAlign: 'center',
        }}>

        <Row style={{ marginTop:60, marginBottom:60, }}>
          <Col>
            <Ionicon icon="ion-checkmark-round" fontSize="64px" color="green"/>
          </Col>
        </Row>

        <Row style={{ marginTop:30, marginBottom:30, }}>
          <Col>
            <span style={{fontSize: 28}}>
              COMPLETED
            </span>
          </Col>
        </Row>

        {app_issue_token_flg === true && (
          <div>
            <Row style={{ marginTop:30, marginBottom:30, }}>
              <Col>
                <span style={{fontSize:22, color: 'green'}}>
                  You got {coins ? coins.toFixed(2) : 0} tokens. Thanks!
                </span>
              </Col>
            </Row>

            <Row style={{ marginTop:30, marginBottom:30, }}>
              <Col>
                <span style={{fontSize:16, color: 'orange'}}>
                  * We still need to verify your work. there is a possibility that your token is removed after verification.
                </span>
              </Col>
            </Row>
          </div>
        )}

        {app_issue_token_flg === false && (
          <div>
            <Row style={{ marginTop:30, marginBottom:30, }}>
              <Col>
                <span style={{fontSize:22, color: 'green'}}>
                  Thanks!
                </span>
              </Col>
            </Row>
          </div>
        )}
        
        <Row style={{ marginTop:60, marginBottom:60, }}>
          <Col xs="12" md="6" style={{ textAlign: 'right' }}>
            <Button onClick={this.goDashboard} color="secondary">Dashboard</Button>
          </Col>
          <Col xs="12" md="6" style={{ textAlign: 'left' }}>
            <Button onClick={onNextTaskPushed} color="primary">Next task</Button>
          </Col>
          <Col />
        </Row>

      </Container>
    )
  }
}

export default withRouter( connect()(TaskCompleted) )
