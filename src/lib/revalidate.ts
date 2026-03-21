import { revalidatePath } from 'next/cache';

/**
 * Revalidate all frontend pages for both languages.
 * Call this when content that affects multiple pages changes
 * (e.g., categories, settings, posts).
 */
export function revalidateAllPages() {
  // Revalidate all pages under both language prefixes
  revalidatePath('/tr', 'layout');
  revalidatePath('/en', 'layout');
}

/**
 * Revalidate only the homepage for both languages.
 * Call this when homepage sections change.
 */
export function revalidateHomePage() {
  revalidatePath('/tr', 'page');
  revalidatePath('/en', 'page');
}

/**
 * Revalidate post-related pages for both languages.
 * Call this when posts are created, updated, or deleted.
 */
export function revalidatePosts() {
  // Homepage (featured posts section)
  revalidateHomePage();
  // Article pages, search, category pages
  revalidatePath('/tr', 'layout');
  revalidatePath('/en', 'layout');
}
