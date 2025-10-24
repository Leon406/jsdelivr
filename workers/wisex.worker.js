const WEBSOCKET_URL = "wss://api.euask.com:8094/chat";

const AVAILABLE_MODELS = [
    { id: "o4-mini", name: "GPT-4o mini" },
    { id: "gpt-5-nano", name: "GPT-5 Nano" },
    { id: "gpt-5-mini", name: "GPT-5 Mini" },
    { id: "gpt-5", name: "GPT-5" },
    { id: "doubao-seed-1.6-250615", name: "Doubao seed" },
    { id: "gpt-image-1", name: "Text to Image (GPT4)" },
    { id: "o3", name: "GPT-o3 (Reasoning model)" },
    { id: "qwen-turbo-latest", name: "Qwen - Trubo" },
    { id: "qwen-plus-latest", name: "Qwen - Plus" },
    { id: "qwen-max-latest", name: "Qwen - Max" },
    { id: "google/gemini-2.5-pro-preview-03-25", name: "Gemini-2.5 Pro" },
    { id: "GLM-4-Flash", name: "GLM-4 Flash" },
    { id: "GLM-Z1-Flash", name: "GLM-Z1 Flash" },
    { id: "GLM-Z1-Air", name: "GLM-Z1 Air" },
    { id: "deepseek-reasoner", name: "Deepseek-R1" },
    { id: "deepseek-chat", name: "Deepseek Chat" }
];

const MODEL_IDS = AVAILABLE_MODELS.map(m => m.id);

function generateId() {
    return 'chatcmpl-' + Math.random().toString(36).substring(2, 10);
}

function estimateTokens(text) {
    return Math.ceil(text.length / 4);
}

function jsonResponse(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
    });
}

function errorResponse(message, status = 400) {
    return jsonResponse({
        error: {
            message,
            type: 'invalid_request_error',
            code: status
        }
    }, status);
}

function getHomePage(request) {
    const currentUrl = new URL(request.url);
    const baseUrl = `${currentUrl.protocol}//${currentUrl.host}`;
    
    const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OpenAI API Gateway</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background: #000;
            color: #e4e4e7;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            overflow-x: hidden;
        }
        
        #starfield {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 0;
        }
        
        .container {
            position: relative;
            z-index: 1;
            max-width: 1200px;
            margin: 0 auto;
            padding: 40px 20px;
            flex: 1;
        }
        
        header {
            text-align: center;
            margin-bottom: 60px;
            padding-top: 40px;
        }
        
        .logo {
            width: 80px;
            height: 80px;
            margin: 0 auto 24px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 40px;
            box-shadow: 0 8px 32px rgba(102, 126, 234, 0.5);
            animation: float 3s ease-in-out infinite;
        }
        
        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
        }
        
        h1 {
            font-size: 48px;
            font-weight: 700;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 16px;
        }
        
        .subtitle {
            font-size: 18px;
            color: #a1a1aa;
            font-weight: 400;
        }
        
        .status-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 8px 16px;
            background: rgba(16, 185, 129, 0.15);
            border: 1px solid rgba(16, 185, 129, 0.4);
            border-radius: 20px;
            margin-top: 20px;
            font-size: 14px;
            color: #10b981;
        }
        
        .status-dot {
            width: 8px;
            height: 8px;
            background: #10b981;
            border-radius: 50%;
            animation: pulse-dot 2s ease-in-out infinite;
        }
        
        @keyframes pulse-dot {
            0%, 100% { 
                opacity: 1;
                box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
            }
            50% { 
                opacity: 0.7;
                box-shadow: 0 0 0 8px rgba(16, 185, 129, 0);
            }
        }
        
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 24px;
            margin-bottom: 40px;
        }
        
        .card {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 16px;
            padding: 32px;
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
        }
        
        .card:hover {
            background: rgba(255, 255, 255, 0.08);
            border-color: rgba(102, 126, 234, 0.6);
            transform: translateY(-4px);
            box-shadow: 0 12px 40px rgba(102, 126, 234, 0.3);
        }
        
        .card-icon {
            width: 48px;
            height: 48px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            margin-bottom: 20px;
        }
        
        .card h3 {
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 12px;
            color: #f4f4f5;
        }
        
        .card p {
            color: #a1a1aa;
            line-height: 1.6;
            margin-bottom: 16px;
        }
        
        .endpoint {
            background: rgba(0, 0, 0, 0.4);
            padding: 12px 16px;
            border-radius: 8px;
            font-family: 'Monaco', 'Courier New', monospace;
            font-size: 13px;
            color: #10b981;
            border: 1px solid rgba(16, 185, 129, 0.3);
            word-break: break-all;
        }
        
        .models-section {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 16px;
            padding: 32px;
            backdrop-filter: blur(10px);
            margin-bottom: 40px;
        }
        
        .models-section h2 {
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 24px;
            color: #f4f4f5;
        }
        
        .models-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 12px;
        }
        
        .model-tag {
            background: rgba(102, 126, 234, 0.15);
            border: 1px solid rgba(102, 126, 234, 0.4);
            padding: 10px 16px;
            border-radius: 8px;
            font-size: 14px;
            color: #a5b4fc;
            text-align: center;
            transition: all 0.2s ease;
        }
        
        .model-tag:hover {
            background: rgba(102, 126, 234, 0.25);
            border-color: rgba(102, 126, 234, 0.6);
            transform: scale(1.05);
        }
        
        .usage-section {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 16px;
            padding: 32px;
            backdrop-filter: blur(10px);
        }
        
        .usage-section h2 {
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 24px;
            color: #f4f4f5;
        }
        
        .code-block {
            background: rgba(0, 0, 0, 0.5);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 16px;
            overflow-x: auto;
        }
        
        .code-block pre {
            margin: 0;
            font-family: 'Monaco', 'Courier New', monospace;
            font-size: 13px;
            line-height: 1.6;
            color: #e4e4e7;
        }
        
        .code-block code {
            color: #10b981;
        }
        
        .api-key-note {
            background: rgba(234, 179, 8, 0.1);
            border: 1px solid rgba(234, 179, 8, 0.3);
            border-radius: 12px;
            padding: 16px;
            margin-bottom: 24px;
            color: #fbbf24;
            font-size: 14px;
            line-height: 1.6;
        }
        
        .api-key-note strong {
            color: #fcd34d;
        }
        
        footer {
            text-align: center;
            padding: 40px 20px;
            color: #71717a;
            font-size: 14px;
        }
        
        @media (max-width: 768px) {
            h1 {
                font-size: 36px;
            }
            
            .grid {
                grid-template-columns: 1fr;
            }
            
            .models-grid {
                grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            }
        }
    </style>
