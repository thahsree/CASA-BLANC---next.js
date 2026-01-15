import shopify from '@/lib/shopify';
import { NextRequest, NextResponse } from 'next/server';

export const revalidate = 0; // No caching - always fetch fresh from Shopify

const PRODUCTS_QUERY = `
  query {
    products(first: 100, sortKey: CREATED_AT, reverse: true) {
      edges {
        node {
          id
          title
          description
          handle
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 1) {
            edges {
              node {
                id
                compareAtPrice {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
  }
`;

export async function GET(request: NextRequest) {
  try {
    const res: any = await shopify.request(PRODUCTS_QUERY);

    // res is the parsed JSON from Shopify GraphQL. Expect { data: { products: ... } }
    const data = res?.data ?? res;

    // // Helpful server-side debug (will appear in terminal)
    // console.log('Products route - Shopify response keys:', Object.keys(data || {}));

    if (data?.errors) {
      console.error('Shopify GraphQL errors:', data.errors);
      return NextResponse.json({ error: 'Shopify GraphQL errors', details: data.errors }, { status: 502 });
    }

    const products = data?.products ?? null;

    // Return a consistent shape: { products: { edges: [...] } } or { products: null }
    const response = NextResponse.json({ products });
    
    // Prevent caching at all levels (browser, CDN, etc.)
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (err: any) {
    console.error('Products route fetch error:', err);
    const response = NextResponse.json({ error: 'Failed to fetch products', message: err?.message ?? String(err) }, { status: 500 });
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    return response;
  }
}
