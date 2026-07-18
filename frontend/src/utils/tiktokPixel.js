const TTQ_CURRENCY = "NGN";

const cleanPayload = (payload) =>
  Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined),
  );

const getProductPrice = (product) => {
  const price = product?.onSale ? product.salePrice : product?.price;
  const numericPrice = Number(price);

  return Number.isFinite(numericPrice) ? numericPrice : 0;
};

const getProductId = (product) => product?._id || product?.id;

export const buildProductPayload = (product, quantity = 1) => {
  const productId = getProductId(product);
  const itemPrice = getProductPrice(product);
  const itemQuantity = Number(quantity) || 1;

  return cleanPayload({
    contents: [
      {
        content_id: productId,
        content_name: product?.name,
        content_category: product?.section || product?.category,
        quantity: itemQuantity,
        price: itemPrice,
      }
    ],
    content_type: "product",
    value: itemPrice * itemQuantity,
    currency: TTQ_CURRENCY,
  });
};

export const buildCartPayload = (cartItems, products) => {
  const contents = cartItems
    .map((item) => {
      const product = products.find((p) => getProductId(p) === item._id);
      if (!product) return null;

      return {
        content_id: getProductId(product),
        content_name: product.name,
        quantity: Number(item.quantity) || 1,
        price: getProductPrice(product),
      };
    })
    .filter(Boolean);

  const value = contents.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  return cleanPayload({
    contents,
    content_type: "product",
    value,
    currency: TTQ_CURRENCY,
  });
};

export const buildOrderPayload = (orderItems, amount) => {
  const contents = orderItems.map((item) => {
    return {
      content_id: item._id,
      content_name: item.name,
      quantity: Number(item.quantity) || 1,
      price: Number(item.price) || 0,
    };
  });

  return cleanPayload({
    contents,
    content_type: "product",
    value: Number(amount) || 0,
    currency: TTQ_CURRENCY,
  });
};

export const trackViewContent = (product) => {
  if (typeof window === "undefined" || !window.ttq || !product) return;
  window.ttq.track("ViewContent", buildProductPayload(product));
};

export const trackAddToCart = (product, quantity) => {
  if (typeof window === "undefined" || !window.ttq || !product) return;
  window.ttq.track("AddToCart", buildProductPayload(product, quantity));
};

export const trackInitiateCheckout = (cartItems, products) => {
  if (typeof window === "undefined" || !window.ttq) return;
  window.ttq.track("InitiateCheckout", buildCartPayload(cartItems, products));
};

export const trackOrderPlaced = (orderItems, amount) => {
  if (typeof window === "undefined" || !window.ttq || !orderItems?.length) return;
  window.ttq.track("CompletePayment", buildOrderPayload(orderItems, amount));
};
