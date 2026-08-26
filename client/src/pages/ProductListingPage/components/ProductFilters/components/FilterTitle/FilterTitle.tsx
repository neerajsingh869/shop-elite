interface FilterTitleProps {
  title: string;
}

function FilterTitle({title}: FilterTitleProps) {
  return (
    <h3 className="text-sm text-zinc-200 font-semibold uppercase tracking-wider">
      {title}
    </h3>
  );
}

export default FilterTitle;
