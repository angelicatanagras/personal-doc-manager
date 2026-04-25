import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';

export default function EditModal({ doc, onClose, onUpdated }) {
  const [name, setName] = useState(doc.name);
  const [expiryDate, setExpiryDate] = useState(
    doc.expiryDate ? new Date(doc.expiryDate).toISOString().split('T')[0] : ''
  );
  const [folderId, setFolderId] = useState(doc.folderId?._id || doc.folderId || '');
  const [folders, setFolders] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    axiosInstance.get('/api/folders').then(({ data }) => setFolders(data)).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Document name is required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const { data } = await axiosInstance.put(`/api/documents/${doc._id}`, {
        name: trimmedName,
        expiryDate: expiryDate || null,
        folderId: folderId || null,
      });
      onUpdated(data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0]">
          <h2 className="text-[15px] font-bold text-[#1E293B]">Edit Document</h2>
          <button onClick={onClose} className="text-[#94A3B8] hover:text-[#1E293B]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
          {error && <div className="px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>}
          <div>
            <label className="block text-[13px] font-medium text-[#1E293B] mb-1.5">Document name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full py-2 px-3 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:border-[#14B8A6] focus:ring-2 focus:ring-[#14B8A6]/10"
            />
            <p className="mt-1 text-[11px] text-[#94A3B8]">The file keeps its original type. Downloads will use the renamed document title.</p>
          </div>
          <div>
            <label className="block text-[13px] font-medium text-[#1E293B] mb-1.5">Folder <span className="text-[#94A3B8] font-normal">(optional)</span></label>
            <select
              value={folderId}
              onChange={(e) => setFolderId(e.target.value)}
              className="w-full py-2 px-3 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:border-[#14B8A6] focus:ring-2 focus:ring-[#14B8A6]/10"
            >
              <option value="">Uncategorised</option>
              {folders.map((f) => (
                <option key={f._id} value={f._id}>{f.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[13px] font-medium text-[#1E293B] mb-1.5">Expiry date <span className="text-[#94A3B8] font-normal">(optional)</span></label>
            <input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="w-full py-2 px-3 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:border-[#14B8A6] focus:ring-2 focus:ring-[#14B8A6]/10"
            />
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-[#E2E8F0] text-sm font-medium rounded-lg hover:bg-[#F1F5F9]">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-[#0F766E] text-white text-sm font-semibold rounded-lg hover:bg-[#0d6460] disabled:opacity-60">
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
