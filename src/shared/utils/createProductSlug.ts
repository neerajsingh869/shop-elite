function createProductSlug(title: string): string {
  const productSlug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  return productSlug;
}

export default createProductSlug;
