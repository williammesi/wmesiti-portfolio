/**
 * Sanity Image Utilities
 * Centralized functions for handling Sanity image URLs and optimization
 */

// Base Sanity CDN URL
const SANITY_CDN_BASE = 'https://cdn.sanity.io/images';
const PROJECT_ID = '9bdbnjzy';
const DATASET = 'production';

/**
 * Extract image details from Sanity asset reference
 */
export function parseImageRef(ref: string) {
  // Parse format: image-{hash}-{width}x{height}-{format}
  const parts = ref.replace('image-', '').split('-');
  const hash = parts[0];
  const dimensions = parts[1]?.split('x');
  const format = parts[2] || 'jpg';

  return {
    hash,
    width: dimensions?.[0] ? parseInt(dimensions[0]) : undefined,
    height: dimensions?.[1] ? parseInt(dimensions[1]) : undefined,
    format,
  };
}

/**
 * Generate optimized image URL from Sanity asset reference
 */
export function getImageUrl(
  ref: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'jpg' | 'png' | 'webp' | 'auto';
    fit?: 'crop' | 'fill' | 'fillmax' | 'max' | 'scale' | 'clip' | 'min';
    auto?: 'format' | 'format,compress';
  } = {}
): string {
  const { hash, format: originalFormat } = parseImageRef(ref);

  // Build query parameters
  const params = new URLSearchParams();

  if (options.width) params.set('w', options.width.toString());
  if (options.height) params.set('h', options.height.toString());
  if (options.quality) params.set('q', options.quality.toString());
  if (options.format) params.set('fm', options.format);
  if (options.fit) params.set('fit', options.fit);
  if (options.auto) params.set('auto', options.auto);

  const queryString = params.toString();
  const extension = options.format || originalFormat;

  return `${SANITY_CDN_BASE}/${PROJECT_ID}/${DATASET}/${hash}.${extension}${queryString ? `?${queryString}` : ''}`;
}

/**
 * Generate responsive image srcset for different screen sizes
 */
export function getResponsiveImageUrls(
  ref: string,
  options: {
    sizes: number[];
    quality?: number;
    format?: 'jpg' | 'png' | 'webp' | 'auto';
  }
): {
  src: string;
  srcset: string;
  sizes: string;
} {
  const { sizes, quality = 85, format = 'auto' } = options;

  // Generate srcset entries
  const srcsetEntries = sizes.map(width => {
    const url = getImageUrl(ref, { width, quality, format, auto: 'format,compress' });
    return `${url} ${width}w`;
  });

  // Default src (use the largest size)
  const src = getImageUrl(ref, {
    width: Math.max(...sizes),
    quality,
    format,
    auto: 'format,compress'
  });

  // Generate sizes attribute based on common breakpoints
  const sizesAttr = [
    '(max-width: 640px) 100vw',
    '(max-width: 1024px) 50vw',
    '33vw'
  ].join(', ');

  return {
    src,
    srcset: srcsetEntries.join(', '),
    sizes: sizesAttr,
  };
}

/**
 * Get optimized thumbnail URL
 */
export function getThumbnailUrl(
  ref: string,
  size: number = 400,
  quality: number = 80
): string {
  return getImageUrl(ref, {
    width: size,
    height: size,
    quality,
    fit: 'crop',
    format: 'webp',
    auto: 'format,compress',
  });
}

/**
 * Get blur placeholder data URL for loading states
 */
export function getBlurDataUrl(ref: string): string {
  const blurUrl = getImageUrl(ref, {
    width: 20,
    quality: 20,
    format: 'jpg',
  });
  return blurUrl;
}

/**
 * Simple fallback for legacy image URL generation
 * (maintains compatibility with existing code)
 */
export function getLegacyImageUrl(ref: string): string {
  return ref
    .replace('image-', `${SANITY_CDN_BASE}/${PROJECT_ID}/${DATASET}/`)
    .replace('-jpg', '.jpg')
    .replace('-png', '.png')
    .replace('-webp', '.webp');
}