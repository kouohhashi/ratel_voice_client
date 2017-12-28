export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_FAILED = 'LOGIN_FAILED'
export const WALLET_PREPARED = 'WALLET_PREPARED'

export function loginSuccess ({ params }) {

  return {
    type: LOGIN_SUCCESS,
    params
  }
}

export function loginFailedRedux () {

  return {
    type: LOGIN_FAILED
  }
}

export function walletPrepared ({ params }) {

  return {
    type: WALLET_PREPARED,
    params
  }
}
