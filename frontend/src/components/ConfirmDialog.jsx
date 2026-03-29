export default function ConfirmDialog({ title, message, confirmLabel = 'Delete', onConfirm, onCancel, danger = true }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
        <h2 className="text-[16px] font-bold text-[#1E293B] mb-2">{title}</h2>
        <p className="text-sm text-[#64748B] mb-6 leading-relaxed">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-[#1E293B] border border-[#E2E8F0] rounded-lg hover:bg-[#F1F5F9] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
              danger
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-[#0F766E] text-white hover:bg-[#0d6460]'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
