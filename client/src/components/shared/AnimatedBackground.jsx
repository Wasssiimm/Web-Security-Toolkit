export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Base gradient: muted slate in light, deep black-blue in dark */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-200 via-slate-300/40 to-slate-200 dark:from-[#050810] dark:via-[#0a0f1e] dark:to-[#0d0820]" />

      {/* Top-down vignette in light mode to dim the page edges */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-300/30 via-transparent to-slate-300/40 dark:hidden" />

      {/* Grid */}
      <div className="absolute inset-0 bg-grid bg-grid-fade opacity-50 dark:opacity-70" />

      {/* Ambient blobs — much dimmer + cooler in light mode */}
      <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-slate-400/20 dark:bg-cyan-500/15 rounded-full blur-3xl animate-blob" />
      <div className="absolute top-[20%] right-[-10%] w-[35rem] h-[35rem] bg-indigo-300/15 dark:bg-fuchsia-500/15 rounded-full blur-3xl animate-blob-slow" />
      <div className="absolute bottom-[-15%] left-[20%] w-[30rem] h-[30rem] bg-cyan-300/10 dark:bg-emerald-500/10 rounded-full blur-3xl animate-blob" style={{ animationDelay: '-10s' }} />

      {/* Subtle noise */}
      <div className="absolute inset-0 opacity-[0.025] dark:opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  )
}
