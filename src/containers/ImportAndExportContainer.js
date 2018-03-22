import { connect } from 'react-redux'
import ImportAndExport from '../components/ImportAndExport';
import {
  toggleVisibility,
  toggleExportCopied,
  importStore
} from '../actions/ImportAndExportActions';

const mapStateToProps = state => {
  return {
    state: state
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    toggleVisibility: () => {
      dispatch(toggleExportCopied(false));
      dispatch(toggleVisibility());
    },
    toggleExportCopied: (val) => {
      dispatch(toggleExportCopied(val));
    },
    importStore: (store) => {
      let parsedStore = JSON.parse(store);
      let seedHex = bitbox.Mnemonic.mnemonicToSeedHex(parsedStore.configuration.wallet.mnemonic)
      let hdnode = bitbox.HDNode.fromSeedHex(seedHex)
      parsedStore.wallet.accounts.forEach((account, index) => {
        let ac = hdnode.derivePath(`m/44'/145'/${index}'`);
        let external = ac.derivePath("0")
        let internal = ac.derivePath("1")

        let a = bitbox.HDNode.createAccount([external, internal]);
        account.addresses = a;
      })
      dispatch(importStore(parsedStore));
    }
  }
}
 
const ImportAndExportContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ImportAndExport)
 
export default ImportAndExportContainer
