import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import DocumentCard from '../components/DocumentCard';
import EditModal from '../components/EditModal';
import ConfirmDialog from '../components/ConfirmDialog';
import axiosInstance from '../axiosConfig';
import SkeletonCard from '../components/SkeletonCard';
import { useToast } from '../components/Toast';

const CATEGORY_COLORS = {
  Identity: 'bg-blue-100 text-blue-700',
  Financial: 'bg-green-100 text-green-700',
  Medical: 'bg-red-100 text-red-700',
  Legal: 'bg-purple-100 text-purple-700',
  Property: 'bg-orange-100 text-orange-700',
  Custom: 'bg-slate-100 text-slate-600',
};

export default function Folders() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [folderDocs, setFolderDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [docsLoading, setDocsLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [createError, setCreateError] = useState('');
  const [renameFolder, setRenameFolder] = useState(null);
  const [renameName, setRenameName] = useState('');
  const [deleteFolder, setDeleteFolder] = useState(null);
  const [editDoc, setEditDoc] = useState(null);
  const [deleteDoc, setDeleteDoc] = useState(null);
  const [error, setError] = useState('');
  const toast = useToast();

  useEffect(() => {
    fetchFolders();
  }, []);

  useEffect(() => {
    if (selectedFolder) fetchFolderDocs(selectedFolder._id);
  }, [selectedFolder]);

  const fetchFolders = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get('/api/folders');
      setFolders(data);
    } catch {
      setError('Failed to load folders');
    } finally {
      setLoading(false);
    }
  };

  const fetchFolderDocs = async (folderId) => {
    setDocsLoading(true);
    try {
      const { data } = await axiosInstance.get('/api/documents', { params: { folderId } });
      setFolderDocs(data);
    } catch {
      setFolderDocs([]);
    } finally {
      setDocsLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreateError('');
    try {
      const { data } = await axiosInstance.post('/api/folders', { name: newFolderName });
      setFolders((prev) => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)));
      toast('Folder created', { message: `"${data.name}" has been created.`, type: 'success' });
      setNewFolderName('');
      setShowCreate(false);
    } catch (err) {
      setCreateError(err.response?.data?.message || 'Failed to create folder');
    }
  };

  const handleRename = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axiosInstance.put(`/api/folders/${renameFolder._id}`, { name: renameName });
      setFolders((prev) => prev.map((f) => (f._id === data._id ? data : f)));
      if (selectedFolder?._id === data._id) setSelectedFolder(data);
      toast('Folder renamed', { message: `Folder renamed to "${data.name}".`, type: 'success' });
      setRenameFolder(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to rename folder');
    }
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/api/folders/${deleteFolder._id}`);
      setFolders((prev) => prev.filter((f) => f._id !== deleteFolder._id));
      if (selectedFolder?._id === deleteFolder._id) {
        setSelectedFolder(null);
        setFolderDocs([]);
      }
      toast('Folder deleted', { message: `"${deleteFolder.name}" has been deleted.`, type: 'success' });
      setDeleteFolder(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete folder');
    }
  };

  const handleDownload = async (doc) => {
    const { data } = await axiosInstance.get(`/api/documents/${doc._id}/download`, { responseType: 'blob' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(data);
    a.download = doc.originalName || doc.name;
    a.click();
  };

  const handleDocDelete = async () => {
    await axiosInstance.delete(`/api/documents/${deleteDoc._id}`);
    setFolderDocs((prev) => prev.filter((d) => d._id !== deleteDoc._id));
    setDeleteDoc(null);
  };

  const handleDocUpdated = (updated) => {
    setFolderDocs((prev) => prev.map((d) => (d._id === updated._id ? updated : d)));
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-[52px] bg-white border-b border-[#E2E8F0] flex items-center px-5 gap-3 flex-shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden -ml-1 mr-1 p-1 text-[#64748B]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
          <span className="text-[15px] font-bold text-[#1E293B]">Folders</span>
          <div className="flex-1" />
          <button
            onClick={() => { setShowCreate(true); setCreateError(''); setNewFolderName(''); }}
            className="flex items-center gap-1.5 h-[34px] px-3.5 bg-[#0F766E] text-white text-[13px] font-semibold rounded-md hover:bg-[#0d6460] transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New Folder
          </button>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Folder list */}
          <div className="w-64 border-r border-[#E2E8F0] bg-white flex flex-col overflow-y-auto flex-shrink-0">
            {error && <p className="text-xs text-red-500 px-4 pt-3">{error}</p>}
            {loading ? (
              <p className="text-sm text-[#64748B] p-4">Loading…</p>
            ) : folders.length === 0 ? (
              <div className="p-4 text-center">
                <p className="text-sm text-[#64748B] mb-2">No folders yet.</p>
                <button onClick={() => setShowCreate(true)} className="text-xs text-[#0F766E] font-medium underline">Create one</button>
              </div>
            ) : (
              <ul className="py-2">
                {folders.map((folder) => (
                  <li key={folder._id}>
                    <button
                      onClick={() => setSelectedFolder(folder)}
                      className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-left transition-colors ${
                        selectedFolder?._id === folder._id
                          ? 'bg-[#F0FDFA] text-[#0F766E]'
                          : 'text-[#1E293B] hover:bg-[#F8FAFC]'
                      }`}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                      <span className="flex-1 text-[13px] font-medium truncate">{folder.name}</span>
                      <span className={`text-[10px] font-semibold px-1.5 py-px rounded ${CATEGORY_COLORS[folder.category]}`}>
                        {folder.category}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Folder content */}
          <div className="flex-1 overflow-y-auto px-6 py-5">
            {!selectedFolder ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="1.5" className="mb-3"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                <p className="text-sm text-[#64748B]">Select a folder to view its documents</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-[16px] font-bold text-[#1E293B]">{selectedFolder.name}</h2>
                    <p className="text-[12px] text-[#64748B]">{folderDocs.length} document{folderDocs.length !== 1 ? 's' : ''}</p>
                  </div>
                  {!selectedFolder.isDefault && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setRenameFolder(selectedFolder); setRenameName(selectedFolder.name); }}
                        className="px-3 py-1.5 text-[12px] font-medium text-[#64748B] border border-[#E2E8F0] rounded-md hover:border-[#14B8A6] hover:text-[#0F766E] transition-colors"
                      >
                        Rename
                      </button>
                      <button
                        onClick={() => setDeleteFolder(selectedFolder)}
                        className="px-3 py-1.5 text-[12px] font-medium text-red-500 border border-red-200 rounded-md hover:bg-red-50 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>

                {docsLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
                  </div>
                ) : folderDocs.length === 0 ? (
                  <p className="text-sm text-[#64748B] py-10 text-center">No documents in this folder.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {folderDocs.map((doc) => (
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
              </>
            )}
          </div>
        </div>
      </div>

      {/* Create folder modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm mx-4 p-6">
            <h3 className="text-[15px] font-bold text-[#1E293B] mb-4">New Folder</h3>
            <form onSubmit={handleCreate} className="flex flex-col gap-3">
              {createError && <p className="text-xs text-red-500">{createError}</p>}
              <input
                type="text"
                placeholder="Folder name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                autoFocus
                className="w-full h-[38px] border border-[#E2E8F0] rounded-md px-3 text-[13px] text-[#1E293B] focus:outline-none focus:border-[#14B8A6]"
              />
              <div className="flex justify-end gap-2 mt-1">
                <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2 text-[13px] text-[#64748B] border border-[#E2E8F0] rounded-md hover:bg-[#F8FAFC]">Cancel</button>
                <button type="submit" className="px-4 py-2 text-[13px] font-semibold text-white bg-[#0F766E] rounded-md hover:bg-[#0d6460]">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Rename folder modal */}
      {renameFolder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm mx-4 p-6">
            <h3 className="text-[15px] font-bold text-[#1E293B] mb-4">Rename Folder</h3>
            <form onSubmit={handleRename} className="flex flex-col gap-3">
              <input
                type="text"
                value={renameName}
                onChange={(e) => setRenameName(e.target.value)}
                autoFocus
                className="w-full h-[38px] border border-[#E2E8F0] rounded-md px-3 text-[13px] text-[#1E293B] focus:outline-none focus:border-[#14B8A6]"
              />
              <div className="flex justify-end gap-2 mt-1">
                <button type="button" onClick={() => setRenameFolder(null)} className="px-4 py-2 text-[13px] text-[#64748B] border border-[#E2E8F0] rounded-md hover:bg-[#F8FAFC]">Cancel</button>
                <button type="submit" className="px-4 py-2 text-[13px] font-semibold text-white bg-[#0F766E] rounded-md hover:bg-[#0d6460]">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteFolder && (
        <ConfirmDialog
          title="Delete Folder?"
          message={`"${deleteFolder.name}" will be deleted. Documents inside will be moved to Uncategorised.`}
          confirmLabel="Delete Folder"
          onConfirm={handleDelete}
          onCancel={() => setDeleteFolder(null)}
        />
      )}

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
