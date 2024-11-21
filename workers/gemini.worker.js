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
	// 无法修改原始请求头，需要复制一份
    const headers = new Headers(request.headers);
    // 隐藏真实来源ip
	headers.set("x-real-ip","45.159.217.254");
	headers.delete("x-forwarded-for");
    const newRequest = new Request(request, {
        headers: headers
    });
	
	const url = new URL(request.url);
	const targetHost = url.searchParams.get('host');
	url.searchParams.delete("host");
    url.host = targetHost? targetHost: 'generativelanguage.googleapis.com';
    return fetch(new Request(url, newRequest))
  }
}
