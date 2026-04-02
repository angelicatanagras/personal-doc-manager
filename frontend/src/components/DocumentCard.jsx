const FILE_STYLES = {
  pdf:  { accent: 'bg-red-500',    iconBg: 'bg-red-50',    iconText: 'text-red-500',    border: 'border-red-100'    },
  docx: { accent: 'bg-indigo-500', iconBg: 'bg-indigo-50', iconText: 'text-indigo-600', border: 'border-indigo-100' },
  xlsx: { accent: 'bg-green-500',  iconBg: 'bg-green-50',  iconText: 'text-green-600',  border: 'border-green-100'  },
  jpg:  { accent: 'bg-blue-500',   iconBg: 'bg-blue-50',   iconText: 'text-blue-500',   border: 'border-blue-100'   },
  png:  { accent: 'bg-blue-500',   iconBg: 'bg-blue-50',   iconText: 'text-blue-500',   border: 'border-blue-100'   },
  txt:  { accent: 'bg-gray-400',   iconBg: 'bg-gray-50',   iconText: 'text-gray-500',   border: 'border-gray-100'   },
};

const STATUS_CONFIG = {
  valid:    { dot: 'bg-green-500',  label: 'Valid',    text: 'text-green-700',  bg: 'bg-green-50'  },
  expiring: { dot: 'bg-orange-400', label: 'Expiring', text: 'text-orange-700', bg: 'bg-orange-50' },
  expired:  { dot: 'bg-red-500',    label: 'Expired',  text: 'text-red-700',    bg: 'bg-red-50'    },
  stored:   { dot: 'bg-slate-400',  label: 'Stored',   text: 'text-slate-600',  bg: 'bg-slate-100' },
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
  const status = STATUS_CONFIG[doc.status] || STATUS_CONFIG.stored;

  return (
    <div className="group relative bg-white rounded-xl border border-[#E2E8F0] shadow-sm hover:shadow-md hover:border-[#CBD5E1] transition-all duration-200 overflow-hidden flex flex-col">
      {/* Left accent bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${style.accent} rounded-l-xl`} />

      {/* Card content */}
      <div className="pl-5 pr-4 pt-4 pb-3 flex flex-col gap-3 flex-1">
        {/* Top row: icon + status + hover actions */}
        <div className="flex items-start justify-between gap-2">
          {/* File icon */}
          <div className={`w-10 h-12 rounded-lg ${style.iconBg} border ${style.border} flex flex-col items-center justify-center gap-0.5 flex-shrink-0 relative`}>
            {/* Folded corner */}
            <div className="absolute top-0 right-0 w-0 h-0"
              style={{ borderStyle: 'solid', borderWidth: '0 8px 8px 0', borderColor: `transparent white transparent transparent` }} />
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={style.iconText} strokeLinecap="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
            <span className={`text-[7px] font-black uppercase tracking-wide ${style.iconText}`}>{ext}</span>
          </div>

          {/* Right side: status + actions */}
          <div className="flex flex-col items-end gap-2 flex-1 min-w-0">
            {/* Status badge */}
            <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-full ${status.bg} ${status.text} flex-shrink-0`}>
              <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
              {status.label}
            </span>

            {/* Action buttons — hidden at rest, shown on hover */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
              <button
                onClick={(e) => { e.stopPropagation(); onDownload(doc); }}
                title="Download"
                className="w-7 h-7 rounded-md bg-[#F1F5F9] hover:bg-teal-50 hover:text-[#0F766E] text-[#64748B] flex items-center justify-center transition-colors"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onEdit(doc); }}
                title="Edit"
                className="w-7 h-7 rounded-md bg-[#F1F5F9] hover:bg-teal-50 hover:text-[#0F766E] text-[#64748B] flex items-center justify-center transition-colors"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(doc); }}
                title="Delete"
                className="w-7 h-7 rounded-md bg-[#F1F5F9] hover:bg-red-50 hover:text-red-500 text-[#64748B] flex items-center justify-center transition-colors"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
              </button>
            </div>
          </div>
        </div>

        {/* Document name */}
        <p className="text-[13.5px] font-semibold text-[#1E293B] leading-snug line-clamp-2 -mt-1">{doc.name}</p>

        {/* Footer row */}
        <div className="flex items-center justify-between pt-2 border-t border-[#F1F5F9] mt-auto">
          <span className="text-[11px] text-[#94A3B8] flex items-center gap-1">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
            {doc.folderId?.name || 'Uncategorised'}
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-[10.5px] text-[#CBD5E1]">{formatSize(doc.size)}</span>
            <span className="text-[#E2E8F0]">·</span>
            <span className="text-[10.5px] text-[#CBD5E1]">{timeAgo(doc.updatedAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
