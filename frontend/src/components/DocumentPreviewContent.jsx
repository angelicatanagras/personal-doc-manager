import { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig';

const isImageType = (mimeType = '') => mimeType.startsWith('image/');
const isPdfType = (mimeType = '') => mimeType === 'application/pdf';
const isTextType = (mimeType = '', fileType = '') => mimeType.startsWith('text/') || fileType === 'txt';

export default function DocumentPreviewContent({ doc, onDownload }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [textPreview, setTextPreview] = useState('');

  useEffect(() => {
    let objectUrl = '';

    const loadPreview = async () => {
      setLoading(true);
      setError('');
      setPreviewUrl('');
      setTextPreview('');

      try {
        const { data } = await axiosInstance.get(`/api/documents/${doc._id}/download`, {
          responseType: 'blob',
        });

        if (isTextType(doc.mimeType, doc.fileType)) {
          const text = await data.text();
          setTextPreview(text);
          return;
        }

        objectUrl = URL.createObjectURL(data);
        setPreviewUrl(objectUrl);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load preview.');
      } finally {
        setLoading(false);
      }
    };

    loadPreview();

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [doc]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-slate-500">
        Loading preview...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center px-6 text-center text-sm text-red-600">
        {error}
      </div>
    );
  }

  if (isImageType(doc.mimeType) && previewUrl) {
    return <img src={previewUrl} alt={doc.name} className="max-h-full max-w-full rounded-lg object-contain" />;
  }

  if (isPdfType(doc.mimeType) && previewUrl) {
    return <iframe title={doc.name} src={previewUrl} className="h-full w-full rounded-lg border-0 bg-white" />;
  }

  if (isTextType(doc.mimeType, doc.fileType)) {
    return (
      <pre className="h-full w-full overflow-auto whitespace-pre-wrap rounded-lg bg-white p-5 text-sm text-slate-700">
        {textPreview || 'This file is empty.'}
      </pre>
    );
  }

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-800">Preview not available for this file type</p>
        <p className="mt-1 text-sm text-slate-500">
          {doc.fileType?.toUpperCase() || 'FILE'} files can still be downloaded and opened locally.
        </p>
      </div>
      <button
        type="button"
        onClick={() => onDownload(doc)}
        className="inline-flex items-center gap-2 rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-600"
      >
        Download file
      </button>
    </div>
  );
}
