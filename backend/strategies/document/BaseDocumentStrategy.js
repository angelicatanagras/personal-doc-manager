class BaseDocumentStrategy {
  supportsInlinePreview() {
    return false;
  }

  getPreviewType() {
    return 'download';
  }

  buildDownloadName(document, extension) {
    const trimmedName = (document.name || '').trim();
    const originalName = document.originalName || '';

    if (!trimmedName) return originalName || 'document';
    if (extension && trimmedName.toLowerCase().endsWith(extension.toLowerCase())) return trimmedName;
    return `${trimmedName}${extension}`;
  }
}

module.exports = BaseDocumentStrategy;
