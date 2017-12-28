import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import {
  Row,
  Col,
  Button,
 } from 'reactstrap';
// import Alert from 'react-s-alert';
import * as MyAPI from '../utils/MyAPI'

class TaskListItem extends Component {

  state = {
    disabled: false,
  }

  selectReadingMaterial = () => {

    const { login_token, item } = this.props

    const params = {
      login_token: login_token,
      reading_material_id: item._id,
    }

    MyAPI.selectReadingMaterial(params)
    .then((results) => {

      if (!results){
        return Promise.reject(Error("something went wrong"))
      }

      if (results.status !== 'success'){
        return Promise.reject(Error(results.message))
      }

      this.props.materialSelected({
        reading_material_id: item._id
      })

    })
    .catch((err) => {
      console.log("err:", err)
    })
  }

  // render view
  render() {

    const { item, selected } = this.props

    let completed = false
    if (item.contributd_count === item.sentence_count ){
      completed = true
    }

    return(
      <div style={{
        marginTop: 20,
        marginBottom: 20,
      }}>

        <Row style={{
            marginTop: 5,
          }}>

          <Col md="10" xs="12" style={{textAlign: 'left'}}>

            <span style={{
                fontSize: 24,
                color: item.deleted ? '#cccccc' : '#000000',
              }}>{item.reading_material_title} </span>
            <span style={{
                fontSize: 28,
                color: item.deleted ? '#cccccc' : '#000000',
              }}>
               ({item.reading_material_chapter_id})
              </span>
          </Col>

          {completed === false && selected === true && (
            <Col md="2" xs="12" style={{textAlign: 'left'}}>
              <span>Selecting</span>
            </Col>
          )}

          {completed === false && selected !== true && (
            <Col md="2" xs="12" style={{textAlign: 'left'}}>
              <Button color="primary" onClick={this.selectReadingMaterial}>Select</Button>
            </Col>
          )}


        </Row>

        <Row>
          <Col md="10" xs="12" style={{textAlign: 'left'}}>

            {completed && (
              <span style={{
                color: 'green',
              }}>
                [COMPLETED]
              </span>
            )}

            {item.chapter_title} ({item.contributd_count} / {item.sentence_count})
          </Col>

          <Col md="2" xs="12" />

        </Row>

      </div>
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

export default withRouter( connect( mapStateToProps )(TaskListItem) )
