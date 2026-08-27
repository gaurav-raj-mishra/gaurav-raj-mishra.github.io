/**
 * View-transition name for a post — must be a valid CSS identifier,
 * so folder slashes and other punctuation become hyphens. Used on
 * post titles in lists and on the article heading, so the title
 * morphs between pages.
 */
export const tname = (id: string) => "post-" + id.replace(/[^a-zA-Z0-9_-]/g, "-");
