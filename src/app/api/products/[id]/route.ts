import shopify from '@/lib/shopify';
import { NextRequest, NextResponse } from 'next/server';

export const revalidate = 0; // No caching - always fetch fresh from Shopify

// GraphQL query: fetch a single product by id
// Shopify Storefront product id is a global ID (gid://shopify/Product/XXXX)
const PRODUCT_BY_ID_QUERY = `
  query product($id: ID!) {
    node(id: $id) {
      ... on Product {
        id
        title
        description
        handle
        priceRange {
          minVariantPrice { amount currencyCode }
        }
        images(first: 6) {
          edges { node { url altText } }
        }
        variants(first: 10) {
          edges { node { id title price { amount currencyCode } compareAtPrice { amount currencyCode } } }
        }
      }
    }
  }
`;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: rawId } = await params;
  
  let id = rawId;
  if (!id) {
    return NextResponse.json({ product: null, error: 'Missing product id' });
  }
  
  // Decode in case the ID is URL-encoded
  id = decodeURIComponent(id);

  try {
    const res: any = await shopify.request(PRODUCT_BY_ID_QUERY, { id });
    console.log('API /products/[id] - Shopify response:', JSON.stringify(res, null, 2));
    const data = res?.data ?? res;

    // Shopify GraphQL errors may appear under data.errors or top-level errors depending on helper
    const graphErrors = (res && res.errors) || (data && (data as any).errors);
    if (graphErrors) {
      console.error('API /products/[id] - GraphQL errors:', graphErrors);
      return NextResponse.json({ product: null, error: 'Shopify errors', details: graphErrors, raw: res }, { status: 200 });
    }

    // `node` will be the Product when the ID is a Product global ID
    const product = res?.data?.node ?? data?.node ?? null;
    console.log('API /products/[id] - Extracted product:', product ? `Found: ${product.title}` : 'NULL');
    
    const response = NextResponse.json({ product, raw: res });
    
    // Prevent caching at all levels (browser, CDN, etc.)
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (err: any) {
    // Normalize errors to a 200 so clients can render friendly messages without throwing
    console.error('Product by id route error:', err);
    const response = NextResponse.json({ product: null, error: 'Failed to fetch product', message: err?.message ?? String(err) });
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    return response;
  }
}
