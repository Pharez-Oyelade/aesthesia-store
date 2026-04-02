// export const config = {
//   matcher: ["/product/:id*"],
// };

// const CRAWLERS = [
//   "facebookexternalhit",
//   "twitterbot",
//   "whatsapp",
//   "linkedinbot",
//   "slackbot",
//   "telegrambot",
//   "googlebot",
// ];

// export default function middleware(req) {
//   const ua = (req.headers.get("user-agent") || "").toLowerCase();
//   const isCrawler = CRAWLERS.some((bot) => ua.includes(bot));

//   if (isCrawler) {
//     // Use standard URL API instead of req.nextUrl (that's Next.js only)
//     const url = new URL(req.url);
//     const productId = url.pathname.split("/").pop();
//     const ogUrl = `https://aesthesia-store-backend.onrender.com/og/product/${productId}`;
//     return Response.redirect(ogUrl, 302);
//   }
// }

export const config = {
  matcher: ["/product/:id*"],
};

const CRAWLERS = [
  "facebookexternalhit",
  "twitterbot",
  "whatsapp",
  "linkedinbot",
  "slackbot",
  "telegrambot",
  "googlebot",
];

export default async function middleware(req) {
  const ua = (req.headers.get("user-agent") || "").toLowerCase();
  const isCrawler = CRAWLERS.some((bot) => ua.includes(bot));

  if (!isCrawler) return; // real user — do nothing

  const url = new URL(req.url);
  const productId = url.pathname.split("/").pop();

  try {
    const res = await fetch(
      `https://aesthesia-store-backend.onrender.com/api/product/single`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      },
    );
    const data = await res.json();
    const product = data.product; // adjust to match your API response shape

    const title = product.name;
    const description = `Shop ${product.name} on Aesthesia Haven`;
    const image = Array.isArray(product.image)
      ? product.image[0].url
      : product.image.url;
    const canonicalUrl = `https://www.aesthesiahaven.com/product/${productId}`;

    const html = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${title}</title>
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:type" content="product" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:image" content="${image}" />
  </head>
  <body></body>
</html>`;

    return new Response(html, {
      headers: { "Content-Type": "text/html" },
    });
  } catch (err) {
    return; // if fetch fails, fall through to normal React app
  }
}
