import DocumentPreviewContent from './DocumentPreviewContent';

export default function DocumentPreviewModal({ doc, onClose, onDownload }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm">
      <div className="flex h-[85vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-slate-50 shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-200 bg-white px-6 py-4">
          <div className="min-w-0">
            <h2 className="truncate text-lg font-bold text-slate-900">{doc.name}</h2>
            <p className="mt-1 text-sm text-slate-500">
              {doc.originalName} · {doc.fileType?.toUpperCase() || 'FILE'}
            </p>
          </div>
          <div className="ml-4 flex items-center gap-2">
            <button
              type="button"
              onClick={() => onDownload(doc)}
              className="hidden rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 sm:block"
            >
              Download
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              aria-label="Close preview"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden bg-slate-100 p-4">
          <div className="h-full w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
            <DocumentPreviewContent doc={doc} onDownload={onDownload} />
          </div>
        </div>
      </div>
    </div>
  );
}
