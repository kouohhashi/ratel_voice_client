import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
// import { Link } from 'react-router-dom'
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Input,
} from 'reactstrap';
import * as MyAPI from '../../utils/MyAPI'
import Alert from 'react-s-alert';
import AdminHeader from './AdminHeader'

// admin dashboard so far only feature is uploading epub document
class AdminUploadEpub extends Component {

  state = {
    file: null
  }

  // submit epub file to server
  _onSubmit = (e) => {
    e.preventDefault();

    const { file } = this.state

    let fd = new FormData();
    fd.append('upl', file, 'prediction.txt');
    fd.append('foo', 'bar')

    MyAPI.epub_upload(fd)
    .then((data) => {

      if (data.status !== 'success' ){
        let error_text = 'Error';
        if (data.message) {
          error_text = data.message
        }
        return Promise.reject(Error(error_text))
      }

      Alert.success("success", {
        position: 'top-right',
        effect: 'slide',
        timeout: 5000
      });

      this.setState({
        file: null,
      })

    })
    .catch((err) => {
      console.log("err:", err)

      this.setState({
        file: null,
      })

      Alert.error(err.message, {
        position: 'top-right',
        effect: 'slide',
        timeout: 5000
      });
    })
  }

  // set file on state
  _fileOnChange = (e) => {
    this.setState({
      file: e.target.files[0]
    })
  }

  // render view
  render() {

    return(
      <Container className='home' style={{textAlign: 'center'}}>

        <AdminHeader />
        
        <Form onSubmit={this._onSubmit}>

          <Row style={{marginTop: 30, marginBottom: 10,}}>
            <Col>
              <span style={{ fontSize: 28, }}>
                Import epub document
              </span>
            </Col>
          </Row>
          <Row style={{marginTop: 10, marginBottom: 30,}}>
            <Col>
              <span style={{ fontSize: 16, }}>
                You can import epub document. You can find examples <a href="https://www.bookrix.com/books.html" target="_blank" rel="noopener noreferrer">here</a>.<br />* Not all books are downloadable...
              </span>
            </Col>
          </Row>

          <Row style={{marginTop: 30, marginBottom: 30,}}>
            <Col md="4" xs="12" />
            <Col md="4" xs="12" style={{ textAlign: 'center' }}>
              <Input type="file" name="file" id="exampleFile" onChange={this._fileOnChange} />
            </Col>
            <Col md="4" xs="12" />
          </Row>

          <Row style={{marginTop: 30, marginBottom: 30,}}>
            <Col>
              <Button color="primary">
                Import
              </Button>
            </Col>
          </Row>

        </Form>

      </Container>
    )
  }
}

export default withRouter( connect()(AdminUploadEpub) )