</head>
<body>
    <canvas id="starfield"></canvas>
    
    <div class="container">
        <header>
            <div class="logo">🚀</div>
            <h1>OpenAI API Gateway</h1>
            <p class="subtitle">高性能 AI 模型接口服务</p>
            <div class="status-badge">
                <span class="status-dot"></span>
                <span>服务运行中</span>
            </div>
        </header>
        
        <div class="grid">
            <div class="card">
                <div class="card-icon">📋</div>
                <h3>模型列表</h3>
                <p>获取所有可用的 AI 模型信息</p>
                <div class="endpoint">GET /v1/models</div>
            </div>
            
            <div class="card">
                <div class="card-icon">💬</div>
                <h3>聊天完成</h3>
                <p>发送消息并获取 AI 响应</p>
                <div class="endpoint">POST /v1/chat/completions</div>
            </div>
            
            <div class="card">
                <div class="card-icon">⚡</div>
                <h3>流式输出</h3>
                <p>支持实时流式响应，提升用户体验</p>
                <div class="endpoint">stream: true</div>
            </div>
        </div>
        
        <div class="models-section">
            <h2>🤖 支持的模型</h2>
            <div class="models-grid">
                ${AVAILABLE_MODELS.map(m => `<div class="model-tag">${m.name}</div>`).join('')}
            </div>
        </div>
        
        <div class="usage-section">
            <h2>📖 使用示例</h2>
            
            <div class="api-key-note">
                <strong>⚠️ API Key 说明：</strong><br>
                默认 API Key 为 <code>sk-123456</code>，可通过环境变量 <code>API_KEY</code> 自定义设置。
            </div>
            
            <div class="code-block">
                <pre><code>curl ${baseUrl}/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer sk-123456" \\
  -d '{
    "model": "gpt-5",
    "messages": [
      {"role": "user", "content": "Hello!"}
    ],
    "stream": false
  }'</code></pre>
            </div>
            
            <div class="code-block">
                <pre><code>import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: '${baseUrl}/v1',
  apiKey: 'sk-123456'
});

const response = await client.chat.completions.create({
  model: 'gpt-5',
  messages: [{ role: 'user', content: 'Hello!' }]
});</code></pre>
            </div>
            
            <div class="code-block">
                <pre><code>// Python 示例
from openai import OpenAI

client = OpenAI(
    base_url="${baseUrl}/v1",
    api_key="sk-123456"
)

