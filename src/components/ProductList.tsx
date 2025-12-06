'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface Product {
  id: string;
  title: string;
  description: string;
  handle: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    edges: Array<{
      node: {
        url: string;
        altText: string;
      };
    }>;
  };
  variants: {
    edges: Array<{
      node: {
        id: string;
      };
    }>;
  };
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        setProducts(data.products?.edges?.map((edge: any) => edge.node) || []);
      } catch (err) {
        setError('Failed to load products');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div className="text-center py-12">Loading products...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-600">{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white dark:bg-zinc-900 rounded-lg shadow-md hover:shadow-lg transition overflow-hidden"
        >
          {product.images.edges[0] && (
            <div className="relative w-full h-48 bg-gray-200">
              <Image
                src={product.images.edges[0].node.url}
                alt={product.images.edges[0].node.altText || product.title}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-2">{product.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
              {product.description}
            </p>
            <div className="flex justify-between items-center">
              <span className="font-bold text-lg">
                {product.priceRange.minVariantPrice.currencyCode}{' '}
                {product.priceRange.minVariantPrice.amount}
              </span>
              <button
                onClick={() => handleAddToCart(product)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

async function handleAddToCart(product: Product) {
  // Get or create cart
  let cartId = localStorage.getItem('cartId');

  if (!cartId) {
    const cartResponse = await fetch('/api/cart', {
      method: 'POST',
      body: JSON.stringify({ action: 'create' }),
    });
    const cartData = await cartResponse.json();
    cartId = cartData.cartCreate?.cart?.id;
    if (cartId) {
      localStorage.setItem('cartId', cartId);
    }
  }

  // Add to cart
  const variantId = product.variants.edges[0]?.node.id;
  if (variantId && cartId) {
    await fetch('/api/cart', {
      method: 'POST',
      body: JSON.stringify({
        action: 'add',
        cartId,
        variantId,
        quantity: 1,
      }),
    });
    alert('Added to cart!');
  }
}
