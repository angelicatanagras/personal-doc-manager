const fs = require('fs');
const path = require('path');

class FileStorageService {
  removeFile(filePath) {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  resolvePath(filePath) {
    return path.resolve(filePath);
  }

  fileExists(filePath) {
    return fs.existsSync(filePath);
  }

  buildDownloadName(document) {
    const trimmedName = (document.name || '').trim();
    const originalName = document.originalName || '';
    const extension = path.extname(originalName);

    if (!trimmedName) return originalName || 'document';
    if (extension && trimmedName.toLowerCase().endsWith(extension.toLowerCase())) return trimmedName;
    return `${trimmedName}${extension}`;
  }
}

module.exports = FileStorageService;
