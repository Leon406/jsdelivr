const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // You should restrict this to your domain in production
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400', // 24 hours cache for preflight requests
};

// Helper function to handle CORS preflight requests
function handleOptions(request) {
  return new Response(null, {
    headers: corsHeaders,
    status: 204,
  });
}


export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return handleOptions(request);
    }
    const url = new URL(request.url);
	const targetHost = url.searchParams.get('host');
    url.host = targetHost? targetHost: 'generativelanguage.googleapis.com';
    return fetch(new Request(url, request))
  }
}
