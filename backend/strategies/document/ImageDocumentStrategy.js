const BaseDocumentStrategy = require('./BaseDocumentStrategy');

class ImageDocumentStrategy extends BaseDocumentStrategy {
  supportsInlinePreview() {
    return true;
  }

  getPreviewType() {
    return 'image';
  }
}

module.exports = ImageDocumentStrategy;
