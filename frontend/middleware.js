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

export default function middleware(req) {
  const ua = (req.headers.get("user-agent") || "").toLowerCase();
  const isCrawler = CRAWLERS.some((bot) => ua.includes(bot));

  if (isCrawler) {
    // Use standard URL API instead of req.nextUrl (that's Next.js only)
    const url = new URL(req.url);
    const productId = url.pathname.split("/").pop();
    const ogUrl = `https://aesthesia-store-backend.onrender.com/og/product/${productId}`;
    return Response.redirect(ogUrl, 302);
  }
}
