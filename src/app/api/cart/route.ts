import shopify from '@/lib/shopify';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const CREATE_CART_MUTATION = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        lines(first: 10) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  product {
                    title
                    handle
                  }
                  image {
                    url
                  }
                }
              }
              cost {
                totalAmount {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
      }
      userErrors {
        code
        field
        message
      }
    }
  }
`;

const ADD_TO_CART_MUTATION = `
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
        lines(first: 10) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  product {
                    title
                    handle
                  }
                  image {
                    url
                  }
                }
              }
              cost {
                totalAmount {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
      }
      userErrors {
        code
        field
        message
      }
    }
  }
`;

const GET_CART_QUERY = `
  query getCart($cartId: ID!) {
    cart(id: $cartId) {
      id
      checkoutUrl
      lines(first: 10) {
        edges {
          node {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id
                title
                product {
                  title
                  handle
                }
                image {
                  url
                }
              }
            }
            cost {
              totalAmount {
                amount
                currencyCode
              }
            }
          }
        }
      }
      cost {
        totalAmount {
          amount
          currencyCode
        }
      }
    }
  }
`;

const UPDATE_CART_MUTATION = `
  mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
        lines(first: 10) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  product {
                    title
                    handle
                  }
                  image {
                    url
                  }
                }
              }
              cost {
                totalAmount {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
      }
      userErrors {
        code
        field
        message
      }
    }
  }
`;

const REMOVE_CART_ITEM_MUTATION = `
  mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        id
        checkoutUrl
        lines(first: 10) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  product {
                    title
                    handle
                  }
                  image {
                    url
                  }
                }
              }
              cost {
                totalAmount {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
      }
      userErrors {
        code
        field
        message
      }
    }
  }
`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, cartId, variantId, quantity, lineIds } = body;
    const cookieStore = await cookies();

    if (action === 'create') {
      const res: any = await shopify.request(CREATE_CART_MUTATION, { input: {} });
      const data = res?.data ?? res;
      if (data?.cartCreate?.userErrors?.length) {
        return NextResponse.json({ error: 'Cart create errors', details: data.cartCreate.userErrors }, { status: 502 });
      }
      
      const newCartId = data.cartCreate?.cart?.id;
      const response = NextResponse.json({ cart: data.cartCreate?.cart ?? null });
      
      // Store cart ID in session cookie
      if (newCartId) {
        response.cookies.set('cartId', newCartId, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 30 // 30 days
        });
      }
      
      return response;
    }

    if (action === 'add') {
      if (!cartId || !variantId) {
        return NextResponse.json({ error: 'Missing cartId or variantId' }, { status: 400 });
      }

      const res: any = await shopify.request(ADD_TO_CART_MUTATION, {
        cartId,
        lines: [
          {
            merchandiseId: variantId,
            quantity: quantity || 1,
          },
        ],
      });

      const data = res?.data ?? res;
      if (data?.cartLinesAdd?.userErrors?.length) {
        return NextResponse.json({ error: 'Add to cart errors', details: data.cartLinesAdd.userErrors }, { status: 502 });
      }

      const response = NextResponse.json({ cart: data.cartLinesAdd?.cart ?? null });
      
      // Update cart ID in session cookie
      if (cartId) {
        response.cookies.set('cartId', cartId, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 30 // 30 days
        });
      }
      
      return response;
    }

    if (action === 'update') {
      if (!cartId) {
        return NextResponse.json({ error: 'Missing cartId' }, { status: 400 });
      }

      const lines = body.lines || [];
      if (!Array.isArray(lines) || lines.length === 0) {
        return NextResponse.json({ error: 'Missing or invalid lines array' }, { status: 400 });
      }

      const res: any = await shopify.request(UPDATE_CART_MUTATION, {
        cartId,
        lines: lines,
      });

      const data = res?.data ?? res;
      if (data?.cartLinesUpdate?.userErrors?.length) {
        return NextResponse.json({ error: 'Update cart errors', details: data.cartLinesUpdate.userErrors }, { status: 502 });
      }

      return NextResponse.json({ cart: data.cartLinesUpdate?.cart ?? null });
    }

    if (action === 'remove') {
      if (!cartId || !lineIds || !Array.isArray(lineIds)) {
        return NextResponse.json({ error: 'Missing cartId or lineIds' }, { status: 400 });
      }

      const res: any = await shopify.request(REMOVE_CART_ITEM_MUTATION, {
        cartId,
        lineIds,
      });

      const data = res?.data ?? res;
      if (data?.cartLinesRemove?.userErrors?.length) {
        return NextResponse.json({ error: 'Remove cart errors', details: data.cartLinesRemove.userErrors }, { status: 502 });
      }

      return NextResponse.json({ cart: data.cartLinesRemove?.cart ?? null });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    console.error('Cart route error:', err);
    return NextResponse.json({ error: 'Failed to process cart', message: err?.message ?? String(err) }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const cartId = url.searchParams.get('cartId');
    const cookieStore = await cookies();

    // Use cartId from query params or from cookies
    const actualCartId = cartId || cookieStore.get('cartId')?.value;

    if (!actualCartId) {
      return NextResponse.json({ cart: null });
    }

    const res: any = await shopify.request(GET_CART_QUERY, { cartId: actualCartId });
    const data = res?.data ?? res;

    if (data?.cart) {
      return NextResponse.json({ cart: data.cart });
    }

    return NextResponse.json({ cart: null });
  } catch (err: any) {
    console.error('Cart GET route error:', err);
    return NextResponse.json({ error: 'Failed to fetch cart', message: err?.message ?? String(err) }, { status: 500 });
  }
}
