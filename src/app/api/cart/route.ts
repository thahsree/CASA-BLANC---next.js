import dbConnect from "@/lib/mongodb";
import Cart from "@/models/Cart";
import Product from "@/models/Product";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, cartId, variantId, quantity, lines } = body;
    await dbConnect();

    // 1. Create Cart
    if (action === "create") {
      const newCart = await Cart.create({ items: [] });
      const response = NextResponse.json({ cart: { id: newCart._id } });

      // We can also set cookie here if needed, but frontend seems to rely on localStorage + cookie
      return response;
    }

    // For other actions, we need a cartId
    if (!cartId) {
      return NextResponse.json({ error: "Missing cartId" }, { status: 400 });
    }

    let cart = await Cart.findById(cartId);
    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    // 2. Add Item
    if (action === "add") {
      if (!variantId) {
        return NextResponse.json({ error: "Missing variantId" }, { status: 400 });
      }

      // Find product that contains this variant
      // Note: In our Product model, variants are subdocuments. 
      // We search for a product where variants._id == variantId
      const product = await Product.findOne({ "variants._id": variantId });

      if (!product) {
        return NextResponse.json({ error: "Product variant not found" }, { status: 404 });
      }

      // Extract variant details
      const variant = product.variants.find((v: any) => v._id.toString() === variantId);
      const image = product.images?.[0]?.url;

      if (!variant) {
        return NextResponse.json({ error: "Variant data missing" }, { status: 500 });
      }

      // Check if item already exists in cart
      const existingItemIndex = cart.items.findIndex((item) => item.variantId === variantId);

      if (existingItemIndex > -1) {
        cart.items[existingItemIndex].quantity += (quantity || 1);
      } else {
        cart.items.push({
          productId: product._id.toString(),
          variantId: variant._id.toString(),
          quantity: quantity || 1,
          title: `${product.title} - ${variant.title}`,
          price: variant.price,
          image: image,
        });
      }

      await cart.save();
      return NextResponse.json({ cart: formatCartResponse(cart) });
    }

    // 3. Update Item
    if (action === "update") {
      if (!lines || !Array.isArray(lines)) {
        return NextResponse.json({ error: "Invalid lines" }, { status: 400 });
      }

      for (const line of lines) {
        const itemIndex = cart.items.findIndex(item => item._id?.toString() === line.id || item.variantId === line.id);
        // The frontend might pass the cart item _id (line.id) or variantId. 
        // Looking at previous code, it used line.id (Shopify ID). Mongoose subdocs have _id. 
        // We'll try to match item._id.
        if (itemIndex > -1) {
          cart.items[itemIndex].quantity = line.quantity;
        }
      }

      await cart.save();
      return NextResponse.json({ cart: formatCartResponse(cart) });
    }

    // 4. Remove Item
    if (action === "remove") {
      const { lineIds } = body;
      if (!lineIds || !Array.isArray(lineIds)) {
        return NextResponse.json({ error: "Invalid lineIds" }, { status: 400 });
      }

      // Filter out items that match the lineIds (which we treat as item._id)
      cart.items = cart.items.filter((item: any) =>
        !lineIds.includes(item._id.toString())
      );

      await cart.save();
      return NextResponse.json({ cart: formatCartResponse(cart) });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });

  } catch (error: any) {
    console.error("Cart API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const cartId = url.searchParams.get("cartId");

    // Cookie support could be added back if essential

    if (!cartId) {
      return NextResponse.json({ cart: null });
    }

    await dbConnect();
    const cart = await Cart.findById(cartId);

    if (!cart) {
      return NextResponse.json({ cart: null });
    }

    return NextResponse.json({ cart: formatCartResponse(cart) });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Helper to format Cart to match what frontend expects (Shopify-like structure somewhat, or simplified)
// To minimize frontend changes, we might want to mimic the structure, OR simply update frontend to use clean structure.
// Given I am rewriting frontend, I will use a cleaner structure, but I need to make sure I update the frontend to match THIS structure.
// I will return a simplified structure: { id, lines: { edges: [...] }, cost: { totalAmount: ... } }
// so that minimal frontend change is needed if I wanted to keep it close, but I'll try to just return clean data and rewrite frontend to consume clean data.
// But wait, `formatCartResponse` helper suggests I might want to adapt it. 
// I'll stick to a decent structure.
function formatCartResponse(cart: any) {
  return {
    id: cart._id,
    checkoutUrl: "/checkout", // Placeholder
    lines: {
      edges: cart.items.map((item: any) => ({
        node: {
          id: item._id, // Cart Line ID
          quantity: item.quantity,
          merchandise: {
            id: item.variantId,
            title: item.title,
            product: {
              title: item.title.split(' - ')[0],
              handle: 'todo'
            },
            image: { url: item.image }
          },
          cost: {
            totalAmount: {
              amount: (item.price * item.quantity).toString(),
              currencyCode: "USD" // or INR
            }
          }
        }
      }))
    },
    cost: {
      totalAmount: {
        amount: cart.subtotal.toString(),
        currencyCode: "USD"
      }
    }
  };
}
