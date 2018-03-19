import React, { Component } from 'react';
import underscore from 'underscore';
import moment from 'moment';
class AccountTransactions extends Component {
  render() {
    let account = underscore.findWhere(this.props.wallet.accounts, {index: +this.props.match.params.account_id});
    return (
      <div className="AccountTransactions pure-g">
        <div className="pure-u-1-1">
          <h2>Transactions</h2>
          <table className="pure-table">
            <tbody>
              <tr>
                <th colSpan="2" className='important'>{moment(Date.now()).format('MMMM Do YYYY')}</th>
                <th>0.507 BCH</th>
              </tr>
              <tr>
                <td className='important'>{moment(Date.now()).format('h:mm:ss a')}</td>
                <td>bitcoincash:qrruxutvg8s76dd3w7r5c0efy5nru609dyzsecpsxz</td>
                <td><span className="minus">-</span> 0.00171852</td>
              </tr>
              <tr>
                <td className='important'>{moment(Date.now()).format('h:mm:ss a')}</td>
                <td>bitcoincash:qrruxutvg8s76dd3w7r5c0efy5nru609dyzsecpsxz</td>
                <td><span className="plus">+</span> 16.47640775</td>
              </tr>
            </tbody>
          </table>
          <table className="pure-table">
            <tbody>
              <tr>
                <th colSpan="2" className='important'>{moment(Date.now()).format('MMMM Do YYYY')}</th>
                <th>0.507 BCH</th>
              </tr>
              <tr>
                <td className='important'>{moment(Date.now()).format('h:mm:ss a')}</td>
                <td>bitcoincash:qrruxutvg8s76dd3w7r5c0efy5nru609dyzsecpsxz</td>
                <td><span className="minus">-</span> 0.00171852</td>
              </tr>
              <tr>
                <td className='important'>{moment(Date.now()).format('h:mm:ss a')}</td>
                <td>bitcoincash:qrruxutvg8s76dd3w7r5c0efy5nru609dyzsecpsxz</td>
                <td><span className="plus">+</span> 16.47640775</td>
              </tr>
            </tbody>
          </table>
          <table className="pure-table">
            <tbody>
              <tr>
                <th colSpan="2" className='important'>{moment(Date.now()).format('MMMM Do YYYY')}</th>
                <th>0.507 BCH</th>
              </tr>
              <tr>
                <td className='important'>{moment(Date.now()).format('h:mm:ss a')}</td>
                <td>bitcoincash:qrruxutvg8s76dd3w7r5c0efy5nru609dyzsecpsxz</td>
                <td><span className="minus">-</span> 0.00171852</td>
              </tr>
              <tr>
                <td className='important'>{moment(Date.now()).format('h:mm:ss a')}</td>
                <td>bitcoincash:qrruxutvg8s76dd3w7r5c0efy5nru609dyzsecpsxz</td>
                <td><span className="plus">+</span> 16.47640775</td>
              </tr>
            </tbody>
          </table>
          <table className="pure-table">
            <tbody>
              <tr>
                <th colSpan="2" className='important'>{moment(Date.now()).format('MMMM Do YYYY')}</th>
                <th>0.507 BCH</th>
              </tr>
              <tr>
                <td className='important'>{moment(Date.now()).format('h:mm:ss a')}</td>
                <td>bitcoincash:qrruxutvg8s76dd3w7r5c0efy5nru609dyzsecpsxz</td>
                <td><span className="minus">-</span> 0.00171852</td>
              </tr>
              <tr>
                <td className='important'>{moment(Date.now()).format('h:mm:ss a')}</td>
                <td>bitcoincash:qrruxutvg8s76dd3w7r5c0efy5nru609dyzsecpsxz</td>
                <td><span className="plus">+</span> 16.47640775</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default AccountTransactions;
