/**
 * @typedef {Object} OpenAICompletionResponse
 * @property {string} id
 * @property {string} object
 * @property {number} created
 * @property {string} model
 * @property {Array<{index: number, message: {role: string, content: string}, finish_reason: string}>} choices
 * @property {{prompt_tokens: number, completion_tokens: number, total_tokens: number}} usage
 */

// ============= Configuration =============
const K2_CONFIG = {
  API_ENDPOINT: "https://www.k2think.ai/api/guest/chat/completions",
  TIMEOUT_MS: 30000,
  DEFAULT_HEADERS: {
    'Accept': 'text/event-stream',
    'Accept-Encoding': 'gzip, deflate, br, zstd',
    'Accept-Language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7',
    'Content-Type': 'application/json',
    'Origin': 'https://www.k2think.ai',
    'Pragma': 'no-cache',
    'Referer': 'https://www.k2think.ai/guest',
    'Sec-Ch-Ua': '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
    'Sec-Ch-Ua-Mobile': '?0',
    'Sec-Ch-Ua-Platform': '"macOS"',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-origin',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  },
  REASONING_PATTERN: /<details type="reasoning"[^>]*>.*?<summary>.*?<\/summary>([\s\S]*?)<\/details>/,
  ANSWER_PATTERN: /<answer>([\s\S]*?)<\/answer>/,
};

const LONGCAT_CONFIG = {
  API_ENDPOINT: 'https://longcat.chat/api/v1/chat-completion-oversea',
  DEFAULT_HEADERS: {
      'accept': 'text/event-stream,application/json',
      'content-type': 'application/json',
      'origin': 'https://longcat.chat',
      'referer': 'https://longcat.chat/t',
  }
};


// ============= Authentication Manager =============
class AuthManager {
  constructor() {
    // 将 API 密钥直接定义为字符串
    this.validApiKey = "sk-123456"; 
  }

  authenticate(req) {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return this.unauthorizedResponse("API key required");
    }
    
    // 提取 Bearer Token
    const apiKey = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;
    
    // 直接与设定的密钥进行比较
    if (apiKey !== this.validApiKey) {
      return this.unauthorizedResponse("Invalid API key provided");
    }
    
    // 验证通过
    return null;
  }

  unauthorizedResponse(message) {
    return new Response(JSON.stringify({ error: { message, type: 'authentication_error' } }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
}

// ============= K2Think Content Parser =============
class K2ContentParser {
  extractReasoningAndAnswer(content) {
    if (!content) return ["", ""];
    try {
      const reasoningMatch = content.match(K2_CONFIG.REASONING_PATTERN);
      const reasoning = reasoningMatch?.[1]?.trim() || "";
      const answerMatch = content.match(K2_CONFIG.ANSWER_PATTERN);
      const answer = answerMatch?.[1]?.trim() || "";
      return [reasoning, answer];
    } catch (error) {
      console.error("Error extracting K2 content:", error);
      return ["", ""];
    }
  }

  calculateDelta(previous, current) {
    if (!previous) return current;
    if (!current || current.length < previous.length) return "";
    return current.substring(previous.length);
  }

  parseApiResponse(obj) {
    if (!obj || typeof obj !== "object") return ["", false];
    const response = obj;
    if (response.done === true) return ["", true];
    if (Array.isArray(response.choices) && response.choices.length > 0) {
      const delta = response.choices[0].delta || {};
      return [delta.content || "", false];
    }
    if (typeof response.content === "string") {
      return [response.content, false];
    }
    return ["", false];
  }
}

// ============= K2Think Stream Handler =============
class K2StreamHandler {
  constructor(parser) {
    this.parser = parser;
  }

  async *generateStream(payload, model) {
    const streamId = `chatcmpl-${crypto.randomUUID().replaceAll('-', '')}`;
    const createdTime = Math.floor(Date.now() / 1000);
    
    yield this.createChunk(streamId, createdTime, model, { role: "assistant" });

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), K2_CONFIG.TIMEOUT_MS);

    try {
      const traceId = crypto.randomUUID().replaceAll('-', '');
      const parentId = crypto.randomUUID().replaceAll('-', '').substring(0, 16);
      const headers = {
        ...K2_CONFIG.DEFAULT_HEADERS,
        'traceparent': `00-${traceId}-${parentId}-01`,
      };

      const response = await fetch(K2_CONFIG.API_ENDPOINT, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(payload),
        signal: controller.signal,
        cf: { minTlsVersion: "1.2" }
      });

      if (!response.ok) {
        throw new Error(`K2Think API error: ${response.status} ${response.statusText}`);
      }
      yield* this.processStream(response, streamId, createdTime, model);
    } catch (error) {
      if (error.name === 'AbortError') throw new Error('Request timeout');
      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }

  async *processStream(response, streamId, createdTime, model) {
    const reader = response.body?.getReader();
    if (!reader) throw new Error("No response body");

    const decoder = new TextDecoder();
    let buffer = "";
    let accumulatedContent = "", previousReasoning = "", previousAnswer = "", reasoningPhase = true;

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data:")) continue;
          const dataStr = line.substring(5).trim();
          if (this.isEndMarker(dataStr)) continue;

          const content = this.parseDataString(dataStr);
          if (!content) continue;

          accumulatedContent = content;
          const [currentReasoning, currentAnswer] = this.parser.extractReasoningAndAnswer(accumulatedContent);

          if (reasoningPhase && currentReasoning) {
            const delta = this.parser.calculateDelta(previousReasoning, currentReasoning);
            if (delta.trim()) {
              yield this.createChunk(streamId, createdTime, model, { reasoning_content: delta });
              previousReasoning = currentReasoning;
            }
          }
          if (currentAnswer && reasoningPhase) {
            reasoningPhase = false;
            const finalReasoningDelta = this.parser.calculateDelta(previousReasoning, currentReasoning);
            if (finalReasoningDelta.trim()) {
              yield this.createChunk(streamId, createdTime, model, { reasoning_content: finalReasoningDelta });
            }
          }
          if (!reasoningPhase && currentAnswer) {
            const delta = this.parser.calculateDelta(previousAnswer, currentAnswer);
            if (delta.trim()) {
              yield this.createChunk(streamId, createdTime, model, { content: delta });
              previousAnswer = currentAnswer;
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }

    yield this.createChunk(streamId, createdTime, model, {}, "stop");
    yield "data: [DONE]\n\n";
  }

  isEndMarker(data) {
    return !data || data === "-1" || data === "[DONE]" || data === "DONE" || data === "done";
  }

  parseDataString(dataStr) {
    try {
      const obj = JSON.parse(dataStr);
      const [piece, isDone] = this.parser.parseApiResponse(obj);
      return isDone ? "" : piece;
    } catch {
      return dataStr;
    }
  }

  createChunk(id, created, model, delta, finishReason) {
    const choice = { delta, index: 0 };
    if (finishReason) choice.finish_reason = finishReason;
    const response = { id, object: "chat.completion.chunk", created, model, choices: [choice] };
    return `data: ${JSON.stringify(response)}\n\n`;
  }

  async aggregateStream(response) {
    const reader = response.body?.getReader();
    if (!reader) return "";
    const decoder = new TextDecoder();
    let buffer = "";
    let finalContent = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          if (!line.startsWith("data:")) continue;
          const dataStr = line.substring(5).trim();
          if (this.isEndMarker(dataStr)) continue;
          const content = this.parseDataString(dataStr);
          if (content) finalContent = content;
        }
      }
    } finally {
      reader.releaseLock();
    }
    const [, answer] = this.parser.extractReasoningAndAnswer(finalContent);
    return answer.replace(/\\n/g, "\n");
  }
}

