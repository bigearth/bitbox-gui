import React, { Component } from 'react';
import BitcoinCash from '../utilities/BitcoinCash';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faDownload from '@fortawesome/fontawesome-free-solid/faDownload';
import faUpload from '@fortawesome/fontawesome-free-solid/faUpload';
import faCheckSquare from '@fortawesome/fontawesome-free-solid/faCheckSquare';
import faClipboard from '@fortawesome/fontawesome-free-solid/faClipboard';

class ImportAndExport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tmpStore: ''
    }
  }

  toggleVisibility() {
    this.setState({
      tmpStore: ''
    })
    this.props.toggleVisibility();
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
    let importAndExportConfig = this.props.state.importAndExport;

    const importState = importAndExportConfig.importState
    const normalImportIcon = <FontAwesomeIcon icon={faDownload} />
    const successfulImportIcon = <FontAwesomeIcon icon={faCheckSquare} />

    const exportCopied = importAndExportConfig.exportCopied
    const normalExportIcon = <FontAwesomeIcon icon={faClipboard} />
    const copiedExportIcon = <FontAwesomeIcon icon={faCheckSquare} />

    let textarea;
    if(importAndExportConfig.activePane === 'import') {
      textarea = <div>
        <button className="importAndExportBtn" onClick={this.importStore.bind(this)}>
          <span className={ importState ? 'hidden' : '' }>{ normalImportIcon } import</span>
          <span className={ importState ? '' : 'hidden' }>{ successfulImportIcon } imported</span>
        </button>
        <textarea placeholder='Paste BITBOX state tree' id="import" onChange={this.updateTmpStore.bind(this)} value={this.state.tmpStore}></textarea>
      </div>;
    } else {
      textarea = <div>
        <button className="importAndExportBtn" onClick={this.toggleExportCopied.bind(this)}>
          <span className={ exportCopied ? 'hidden' : '' }>{ normalExportIcon } copy to clipboard</span>
          <span className={ exportCopied ? '' : 'hidden' }>{ copiedExportIcon } copied</span>
        </button>
        <textarea disabled id="export" value={JSON.stringify(this.props.state, null, 2)}></textarea>
      </div>;
    }

    let modal;
    if(importAndExportConfig.visible) {
      let icon;
      if(importAndExportConfig.activePane === 'import') {
        icon = 'faDownload';
      } else {
        icon = 'faUpload';
      }
      modal =
        <div id="keyImportAndExportModal" className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <span onClick={this.toggleVisibility.bind(this)} className="close">&times;</span>
              <h2><FontAwesomeIcon icon={icon} /> {importAndExportConfig.activePane.toUpperCase()}</h2>
            </div>
            <div className="modal-body">
              <div className="ImportAndExport">
                {textarea}
              </div>
            </div>
          </div>
        </div>;
    }
    return (
      <div className="">
        {modal}
      </div>
    );
  }
}

export default ImportAndExport;
