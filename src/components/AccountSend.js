import React, { Component } from 'react';
import underscore from 'underscore';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faChevronUp from '@fortawesome/fontawesome-free-solid/faChevronUp';

class AccountSend extends Component {
  handleSubmit(e) {
    BITBOX.RawTransactions.getRawTransaction(this.state.txid).then((result) => {
      console.log(result)
    }, (err) => { console.log(err); });
    e.preventDefault();
  }

  handleInputChange(e) {
    let value = e.target.value;
    let id = e.target.id;
    this.props.updateAccountSendValue(id, value);
  }

  render() {

    return (
      <div className="AccountSend content pure-g">
        <div className="pure-u-1-1">
          <h2><FontAwesomeIcon icon={faChevronUp} /> Send Bitcoin Cash</h2>

          <form className="pure-form pure-form-aligned" onSubmit={this.handleSubmit.bind(this)}>
              <fieldset>
                  <div className="pure-control-group">
                      <label htmlFor="address">Address</label>
                      <input onChange={this.handleInputChange.bind(this)} id="to" type="text" placeholder="Address" />
                  </div>

                  <div className="pure-control-group">
                      <label htmlFor="password">Amount</label>
                      <input onChange={this.handleInputChange.bind(this)} id="amount" type="number" placeholder="Amount" />
                  </div>
                  <div className="pure-controls">
                      <button type="submit" className="pure-button pure-button-primary">Submit</button>
                  </div>
              </fieldset>
          </form>
        </div>
      </div>
    );
  }
}

export default AccountSend;
