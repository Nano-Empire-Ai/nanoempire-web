import { shopifyApi, ApiVersion } from '@shopify/shopify-api';
import { SQLiteSessionStorage } from '@shopify/shopify-app-session-storage-sqlite';

export const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY || 'mock_key',
  apiSecretKey: process.env.SHOPIFY_API_SECRET || 'mock_secret',
  apiVersion: ApiVersion.October24,
  scopes: ['read_products'],
  hostName: process.env.SHOPIFY_APP_HOST || 'localhost:3000',
  hostScheme: process.env.NODE_ENV === 'production' ? 'https' : 'http',
  sessionStorage: new SQLiteSessionStorage('shopify_sessions.db'),
  isEmbeddedApp: true,
});

export async function registerWebhooks(shop: string, accessToken: string) {
  const webhooks = [
    { topic: 'products/create', address: '/api/shopify/webhooks' },
    { topic: 'products/update', address: '/api/shopify/webhooks' },
    { topic: 'products/delete', address: '/api/shopify/webhooks' },
    { topic: 'app/uninstalled', address: '/api/shopify/webhooks/uninstall' },
  ];

  for (const webhook of webhooks) {
    await shopify.webhooks.register({
      session: { shop, accessToken, id: shop, state: '', isOnline: false } as any,
    });
  }
}
