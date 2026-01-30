/**
 * Generate blur placeholder data URLs for images
 * Uses dark theme matching the app design
 */

export const SKELETON_BLUR_URLS = {
  // Large images (hero, product detail)
  heroImage: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='0%25'%3E%3Cstop offset='0%25' style='stop-color:%233f3f46;stop-opacity:1'/%3E%3Cstop offset='50%25' style='stop-color:%232d2d30;stop-opacity:1'/%3E%3Cstop offset='100%25' style='stop-color:%233f3f46;stop-opacity:1'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23grad)' width='800' height='600'/%3E%3C/svg%3E",

  // Medium images (product cards, list items)
  productCard: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='0%25'%3E%3Cstop offset='0%25' style='stop-color:%233f3f46;stop-opacity:1'/%3E%3Cstop offset='50%25' style='stop-color:%232d2d30;stop-opacity:1'/%3E%3Cstop offset='100%25' style='stop-color:%233f3f46;stop-opacity:1'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23grad)' width='400' height='300'/%3E%3C/svg%3E",

  // Small images (thumbnails)
  thumbnail: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='0%25'%3E%3Cstop offset='0%25' style='stop-color:%233f3f46;stop-opacity:1'/%3E%3Cstop offset='50%25' style='stop-color:%232d2d30;stop-opacity:1'/%3E%3Cstop offset='100%25' style='stop-color:%233f3f46;stop-opacity:1'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23grad)' width='100' height='100'/%3E%3C/svg%3E",
};
