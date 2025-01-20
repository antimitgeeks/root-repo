const { DeliveryMethod } = require("@shopify/shopify-api");
/**
 * @type {{[key: string]: import("@shopify/shopify-api").WebhookHandler}}
 */
module.exports = {
  /**
   * Customers can request their data from a store owner. When this happens,
   * Shopify invokes this privacy webhook.
   *
   * https://shopify.dev/docs/apps/webhooks/configuration/mandatory-webhooks#customers-data_request
   */
  CUSTOMERS_DATA_REQUEST: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks/customer-data-request",
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);
      // Payload has the following shape:
      // {
      //   "shop_id": 954889,
      //   "shop_domain": "{shop}.myshopify.com",
      //   "orders_requested": [
      //     299938,
      //     280263,
      //     220458
      //   ],
      //   "customer": {
      //     "id": 191167,
      //     "email": "john@example.com",
      //     "phone": "555-625-1199"
      //   },
      //   "data_request": {
      //     "id": 9999
      //   }
      // }
      console.log(payload, "######################## customer data request webhook############################################");

    },
  },

  /**
   * Store owners can request that data is deleted on behalf of a customer. When
   * this happens, Shopify invokes this privacy webhook.
   *
   * https://shopify.dev/docs/apps/webhooks/configuration/mandatory-webhooks#customers-redact
   */
  CUSTOMERS_REDACT: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks/customer-redact",
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);
      // Payload has the following shape:
      // {
      //   "shop_id": 954889,
      //   "shop_domain": "{shop}.myshopify.com",
      //   "customer": {
      //     "id": 191167,
      //     "email": "john@example.com",
      //     "phone": "555-625-1199"
      //   },
      //   "orders_to_redact": [
      //     299938,
      //     280263,
      //     220458
      //   ]
      // }
      const costumerId = `gid://shopify/customer/${payload.customer.id}`;
      console.log(payload, "######################## customers redact ############################################");
    },

  },

  /**
   * 48 hours after a store owner uninstalls your app, Shopify invokes this
   * privacy webhook.
   *
   * https://shopify.dev/docs/apps/webhooks/configuration/mandatory-webhooks#shop-redact
   */
  SHOP_REDACT: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks/shop-redact",
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);
      console.log(payload, "######################## shop redact  webhook############################################");

      // Payload has the following shape:
      // {
      //   "shop_id": 954889,
      //   "shop_domain": "{shop}.myshopify.com"
      // }
    },
  },

  /**
     * Triggered when a new order is created.
     *
     * https://shopify.dev/docs/apps/webhooks/events/order/create
     */
  ORDERS_CREATE: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);
      // Payload has the following shape:
      // {
      //   "id": 123456,
      //   "email": "john@example.com",
      //   "created_at": "2024-12-12T10:55:00-05:00",
      //   "line_items": [...],
      //   "customer": {
      //     "id": 78910,
      //     "email": "john@example.com"
      //   },
      //   ...
      // }
      console.log(payload, "######################## order create webhook ############################################");

      // Example: Call a service to process the order
    },
  },

  APP_UNINSTALLED: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks/uninstall",
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);
      console.log("######################## app uninstall webhook############################################");
    },
  },

};
