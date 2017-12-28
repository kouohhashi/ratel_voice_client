import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Input,
  ButtonGroup,
} from 'reactstrap';
import * as MyAPI from '../../utils/MyAPI'
import Alert from 'react-s-alert';
import AdminHeader from './AdminHeader'
import Loading from '../Loading'

// admin dashboard so far only feature is uploading epub document
class AdminDashboard extends Component {

  state = {
    app_id: null,
    max_chapter_id: 0,
    max_reader_id: 0,
    issue_token_flg: true,
  }

  componentDidMount() {
    this._getAppStatus()
  }

  // submit epub file to server
  _onSubmit = (e) => {
    e.preventDefault();

    this._updateAppStatus()
  }

  // set file on state
  _fileOnChange = (e) => {
    this.setState({
      file: e.target.files[0]
    })
  }

  // get app status
  _getAppStatus = () => {

    const params = {
      app_id: 'ratel_voice'
    }

    MyAPI.getAppStatus(params)
    .then((results) => {

      if (results.status !== 'success' ){
        let error_text = 'Error';
        if (results.message) {
          error_text = results.message
        }
        return Promise.reject(Error(error_text))
      }

      this.setState({
        app_id: results.app._id,
        max_chapter_id: results.app.max_chapter_id,
        max_reader_id: results.app.max_reader_id,
        issue_token_flg: results.app.issue_token_flg,
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

  // handle input
  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }

  _updateIssueTokenFlg = (flg) => {
    this.setState({
      issue_token_flg: flg,
    })
  }

  // update app status
  _updateAppStatus = () => {

    const {
      app_id,
      max_chapter_id,
      max_reader_id,
      issue_token_flg
    } = this.state

    if (!app_id) {
      return;
    }

    const params = {
      app_id: app_id,
      max_chapter_id: max_chapter_id,
      max_reader_id: max_reader_id,
      issue_token_flg: issue_token_flg,
    }

    MyAPI.updateAppStatus(params)
    .then((results) => {

      if (results.status !== 'success' ){
        let error_text = 'Error';
        if (results.message) {
          error_text = results.message
        }
        return Promise.reject(Error(error_text))
      }
      
      Alert.success("Updated", {
        position: 'top-right',
        effect: 'slide',
        timeout: 5000
      });
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

    const { app_id, max_chapter_id, max_reader_id, issue_token_flg } = this.state

    if (!app_id) {
      return (<Loading text="loading..." />)
    }

    return(
      <Container className='home' style={{textAlign: 'center'}}>

        <AdminHeader />

        <Form onSubmit={this._onSubmit}>

          <Row style={{marginTop: 10, marginBottom: 30,}}>
            <Col>
              <span style={{ fontSize: 28, }}>
                ID: {app_id}
              </span>
            </Col>
          </Row>
          <Row style={{marginTop: 30, marginBottom: 10,}}>
            <Col md="6" xs="12" style={{ textAlign: 'right' }}>
              <span style={{ fontSize: 16, lineHeight: '34px'}}>
              max_chapter_id
              </span>
            </Col>
            <Col md="6" xs="12" style={{ textAlign: 'left' }}>
              <Input
                style={{width: 100}}
                name='max_chapter_id'
                onChange={this.handleChange}
                value={max_chapter_id}
                placeholder='current max chapter id' />
            </Col>
          </Row>
          <Row style={{marginTop: 10, marginBottom: 10,}}>
            <Col md="6" xs="12" style={{ textAlign: 'right' }}>
              <span style={{ fontSize: 16, lineHeight: '34px'}}>
              max_reader_id
              </span>
            </Col>
            <Col md="6" xs="12" style={{ textAlign: 'left' }}>
              <Input
                style={{width: 100}}
                name='max_reader_id'
                onChange={this.handleChange}
                value={max_reader_id}
                placeholder='current max reader id' />
            </Col>
          </Row>
          <Row style={{marginTop: 10, marginBottom: 30,}}>
            <Col md="6" xs="12" style={{ textAlign: 'right' }}>
              <span style={{ fontSize: 16, lineHeight: '34px'}}>
              Issue Token
              </span>
            </Col>
            <Col md="6" xs="12" style={{ textAlign: 'left' }}>

              <ButtonGroup>
                <Button color={issue_token_flg !== false ? 'primary' : 'secondary'}
                  onClick={() => this._updateIssueTokenFlg(true)}
                  active={issue_token_flg !== false}>True</Button>
                <Button color={issue_token_flg === false ? 'primary' : 'secondary'}
                  onClick={() => this._updateIssueTokenFlg(false)}
                  active={issue_token_flg === false}>False</Button>
              </ButtonGroup>

            </Col>
          </Row>

          <Row style={{marginTop: 30, marginBottom: 10,}}>
            <Col md="4" xs="12" />
            <Col md="4" xs="12">
              <Button color="primary" style={{
                width: '100%',
              }}>
                Update
              </Button>
            </Col>
            <Col md="4" xs="12" />
          </Row>

        </Form>

      </Container>
    )
  }
}

export default withRouter( connect()(AdminDashboard) )
