interface MoreInfoProps {
  label: string;
  value: string;
}

function MoreInfo({ label, value }: MoreInfoProps) {
  return (
    <div className="border p-3 rounded-xl border-zinc-800 bg-zinc-950 flex flex-col gap-1">
      <span className="uppercase text-xs text-zinc-600 tracking-wider overflow-hidden">
        {label}
      </span>
      <span className="text-sm text-zinc-200 font-medium">{value}</span>
    </div>
  );
}

export default MoreInfo;
