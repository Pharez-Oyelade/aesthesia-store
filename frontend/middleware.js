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
  const userAgent = (req.headers.get("user-agent") || "").toLowerCase();
  const isCrawler = CRAWLERS.some((crawler) => userAgent.includes(crawler));

  if (isCrawler) {
    const productId = req.nextUrl.pathname.split("/").pop();
    const ogUrl = `https://aesthesia-store-backend.onrender.com/og/product/${productId}`;
    return Response.redirect(ogUrl, 302);
  }
}
