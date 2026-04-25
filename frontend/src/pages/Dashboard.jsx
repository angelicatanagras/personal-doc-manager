import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import DocumentCard from '../components/DocumentCard';
import SkeletonCard from '../components/SkeletonCard';
import UploadModal from '../components/UploadModal';
import EditModal from '../components/EditModal';
import ConfirmDialog from '../components/ConfirmDialog';
import DocumentPreviewModal from '../components/DocumentPreviewModal';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { getDocumentDownloadName } from '../utils/documentName';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [recentDocs, setRecentDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [editDoc, setEditDoc] = useState(null);
  const [deleteDoc, setDeleteDoc] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const dropRef = useRef();

  useEffect(() => {
    axiosInstance.get('/api/documents', { params: { sort: '' } })
      .then(({ data }) => setRecentDocs(data.slice(0, 6)))
      .catch((err) => setFetchError(err.response?.data?.message || err.message || 'Failed to load documents.'))
      .finally(() => setLoading(false));
  }, []);

  const handleDownload = async (doc) => {
    const { data } = await axiosInstance.get(`/api/documents/${doc._id}/download`, { responseType: 'blob' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(data);
    a.download = getDocumentDownloadName(doc);
    a.click();
  };

  const handleDelete = async () => {
    await axiosInstance.delete(`/api/documents/${deleteDoc._id}`);
    setRecentDocs((prev) => prev.filter((d) => d._id !== deleteDoc._id));
    toast('Moved to trash', { message: `"${deleteDoc.name}" was moved to trash.`, type: 'success' });
    setDeleteDoc(null);
  };

  const handleUpdated = (updated) => {
    setRecentDocs((prev) => prev.map((d) => (d._id === updated._id ? updated : d)));
    toast('Document updated', { message: `"${updated.name}" has been saved.`, type: 'success' });
  };

  const onUploaded = (doc) => {
    setRecentDocs((prev) => [doc, ...prev].slice(0, 6));
    toast('Upload successful', { message: `"${doc.name}" has been uploaded.`, type: 'success' });
  };

  const handleZoneDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    setShowUpload(true);
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-[52px] bg-white border-b border-[#E2E8F0] flex items-center px-4 sm:px-5 gap-3 flex-shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden -ml-1 mr-1 p-1 text-[#64748B]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
          <span className="text-[15px] font-bold text-[#1E293B]">Dashboard</span>
          <div className="flex-1" />
          <button
            onClick={() => setShowUpload(true)}
            className="flex items-center gap-1.5 h-[34px] px-3 sm:px-3.5 bg-[#0F766E] text-white text-[13px] font-semibold rounded-md hover:bg-[#0d6460] transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Upload
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5 flex flex-col gap-5 sm:gap-6">
          {/* Welcome */}
          <div>
            <h1 className="text-[18px] sm:text-[20px] font-bold text-[#1E293B] leading-tight">Welcome back, {user?.name?.split(' ')[0] ?? 'there'} 👋</h1>
            <p className="text-sm text-[#64748B] mt-0.5">Here&apos;s what&apos;s in your vault.</p>
          </div>

          {/* Drop zone */}
          <div
            ref={dropRef}
            onClick={() => setShowUpload(true)}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleZoneDrop}
            className={`relative border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 overflow-hidden ${
              dragging
                ? 'border-[#0F766E] bg-gradient-to-br from-teal-50 to-cyan-50 shadow-inner'
                : 'border-[#E2E8F0] hover:border-[#14B8A6] hover:bg-gradient-to-br hover:from-teal-50/60 hover:to-cyan-50/40'
            }`}
          >
            <div className="flex flex-col items-center py-8 px-4 sm:py-10 sm:px-6 text-center">
              {/* Icon with background circle */}
              <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-colors ${
                dragging ? 'bg-teal-100' : 'bg-[#F1F5F9] group-hover:bg-teal-100'
              }`}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={dragging ? '#0F766E' : '#94A3B8'} strokeWidth="1.5" strokeLinecap="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
              </div>

              <p className="text-[14px] font-semibold text-[#1E293B] mb-1">
                {dragging ? 'Drop your file here' : 'Drag & drop files here, or '}
                {!dragging && <span className="text-[#0F766E] underline underline-offset-2">browse</span>}
              </p>
              <p className="text-[12px] text-[#94A3B8] mb-4">Maximum file size 50 MB</p>

              {/* Accepted types as chips */}
              <div className="flex items-center gap-2 flex-wrap justify-center">
                {['PDF', 'DOCX', 'XLSX', 'JPG', 'PNG'].map((t) => (
                  <span key={t} className="text-[11px] font-semibold px-2.5 py-1 bg-white border border-[#E2E8F0] rounded-full text-[#64748B] shadow-sm">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Recent documents */}
          <div>
            {fetchError && <div className="mb-3 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{fetchError}</div>}
            <div className="flex items-center justify-between gap-3 mb-3">
              <h2 className="text-[14px] font-bold text-[#1E293B]">Recent Documents</h2>
              <button onClick={() => navigate('/documents')} className="text-xs text-[#0F766E] font-medium hover:underline whitespace-nowrap">
                View all →
              </button>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-3 gap-3">
                {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : recentDocs.length === 0 ? (
              <div className="py-12 text-center">
                <svg className="mx-auto mb-3 text-[#CBD5E1]" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                <p className="text-sm text-[#64748B]">No documents yet.</p>
                <button onClick={() => setShowUpload(true)} className="mt-2 text-xs text-[#0F766E] font-medium hover:underline">Upload your first file →</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-3 gap-3">
                {recentDocs.map((doc) => (
                  <DocumentCard
                  key={doc._id}
                  doc={doc}
                  onOpen={(selectedDoc) => navigate(`/documents/${selectedDoc._id}`)}
                  onPreview={setPreviewDoc}
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

      {previewDoc && (
        <DocumentPreviewModal
          doc={previewDoc}
          onClose={() => setPreviewDoc(null)}
          onDownload={handleDownload}
        />
      )}
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
