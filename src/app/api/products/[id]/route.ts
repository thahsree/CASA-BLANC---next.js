import shopify from '@/lib/shopify';
import { NextRequest, NextResponse } from 'next/server';

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
    return NextResponse.json({ product, raw: res });
  } catch (err: any) {
    // Normalize errors to a 200 so clients can render friendly messages without throwing
    console.error('Product by id route error:', err);
    return NextResponse.json({ product: null, error: 'Failed to fetch product', message: err?.message ?? String(err) });
  }
}
