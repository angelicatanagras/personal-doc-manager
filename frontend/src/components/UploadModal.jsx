import { useState, useRef, useEffect } from 'react';
import axiosInstance from '../axiosConfig';

const TAGS = ['Identity', 'Government', 'Travel', 'Finance', 'Health', 'Work', 'Legal', 'Property'];

export default function UploadModal({ onClose, onUploaded }) {
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [nameError, setNameError] = useState('');
  const inputRef = useRef();

  useEffect(() => {
    if (!name) { setNameError(''); return; }
    const timer = setTimeout(async () => {
      try {
        const { data } = await axiosInstance.get('/api/documents/check-name', { params: { name } });
        setNameError(data.exists ? `A document named "${name}" already exists. Please choose a different name.` : '');
      } catch (_) {}
    }, 350);
    return () => clearTimeout(timer);
  }, [name]);

  const handleFile = (f) => {
    setFile(f);
    setName(f.name.replace(/\.[^.]+$/, ''));
    setError('');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setError('Please select a file.');
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('name', name || file.name);
      if (expiryDate) fd.append('expiryDate', expiryDate);
      if (selectedTags.length) fd.append('tags', JSON.stringify(selectedTags));

      const { data } = await axiosInstance.post('/api/documents', fd);
      onUploaded(data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0]">
          <h2 className="text-[15px] font-bold text-[#1E293B]">Upload Document</h2>
          <button onClick={onClose} className="text-[#94A3B8] hover:text-[#1E293B] transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
          {error && (
            <div className="px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>
          )}
          {nameError && (
            <div className="px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{nameError}</div>
          )}

          {/* Drop zone */}
          <div
            onClick={() => inputRef.current.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              dragging ? 'border-[#14B8A6] bg-teal-50' : 'border-[#E2E8F0] hover:border-[#14B8A6]'
            }`}
          >
            <input ref={inputRef} type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png,.docx,.xlsx,.txt" onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])} />
            {file ? (
              <p className="text-sm font-medium text-[#0F766E]">✓ {file.name}</p>
            ) : (
              <>
                <svg className="mx-auto mb-2 text-[#94A3B8]" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                <p className="text-sm text-[#64748B]">Drag & drop or <span className="text-[#0F766E] font-medium">browse</span></p>
                <p className="text-xs text-[#94A3B8] mt-1">PDF, JPG, PNG, DOCX, XLSX · max 50 MB</p>
              </>
            )}
          </div>

          {/* Name */}
          <div>
            <label className="block text-[13px] font-medium text-[#1E293B] mb-1.5">Document name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Passport Scan 2024"
              className="w-full py-2 px-3 border border-[#E2E8F0] rounded-lg text-sm text-[#1E293B] focus:outline-none focus:border-[#14B8A6] focus:ring-2 focus:ring-[#14B8A6]/10"
            />
          </div>

          {/* Expiry */}
          <div>
            <label className="block text-[13px] font-medium text-[#1E293B] mb-1.5">Expiry date <span className="text-[#94A3B8] font-normal">(optional)</span></label>
            <input
              type="date"
              value={expiryDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="w-full py-2 px-3 border border-[#E2E8F0] rounded-lg text-sm text-[#1E293B] focus:outline-none focus:border-[#14B8A6] focus:ring-2 focus:ring-[#14B8A6]/10"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-[13px] font-medium text-[#1E293B] mb-1.5">Tags</label>
            <div className="flex flex-wrap gap-1.5">
              {TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 text-[12px] font-medium rounded-full border transition-all ${
                    selectedTags.includes(tag)
                      ? 'bg-[#CCFBF1] border-[#14B8A6] text-[#0F766E]'
                      : 'bg-white border-[#E2E8F0] text-[#64748B] hover:border-[#14B8A6]'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-[#E2E8F0] text-sm font-medium text-[#1E293B] rounded-lg hover:bg-[#F1F5F9] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading || !!nameError}
              className="flex-1 py-2.5 bg-[#0F766E] text-white text-sm font-semibold rounded-lg hover:bg-[#0d6460] disabled:opacity-60 transition-colors"
            >
              {uploading ? 'Uploading...' : 'Save Document'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
