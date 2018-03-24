import { connect } from 'react-redux'
import StatusBar from '../components/StatusBar'
import Miner from '../utilities/Miner';
import {
  updateStore
} from '../actions/ConfigurationActions';

import {
  addTx
} from '../actions/MempoolActions';

import {
  updateAccount
} from '../actions/WalletActions';

const mapStateToProps = (state) => {
  return {
    wallet: state.wallet,
    configuration: state.configuration,
    blockchain: state.blockchain,
    mempool: state.mempool
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateAccount: (account) => {
      dispatch(updateAccount(account))
    },
    addTx: (tx) => {
      dispatch(addTx(tx))
    },
    mineBlock: (blockchain) => {
      Miner.mineBlock(dispatch, blockchain)
    }
  }
}
 
const StatusBarContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(StatusBar)
 
export default StatusBarContainer
