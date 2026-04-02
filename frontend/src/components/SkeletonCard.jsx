export default function SkeletonCard() {
  return (
    <div className="relative bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden flex flex-col animate-pulse">
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-200 rounded-l-xl" />
      <div className="pl-5 pr-4 pt-4 pb-3 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="w-10 h-12 rounded-lg bg-slate-100" />
          <div className="flex flex-col items-end gap-2 flex-1">
            <div className="h-5 w-16 rounded-full bg-slate-100" />
            <div className="h-5 w-20 rounded bg-slate-100" />
          </div>
        </div>
        <div className="space-y-1.5 -mt-1">
          <div className="h-3.5 w-4/5 rounded bg-slate-100" />
          <div className="h-3.5 w-3/5 rounded bg-slate-100" />
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-[#F1F5F9]">
          <div className="h-3 w-20 rounded bg-slate-100" />
          <div className="h-3 w-16 rounded bg-slate-100" />
        </div>
      </div>
    </div>
  );
}
