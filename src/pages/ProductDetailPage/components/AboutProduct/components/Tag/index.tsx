interface TagProps {
  tag: string;
}

function Tag({ tag }: TagProps) {
  return (
    <span className="text-xs text-zinc-500 bg-zinc-950 border border-zinc-800 px-1.5 rounded-lg py-0.5 lowercase">
      #{tag}
    </span>
  );
}

export default Tag;
