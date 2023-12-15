const _ = require("lodash");

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
    // convert memory and storageSize data from database to human readable e.g., 1TB
    camelCasedData.memory = GBToHumanReadable(camelCasedData.memory);
    camelCasedData.storageSize = GBToHumanReadable(camelCasedData.storageSize);
    return new Computer(camelCasedData);
  }

  toDatabase() {
    //convert memory and storageSize collected from frontend to GB for storage in database
    this.memory = HumanReadableToGB(this.memory);
    this.storageSize = HumanReadableToGB(this.storageSize);
    return _.mapKeys(this, (value, key) => _.snakeCase(key));
  }
}

const HumanReadableToGB = (sizeStr) => {
  // convert humanReadable file size to GB based float number
  // using 1024 as the conversion base
  // "humanReadable" refers to string displayed on frontend
  // "GB based float number" is for storage in database, e.g., the number stored for that humanReadable size
  // we have an assumption here: the humanReadable only shows up as GB or TB
  // e.g.,
  // 1GB => 1
  // 12 GB => 12
  // 1TB => 1024
  let base = 1024;
  let fSize = sizeStr.toUpperCase();
  let s = 0;
  if (fSize.includes("GB")) {
    s = parseInt(fSize.replace("GB"));
  } else if (fSize.includes("TB")) {
    s = parseInt(fSize.replace("TB")) * base;
  } else {
    console.log(
      "Input for humanReadableToGB only supports GB/TB input. Current input is",
      sizeStr,
    );
  }
  return s;
};

const GBToHumanReadable = (size) => {
  // convert file size in GB based float number to humanReadable string
  // using 1024 as the conversion base
  // "humanReadable" refers to string displayed on frontend
  // "GB based float number" is for storage in database, e.g., the number stored for that humanReadable size
  // we have an assumption here: the humanReadable only shows up as GB or TB
  // e.g.,
  // 1=> 1GB
  // 12 => 12GB
  // 1024 => 1TB
  let base = 1024;
  let s = 0;
  let sizeStr = "";
  if (size >= 1024) {
    s = size / base;
    sizeStr = s.toString() + " TB";
  } else {
    sizeStr = size.toString() + " GB";
  }

  if (s >= 1024) {
    console.log(
      "Input for GBToHumanReadable only supports GB/TB input. Current input is in GB: ",
      size,
    );
  }
  return sizeStr;
};

module.exports = { Computer };
