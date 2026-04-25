const fs = require('fs');
const path = require('path');

class LocalStorageAdapter {
  remove(filePath) {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  resolve(filePath) {
    return path.resolve(filePath);
  }

  exists(filePath) {
    return fs.existsSync(filePath);
  }

  extensionFor(fileName) {
    return path.extname(fileName || '');
  }
}

module.exports = LocalStorageAdapter;
