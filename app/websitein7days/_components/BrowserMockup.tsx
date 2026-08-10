export default function BrowserMockup() {
  return (
    <div className="relative" aria-hidden="true">
      {/* Desktop browser frame */}
      <div className="rounded-2xl border border-white/10 bg-[#111113] shadow-2xl shadow-black/40">
        <div className="flex items-center gap-1.5 border-b border-white/8 px-4 py-3">
          <span className="size-2.5 rounded-full bg-white/15" />
          <span className="size-2.5 rounded-full bg-white/15" />
          <span className="size-2.5 rounded-full bg-white/15" />
          <div className="ml-3 h-5 flex-1 rounded-full bg-white/5" />
        </div>
        <div className="space-y-3 p-5">
          <div className="flex items-center justify-between">
            <div className="h-3 w-20 rounded-full bg-primary/60" />
            <div className="flex gap-2">
              <div className="h-2.5 w-10 rounded-full bg-white/10" />
              <div className="h-2.5 w-10 rounded-full bg-white/10" />
              <div className="h-2.5 w-14 rounded-full bg-white/10" />
            </div>
          </div>

          <div className="grid grid-cols-5 gap-3 pt-2">
            <div className="col-span-3 space-y-3">
              <div className="h-3.5 w-4/5 rounded-full bg-white/25" />
              <div className="h-3.5 w-3/5 rounded-full bg-white/15" />
              <div className="h-2 w-full rounded-full bg-white/8" />
              <div className="h-2 w-4/5 rounded-full bg-white/8" />
              <div className="mt-4 h-8 w-32 rounded-full bg-primary/70" />
            </div>
            <div className="col-span-2 rounded-xl bg-gradient-to-br from-primary/25 to-white/5" />
          </div>

          <div className="grid grid-cols-3 gap-3 pt-3">
            {[0, 1, 2].map((item) => (
              <div key={item} className="space-y-2 rounded-xl border border-white/8 p-3">
                <div className="h-2 w-2/3 rounded-full bg-white/20" />
                <div className="h-1.5 w-full rounded-full bg-white/8" />
                <div className="h-1.5 w-4/5 rounded-full bg-white/8" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile responsive preview */}
      <div className="absolute -bottom-8 -right-4 w-28 rounded-[1.4rem] border border-white/12 bg-[#111113] p-2 shadow-2xl shadow-black/50 sm:-right-8 sm:w-32">
        <div className="space-y-2 rounded-2xl bg-black/40 p-2.5">
          <div className="h-2 w-1/2 rounded-full bg-primary/60" />
          <div className="h-10 rounded-lg bg-gradient-to-br from-primary/25 to-white/5" />
          <div className="h-1.5 w-4/5 rounded-full bg-white/15" />
          <div className="h-1.5 w-3/5 rounded-full bg-white/10" />
          <div className="h-4 w-full rounded-full bg-primary/70" />
        </div>
      </div>
    </div>
  );
}
