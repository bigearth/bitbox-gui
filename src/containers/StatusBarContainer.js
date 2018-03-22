import { connect } from 'react-redux'
import StatusBar from '../components/StatusBar'
import {
  updateStore
} from '../actions/ConfigurationActions';

import {
  addTx
} from '../actions/MempoolActions';

import {
  addBlock
} from '../actions/BlockchainActions';

import {
  emptyMempool
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
    updateStore: () => {
      dispatch(updateStore())
    },
    updateAccount: (account) => {
      dispatch(updateAccount(account))
    },
    addTx: (tx) => {
      dispatch(addTx(tx))
    },
    mineBlock: (blockchain) => {
      let newChain = blockchain;
      dispatch(addBlock(newChain));

      // flush mempool
      dispatch(emptyMempool());

      // update store
      dispatch(updateStore());
    }
  }
}
 
const StatusBarContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(StatusBar)
 
export default StatusBarContainer
