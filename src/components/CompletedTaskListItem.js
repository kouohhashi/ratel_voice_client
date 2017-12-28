import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import {
  Row,
  Col,
  Button,
 } from 'reactstrap';
import Alert from 'react-s-alert';
import FaBook from 'react-icons/lib/fa/book';
import SweetAlert from 'sweetalert-react';
import * as MyAPI from '../utils/MyAPI'
import { API_URL } from '../utils/Settings'

const audio = new Audio();

class CompletedTaskListItem extends Component {

  state = {
    disabled: false,
  }

  // download voice and play
  _checkMyVoice = (task) => {

    this.setState({
      disabled: true,
    })

    const url = API_URL+"/api/voice_with_id?voice_id="+task._id;

    audio.src = url
    audio.onended = (aaa) => {
      this.setState({
        disabled: false,
      })
    }
    audio.onerror = (e) => {
      this.setState({
        disabled: false,
      })
    }
    audio.play()
  }

  // confirm before reporting this voice as mistake
  _confirmReportWrong = () => {
    this.setState({
      show: true
    })
  }

  // report mistake
  reportWrong = () => {

    const { login_token, task } = this.props

    const params = {
      login_token: login_token,
      voice_id: task._id,
    }
    MyAPI.reportFailedTask(params)
    .then((results) => {

      if (!results){
        return Promise.reject(Error("something went wrong"))
      }

      if (results.status !== 'success'){
        return Promise.reject(Error(results.message))
      }

      this.props.voiceMarkedAsDeleted(task._id)

      this.setState({
        show: false
      })
    })
    .catch((err) => {
      console.log("err:", err)

      this.setState({
        show: false
      })

      Alert.error(err.message, {
        position: 'top-right',
        effect: 'slide',
        timeout: 5000
      });
    })
  }

  // render view
  render() {

    const { disabled } = this.state
    const { task } = this.props

    return(

      <Row key={task._id} style={{
          marginTop: 10,
          marginBottom: 10,
        }}>
        <Col md="8" xs="12" style={{textAlign: 'left'}}>
          <FaBook />
          <span style={{
              marginLeft: 5,
              fontSize: 14,
              color: task.deleted ? '#cccccc' : '#000000',
            }}>{task.createdAt}</span>
          <br />
          <span style={{
              fontSize: 16,
              color: task.deleted ? '#cccccc' : '#000000',
            }}>{task.phonetic}</span>
        </Col>

        {task.deleted !== true
          ? (
          <Col md="4" xs="12">
            <Button
              color="success"
              disabled={disabled}
              onClick={() => this._checkMyVoice(task)}>
                Check voice
             </Button>
            <Button
              style={{
                marginLeft: 10,
              }}
              color="warning"
              disabled={disabled}
              onClick={() => this._confirmReportWrong()}>
                Oops, my mistake!
             </Button>
          </Col>
        )
        : (
          <Col md="4" xs="12" />
        )}

        <SweetAlert
           show={this.state.show}
           title="Demo with Cancel"
           text="SweetAlert in React"
           showCancelButton
           onConfirm={() => {
             this.reportWrong()
           }}
           onCancel={() => {
             this.setState({ show: false });
           }}
           onClose={() => console.log('close')} // eslint-disable-line no-console
         />

      </Row>
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

    return {
      ready: user.ready,
      profile: user.profile,
      reader_id: user.reader_id,
      login_token: user.login_token,
      chapter_id: chapter_id,
      reading: reading,
    }
  } else {
    return {}
  }
}

// export default withRouter(MainPage);
export default withRouter( connect( mapStateToProps )(CompletedTaskListItem) )
