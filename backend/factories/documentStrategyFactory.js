const PdfDocumentStrategy = require('../strategies/document/PdfDocumentStrategy');
const ImageDocumentStrategy = require('../strategies/document/ImageDocumentStrategy');
const TextDocumentStrategy = require('../strategies/document/TextDocumentStrategy');
const DefaultDocumentStrategy = require('../strategies/document/DefaultDocumentStrategy');

class DocumentStrategyFactory {
  create(document) {
    const fileType = document?.fileType;
    const mimeType = document?.mimeType || '';

    if (fileType === 'pdf' || mimeType === 'application/pdf') return new PdfDocumentStrategy();
    if (['jpg', 'jpeg', 'png'].includes(fileType) || mimeType.startsWith('image/')) return new ImageDocumentStrategy();
    if (fileType === 'txt' || mimeType.startsWith('text/')) return new TextDocumentStrategy();
    return new DefaultDocumentStrategy();
  }
}

module.exports = DocumentStrategyFactory;
