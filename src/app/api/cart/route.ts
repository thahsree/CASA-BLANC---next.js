import shopify from '@/lib/shopify';
import { NextRequest, NextResponse } from 'next/server';

const CREATE_CART_MUTATION = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
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
        lines(first: 10) {
          edges {
            node {
              id
              quantity
            }
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
    const { action, cartId, variantId, quantity } = body;

    if (action === 'create') {
      const res: any = await shopify.request(CREATE_CART_MUTATION, { input: {} });
      const data = res?.data ?? res;
      if (data?.cartCreate?.userErrors?.length) {
        return NextResponse.json({ error: 'Cart create errors', details: data.cartCreate.userErrors }, { status: 502 });
      }
      return NextResponse.json({ cart: data.cartCreate?.cart ?? null });
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

      return NextResponse.json({ cart: data.cartLinesAdd?.cart ?? null });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    console.error('Cart route error:', err);
    return NextResponse.json({ error: 'Failed to process cart', message: err?.message ?? String(err) }, { status: 500 });
  }
}
