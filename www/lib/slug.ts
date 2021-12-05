export const slugify = (text: string): string => {
  return text
    .replace(/[^-a-zA-Z0-9\s+]+/gi, "") // Remove all non-word chars
    .replace(/\s+/gi, "-") // Replace all spaces with dashes
    .replace(/--+/g, "-") // Replace multiple - with single -
    .toLowerCase();
};

export const cleanSlug = (text: string): string => {
  return text
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
};
