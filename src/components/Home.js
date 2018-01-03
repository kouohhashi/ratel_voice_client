import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
// import { Link } from 'react-router-dom'
import {
  Container,
  Row,
  Col,
  Button,
} from 'reactstrap';
import { MicrophoneRecorder } from '../utils/MicrophoneRecorder';
// import AudioContext from '../utils/AudioContext';
import * as MyAPI from '../utils/MyAPI'
import Alert from 'react-s-alert';
// import FaRefresh from 'react-icons/lib/fa/refresh';
import HeaderBeforeLogin from './HeaderBeforeLogin'
import { detect } from 'detect-browser';
const browser = detect();

// home
class Home extends Component {

  state = {
    recording: false,
    uploading: false,
    blobURL: null,
    blobData: null,
    recongized_text: null,
    reading_sentence: {},
    mic_initialized: false,
    browser_name: null,
  }

  componentDidMount() {

    // check brower
    if (browser && browser.name === 'chrome') {
      // ok
    } else if (browser && browser.name === 'firefox') {
      // ok
    } else {
      // browser_name = browser.name;
      // console.log("browser.name: ", browser.name)
      this.setState({
        browser_name: browser.name,
      })
    }

    // this.setState({
    //   browser_name: browser.name,
    // })

    // Alert.info(browser.name, {
    //   position: 'top-right',
    //   effect: 'slide',
    //   timeout: 5000
    // });

    // retrieve sample sentence
    this._changeSampleText()

    // initialize micro phone
    this._initMic()
  }

  // initialize mic
  _initMic = () => {

    const { mic_initialized } = this.props
    if ( mic_initialized === true ){
      return;
    }

    const options = {
      audioBitsPerSecond: 128000,
      mimeType: 'audio/webm;codecs=opus',
    }
    this.microphoneRecorder = new MicrophoneRecorder( this.recordingStarted, this.recordingStopped, options);

    this.setState({
      mic_initialized: true,
    })
  }

  // callback function: recording started
  recordingStarted = () => {
    this.setState({recording: true})
  }

  // callback function: recording stopped
  recordingStopped = (recordedBlob) => {
    this.setState({
      blobURL: recordedBlob.blobURL,
      blobData: recordedBlob.blob,
      recording: false,
    })
  }

  // start recording
  _startRecording = () => {
    this.microphoneRecorder.startRecording()
  }

  // stop recording
  _stopRecording = () => {
    this.microphoneRecorder.stopRecording();
  }

  // delete audio
  _deleteAudio = () => {
    this.setState({
      blobURL: null,
      recongized_text: null,
    })
  }

