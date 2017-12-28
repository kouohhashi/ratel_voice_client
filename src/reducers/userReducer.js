import {
  LOGIN_SUCCESS,
  LOGIN_FAILED,
  WALLET_PREPARED,
} from '../actions/UserActions'

function user (state = {}, action) {

  switch (action.type) {

    case LOGIN_SUCCESS :

      const { login_token, user, app_info } = action.params
      return {
        ...state,
        _id: user._id,
        profile: user.profile,
        login_token: login_token,
        reader_id: user.reader_id,
        app_issue_token_flg: app_info.issue_token_flg,
        ready: true,
      }

    case LOGIN_FAILED :

      return {
        ...state,
        ready: true,
      }


    case WALLET_PREPARED :

      const { wallet, web3 } = action.params
      return {
        ...state,
        wallet: wallet,
        web3: web3,
      }

    default :
      return state
  }
}

export default user
