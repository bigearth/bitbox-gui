import React, { Component } from 'react';
import BitcoinCash from '../utilities/BitcoinCash';
import ImportAndExportContainer from '../containers/ImportAndExportContainer'

class ImportAndExportModal extends Component {
  hideImportAndExportModal() {
    this.props.hideImportAndExportModal();
  }

  render() {
    return (
      <div id="keyImportAndExportModal" className="modal">
        <div className="modal-content">
          <div className="modal-header">
            <span onClick={this.hideImportAndExportModal.bind(this)} className="close">&times;</span>
            <h2><i className="far fa-file-alt" /> Import &amp; Export</h2>
          </div>
          <div className="modal-body">
          <ImportAndExportContainer />
          </div>
        </div>
      </div>
    );
  }
}

export default ImportAndExportModal;
