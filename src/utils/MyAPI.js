import { API_URL, API_KEY } from './Settings'

const headers = {
  'Accept': 'application/json',
  'Authorization': API_KEY
}

// create an account
export const createAccount = (params) =>
  fetch(`${API_URL}/api/create_user`, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify( params )
  }).then(res => res.json())

// signin
export const signinWithPassword = (params) =>
  fetch(`${API_URL}/api/login_with_email_password`, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify( params )
  }).then(res => res.json())

// upload
export const upload = (data) =>
  fetch(`${API_URL}/api/files`, {
    method: 'POST',
    headers: {
      ...headers,
    },
    body: data
  }).then(res => res.json())

// signin with token
export const signinWithToken = (params) =>
  fetch(`${API_URL}/api/login_with_token`, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify( params )
  }).then(res => res.json())

// logout
export const logout = (params) =>
  fetch(`${API_URL}/api/logout`, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify( params )
  }).then(res => res.json())

// get voice task
export const getVoiceTask = (params) =>
  fetch(`${API_URL}/api/get_voice_task`, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify( params )
  }).then(res => res.json())

// get completed tasks
export const getCompletedTasks = (params) =>
  fetch(`${API_URL}/api/get_completed_tasks`, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify( params )
  }).then(res => res.json())

// report problem
export const reportFailedTask = (params) =>
  fetch(`${API_URL}/api/report_failed_task`, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify( params )
  }).then(res => res.json())


// skip this sentence
export const skipThisSentence = (params) =>
  fetch(`${API_URL}/api/skip_sentence`, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify( params )
  }).then(res => res.json())


// inference
export const voice_to_text = (data) =>
  fetch(`${API_URL}/api/voice_to_text`, {
    method: 'POST',
    headers: {
      ...headers,
    },
    body: data
  }).then(res => res.json())


// get randam example script
export const getRandomExampleScript = (params) =>
  fetch(`${API_URL}/api/get_random_example_script`, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify( params )
  }).then(res => res.json())

// get reading materials
export const getReadingMaterials = (params) =>
  fetch(`${API_URL}/api/get_reading_materials`, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify( params )
  }).then(res => res.json())



// select reading material
export const selectReadingMaterial = (params) =>
  fetch(`${API_URL}/api/select_reading_material`, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify( params )
  }).then(res => res.json())



// inference
export const epub_upload = (data) =>
  fetch(`${API_URL}/api/epub_upload`, {
    method: 'POST',
    headers: {
      ...headers,
    },
    body: data
  }).then(res => res.json())

// restoreWallet
export const retrieveSeedText = (params) =>
  fetch(`${API_URL}/api/retrieve_seed_text`, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify( params )
  }).then(res => res.json())

// get app status
export const getAppStatus = (params) =>
  fetch(`${API_URL}/api/get_app_status`, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify( params )
  }).then(res => res.json())

// update app status
export const updateAppStatus = (params) =>
  fetch(`${API_URL}/api/update_app_status`, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify( params )
  }).then(res => res.json())
