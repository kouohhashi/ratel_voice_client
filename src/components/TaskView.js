import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import {
  Container,
  Row,
  Col,
  Button,
  Input,
  Form,
} from 'reactstrap';
import { MicrophoneRecorder } from '../utils/MicrophoneRecorder';
// import AudioContext from '../utils/AudioContext';
import Ionicon from 'react-ionicons'
import Alert from 'react-s-alert';
import Loading from './Loading'
import TaskCompleted from './TaskCompleted'
import * as MyAPI from '../utils/MyAPI'
import HeaderAfterLogin from './HeaderAfterLogin'

// show task
class TaskView extends Component {

  state = {
    recording: false,
    audioUrl:'',
    sentence_info: null,
    phonetic_editing: false,
    phonetic:'',
    completed: false,
    coins: 0,
    disabled: false,
    recordedBlob:null,
  }

  componentDidMount() {

    // init mic
    this.initMic()

    if ( this.props && this.props.ready === true ){
      this.accountReady(this.props)
    }
  }

  // detect props changed
  componentWillReceiveProps(nextProps) {

    // current state
    let current_ready = false
    if ( this.props && this.props.ready ){
      current_ready = this.props.ready
    }

    // next state
    let next_ready = false
    if (nextProps && nextProps.ready) {
      next_ready = nextProps.ready
    }

    if ( current_ready !==  next_ready){
      this.accountReady(nextProps)
    }
  }

  accountReady = ({ login_token }) => {

    if (login_token) {
      this.getVoiceTask({login_token: login_token})
    } else {
      console.log("user has not login")
    }
  }

