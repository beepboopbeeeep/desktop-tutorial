export default {
  async fetch(request) {
    const url = new URL(request.url);
    const domain = url.searchParams.get("domain");
    if (!domain) {
      return new Response(JSON.stringify({ error: "Missing domain" }), {
        status: 400,
        headers: { "content-type": "application/json" }
      });
    }

    const dnsURL = `https://cloudflare-dns.com/dns-query?name=${domain}&type=A`;
    try {
      const res = await fetch(dnsURL, {
        headers: { "accept": "application/dns-json" }
      });
      const data = await res.text();
      return new Response(data, {
        headers: {
          "content-type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: "DNS fetch failed" }), {
        status: 502,
        headers: { "content-type": "application/json" }
      });
    }
  }
}
