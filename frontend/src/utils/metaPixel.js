import ReactPixel from "react-facebook-pixel";

const META_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID;
const META_CURRENCY = "NGN";

const cleanPayload = (payload) =>
  Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined),
  );

const getPagePayload = () => {
  if (typeof window === "undefined") return {};

  return cleanPayload({
    page_title: document.title,
    page_url: window.location.href,
    page_location: window.location.href,
    page_path: `${window.location.pathname}${window.location.search}`,
    referrer: document.referrer || undefined,
  });
};

const getProductPrice = (product) => {
  const price = product?.onSale ? product.salePrice : product?.price;
  const numericPrice = Number(price);

  return Number.isFinite(numericPrice) ? numericPrice : 0;
};

const getProductId = (product) => product?._id || product?.id;

export const buildProductPayload = (product, quantity = 1, options = {}) => {
  const productId = getProductId(product);
  const itemPrice = getProductPrice(product);
  const itemQuantity = Number(quantity) || 1;

  return cleanPayload({
    ...getPagePayload(),
    content_ids: productId ? [productId] : undefined,
    contents: productId
      ? [
          cleanPayload({
            id: productId,
            quantity: itemQuantity,
            item_price: itemPrice,
          }),
        ]
      : undefined,
    content_type: "product",
    content_name: product?.name,
    content_category: product?.section || product?.category,
    value: itemPrice * itemQuantity,
    currency: META_CURRENCY,
    num_items: itemQuantity,
    product_id: productId,
    product_name: product?.name,
    product_category: product?.section || product?.category,
    size: options.size || undefined,
    color: options.color || undefined,
    fit_length: options.fitLength || undefined,
  });
};

export const buildCartPayload = (cartItems, products) => {
  const contents = cartItems
    .map((item) => {
      const product = products.find((p) => getProductId(p) === item._id);
      if (!product) return null;

      return {
        item,
        product,
        price: getProductPrice(product),
      };
    })
    .filter(Boolean);

  const numItems = contents.reduce(
    (total, { item }) => total + (Number(item.quantity) || 0),
    0,
  );
  const value = contents.reduce(
    (total, { item, price }) => total + price * (Number(item.quantity) || 0),
    0,
  );

  return cleanPayload({
    ...getPagePayload(),
    content_ids: contents.map(({ product }) => getProductId(product)),
    contents: contents.map(({ item, product, price }) =>
      cleanPayload({
        id: getProductId(product),
        quantity: Number(item.quantity) || 1,
        item_price: price,
      }),
    ),
    content_type: "product",
    content_name: contents.map(({ product }) => product.name).join(", "),
    value,
    currency: META_CURRENCY,
    num_items: numItems,
  });
};

export const buildOrderPayload = (orderItems, amount, options = {}) => {
  const contents = orderItems.map((item) => {
    const itemPrice = Number(item.price) || 0;
    const itemQuantity = Number(item.quantity) || 1;

    return cleanPayload({
      id: item._id,
      quantity: itemQuantity,
      item_price: itemPrice,
    });
  });

  return cleanPayload({
    ...getPagePayload(),
    content_ids: orderItems.map((item) => item._id).filter(Boolean),
    contents,
    content_type: "product",
    content_name: orderItems.map((item) => item.name).filter(Boolean).join(", "),
    value: Number(amount) || 0,
    currency: META_CURRENCY,
    num_items: orderItems.reduce(
      (total, item) => total + (Number(item.quantity) || 0),
      0,
    ),
    order_id: options.orderId,
    transaction_id: options.reference,
    payment_method: options.paymentMethod,
  });
};

export const updateMetaAdvancedMatching = (userData) => {
  if (!META_PIXEL_ID || !userData) return;

  const advancedMatching = cleanPayload({
    em: userData.email?.toLowerCase(),
    ph: userData.phone,
    fn: userData.firstName || (userData.name ? userData.name.split(" ")[0] : undefined),
    ln: userData.lastName || (userData.name ? userData.name.split(" ").slice(1).join(" ") : undefined),
    ct: userData.city,
    st: userData.state,
    country: userData.country,
    zp: userData.zipcode,
    external_id: userData._id || userData.id,
  });

  if (Object.keys(advancedMatching).length > 0) {
    ReactPixel.init(META_PIXEL_ID, advancedMatching, { autoConfig: true, debug: false });
  }
};

export const initMetaPixel = (advancedMatching = {}) => {
  if (META_PIXEL_ID) {
    ReactPixel.init(META_PIXEL_ID, advancedMatching, { autoConfig: true, debug: false });
  }
};

export const trackPageView = () => {
  if (!META_PIXEL_ID) return;

  const pagePayload = getPagePayload();

  ReactPixel.fbq("track", "PageView", pagePayload);
  ReactPixel.trackCustom("PageViewed", pagePayload);
};

export const trackViewContent = (product) => {
  if (!META_PIXEL_ID || !product) return;

  ReactPixel.track("ViewContent", buildProductPayload(product));
};

export const trackAddToCart = (product, quantity, options) => {
  if (!META_PIXEL_ID || !product) return;

  ReactPixel.track("AddToCart", buildProductPayload(product, quantity, options));
};

export const trackInitiateCheckout = (cartItems, products) => {
  if (!META_PIXEL_ID) return;

  ReactPixel.track("InitiateCheckout", buildCartPayload(cartItems, products));
};

export const trackOrderPlaced = (orderItems, amount, options) => {
  if (!META_PIXEL_ID || !orderItems?.length) return;

  const orderPayload = buildOrderPayload(orderItems, amount, options);

  ReactPixel.track("Purchase", orderPayload);
  ReactPixel.trackCustom("OrderPlaced", orderPayload);
};
