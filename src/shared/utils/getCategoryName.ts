function getCategoryName(categorySlug: string | undefined): string {
  const categoryName = categorySlug
    ? categorySlug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : "Unknown";

  return categoryName;
}

export default getCategoryName;
