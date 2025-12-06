const RAW_SHOP_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || '';
const SHOP_DOMAIN = RAW_SHOP_DOMAIN.replace(/^https?:\/\//i, '').replace(/\/$/, '').trim();
const STOREFRONT_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || '';

if (!SHOP_DOMAIN || !STOREFRONT_TOKEN) {
  // Don't throw here so server can still start, but warn prominently.
  // Missing env vars will surface as errors when making requests.
  // eslint-disable-next-line no-console
  console.warn('Shopify env vars missing or empty: NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN or SHOPIFY_STOREFRONT_ACCESS_TOKEN', {
    NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN: RAW_SHOP_DOMAIN ? '[redacted]' : RAW_SHOP_DOMAIN,
  });
}

async function request(query: string, variables?: Record<string, any>) {
  if (!SHOP_DOMAIN) {
    throw new Error('Shopify store domain is not configured (NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN)');
  }

  const url = `https://${SHOP_DOMAIN}/api/2024-10/graphql.json`;

  // eslint-disable-next-line no-console
  console.debug('Shopify request URL:', url);

  let res: Response;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
    });
  } catch (err: any) {
    // Network-level error (DNS lookup failed, etc.)
    throw new Error(`Shopify fetch failed: ${err?.message || String(err)}`);
  }

  const json = await res.json().catch((e) => {
    throw new Error(`Invalid JSON response from Shopify: ${String(e)}`);
  });

  if (!res.ok) {
    const message = json?.errors ? JSON.stringify(json.errors) : res.statusText;
    throw new Error(`Shopify fetch error: ${message}`);
  }

  if (json.errors) {
    throw new Error(`Shopify GraphQL errors: ${JSON.stringify(json.errors)}`);
  }

  return json;
}

export default { request };
 