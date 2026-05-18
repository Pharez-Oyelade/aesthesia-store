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

export const initMetaPixel = () => {
  if (META_PIXEL_ID) {
    ReactPixel.init(META_PIXEL_ID, {}, { autoConfig: true, debug: false });
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
