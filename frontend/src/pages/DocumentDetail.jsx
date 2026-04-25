import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import axiosInstance from '../axiosConfig';
import DocumentPreviewContent from '../components/DocumentPreviewContent';
import { getDocumentDownloadName } from '../utils/documentName';
import { useToast } from '../components/Toast';

const formatSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
};

const formatDate = (value) => {
  if (!value) return 'Not set';
  return new Date(value).toLocaleString();
};

export default function DocumentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [doc, setDoc] = useState(null);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDocument = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await axiosInstance.get(`/api/documents/${id}`);
        setDoc(data);
        setName(data.name || '');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load document.');
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [id]);

  const handleDownload = async (currentDoc) => {
    const { data } = await axiosInstance.get(`/api/documents/${currentDoc._id}/download`, { responseType: 'blob' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(data);
    a.download = getDocumentDownloadName(currentDoc);
    a.click();
  };

  const handleRename = async (e) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Document name is required.');
      return;
    }

    setSaving(true);
    setError('');
    try {
      const { data } = await axiosInstance.put(`/api/documents/${id}`, { name: trimmedName });
      setDoc(data);
      setName(data.name);
      toast('Document renamed', { message: `"${data.name}" has been saved.`, type: 'success' });
    } catch (err) {
      setError(err.response?.data?.message || 'Rename failed.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-[52px] bg-white border-b border-[#E2E8F0] flex items-center px-5 gap-3 flex-shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden -ml-1 mr-1 p-1 text-[#64748B]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
          </button>
          <button onClick={() => navigate(-1)} className="text-sm font-medium text-[#64748B] hover:text-[#1E293B]">
            ← Back
          </button>
          <span className="text-[15px] font-bold text-[#1E293B]">Document Details</span>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {loading ? (
            <div className="py-10 text-center text-sm text-[#64748B]">Loading document...</div>
          ) : error && !doc ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
          ) : doc ? (
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.5fr)_380px]">
              <div className="min-h-[520px] overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 p-4">
                <div className="h-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                  <DocumentPreviewContent doc={doc} onDownload={handleDownload} />
                </div>
              </div>

              <div className="flex flex-col gap-5">
                <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">Inline Rename</p>
                      <p className="mt-1 text-sm text-[#64748B]">Update the document title and save it without leaving this page.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDownload(doc)}
                      className="rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-sm font-medium text-[#1E293B] hover:bg-[#F8FAFC]"
                    >
                      Download
                    </button>
                  </div>

                  <form onSubmit={handleRename} className="flex flex-col gap-3">
                    {error && <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}
                    <div>
                      <label htmlFor="document-name" className="mb-1.5 block text-[13px] font-medium text-[#1E293B]">Document name</label>
                      <input
                        id="document-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm text-[#1E293B] focus:outline-none focus:border-[#14B8A6] focus:ring-2 focus:ring-[#14B8A6]/10"
                      />
                      <p className="mt-1 text-[11px] text-[#94A3B8]">Downloads will keep the same file type but use the updated title.</p>
                    </div>
                    <button
                      type="submit"
                      disabled={saving}
                      className="inline-flex w-fit items-center justify-center rounded-lg bg-[#0F766E] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0d6460] disabled:opacity-60"
                    >
                      {saving ? 'Saving...' : 'Save new name'}
                    </button>
                  </form>
                </div>

                <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
                  <h2 className="text-[15px] font-bold text-[#1E293B]">Metadata</h2>
                  <dl className="mt-4 grid grid-cols-[120px_1fr] gap-y-3 text-sm">
                    <dt className="text-[#64748B]">Current name</dt>
                    <dd className="font-medium text-[#1E293B] break-words">{doc.name}</dd>
                    <dt className="text-[#64748B]">Original file</dt>
                    <dd className="font-medium text-[#1E293B] break-words">{doc.originalName}</dd>
                    <dt className="text-[#64748B]">Type</dt>
                    <dd className="font-medium text-[#1E293B]">{doc.fileType?.toUpperCase() || 'FILE'}</dd>
                    <dt className="text-[#64748B]">Size</dt>
                    <dd className="font-medium text-[#1E293B]">{formatSize(doc.size)}</dd>
                    <dt className="text-[#64748B]">Folder</dt>
                    <dd className="font-medium text-[#1E293B]">{doc.folderId?.name || 'Uncategorised'}</dd>
                    <dt className="text-[#64748B]">Status</dt>
                    <dd className="font-medium text-[#1E293B] capitalize">{doc.status}</dd>
                    <dt className="text-[#64748B]">Expiry</dt>
                    <dd className="font-medium text-[#1E293B]">{doc.expiryDate ? new Date(doc.expiryDate).toLocaleDateString() : 'Not set'}</dd>
                    <dt className="text-[#64748B]">Uploaded</dt>
                    <dd className="font-medium text-[#1E293B]">{formatDate(doc.createdAt)}</dd>
                    <dt className="text-[#64748B]">Updated</dt>
                    <dd className="font-medium text-[#1E293B]">{formatDate(doc.updatedAt)}</dd>
                    <dt className="text-[#64748B]">Tags</dt>
                    <dd className="font-medium text-[#1E293B]">
                      {Array.isArray(doc.tags) && doc.tags.length > 0 ? doc.tags.map((tag) => (typeof tag === 'string' ? tag : tag.name)).join(', ') : 'None'}
                    </dd>
                  </dl>
                </div>

                <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
                  <h2 className="text-[15px] font-bold text-[#1E293B]">Next Actions</h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Link to="/documents" className="rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm font-medium text-[#1E293B] hover:bg-[#F8FAFC]">All documents</Link>
                    <Link to="/folders" className="rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm font-medium text-[#1E293B] hover:bg-[#F8FAFC]">Folders</Link>
                    <button type="button" onClick={() => handleDownload(doc)} className="rounded-lg bg-[#1E293B] px-3 py-2 text-sm font-medium text-white hover:opacity-90">Download</button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