response = client.chat.completions.create(
    model="gpt-5",
    messages=[{"role": "user", "content": "Hello!"}]
)</code></pre>
            </div>
        </div>
    </div>
    
    <footer>
        Powered by Cloudflare Workers
    </footer>
    
    <script>
        const canvas = document.getElementById('starfield');
        const ctx = canvas.getContext('2d');
        
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        
        const stars = [];
        const numStars = 800;
        const speed = 2;
        const centerX = width / 2;
        const centerY = height / 2;
        
        class Star {
            constructor() {
                this.reset();
            }
            
            reset() {
                this.x = Math.random() * width - centerX;
                this.y = Math.random() * height - centerY;
                this.z = Math.random() * width;
                this.pz = this.z;
            }
            
            update() {
                this.pz = this.z;
                this.z -= speed;
                
                if (this.z < 1) {
                    this.reset();
                }
            }
            
            draw() {
                const sx = (this.x / this.pz) * width + centerX;
                const sy = (this.y / this.pz) * height + centerY;
                const ex = (this.x / this.z) * width + centerX;
                const ey = (this.y / this.z) * height + centerY;
                
                const size = (1 - this.z / width) * 3;
                const opacity = 1 - this.z / width;
                
                ctx.strokeStyle = \`rgba(255, 255, 255, \${opacity})\`;
                ctx.lineWidth = size;
                ctx.beginPath();
                ctx.moveTo(sx, sy);
                ctx.lineTo(ex, ey);
                ctx.stroke();
            }
        }
        
        for (let i = 0; i < numStars; i++) {
            stars.push(new Star());
        }
        
        function animate() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, width, height);
            
            stars.forEach(star => {
                star.update();
                star.draw();
            });
            
            requestAnimationFrame(animate);
        }
        
        animate();
        
        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });
    </script>
</body>
</html>`;
    
    return new Response(html, {
        headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Access-Control-Allow-Origin': '*',
        }
    });
}

async function chatWithWiseCleaner(token, model, messages, stream = false) {
    let userMessage = "";
    for (let i = messages.length - 1; i >= 0; i--) {
        if (messages[i].role === "user") {
            userMessage = messages[i].content;
            break;
        }
    }
    
    if (!userMessage) {
        throw new Error("没有找到用户消息");
    }
    
    const userMessageCount = messages.filter(m => m.role === "user").length;
    const isNewConversation = userMessageCount === 1;
    
    const chatMessage = {
        type: "chat",
        message: userMessage,
        web: false,
        model: model,
        context: 8,
        ignore_context: isNewConversation,
        max_tokens: 4096,
        temperature: 0.6,
        top_p: 1,
        top_k: 5,
        presence_penalty: 0,
        frequency_penalty: 0,
        repetition_penalty: 1
    };
    
    try {
        const ws = new WebSocket(WEBSOCKET_URL, {
            headers: {
                "Origin": "https://aicg.wisecleaner.com",
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
                "Cache-Control": "no-cache",
                "Pragma": "no-cache"
            }
        });
        
        await new Promise((resolve, reject) => {
            ws.addEventListener('open', resolve);
            ws.addEventListener('error', reject);
        });
        
        const authMessage = { token: token, id: -1 };
        ws.send(JSON.stringify(authMessage));
        
        await new Promise(resolve => setTimeout(resolve, 100));
        
        ws.send(JSON.stringify(chatMessage));
        
        let fullResponse = "";
        const chunks = [];
        
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                ws.close();
                reject(new Error("请求超时"));
            }, 180000);
            
            ws.addEventListener('message', (event) => {
                try {
                    const data = JSON.parse(event.data);
                    
                    if (data.message) {
                        fullResponse += data.message;
                        if (stream) {
                            chunks.push(data.message);
                        }
                    }
                    
                    if (data.end) {
                        clearTimeout(timeout);
                        ws.close();
                        resolve(stream ? chunks : fullResponse);
                    }
                } catch (e) {
                    if (event.data && event.data.trim()) {
                        fullResponse += event.data;
                        if (stream) {
                            chunks.push(event.data);
                        }
                    }
                }
            });
            
            ws.addEventListener('error', (error) => {
                clearTimeout(timeout);
                reject(error);
            });
            
            ws.addEventListener('close', () => {
                clearTimeout(timeout);
                if (fullResponse || chunks.length > 0) {
                    resolve(stream ? chunks : fullResponse);
                } else {
                    reject(new Error("连接关闭，未收到响应"));
                }
            });
        });
        
    } catch (error) {
        throw new Error(`WebSocket 连接失败: ${error.message}`);
    }
}

