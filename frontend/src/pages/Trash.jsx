import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import ConfirmDialog from '../components/ConfirmDialog';
import axiosInstance from '../axiosConfig';

const formatSize = (bytes) => {
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
};

export default function Trash() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [permDelete, setPermDelete] = useState(null);

  useEffect(() => {
    axiosInstance.get('/api/documents/trash')
      .then(({ data }) => setDocs(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleRestore = async (doc) => {
    await axiosInstance.put(`/api/documents/${doc._id}/restore`);
    setDocs((prev) => prev.filter((d) => d._id !== doc._id));
  };

  const handlePermDelete = async () => {
    await axiosInstance.delete(`/api/documents/${permDelete._id}/permanent`);
    setDocs((prev) => prev.filter((d) => d._id !== permDelete._id));
    setPermDelete(null);
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-[52px] bg-white border-b border-[#E2E8F0] flex items-center px-5 flex-shrink-0">
          <span className="text-[15px] font-bold text-[#1E293B]">Trash</span>
          <p className="ml-3 text-[13px] text-[#64748B]">Items are permanently deleted after 30 days.</p>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {loading ? (
            <p className="text-sm text-[#64748B] py-10 text-center">Loading…</p>
          ) : docs.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-center">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="1.5" className="mb-3"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
              <p className="text-sm text-[#64748B]">Trash is empty.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {docs.map((doc) => (
                <div key={doc._id} className="bg-white border border-[#E2E8F0] rounded-lg px-4 py-3 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-[#1E293B] truncate">{doc.name}</p>
                    <p className="text-[11.5px] text-[#64748B]">{doc.fileType?.toUpperCase()} · {formatSize(doc.size)}</p>
                  </div>
                  <p className="text-[11px] text-[#94A3B8] flex-shrink-0">
                    Deleted {new Date(doc.deletedAt).toLocaleDateString()}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRestore(doc)}
                      className="px-3 py-1.5 text-[12px] font-medium text-[#0F766E] border border-[#0F766E] rounded-md hover:bg-[#F0FDFA] transition-colors"
                    >
                      Restore
                    </button>
                    <button
                      onClick={() => setPermDelete(doc)}
                      className="px-3 py-1.5 text-[12px] font-medium text-red-500 border border-red-200 rounded-md hover:bg-red-50 transition-colors"
                    >
                      Delete forever
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {permDelete && (
        <ConfirmDialog
          title="Delete forever?"
          message={`"${permDelete.name}" will be permanently deleted and cannot be recovered.`}
          confirmLabel="Delete forever"
          onConfirm={handlePermDelete}
          onCancel={() => setPermDelete(null)}
        />
      )}
    </div>
  );
}
