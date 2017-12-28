import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import {
  Container,
  Row,
  Col,
 } from 'reactstrap';
import Loading from './Loading'
import TaskListItem from './TaskListItem'
// import { LOCAL_STRAGE_KEY } from '../utils/Settings'
import HeaderAfterLogin from './HeaderAfterLogin'
import * as MyAPI from '../utils/MyAPI'

// show material list for users to select
class TaskList extends Component {

  state = {
    reading_materials: []
  }

  componentDidMount() {
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
    if (nextProps.ready) {
      next_ready = nextProps.ready
    }

    if ( current_ready !==  next_ready){
      this.accountReady(nextProps)
    }
  }

  accountReady = ({ login_token }) => {

    if (login_token) {
      this.getReadingMaterials(login_token)
    } else {
      console.log("user has not login")
    }
  }
  // get reading materials
  getReadingMaterials = (login_token) => {

    if (!login_token) {
      login_token = this.props.login_token
    }
    if (!login_token){
      console.log("login_token is not ready yet");
      return;
    }

    const params = {
      login_token: login_token
    }

    MyAPI.getReadingMaterials(params)
    .then((results) => {

      if (!results){
        return Promise.reject(Error("no results! maybe server error"))
      }
      if (results.status !== 'success'){
        return Promise.reject(Error(results.message))
      }
      return Promise.resolve(results)

    })
    .then((results) => {

      if (!results || !results.list || results.list.length === 0){
        return Promise.reject(Error("no reading materials found"))
      }

      this.setState({
        reading_materials: results.list,
      })
    })
    .catch((err) => {
      console.log("err:", err)
    })
  }

  _materialSelected = ({reading_material_id}) => {

    const { reading_materials } = this.state
    const array = reading_materials.map((item) => {

      if (item._id === reading_material_id){
        item.selected = true
      } else {
        item.selected = false
      }
      return item
    })

    this.setState({
      reading_materials: array
    })
  }

  // render view
  render() {

    const { profile, login_token } = this.props
    const { reading_materials } = this.state

    if ( !profile || !login_token ){
      return (<Loading text="loading..." />)
    }

    return(
      <Container className='completed_task_list' style={{textAlign: 'center'}}>

        {/* header */}
        <HeaderAfterLogin />

        <Row>
          <Col>

          {reading_materials && reading_materials.map((item) => (

            <TaskListItem
              materialSelected={this._materialSelected}
              item={item}
              selected={item.selected}
              key={item._id} />

          ))}

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
    }
  } else {
    return {}
  }
}

export default withRouter( connect( mapStateToProps )(TaskList) )
