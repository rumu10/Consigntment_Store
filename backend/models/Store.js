const _ = require("lodash");

class Store {
  constructor(data) {
    this.storeId = data.storeId;
    this.managerId = data.managerId;
    this.email = data.email;
    this.storeName = data.storeName;
    this.passwordHash = data.passwordHash;
    this.longitude = data.longitude;
    this.latitude = data.latitude;
    this.balance = data.balance;
    this.inventory = data.inventory;
  }
  static fromDatabase(data) {
    const camelCasedData = _.mapKeys(data, (value, key) => _.camelCase(key));
    return new Store(camelCasedData);
  }

  toDatabase() {
    return _.mapKeys(this, (value, key) => _.snakeCase(key));
  }
}

module.exports = { Store };
