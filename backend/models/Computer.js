const _ = require('lodash');

class Computer {
    constructor(data) {
        this.computerId = data.computerId;
        this.storeId = data.storeId;
        this.computerName = data.computerName;
        this.memory = data.memory;
        this.storageSize = data.storageSize;
        this.processors = data.processors;
        this.processGenerations = data.processGenerations;
        this.graphics = data.graphics;
        this.price = data.price;
        this.status = data.status;
    }

    static fromDatabase(data) {
        const camelCasedData = _.mapKeys(data, (value, key) => _.camelCase(key));
        return new Computer(camelCasedData);
    }

    
    toDatabase() {
        return _.mapKeys(this, (value, key) => _.snakeCase(key));
    }
}




module.exports = { Computer };
