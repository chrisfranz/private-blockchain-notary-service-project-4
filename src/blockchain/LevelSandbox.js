/* ===== Persist data with LevelDB ==================
|  Learn more: level: https://github.com/Level/level |
/===================================================*/

const level = require('level');
const chainDB = './chaindata';

class LevelSandbox {

  constructor() {
    this.db = level(chainDB);
  }

  // Get data from levelDB with key (Promise)
  getLevelDBData(key) {
    const self = this;
    return new Promise((resolve, reject) => {
      // Add your code here, remember in Promises you need to resolve() or reject()
      self.db.get(key, (err, value) => {
        if (err) {
          if (err.notFound) {
            resolve(undefined)
          } else { 
            reject(err)
          }
        } else {
          resolve(JSON.parse(value))
        }
      })
    });
  }

  // Get data from levelDB by hash
  getBlockByHash(hash) {
    const self = this;
    let block = null;
    return new Promise((resolve, reject) => {
      self.db.createReadStream()
        .on('data', data => {
          const blockData = JSON.parse(data.value)
          const blockHash = blockData.hash
          if (blockHash === hash) {
            block = blockData;
          };
        })
        .on('error', err => reject(err))
        .on('close', () => resolve(block))
    })
  }

  getBlockByAddress(address) {
    const self = this;
    const blockArray = [];
    return new Promise((resolve, reject) => {
      self.db.createReadStream()
        .on('data', data => {
          const blockData = JSON.parse(data.value)
          const blockAddress = blockData.body.address
          if (blockAddress === address) {
            blockArray.push(blockData);
          };
        })
        .on('error', err => reject(err))
        .on('close', () => resolve(blockArray))
    })
  }

  // Add data to levelDB with key and value (Promise)
  addLevelDBData(key, value) {
    const self = this;
    return new Promise((resolve, reject) => {
      // Add your code here, remember in Promises you need to resolve() or reject() 
      self.db.put(key, value, (err) => {
        if (err) {
          reject(err)
        } else {
          resolve(value)
        }
      })
    });
  }

  // Method that return the height
  getBlocksCount() {
    const self = this;
    let count = -1;
    return new Promise((resolve, reject) => {
    // Add your code here, remember in Promises you need to resolve() or reject()
    self.db.createReadStream()
      .on('data', (data) => count++)
      .on('error', err => reject(err))
      .on('close', () => resolve(count))
    });
  }
}

module.exports.LevelSandbox = LevelSandbox;
