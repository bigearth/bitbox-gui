import React, { Component } from 'react';
import underscore from 'underscore';
class AccountSend extends Component {
  render() {

    return (
      <div className="AccountSend content pure-g">
        <div className="pure-u-1-1">
          <h2><i className="fas fa-chevron-right" /> Send Bitcoin Cash</h2>

          <form className="pure-form pure-form-aligned">
              <fieldset>
                  <div className="pure-control-group">
                      <label htmlFor="name">Address</label>
                      <input id="name" type="text" placeholder="Username" />
                      <span className="pure-form-message-inline">This is a required field.</span>
                  </div>

                  <div className="pure-control-group">
                      <label htmlFor="password">Amount</label>
                      <input id="password" type="password" placeholder="Password" />
                  </div>

                  <div className="pure-control-group">
                      <label htmlFor="email">Fee</label>
                      <input id="email" type="email" placeholder="Email Address" />
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
