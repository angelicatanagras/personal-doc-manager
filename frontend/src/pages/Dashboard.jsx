import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import DocumentCard from '../components/DocumentCard';
import UploadModal from '../components/UploadModal';
import EditModal from '../components/EditModal';
import ConfirmDialog from '../components/ConfirmDialog';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recentDocs, setRecentDocs] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  const [editDoc, setEditDoc] = useState(null);
  const [deleteDoc, setDeleteDoc] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const dropRef = useRef();

  useEffect(() => {
    axiosInstance.get('/api/documents', { params: { sort: '' } })
      .then(({ data }) => setRecentDocs(data.slice(0, 6)))
      .catch((err) => setFetchError(err.response?.data?.message || err.message || 'Failed to load documents.'));
  }, []);

  const handleDownload = async (doc) => {
    const { data } = await axiosInstance.get(`/api/documents/${doc._id}/download`, { responseType: 'blob' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(data);
    a.download = doc.originalName || doc.name;
    a.click();
  };

  const handleDelete = async () => {
    await axiosInstance.delete(`/api/documents/${deleteDoc._id}`);
    setRecentDocs((prev) => prev.filter((d) => d._id !== deleteDoc._id));
    setDeleteDoc(null);
  };

  const handleUpdated = (updated) => {
    setRecentDocs((prev) => prev.map((d) => (d._id === updated._id ? updated : d)));
  };

  const onUploaded = (doc) => {
    setRecentDocs((prev) => [doc, ...prev].slice(0, 6));
  };

  const handleZoneDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    // Open modal — file selection handled inside UploadModal
    setShowUpload(true);
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-[52px] bg-white border-b border-[#E2E8F0] flex items-center px-5 gap-3 flex-shrink-0">
          <span className="text-[15px] font-bold text-[#1E293B]">Dashboard</span>
          <div className="flex-1" />
          <button
            onClick={() => setShowUpload(true)}
            className="flex items-center gap-1.5 h-[34px] px-3.5 bg-[#0F766E] text-white text-[13px] font-semibold rounded-md hover:bg-[#0d6460] transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Upload
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-6">
          {/* Welcome */}
          <div>
            <h1 className="text-[20px] font-bold text-[#1E293B]">Welcome back, {user?.name?.split(' ')[0] ?? 'there'} 👋</h1>
            <p className="text-sm text-[#64748B] mt-0.5">Here's what's in your vault.</p>
          </div>

          {/* Drop zone */}
          <div
            ref={dropRef}
            onClick={() => setShowUpload(true)}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleZoneDrop}
            className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
              dragging ? 'border-[#14B8A6] bg-teal-50' : 'border-[#E2E8F0] hover:border-[#14B8A6] hover:bg-[#F0FDFA]'
            }`}
          >
            <svg className="mx-auto mb-3 text-[#94A3B8]" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            <p className="text-sm font-medium text-[#1E293B]">Drag & drop files here, or click to upload</p>
            <p className="text-xs text-[#94A3B8] mt-1">PDF, JPG, PNG, DOCX, XLSX · max 50 MB</p>
          </div>

          {/* Recent documents */}
          <div>
            {fetchError && <div className="mb-3 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{fetchError}</div>}
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[14px] font-bold text-[#1E293B]">Recent Documents</h2>
              <button onClick={() => navigate('/documents')} className="text-xs text-[#0F766E] font-medium hover:underline">
                View all →
              </button>
            </div>
            {recentDocs.length === 0 ? (
              <p className="text-sm text-[#64748B] py-6 text-center">No documents yet. Upload your first file above.</p>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {recentDocs.map((doc) => (
                  <DocumentCard
                    key={doc._id}
                    doc={doc}
                    onEdit={setEditDoc}
                    onDelete={setDeleteDoc}
                    onDownload={handleDownload}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showUpload && <UploadModal onClose={() => setShowUpload(false)} onUploaded={onUploaded} />}
      {editDoc && <EditModal doc={editDoc} onClose={() => setEditDoc(null)} onUpdated={handleUpdated} />}
      {deleteDoc && (
        <ConfirmDialog
          title="Move to Trash?"
          message={`"${deleteDoc.name}" will be moved to trash. You can restore it within 30 days.`}
          confirmLabel="Move to Trash"
          onConfirm={handleDelete}
          onCancel={() => setDeleteDoc(null)}
        />
      )}
    </div>
  );
}
