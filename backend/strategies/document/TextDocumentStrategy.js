const BaseDocumentStrategy = require('./BaseDocumentStrategy');

class TextDocumentStrategy extends BaseDocumentStrategy {
  supportsInlinePreview() {
    return true;
  }

  getPreviewType() {
    return 'text';
  }
}

module.exports = TextDocumentStrategy;
