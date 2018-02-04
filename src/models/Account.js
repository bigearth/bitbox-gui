import Address from './Address';

class Account {
  constructor(name) {
    name: string = name;
    this.addresses: Array<Address> = [];
  }
}

export default Account;
