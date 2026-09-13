// Canonicalize before static asset lookup so existing files also redirect.
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.hostname === "www.samosasheet.com" ||
        (url.hostname === "samosasheet.com" && url.protocol !== "https:")) {
      url.protocol = "https:";
      url.hostname = "samosasheet.com";
      url.port = "";
      return Response.redirect(url.toString(), 308);
    }
    return env.ASSETS.fetch(request);
  },
};
