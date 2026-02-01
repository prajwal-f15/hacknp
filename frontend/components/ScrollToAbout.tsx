'use client';

export default function ScrollToAbout({ children }: { children: React.ReactNode }) {
  return (
    <button
      onClick={() => {
        window.location.href = '/about';
      }}
      className="inline-flex items-center px-4 py-2 rounded-lg border border-slate-600 bg-slate-700 text-slate-200 hover:bg-slate-600 transition"
    >
      {children}
    </button>
  );
}
