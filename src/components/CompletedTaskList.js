import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import {
  Container,
  Row,
  Col,
 } from 'reactstrap';
import Loading from './Loading'
import CompletedTaskListItem from './CompletedTaskListItem'
import Alert from 'react-s-alert';
// import { LOCAL_STRAGE_KEY } from '../utils/Settings'
import * as MyAPI from '../utils/MyAPI'
import HeaderAfterLogin from './HeaderAfterLogin'

// show list of completed tasks
class CompletedTaskList extends Component {

  state = {
    task_list: []
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

  // this is similar to document.ready of jquery???
  accountReady = ({ login_token }) => {

    if (login_token) {
      this.getCompletedTasks({login_token: login_token})
    } else {
      console.log("user has not login")
    }
  }

  // retrieve list of completed tasks
  getCompletedTasks = ({login_token}) => {

    const params = {
      login_token: login_token
    }
    MyAPI.getCompletedTasks(params)
    .then((results) => {

      if (!results){
        return Promise.reject(Error("something went wrong"))
      }

      if (results.status !== 'success'){
        return Promise.reject(Error(results.message))
      }

      let completed_tasks = results.list

      this.setState({
        task_list: completed_tasks
      })
      return;
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

  // since one voice was marked as deleted, let's re-render view
  voiceMarkedAsDeleted = (deletedId) => {
    const task_list_2 = this.state.task_list.map((task) => {
      if (task._id === deletedId) {
        task.deleted = true
      }
      return task
    })
    this.setState({
      task_list: task_list_2
    })
  }

  // render view
  render() {

    const { profile, login_token } = this.props
    const { task_list } = this.state

    if ( !profile || !login_token ){
      return (<Loading text="loading..." />)
    }

    return(
      <Container className='completed_task_list' style={{textAlign: 'center'}}>

        {/* header */}
        <HeaderAfterLogin />

        <Row>
          <Col>

          {task_list && task_list.map((task) => (

            <CompletedTaskListItem
              voiceMarkedAsDeleted={this.voiceMarkedAsDeleted}
              task={task}
              key={task._id} />

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

export default withRouter( connect( mapStateToProps )(CompletedTaskList) )