  // upload voice
  _uploadAudio = () => {

    this.setState({
      uploading: true
    })

    const { blobURL, blobData } = this.state
    if (blobURL === null){
      // console.log("blobURL not found ...")
      return;
    }

    let fd = new FormData();
    fd.append('upl', blobData, 'prediction.txt');
    fd.append('foo', 'bar')

    MyAPI.voice_to_text(fd)
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
        uploading: false,
        recongized_text: data.recognized_text,
      })
    })
    .catch((err) => {
      console.log("err:", err)

      this.setState({
        uploading: false,
        recongized_text: null,
      })

      Alert.error(err.message, {
        position: 'top-right',
        effect: 'slide',
        timeout: 5000
      });
    })
  }

  // play your voice
  _playAudio = () => {

    this.setState({
      disabled: true,
    })

    const { blobURL } = this.state
    const audio = new Audio();
    audio.src = blobURL

    audio.onended = (aaa) => {
      // console.log("audio end successfully")
    }
    audio.onerror = (e) => {
      // console.log("audio end with error: ", e)
    }

    audio.play()
  }

  // update example text
  _changeSampleText = () => {

    const params = {}
    MyAPI.getRandomExampleScript(params)
    .then((results) => {

      if (!results){
        return Promise.reject(Error("no results"))
      }

      if (results.status !== 'success'){
        return Promise.reject(Error(results.message))
      }

      return Promise.resolve(results)
    })
    .then((results) => {

      let reading_sentence = results.reading_sentence
      this.setState({
        reading_sentence: reading_sentence,
      })
    })
    .catch((err) => {
      console.log("err:",err)

      Alert.error(err.message, {
        position: 'top-right',
        effect: 'slide',
        timeout: 5000
      });
    })
  }

  // render view
  render() {

    const {
      blobURL,
      recording,
      uploading,
      recongized_text,
      reading_sentence,
      browser_name,
     } = this.state

    return(
      <Container className='home' style={{textAlign: 'center'}}>

        {/* header */}
        <HeaderBeforeLogin />

        {browser_name && (
          <Row style={{marginTop: 60}}>
            <Col md="3" xs="12" />
            <Col md="6" xs="12" style={{
                textAlign: 'left',
                fontSize: 28,
                color: 'red',
              }}>
              {browser_name} is not supported! <br/>
              Please use Chrome or Firefox.
            </Col>
            <Col md="3" xs="12" />
          </Row>
        )}

        <Row style={{marginTop: 60}}>
          <Col md="3" xs="12" />
          <Col md="6" xs="12" style={{
              textAlign: 'left',
              fontSize: 28,
            }}>
            Speak out some sentence in English.
          </Col>
          <Col md="3" xs="12" />
        </Row>

        <Row style={{marginTop: 30}}>
          <Col md="3" xs="12" />
          <Col md="6" xs="12" style={{textAlign: 'left'}}>
            If you don't know what to say, how about ...
          </Col>
          <Col md="3" xs="12" />
        </Row>

        <Row style={{marginTop: 5, marginBottom: 5,}}>
          <Col md="3" xs="12" />
          <Col md="6" xs="12" style={{textAlign: 'right'}}>

            {/*<span onClick={this._changeSampleText} style={{
                cursor: 'pointer',
                marginRight: 10,
                width: 24,
                height: 24,
              }} ><FaRefresh size="24" color="#000000" style={{
                verticalAlign: 'baseline',
              }} /></span>*/}

            <Button onClick={this._changeSampleText}>Change example</Button>

          </Col>
          <Col md="3" xs="12" />
        </Row>

        <Row style={{marginTop: 10, marginBottom: 0,}}>
          <Col md="3" xs="12" />
          <Col md="6" xs="12" style={{textAlign: 'left'}}>
            <span style={{
                fontSize: 16,
              }}>Ideogram</span>
          </Col>
          <Col md="3" xs="12" />
        </Row>
        <Row style={{marginTop: 0, marginBottom: 10,}}>
          <Col md="3" xs="12" />
          <Col md="6" xs="12" style={{textAlign: 'left'}}>
            <span style={{
                fontSize: 20,
              }}>{reading_sentence.ideogram}</span>
          </Col>
          <Col md="3" xs="12" />
        </Row>

        <Row style={{marginTop: 10, marginBottom: 0,}}>
          <Col md="3" xs="12" />
          <Col md="6" xs="12" style={{textAlign: 'left'}}>
            <span style={{
                fontSize: 16,
                color: '#cccccc',
              }}>Phonetic</span>
          </Col>
          <Col md="3" xs="12" />
        </Row>
        <Row style={{marginTop: 0, marginBottom: 10,}}>
          <Col md="3" xs="12" />
          <Col md="6" xs="12" style={{textAlign: 'left'}}>
            <span style={{
                  fontSize: 20,
                  color: '#cccccc',
                }}>{reading_sentence.phonetic}</span>

          </Col>
          <Col md="3" xs="12" />
        </Row>


        {/* show record button */}
        {blobURL === null && recording === false && (
          <Row style={{marginTop: 30}}>
            <Col md="3" xs="12" />
            <Col md="6" xs="12">
              <Button
                onClick={this._startRecording}
                color="primary"
                style={{width: '100%'}}>
                Start recording
              </Button>
            </Col>
            <Col md="3" xs="12" />
          </Row>
        )}

        {blobURL === null && recording === true && (
          <Row style={{marginTop: 30}}>
            <Col md="3" xs="12" />
            <Col md="6" xs="12">
              <Button
                onClick={this._stopRecording}
                color="success"
                style={{width: '100%'}}>
                Stop recording
              </Button>
            </Col>
            <Col md="3" xs="12" />
          </Row>
        )}

        {blobURL !== null && uploading === false && (
          <Row style={{marginTop: 30}}>
            <Col md="3" xs="12" />
            <Col md="3" xs="12">
              <Button
                onClick={this._deleteAudio}
                color="secondary"
                style={{width: '100%'}}>
                Delete Audio
              </Button>
            </Col>
            <Col md="3" xs="12">
              <Button
                onClick={this._playAudio}
                color="success"
                style={{width: '100%'}}>
                Play Audio
              </Button>
            </Col>
            <Col md="3" xs="12" />
          </Row>
        )}
        {blobURL !== null && uploading === false && (
          <Row style={{marginTop: 30}}>
            <Col md="3" xs="12" />
            <Col md="6" xs="12">
              <Button
                onClick={this._uploadAudio}
                color="primary"
                style={{width: '100%'}}>
                Try Speech to Text
              </Button>
            </Col>
            <Col md="3" xs="12" />
          </Row>
        )}

        {uploading === true && (
          <Row style={{marginTop: 30}}>
            <Col md="3" xs="12" />
            <Col md="6" xs="12">
              Wait...
            </Col>
            <Col md="3" xs="12" />
          </Row>
        )}

        {recongized_text !== null && (
          <div>

            <Row style={{marginTop: 30}}>
              <Col md="3" xs="12" />
              <Col md="6" xs="12">
                Recognied text:
              </Col>
              <Col md="3" xs="12" />
            </Row>

            <Row style={{marginTop: 10}}>
              <Col md="3" xs="12" />
              <Col md="6" xs="12">
                {recongized_text}
              </Col>
              <Col md="3" xs="12" />
            </Row>

          </div>

        )}

      </Container>
    )
  }
}

export default withRouter( connect()(Home) )
