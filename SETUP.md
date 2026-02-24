# 环境配置指南

## 🔑 获取硅基流动 API Key

1. 访问 [硅基流动官网](https://siliconflow.cn/)
2. 注册并登录账号
3. 进入控制台 → API Keys
4. 创建新的 API Key
5. 复制 Key 备用

## ⚙️ 配置环境变量

### 方法1: 创建 .env.local 文件

在项目根目录创建 `.env.local` 文件：

```env
# 硅基流动 API 配置
VITE_SILICONFLOW_API_KEY=your_actual_api_key_here
VITE_SILICONFLOW_BASE_URL=https://api.siliconflow.cn/v1
```

**注意：**
- 将 `your_actual_api_key_here` 替换为你的真实 API Key
- `.env.local` 文件已添加到 `.gitignore`，不会被提交到代码仓库

### 方法2: 临时环境变量（仅用于测试）

```bash
# Windows
set VITE_SILICONFLOW_API_KEY=your_actual_api_key_here

# macOS/Linux
export VITE_SILICONFLOW_API_KEY=your_actual_api_key_here
```

## 🚀 启动项目

```bash
npm run dev
```

## 📝 API 使用说明

### 支持的模型
- `Qwen/Qwen2.5-7B-Instruct` (默认)
- `Qwen/Qwen2.5-14B-Instruct`
- `Qwen/Qwen2.5-32B-Instruct`
- `Qwen/Qwen2.5-72B-Instruct`

### 费用说明
- 硅基流动提供免费额度
- 超出免费额度后按使用量计费
- 建议设置用量监控

## 🔍 故障排除

### 1. API Key 无效
```
错误：API Key 无效，请检查配置
解决：检查 .env.local 文件中的 API Key 是否正确
```

### 2. 网络连接问题
```
错误：API请求失败
解决：检查网络连接，确保能访问 api.siliconflow.cn
```

### 3. 频率限制
```
错误：API 调用频率过高，请稍后重试
解决：等待几秒后重试，或升级套餐
```

## 🛡️ 安全提醒

- **不要**将 API Key 提交到代码仓库
- **不要**在前端暴露敏感信息
- 定期轮换 API Key
- 监控 API 使用情况

## 📞 技术支持

如遇到问题，可以：
1. 查看浏览器控制台错误信息
2. 检查网络请求状态
3. 联系硅基流动技术支持
