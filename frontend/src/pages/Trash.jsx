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
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="min-h-[52px] bg-white border-b border-[#E2E8F0] flex items-start sm:items-center px-4 sm:px-5 gap-3 flex-shrink-0 py-2">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden -ml-1 mr-1 p-1 text-[#64748B]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 min-w-0">
            <span className="text-[15px] font-bold text-[#1E293B]">Trash</span>
            <p className="text-[12px] sm:text-[13px] text-[#64748B]">Items are permanently deleted after 30 days.</p>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
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
                <div key={doc._id} className="bg-white border border-[#E2E8F0] rounded-lg px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-[#1E293B] truncate">{doc.name}</p>
                    <p className="text-[11.5px] text-[#64748B] break-words">{doc.fileType?.toUpperCase()} · {formatSize(doc.size)} · Deleted {new Date(doc.deletedAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0 sm:min-w-fit">
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
