import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import DocumentCard from '../components/DocumentCard';
import EditModal from '../components/EditModal';
import ConfirmDialog from '../components/ConfirmDialog';
import axiosInstance from '../axiosConfig';
import SkeletonCard from '../components/SkeletonCard';
import { getDocumentDownloadName } from '../utils/documentName';

export default function ExpiringSoon() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editDoc, setEditDoc] = useState(null);
  const [deleteDoc, setDeleteDoc] = useState(null);

  useEffect(() => {
    axiosInstance.get('/api/documents')
      .then(({ data }) => {
        const alerts = data.filter((d) => d.status === 'expiring' || d.status === 'expired');
        alerts.sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));
        setDocs(alerts);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDownload = async (doc) => {
    const { data } = await axiosInstance.get(`/api/documents/${doc._id}/download`, { responseType: 'blob' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(data);
    a.download = getDocumentDownloadName(doc);
    a.click();
  };

  const handleDocDelete = async () => {
    await axiosInstance.delete(`/api/documents/${deleteDoc._id}`);
    setDocs((prev) => prev.filter((d) => d._id !== deleteDoc._id));
    setDeleteDoc(null);
  };

  const handleDocUpdated = (updated) => {
    setDocs((prev) => prev.map((d) => (d._id === updated._id ? updated : d)).filter((d) => d.status === 'expiring' || d.status === 'expired'));
  };

  const expiring = docs.filter((d) => d.status === 'expiring');
  const expired = docs.filter((d) => d.status === 'expired');

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-[52px] bg-white border-b border-[#E2E8F0] flex items-center px-5 gap-3 flex-shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden -ml-1 mr-1 p-1 text-[#64748B]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
          <span className="text-[15px] font-bold text-[#1E293B]">Expiring Soon</span>
          {docs.length > 0 && (
            <span className="bg-orange-100 text-orange-700 text-[11px] font-bold px-2 py-0.5 rounded-full">{docs.length}</span>
          )}
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-6">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : docs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-20">
              <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </div>
              <p className="text-[15px] font-semibold text-[#1E293B]">All documents are up to date</p>
              <p className="text-sm text-[#64748B] mt-1">No documents are expiring or expired.</p>
            </div>
          ) : (
            <>
              {expiring.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-2 h-2 rounded-full bg-orange-400" />
                    <h2 className="text-[13px] font-bold text-[#1E293B]">Expiring within 30 days</h2>
                    <span className="text-[11px] text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full font-semibold">{expiring.length}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {expiring.map((doc) => (
                      <DocumentCard key={doc._id} doc={doc} onOpen={(selectedDoc) => navigate(`/documents/${selectedDoc._id}`)} onEdit={setEditDoc} onDelete={setDeleteDoc} onDownload={handleDownload} />
                    ))}
                  </div>
                </div>
              )}

              {expired.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-2 h-2 rounded-full bg-red-400" />
                    <h2 className="text-[13px] font-bold text-[#1E293B]">Expired</h2>
                    <span className="text-[11px] text-red-600 bg-red-50 px-2 py-0.5 rounded-full font-semibold">{expired.length}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {expired.map((doc) => (
                      <DocumentCard key={doc._id} doc={doc} onOpen={(selectedDoc) => navigate(`/documents/${selectedDoc._id}`)} onEdit={setEditDoc} onDelete={setDeleteDoc} onDownload={handleDownload} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {editDoc && <EditModal doc={editDoc} onClose={() => setEditDoc(null)} onUpdated={handleDocUpdated} />}
      {deleteDoc && (
        <ConfirmDialog
          title="Move to Trash?"
          message={`"${deleteDoc.name}" will be moved to trash.`}
          confirmLabel="Move to Trash"
          onConfirm={handleDocDelete}
          onCancel={() => setDeleteDoc(null)}
        />
      )}
    </div>
  );
}
