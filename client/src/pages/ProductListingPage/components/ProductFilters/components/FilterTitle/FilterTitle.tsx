interface FilterTitleProps {
  title: string;
}

function FilterTitle({title}: FilterTitleProps) {
  return (
    <h1 className="text-sm text-zinc-200 font-semibold uppercase tracking-wider">
      {title}
    </h1>
  );
}

export default FilterTitle;
