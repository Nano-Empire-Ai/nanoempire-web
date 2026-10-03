import { shopify } from '@/lib/shopify';

export interface ShopifyProduct {
  id: string;
  title: string;
  vendor: string;
  productType: string;
  variants: Array<{
    sku: string;
    barcode: string | null;
    title: string;
  }>;
}

const PRODUCTS_QUERY = `
query GetProducts($first: Int!, $after: String) {
  products(first: $first, after: $after) {
    pageInfo {
      hasNextPage
      endCursor
    }
    edges {
      node {
        id
        title
        vendor
        productType
        variants(first: 5) {
          edges {
            node {
              sku
              barcode
              title
            }
          }
        }
      }
    }
  }
}`;

export async function fetchAllProducts(
  shop: string,
  accessToken: string
): Promise<ShopifyProduct[]> {
  const client = new shopify.clients.Graphql({
    session: { shop, accessToken, id: shop, state: '', isOnline: false } as any,
  });

  const allProducts: ShopifyProduct[] = [];
  let hasNextPage = true;
  let cursor: string | null = null;

  while (hasNextPage) {
    const response = await client.request<any>(PRODUCTS_QUERY, {
      variables: { first: 250, after: cursor },
    });

    const { products } = response.data;

    for (const edge of products.edges) {
      const node = edge.node;
      allProducts.push({
        id: node.id,
        title: node.title,
        vendor: node.vendor,
        productType: node.productType,
        variants: node.variants.edges.map((v: any) => ({
          sku: v.node.sku,
          barcode: v.node.barcode,
          title: v.node.title,
        })),
      });
    }

    hasNextPage = products.pageInfo.hasNextPage;
    cursor = products.pageInfo.endCursor;
  }

  return allProducts;
}

export function extractIdentifiers(products: ShopifyProduct[]): string[] {
  const identifiers: string[] = [];

  for (const product of products) {
    for (const variant of product.variants) {
      // 1. Barcode field (UPC/EAN) - highest confidence
      if (variant.barcode && /^\\d{12,13}$/.test(variant.barcode)) {
        identifiers.push(variant.barcode);
      }
      // 2. SKU field - fallback, lower confidence
      else if (variant.sku) {
        identifiers.push(variant.sku);
      }
    }
    // 3. Title-based fuzzy match - last resort
    identifiers.push(product.title.toLowerCase());
  }

  return [...new Set(identifiers)]; // deduplicate
}
