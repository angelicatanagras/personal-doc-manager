const FILE_STYLES = {
  pdf:  { bg: 'bg-red-50',    text: 'text-red-500',    border: 'border-red-200'    },
  docx: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200' },
  xlsx: { bg: 'bg-green-50',  text: 'text-green-600',  border: 'border-green-200'  },
  jpg:  { bg: 'bg-blue-50',   text: 'text-blue-500',   border: 'border-blue-200'   },
  png:  { bg: 'bg-blue-50',   text: 'text-blue-500',   border: 'border-blue-200'   },
  txt:  { bg: 'bg-gray-50',   text: 'text-gray-500',   border: 'border-gray-200'   },
};

const STATUS_STYLES = {
  valid:    'bg-green-50 text-green-700',
  expiring: 'bg-yellow-50 text-yellow-700',
  expired:  'bg-red-50 text-red-600',
  stored:   'bg-slate-100 text-slate-500',
};

const STATUS_LABELS = {
  valid:    '✓ Valid',
  expiring: '⏳ Expiring',
  expired:  'Expired',
  stored:   'Stored',
};

const formatSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
};

const timeAgo = (date) => {
  const s = Math.floor((Date.now() - new Date(date)) / 1000);
  if (s < 60) return 'just now';
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  if (d < 30) return `${Math.floor(d / 7)}w ago`;
  return `${Math.floor(d / 30)}mo ago`;
};

export default function DocumentCard({ doc, onEdit, onDelete, onDownload }) {
  const ext = doc.fileType || 'file';
  const style = FILE_STYLES[ext] || FILE_STYLES.txt;
  const statusStyle = STATUS_STYLES[doc.status] || STATUS_STYLES.stored;

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-[10px] p-4 flex flex-col gap-2.5 cursor-pointer hover:shadow-md hover:border-[#14B8A6] transition-all">
      {/* Top row */}
      <div className="flex items-start justify-between">
        <div className={`w-11 h-[52px] rounded-md flex items-center justify-center border relative overflow-hidden ${style.bg} ${style.border}`}>
          <span className={`text-[8px] font-black uppercase ${style.text}`}>{ext.toUpperCase()}</span>
          <div className="absolute top-0 right-0 w-0 h-0 border-solid border-[6px] border-transparent border-t-0 border-r-current opacity-40" />
        </div>
        <span className={`text-[10.5px] font-semibold px-2 py-0.5 rounded-full ${statusStyle}`}>
          {STATUS_LABELS[doc.status] || 'Stored'}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-1">
        <p className="text-[13px] font-bold text-[#1E293B] leading-snug line-clamp-2">{doc.name}</p>
        <p className="text-[11.5px] text-[#64748B]">
          {formatSize(doc.size)} · {ext.toUpperCase()}
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-[#E2E8F0]">
        <span className="text-[11px] text-[#64748B] flex items-center gap-1">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
          {doc.folderId?.name || 'Uncategorised'}
        </span>
        <div className="flex items-center gap-1">
          <span className="text-[11px] text-[#94A3B8] mr-1">{timeAgo(doc.updatedAt)}</span>
          <button
            onClick={(e) => { e.stopPropagation(); onDownload(doc); }}
            className="w-6 h-6 rounded bg-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:text-[#0F766E] transition-colors"
            title="Download"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(doc); }}
            className="w-6 h-6 rounded bg-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:text-[#0F766E] transition-colors"
            title="Rename"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(doc); }}
            className="w-6 h-6 rounded bg-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:text-red-500 transition-colors"
            title="Delete"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