async function handleRequest(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    
    const API_KEY = env?.API_KEY || 'sk-123456';
    
    if (request.method === 'OPTIONS') {
        return new Response(null, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            }
        });
    }
    
    if (path === '/' && request.method === 'GET') {
        return getHomePage(request);
    }
    
    if (path === '/v1/models' && request.method === 'GET') {
        return jsonResponse({
            object: "list",
            data: AVAILABLE_MODELS.map(model => ({
                id: model.id,
                object: "model",
                created: Math.floor(Date.now() / 1000),
                owned_by: "wisecleaner",
                permission: [],
                root: model.id,
                parent: null
            }))
        });
    }
    
    if (path === '/v1/chat/completions' && request.method === 'POST') {
        try {
            const authorization = request.headers.get('Authorization');
            if (!authorization) {
                return errorResponse('缺少 Authorization header', 401);
            }
            
            const providedKey = authorization.replace('Bearer ', '').trim();
            if (!providedKey) {
                return errorResponse('无效的 API Key', 401);
            }
            
            if (providedKey !== API_KEY) {
                return errorResponse('API Key 验证失败', 401);
            }
            
            const body = await request.json();
            const { model, messages, stream = false } = body;
            
            if (!MODEL_IDS.includes(model)) {
                return errorResponse(
                    `不支持的模型: ${model}，可用模型: ${MODEL_IDS.join(', ')}`
                );
            }
            
            if (!messages || messages.length === 0) {
                return errorResponse('messages 不能为空');
            }
            
            const chatId = generateId();
            const created = Math.floor(Date.now() / 1000);
            
            const promptText = messages.map(m => m.content).join(' ');
            const promptTokens = estimateTokens(promptText);
            
            const token = env?.WISECLEANER_TOKEN || providedKey;
            
            if (stream) {
                const { readable, writable } = new TransformStream();
                const writer = writable.getWriter();
                const encoder = new TextEncoder();
                
                (async () => {
                    try {
                        const chunks = await chatWithWiseCleaner(token, model, messages, true);
                        
                        for (const content of chunks) {
                            const chunk = {
                                id: chatId,
                                object: "chat.completion.chunk",
                                created: created,
                                model: model,
                                choices: [{
                                    index: 0,
                                    delta: { content: content },
                                    finish_reason: null
                                }]
                            };
                            await writer.write(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`));
                        }
                        
                        const fullResponse = chunks.join('');
                        const completionTokens = estimateTokens(fullResponse);
                        
                        const finalChunk = {
                            id: chatId,
                            object: "chat.completion.chunk",
                            created: created,
                            model: model,
                            choices: [{
                                index: 0,
                                delta: {},
                                finish_reason: "stop"
                            }],
                            usage: {
                                prompt_tokens: promptTokens,
                                completion_tokens: completionTokens,
                                total_tokens: promptTokens + completionTokens
                            }
                        };
                        await writer.write(encoder.encode(`data: ${JSON.stringify(finalChunk)}\n\n`));
                        await writer.write(encoder.encode('data: [DONE]\n\n'));
                        
                    } catch (error) {
                        const errorChunk = {
                            error: {
                                message: error.message,
                                type: "server_error",
                                code: 500
                            }
                        };
                        await writer.write(encoder.encode(`data: ${JSON.stringify(errorChunk)}\n\n`));
                    } finally {
                        await writer.close();
                    }
                })();
                
                return new Response(readable, {
                    headers: {
                        'Content-Type': 'text/event-stream',
                        'Cache-Control': 'no-cache',
                        'Connection': 'keep-alive',
                        'Access-Control-Allow-Origin': '*',
                    }
                });
            }
            
            else {
                const fullResponse = await chatWithWiseCleaner(token, model, messages, false);
                const completionTokens = estimateTokens(fullResponse);
                
                return jsonResponse({
                    id: chatId,
                    object: "chat.completion",
                    created: created,
                    model: model,
                    choices: [{
                        index: 0,
                        message: {
                            role: "assistant",
                            content: fullResponse
                        },
                        finish_reason: "stop"
                    }],
                    usage: {
                        prompt_tokens: promptTokens,
                        completion_tokens: completionTokens,
                        total_tokens: promptTokens + completionTokens
                    }
                });
            }
            
        } catch (error) {
            return errorResponse(error.message, 500);
        }
    }
    
    return errorResponse('Not Found', 404);
}

export default {
    async fetch(request, env, ctx) {
        return handleRequest(request, env);
    }
};