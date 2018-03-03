import React, { Component } from 'react';
import BitcoinCash from '../utilities/BitcoinCash';

class ImportAndExport extends Component {
  constructor(props) {
    super(props);
    this.props.createImportAndExport();
    this.state = {
      tmpStore: ''
    }
  }

  toggleExportCopied() {
    this.props.toggleExportCopied(true);
    electron.clipboard.writeText(JSON.stringify(this.props.state, null, 2))
  }

  updateTmpStore(store) {
    this.setState({
      tmpStore: store.target.value
    })
  }

  importStore() {
    this.props.importStore(this.state.tmpStore);
  }

  render() {
    const exportCopied = this.props.state.importAndExport.exportCopied
    const normalIcon = <i className='fas fa-clipboard' />
    const copiedIcon = <i className='far fa-check-square' />
    return (
      <div className="ImportAndExport">

        <button className="importAndExportBtn" onClick={this.toggleExportCopied.bind(this)}>
          <span className={ exportCopied ? 'hidden' : '' }>{ normalIcon }</span>
          <span className={ exportCopied ? '' : 'hidden' }>{ copiedIcon }</span>
        </button>

        <button className="" onClick={this.importStore.bind(this)}>
        import tmpStore
        </button>

        <textarea id="import" onChange={this.updateTmpStore.bind(this)}></textarea>
        <textarea disabled id="export" value={JSON.stringify(this.props.state, null, 2)}></textarea>
      </div>
    );
  }
}

export default ImportAndExport;
