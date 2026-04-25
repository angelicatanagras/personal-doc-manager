import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import DocumentCard from '../components/DocumentCard';
import UploadModal from '../components/UploadModal';
import EditModal from '../components/EditModal';
import ConfirmDialog from '../components/ConfirmDialog';
import DocumentPreviewModal from '../components/DocumentPreviewModal';
import axiosInstance from '../axiosConfig';
import SkeletonCard from '../components/SkeletonCard';
import { useToast } from '../components/Toast';
import { getDocumentDownloadName } from '../utils/documentName';

const FILTERS = ['All', 'pdf', 'docx', 'xlsx', 'jpg', 'png'];
const FILTER_LABELS = { All: 'All', pdf: 'PDF', docx: 'Word', xlsx: 'Excel', jpg: 'JPG', png: 'PNG' };

export default function AllDocuments() {
  const navigate = useNavigate();
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [sort, setSort] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [editDoc, setEditDoc] = useState(null);
  const [deleteDoc, setDeleteDoc] = useState(null);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toast = useToast();

  const fetchDocs = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (filter !== 'All') params.fileType = filter;
      if (sort) params.sort = sort;
      const { data } = await axiosInstance.get('/api/documents', { params });
      setDocs(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load documents.');
    } finally {
      setLoading(false);
    }
  }, [search, filter, sort]);

  useEffect(() => { fetchDocs(); }, [fetchDocs]);

  const handleDownload = async (doc) => {
    const { data } = await axiosInstance.get(`/api/documents/${doc._id}/download`, { responseType: 'blob' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(data);
    a.download = getDocumentDownloadName(doc);
    a.click();
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/api/documents/${deleteDoc._id}`);
      setDocs((prev) => prev.filter((d) => d._id !== deleteDoc._id));
      toast('Moved to trash', { message: `"${deleteDoc.name}" was moved to trash.`, type: 'success' });
      setDeleteDoc(null);
    } catch {
      setError('Failed to delete document.');
    }
  };

  const handleUpdated = (updated) => {
    setDocs((prev) => prev.map((d) => (d._id === updated._id ? updated : d)));
    toast('Document updated', { message: `"${updated.name}" has been saved.`, type: 'success' });
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="border-b border-[#E2E8F0] bg-white px-4 py-3 md:h-[52px] md:px-5 md:py-0">
          <div className="flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden -ml-1 mr-1 p-1 text-[#64748B]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
          <span className="text-[15px] font-bold text-[#1E293B]">All Documents</span>
          <div className="hidden md:block flex-1 max-w-sm ml-2 relative">
            <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              type="text"
              placeholder="Search documents…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-[34px] bg-[#F1F5F9] border border-[#E2E8F0] rounded-md pl-8 pr-3 text-[13px] text-[#1E293B] focus:outline-none focus:border-[#14B8A6]"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="hidden md:block h-[34px] border border-[#E2E8F0] rounded-md px-2 text-[12px] text-[#1E293B] bg-white focus:outline-none"
          >
            <option value="">Last updated</option>
            <option value="name">Name A–Z</option>
            <option value="size">File size</option>
            <option value="expiry">Expiry date</option>
          </select>
          <button
            onClick={() => setShowUpload(true)}
            className="flex items-center gap-1.5 h-[34px] px-3.5 bg-[#0F766E] text-white text-[13px] font-semibold rounded-md hover:bg-[#0d6460] transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Upload
          </button>
          </div>

          <div className="mt-3 flex flex-col gap-3 md:hidden">
            <div className="relative">
              <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input
                type="text"
                placeholder="Search documents…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-[38px] w-full rounded-md border border-[#E2E8F0] bg-[#F1F5F9] pl-8 pr-3 text-[13px] text-[#1E293B] focus:outline-none focus:border-[#14B8A6]"
              />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="h-[38px] rounded-md border border-[#E2E8F0] px-3 text-[13px] text-[#1E293B] bg-white focus:outline-none"
            >
              <option value="">Last updated</option>
              <option value="name">Name A–Z</option>
              <option value="size">File size</option>
              <option value="expiry">Expiry date</option>
            </select>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-4 md:px-6">
          {error && <div className="mb-4 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>}

          {/* Filter pills */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3.5 py-1 rounded-full text-[12.5px] font-medium border transition-all ${
                  filter === f
                    ? 'bg-[#CCFBF1] border-[#14B8A6] text-[#0F766E] font-bold'
                    : 'bg-white border-[#E2E8F0] text-[#64748B] hover:border-[#14B8A6]'
                }`}
              >
                {FILTER_LABELS[f]}
              </button>
            ))}
          </div>

          <p className="text-[13px] text-[#64748B] mb-3">
            Showing <strong className="text-[#1E293B]">{docs.length}</strong> document{docs.length !== 1 ? 's' : ''}
          </p>

          {loading ? (
            <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : docs.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-center">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="1.5" className="mb-3"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              <p className="text-sm text-[#64748B]">No documents yet.</p>
              <button onClick={() => setShowUpload(true)} className="mt-3 text-sm font-medium text-[#0F766E] underline">Upload your first document</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-3 gap-3">
              {docs.map((doc) => (
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

      {showUpload && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          onUploaded={(doc) => setDocs((prev) => [doc, ...prev])}
        />
      )}
      {previewDoc && (
        <DocumentPreviewModal
          doc={previewDoc}
          onClose={() => setPreviewDoc(null)}
          onDownload={handleDownload}
        />
      )}
      {editDoc && (
        <EditModal doc={editDoc} onClose={() => setEditDoc(null)} onUpdated={handleUpdated} />
      )}
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