  // get text data
  getVoiceTask = ({login_token}) => {

    this.setState({
      completed: false
    })

    const params = {
      login_token: login_token
    }

    MyAPI.getVoiceTask(params)
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

      if (!results || !results.list || results.list.length === 0){
        return Promise.reject("no more task!")
      }

      let phonetic = ''
      if ( results &&  results.list[0] ){
        phonetic = results.list[0].phonetic
      }

      this.setState({
        sentence_info: results.list[0],
        phonetic: phonetic
      })
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

  // initialize mic
  initMic = () => {
    const options = {
      audioBitsPerSecond: 128000,
      mimeType: 'audio/webm;codecs=opus',
    }
    this.microphoneRecorder = new MicrophoneRecorder( this.recordingStarted, this.recordingStopped, options);
  }

  // callback: recording started
  recordingStarted = () => {
    this.setState({recording: true})
  }

  // callback: recording started
  recordingStopped = (recordedBlob) => {
    this.setState({
      recordedBlob: recordedBlob,
      audioUrl: recordedBlob.blobURL,
      recording: false,
    })
  }

  // start recording
  startRecording = () => {
    this.microphoneRecorder.startRecording()
  }

  // stop recording
  stopRecording = () => {
    this.microphoneRecorder.stopRecording();
    this.setState({
      recording: false
    });
  }

  // upload voice data
  upload = () => {

    this.setState({
      disabled: true
    })

    const { phonetic, sentence_info } = this.state
    const { userId, login_token } = this.props

    let fd = new FormData();
    fd.append('upl', this.state.recordedBlob.blob, 'blobby.txt');
    fd.append('user_id', userId);
    fd.append('login_token', login_token);
    fd.append('sentence_info_id', sentence_info._id);
    fd.append('phonetic', phonetic);

    MyAPI.upload(fd)
    .then((data) => {

      if (data.status !== 'success' ){
        let error_text = 'Error';
        if (data.message) {
          error_text = data.message
        }
        return Promise.reject(Error(error_text))
      }

      // TASK COMPLETED
      this.setState({
        completed: true,
        coins: data.coins,
        disabled: false,
      })
    })
    .catch((err) => {
      console.log("err:", err)

      this.setState({
        disabled: false
      })

      Alert.error(err.message, {
        position: 'top-right',
        effect: 'slide',
        timeout: 5000
      });
    })
  }

  // play sounds
  testAudio = () => {

    this.setState({
      disabled: true,
    })

    const { audioUrl } = this.state
    const audio = new Audio();
    audio.src = audioUrl

    audio.onended = (aaa) => {

      console.log("audio end successfully")

      this.setState({
        disabled: false,
      })
    }
    audio.onerror = (e) => {

      console.log("audio end with error: ", e)

      this.setState({
        disabled: false,
      })
    }

    audio.play()
  }

  // start editting phonetic
  togglePhoneticEdit = () => {
    this.setState({phonetic_editing: !this.state.phonetic_editing})
  }

  // handle input change
  handleChangePhonetic = (e, { name, value }) => {
    this.setState({ [name]: value })
  }

  // called from completed page
  onNextTaskPushed = () => {

    this.setState({
      recording: false,
      analyser: null,
      audioUrl:'',
      recordedBlob:'',
      sentence_info: null,
      phonetic_editing: false,
      phonetic:'',
      completed: false,
      coins: 0,
      disabled: false,
    })

    const { login_token } = this.props
    this.getVoiceTask({login_token: login_token})
  }

  // delete audio
  deleteAudio = () => {
    this.setState({
      recordedBlob: null,
    })
  }

  // skip this sentence
  skipTask = () => {
    const { sentence_info } = this.state
    const { login_token } = this.props

    const params = {
      login_token: login_token,
      sentence_info_id: sentence_info._id,
    }

    MyAPI.skipThisSentence(params)
    .then((results) => {

      if (!results){
        return Promise.reject("no results found")
      }
      return Promise.resolve(results)

    })
    .then((results) => {
      // go to next task
      this.onNextTaskPushed()
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

  // render view
  render() {

    const { profile, login_token, app_issue_token_flg } = this.props
    const { recording, recordedBlob, sentence_info, phonetic_editing, phonetic, completed, coins, disabled } = this.state

    if ( !profile || !login_token ){
      return (<Loading text="loading..." />)
    }

    if ( !sentence_info  ){
      return (<Loading text="loading sentence..." />)
    }

    if (completed === true){
      return (
        <TaskCompleted
          onNextTaskPushed={this.onNextTaskPushed}
          coins={coins}
          app_issue_token_flg={app_issue_token_flg}/>
      )
    }

    return(
      <Container className='task_view' style={{textAlign: 'center'}}>

        {/* header */}
        <HeaderAfterLogin />


        {sentence_info && (
          <div style={{marginTop: 60}}>

            <Row>
              <Col md="2" xs="12" />
              <Col md="6" xs="12" style={{textAlign: 'left'}}>
                <span style={{fontSize: 18, lineHeight: '26px'}}>{sentence_info.ideogram}</span>
              </Col>
              <Col md="4" xs="12">
                <span onClick={this.skipTask} style={{
                    color: 'orange',
                    cursor: 'pointer',
                  }}>Skip</span>
              </Col>
            </Row>

            <Row style={{marginTop: 20,}}>

              <Col md="2" xs="12" style={{textAlign: 'right'}}>
                <span style={{cursor: 'pointer'}} onClick={() => this.togglePhoneticEdit()}>
                  <Ionicon icon="ion-edit" fontSize="26px" color="#454545"/>
                </span>

              </Col>

              <Col md="6" xs="12" style={{textAlign: 'left'}}>
                {phonetic_editing
                  ? (
                    <Form>
                      <Input type="textarea"
                        name='phonetic'
                        onChange={this.handleChangePhonetic}
                        value={phonetic} />
                    </Form>
                  )
                  : (
                    <div>
                      <span style={{fontSize: 18, lineHeight: '26px'}}>{phonetic}</span>
                      <br/>
                      <span style={{color: 'red', fontSize: 14}}>* If phonetic is wrong, please fix it!</span>
                    </div>
                  )}
              </Col>
              <Col md="4" xs="12"/>
            </Row>
          </div>
        )}

        <Row style={{ marginTop: 16, marginBottom: 16, }}>
          <Col>
            <Ionicon
              style={{ display: recording ? '' : 'none'}}
              icon="ion-ios-mic" fontSize="80px" color="green" beat={true}/>
            <Ionicon
              style={{ display: recording ? 'none' : ''}}
              icon="ion-ios-mic-off" fontSize="80px" color="#cccccc"/>
          </Col>
        </Row>

        <Row style={{ marginTop: 16, marginBottom: 16, }}>
          <Col>

            {recordedBlob && (
              <Button
                disabled={disabled}
                onClick={this.testAudio}
                type="button">Play</Button>
            )}

            {!recordedBlob && recording && (
              <Button
                disabled={disabled}
                onClick={this.stopRecording} type="button">Stop</Button>
            )}

            {!recordedBlob && !recording && (
              <Button
                style={{
                  cursor: 'pointer',
                }}
                disabled={disabled}
                color='success'
                onClick={this.startRecording} type="button">Start</Button>
            )}

          </Col>
        </Row>

        <Row style={{ marginTop: 16, marginBottom: 16, }}>
          <Col>


            {recordedBlob && (
              <Button
                disabled={disabled}
                onClick={this.deleteAudio}
                type="button">Delete</Button>
            )}

          </Col>
        </Row>


        <Row style={{ marginTop: 16, marginBottom: 16, }}>
          <Col>

            {recordedBlob && (
              <Button
                color='primary'
                disabled={disabled}
                onClick={this.upload}
                type="button">Submit</Button>
            )}

          </Col>
        </Row>

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

    return {
      ready: user.ready,
      profile: user.profile,
      reader_id: user.reader_id,
      login_token: user.login_token,
      chapter_id: chapter_id,
      reading: reading,
      userId: user._id,
      app_issue_token_flg: user.app_issue_token_flg,
    }
  } else {
    return {}
  }
}

export default withRouter( connect( mapStateToProps )(TaskView) )
