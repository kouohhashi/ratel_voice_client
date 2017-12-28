import lightwallet from 'eth-lightwallet'
import HookedWeb3Provider from 'hooked-web3-provider'
import { RPC_SERVER, RatelExampleToken_Address } from './Settings'
import Web3 from 'web3'
import shortid from 'shortid'
import EthUtil from 'ethereumjs-util'
import RatelExampleToken from '../RatelExampleToken.json'

let tokenInstance = null

export const deserializeWallet = ({serialized_keystore}) => {
  return lightwallet.keystore.deserialize(serialized_keystore)
}

// set web3 provider
export const setWeb3Provider = ({ wallet }) => {

  if (!wallet){
    return Promise.reject(Error("no keystore found"))
  }

  var web3Provider = new HookedWeb3Provider({
    host: RPC_SERVER,
    transaction_signer: wallet
  });

  const web3 = new Web3(web3Provider);
  return Promise.resolve({web3: web3})
}

// add new eth address
const newAddresses = ({ wallet, password }) => {

  if (!wallet) {
    return Promise.reject(Error("no keystore found"))
  }

  if (!password) {
    return Promise.reject(Error("no password found"))
  }

  return new Promise((resolve, reject) => {

    wallet.keyFromPassword( password, (err, pwDerivedKey) => {

      if (err){
        reject(err)
      }

      // generate new address
      wallet.generateNewAddress(pwDerivedKey);
      resolve()
    })
  })
}

// create new wallet
export const createNewWallet = ({ seed_text, password }) => {

  if (!password) {
    return Promise.reject(Error("no password found"))
  }

  let randomSeed = null

  if (seed_text){
    randomSeed = seed_text
  } else {
    let extraEntropy = shortid.generate()
    randomSeed = lightwallet.keystore.generateRandomSeed(extraEntropy);
  }

  let wallet = null
  // let web3 = null

  return Promise.resolve()
  .then(() => {

    const params = {
      password: password,
      seedPhrase: randomSeed,
      hdPathString: "m/0'/0'/0'",
    }

    return new Promise((resolve, reject) => {

      // create vault
      lightwallet.keystore.createVault(params, (err, ks) => {
        if (err){
          reject(Error(err))
        }

        wallet = ks
        resolve()
      })
    })
  })
  .then(() => {
    // add new address

    const params = {
      wallet: wallet,
      password: password,
    }
    return newAddresses(params)
  })
  .then(() => {
    // get web3 provider
    return setWeb3Provider({ wallet: wallet })
  })
  .then(({web3}) => {
    // set web3

    const params = {
      web3: web3,
      wallet: wallet,
      seed_text: randomSeed,
    }
    return Promise.resolve(params)
  })
}


// show seed text
// so far we store keystore on the device
// but ideally we should be able to resore wallet at any device.
// const showSeed = ({ wallet, password }) => {
//
//   if (!password) {
//     return Promise.reject(Error("no password found"))
//   }
//
//   return new Promise( (resolve, reject) => {
//
//     wallet.keyFromPassword( password, (err, pwDerivedKey) => {
//       if (err) {
//         resolve(Error(err))
//       }
//
//       let seed = wallet.getSeed(pwDerivedKey);
//       resolve(seed)
//     })
//
//   } )
// }

// recover wallet from seed text
export const recoverWalletFromSeed = ({ seed_text, password }) => {

  if (!password) {
    return Promise.reject(Error("no password found"))
  }

  if (!seed_text) {
    return Promise.reject(Error("no seed text found"))
  }

  const params = {
    seed_text: seed_text,
    password: password,
  }
  return createNewWallet(params)
}

// destroy wallet
export const destroyWallet = ({ userId }) => {
  // console.log("destroyWallet: ", userId)
  const WALLET_STRAGE_KEY = "WALLET-"+userId
  localStorage.removeItem(WALLET_STRAGE_KEY)
  return Promise.resolve()
}


// add one more eth address
// const addOneMoreAddress = ({ wallet, password }) => {
//
//   if (!password) {
//     return Promise.reject(Error("no password found"))
//   }
//
//   if (!wallet) {
//     return Promise.reject(Error("no keystore found"))
//   }
//
//   const params = {
//     wallet: wallet,
//     password: password,
//   }
//   return newAddresses(params)
// }



// create a signature on message
export const makeSignatureOnMessage = ({ web3, address, wallet, password, message }) => {

  return new Promise((resolve, reject) => {

    if (!password) {
      reject(Error("no password"))
    }

    wallet.keyFromPassword( password, (err, pwDerivedKey) => {
      if (err) {
        reject(Error(err))
        return;
      }

      // client-side
      const pKey = wallet.exportPrivateKey( address, pwDerivedKey )
      const pKeyx = new Buffer(pKey, 'hex');
      const messageHash = web3.utils.sha3(message)
      const messageHashx = new Buffer(messageHash.substr(2), 'hex');
      const signedMessage = EthUtil.ecsign(messageHashx, pKeyx)
      const signedHash = EthUtil.toRpcSig(signedMessage.v, signedMessage.r, signedMessage.s).toString('hex')

      const params = {
        signedHash: signedHash
      }
      resolve(params)
    })
  })
}

// prepare contarct instance
const prepareTokenContract =  ({ web3 }) => {
  return Promise.resolve()
  .then(() => {
    // get instance if needed
    if (tokenInstance !== null){
      return Promise.resolve()
    }
    return new web3.eth.Contract(RatelExampleToken.abi, RatelExampleToken_Address)
  })
  .then((results) => {
    // set instance if needed
    if (tokenInstance !== null){
      return Promise.resolve()
    }
    tokenInstance = results
    return Promise.resolve()
  })
}

// retrieve token balance
export const checkTokenBalance = ({web3, address}) => {

  return Promise.resolve()
  .then(() => {
    return prepareTokenContract({ web3: web3 })
  })
  .then(() => {
    return tokenInstance.methods.balanceOf(address).call({
      from : address
    })
  })
}
