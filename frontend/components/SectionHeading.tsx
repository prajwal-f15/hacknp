export default function SectionHeading({ title, subtitle, id, className }: { title: string; subtitle?: string; id?: string; className?: string }) {
  return (
    <div id={id} className={`mb-6 ${className ?? ''}`}>
      <h2 className="text-2xl sm:text-3xl font-semibold text-white">{title}</h2>
      {subtitle && <p className="mt-2 text-slate-400">{subtitle}</p>}
    </div>
  );
}
