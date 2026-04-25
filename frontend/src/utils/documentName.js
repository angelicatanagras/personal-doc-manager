export const getDocumentDownloadName = (doc) => {
  const currentName = (doc.name || '').trim();
  const originalName = doc.originalName || '';
  const extensionIndex = originalName.lastIndexOf('.');
  const extension = extensionIndex >= 0 ? originalName.slice(extensionIndex) : '';

  if (!currentName) return originalName || 'document';
  if (extension && currentName.toLowerCase().endsWith(extension.toLowerCase())) return currentName;
  return `${currentName}${extension}`;
};
