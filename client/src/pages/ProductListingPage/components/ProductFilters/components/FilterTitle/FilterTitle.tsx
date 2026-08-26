interface FilterTitleProps {
  id?: string;
  title: string;
}

function FilterTitle({ id, title }: FilterTitleProps) {
  return (
    // id so the surrounding section/radiogroup can point at it with
    // aria-labelledby - reusing the visible heading as the group name instead
    // of duplicating it in a hidden legend
    <h3
      id={id}
      className="text-sm text-zinc-200 font-semibold uppercase tracking-wider"
    >
      {title}
    </h3>
  );
}

export default FilterTitle;