// ============= Main Request Handler =============
class RequestHandler {
  constructor() {
    this.auth = new AuthManager();
    this.k2Parser = new K2ContentParser();
    this.k2StreamHandler = new K2StreamHandler(this.k2Parser);
  }

  async handleRequest(req) {
    try {
      const url = new URL(req.url);

      if (req.method === "OPTIONS") {
        return this.handleCORS();
      }

      let response;
      if (req.method === "GET" && url.pathname === "/v1/models") {
        response = this.handleModels(req);
      } else if (req.method === "POST" && url.pathname === "/v1/chat/completions") {
        response = await this.handleChatCompletion(req);
      } else {
        response = new Response("Not Found", { status: 404 });
      }

      return this.setCORSHeaders(response);

    } catch (error) {
      console.error("Request error:", error);
      const errorResponse = new Response(JSON.stringify({ error: { message: error.message || "Internal server error", type: "api_error" } }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
      return this.setCORSHeaders(errorResponse);
    }
  }
  
  handleCORS() {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
      },
    });
  }

  setCORSHeaders(response) {
    const newResponse = new Response(response.body, response);
    newResponse.headers.set('Access-Control-Allow-Origin', '*');
    return newResponse;
  }

  handleModels(req) {
    const models = {
      object: "list",
      data: [
        { id: "MBZUAI-IFM/K2-Think", object: "model", created: Math.floor(Date.now() / 1000), owned_by: "talkai" },
        { id: "longcat-flash", object: "model", created: Math.floor(Date.now() / 1000), owned_by: "longcat" },
      ]
    };
    return new Response(JSON.stringify(models), { headers: { "Content-Type": "application/json" } });
  }

  async handleChatCompletion(req) {
    const authError = this.auth.authenticate(req);
    if (authError) return authError;

    let body;
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    if (!body.messages?.length) {
      return new Response(JSON.stringify({ error: "Messages required" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    const model = body.model;
    if (model === "MBZUAI-IFM/K2-Think") {
      return this.handleK2ThinkRequest(body);
    } else if (model === "longcat-flash") {
      return this.handleLongCatRequest(body);
    } else {
      return new Response(JSON.stringify({ error: `Model not found: ${model}` }), { status: 404, headers: { "Content-Type": "application/json" } });
    }
  }

  // --- K2Think Specific Methods ---
  async handleK2ThinkRequest(body) {
    const k2Messages = this.prepareK2Messages(body.messages);
    const payload = {
      stream: true,
      model: body.model,
      messages: k2Messages,
      params: {
        ...(body.temperature && { temperature: body.temperature }),
        ...(body.max_tokens && { max_tokens: body.max_tokens }),
        ...(body.top_p && { top_p: body.top_p })
      }
    };

    if (body.stream) {
      return this.createK2StreamingResponse(payload, body.model);
    } else {
      return this.createK2NonStreamingResponse(payload, body.model);
    }
  }

  prepareK2Messages(messages) {
    const result = [];
    let systemContent = "";
    for (const msg of messages) {
      if (msg.role === "system") {
        systemContent = systemContent ? `${systemContent}\n\n${msg.content}` : msg.content;
      } else {
        result.push({ role: msg.role, content: msg.content });
      }
    }
    if (systemContent) {
      const firstUserIdx = result.findIndex(m => m.role === "user");
      if (firstUserIdx >= 0) {
        result[firstUserIdx].content = `${systemContent}\n\n${result[firstUserIdx].content}`;
      } else {
        result.unshift({ role: "user", content: systemContent });
      }
    }
    return result;
  }

  createK2StreamingResponse(payload, model) {
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          const handler = new K2StreamHandler(new K2ContentParser());
          for await (const chunk of handler.generateStream(payload, model)) {
            controller.enqueue(encoder.encode(chunk));
          }
        } catch (error) {
          console.error("K2 Stream generation error:", error);
          const errorChunk = `data: ${JSON.stringify({ error: error.message || "Stream error" })}\n\n`;
          controller.enqueue(encoder.encode(errorChunk));
        } finally {
          controller.close();
        }
      }
    });
    return new Response(stream, {
      headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", "Connection": "keep-alive" }
    });
  }

  async createK2NonStreamingResponse(payload, model) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), K2_CONFIG.TIMEOUT_MS);
    try {
      const traceId = crypto.randomUUID().replaceAll('-', '');
      const parentId = crypto.randomUUID().replaceAll('-', '').substring(0, 16);
      const headers = {
        ...K2_CONFIG.DEFAULT_HEADERS,
        'traceparent': `00-${traceId}-${parentId}-01`,
      };
      const response = await fetch(K2_CONFIG.API_ENDPOINT, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(payload),
        signal: controller.signal,
        cf: { minTlsVersion: "1.2" }
      });
      if (!response.ok) throw new Error(`K2Think API error: ${response.status}`);
      const content = await this.k2StreamHandler.aggregateStream(response);
      const chatResponse = {
        id: `chatcmpl-${crypto.randomUUID().replaceAll('-', '')}`,
        object: "chat.completion",
        created: Math.floor(Date.now() / 1000),
        model,
        choices: [{ message: { role: "assistant", content }, index: 0, finish_reason: "stop" }],
        usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 }
      };
      return new Response(JSON.stringify(chatResponse), { headers: { "Content-Type": "application/json" } });
    } catch (error) {
      if (error.name === 'AbortError') throw new Error('Request timeout');
      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }

  // --- LongCat Specific Methods ---
  async handleLongCatRequest(body) {
    const lastUserMessage = body.messages.filter(msg => msg.role === 'user').pop();
    const content = lastUserMessage ? lastUserMessage.content : '';

    const longChatPayload = {
      stream: true,
      temperature: body.temperature || 0.7,
      content: content,
      messages: body.messages,
    };

    const longChatResponse = await fetch(LONGCAT_CONFIG.API_ENDPOINT, {
      method: 'POST',
      headers: LONGCAT_CONFIG.DEFAULT_HEADERS,
      body: JSON.stringify(longChatPayload),
    });

    if (!longChatResponse.ok) {
      return new Response(longChatResponse.body, {
        status: longChatResponse.status,
        statusText: longChatResponse.statusText,
      });
    }

    if (body.stream) {
      const { readable, writable } = new TransformStream();
      this.processLongCatStream(longChatResponse, writable);
      return new Response(readable, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    } else {
      const openaiResponse = await this.convertLongCatStreamToNonStream(longChatResponse);
      return new Response(JSON.stringify(openaiResponse), {
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  async processLongCatStream(longChatResponse, writable) {
    const writer = writable.getWriter();
    const reader = longChatResponse.body.getReader();
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();

    try {
      let buffer = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim().startsWith('data:')) {
            try {
              const dataStr = line.slice(5).trim();
              if (dataStr === '[DONE]') {
                await writer.write(encoder.encode('data: [DONE]\n\n'));
                continue;
              }

              const longcatData = JSON.parse(dataStr);
              const openaiChunk = {
                id: `chatcmpl-${longcatData.id || Date.now()}`,
                object: "chat.completion.chunk",
                created: longcatData.created || Math.floor(Date.now() / 1000),
                model: "longcat-flash",
                choices: [{
                  index: 0,
                  delta: { content: longcatData.choices?.[0]?.delta?.content || '' },
                  finish_reason: longcatData.choices?.[0]?.finishReason || null,
                }],
              };
              await writer.write(encoder.encode(`data: ${JSON.stringify(openaiChunk)}\n\n`));
              
              if (longcatData.lastOne) {
                await writer.write(encoder.encode('data: [DONE]\n\n'));
              }
            } catch (e) {
              console.error('Error parsing LongCat stream data:', e, 'Raw data:', line);
            }
          }
        }
      }
    } catch (error) {
      console.error('LongCat stream processing error:', error);
    } finally {
      await writer.close();
    }
  }

  async convertLongCatStreamToNonStream(response) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullContent = "";
    let usageInfo = { promptTokens: 0, completionTokens: 0, totalTokens: 0 };
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.trim().startsWith('data:')) {
          const dataStr = line.slice(5).trim();
          if (dataStr === '[DONE]') continue;

          try {
            const chunk = JSON.parse(dataStr);
            if (chunk.choices?.[0]?.delta?.content) {
              fullContent += chunk.choices[0].delta.content;
            }
            if (chunk.tokenInfo) {
              usageInfo = chunk.tokenInfo;
            }
          } catch (e) {
            console.warn('Failed to parse LongCat stream chunk:', line);
          }
        }
      }
    }

    return {
      id: `chatcmpl-${Date.now()}`,
      object: "chat.completion",
      created: Math.floor(Date.now() / 1000),
      model: "longcat-flash",
      choices: [{
        index: 0,
        message: {
          role: "assistant",
          content: fullContent.trim(),
        },
        finish_reason: "stop",
      }],
      usage: {
        prompt_tokens: usageInfo.promptTokens,
        completion_tokens: usageInfo.completionTokens,
        total_tokens: usageInfo.totalTokens,
      },
    };
  }
}

// ============= Cloudflare Worker Entry Point =============
const handler = new RequestHandler();
addEventListener('fetch', event => {
  event.respondWith(handler.handleRequest(event.request));
});