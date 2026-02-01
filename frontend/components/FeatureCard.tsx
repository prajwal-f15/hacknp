export default function FeatureCard({ title, description, children, pills }: { title: string; description: string; children?: React.ReactNode; pills?: string[] }) {
  return (
    <div className="rounded-2xl p-5 bg-slate-700 shadow hover:shadow-lg transition transform hover:-translate-y-1">
      <div className="flex items-start gap-4">
        <div className="h-10 w-10 rounded-lg bg-blue-900 flex items-center justify-center text-blue-400">{children}</div>
        <div>
          <h3 className="text-md font-medium text-white">{title}</h3>
          <p className="mt-1 text-sm text-slate-400">{description}</p>
          {pills && (
            <div className="mt-3 flex gap-2 flex-wrap">
              {pills.map((p) => (
                <span key={p} className="text-xs px-2 py-1 rounded-full bg-slate-600 text-slate-300">{p}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
