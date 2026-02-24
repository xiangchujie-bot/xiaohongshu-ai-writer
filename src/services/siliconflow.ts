import type { CopywritingInput, GeneratedCopy } from '../types';

interface SiliconFlowMessage {
  role: 'system' | 'user';
  content: string;
}

interface SiliconFlowRequest {
  model: string;
  messages: SiliconFlowMessage[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

interface SiliconFlowResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

class SiliconFlowService {
  private baseURL: string;
  private apiKey: string;
  private model: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_SILICONFLOW_BASE_URL || 'https://api.siliconflow.cn/v1';
    
    // 优先使用环境变量，其次使用内置 API Key
    this.apiKey = import.meta.env.VITE_SILICONFLOW_API_KEY || 
                  'sk-apmppebtokzdzsvzbssynbefsaxwwxpurjzojfpnqrcerwvj'; // 你的硅基流动 API Key
    
    this.model = 'Qwen/Qwen2.5-7B-Instruct'; // 使用通义千问模型
  }

  private buildPrompt(input: CopywritingInput): string {
    const styleMap = {
      planting: '种草文案',
      review: '测评文案',
      tutorial: '教程文案',
      story: '故事文案'
    };

    return `你是一个专业的小红书文案写手，请根据以下信息生成3条不同角度的${styleMap[input.style]}。

要求：
1. 文案要符合小红书平台风格，口语化、接地气
2. 每条文案控制在200-300字
3. 适当使用emoji表情和话题标签
4. 突出产品特点和用户痛点
5. 具有强烈的种草力和感染力

输入信息：
- 话题：${input.topic}
- 产品：${input.productName}
- 产品特点：${input.features.join('、') || '无'}
- 目标人群：${input.targetAudience || '无特定人群'}
- 文案风格：${styleMap[input.style]}

请按以下JSON格式返回3条文案：
{
  "copies": [
    {
      "title": "吸引人的标题",
      "content": "文案内容",
      "tags": ["标签1", "标签2", "标签3"],
      "emojis": ["😊", "🔥", "✨"]
    }
  ]
}`;
  }

  private parseResponse(response: string, input: CopywritingInput): GeneratedCopy[] {
    try {
      // 尝试解析JSON
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.copies && Array.isArray(parsed.copies)) {
          return parsed.copies.map((copy: any, index: number) => ({
            id: `${Date.now()}_${index}`,
            title: copy.title || '默认标题',
            content: copy.content || '默认内容',
            tags: Array.isArray(copy.tags) ? copy.tags : ['好物推荐'],
            emojis: Array.isArray(copy.emojis) ? copy.emojis : ['✨', '🔥'],
            timestamp: new Date().toISOString(),
            isFavorite: false
          }));
        }
      }
    } catch (error) {
      console.error('解析响应失败:', error);
    }

    // 如果解析失败，返回默认格式
    return [{
      id: Date.now().toString(),
      title: `${input.productName}推荐`,
      content: response.slice(0, 300),
      tags: ['好物推荐', '种草'],
      emojis: ['✨', '🔥'],
      timestamp: new Date().toISOString(),
      isFavorite: false
    }];
  }

  async generateCopywriting(input: CopywritingInput): Promise<GeneratedCopy[]> {
    if (!this.apiKey) {
      throw new Error('API Key 未配置');
    }

    const request: SiliconFlowRequest = {
      model: this.model,
      messages: [
        {
          role: 'system',
          content: '你是一个专业的小红书文案写手，擅长创作吸引人的种草文案。'
        },
        {
          role: 'user',
          content: this.buildPrompt(input)
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    };

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API请求失败: ${response.status}`);
      }

      const data: SiliconFlowResponse = await response.json();
      const content = data.choices[0]?.message?.content;

      if (!content) {
        throw new Error('API返回内容为空');
      }

      return this.parseResponse(content, input);
    } catch (error) {
      console.error('SiliconFlow API 调用失败:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('401')) {
          throw new Error('API Key 无效，请检查配置');
        } else if (error.message.includes('429')) {
          throw new Error('API 调用频率过高，请稍后重试');
        } else if (error.message.includes('500')) {
          throw new Error('服务器内部错误，请稍后重试');
        }
      }
      
      throw new Error('生成文案失败，请稍后重试');
    }
  }

  // 重试机制
  async generateCopywritingWithRetry(input: CopywritingInput, maxRetries: number = 3): Promise<GeneratedCopy[]> {
    let lastError: Error;

    for (let i = 0; i < maxRetries; i++) {
      try {
        return await this.generateCopywriting(input);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('未知错误');
        
        if (i < maxRetries - 1) {
          // 指数退避
          const delay = Math.pow(2, i) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError!;
  }
}

export const siliconFlowService = new SiliconFlowService();
