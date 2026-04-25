const BaseDocumentStrategy = require('./BaseDocumentStrategy');

class PdfDocumentStrategy extends BaseDocumentStrategy {
  supportsInlinePreview() {
    return true;
  }

  getPreviewType() {
    return 'pdf';
  }
}

module.exports = PdfDocumentStrategy;
