# 🚀 部署指南

## 📦 GitHub Pages 部署

### 1. 推送到 GitHub

```bash
git add .
git commit -m "feat: 完成小红书文案生成器"
git push origin main
```

### 2. 配置 GitHub Pages

1. 进入 GitHub 仓库
2. 点击 `Settings` 选项卡
3. 在左侧菜单找到 `Pages`
4. 在 `Build and deployment` 中：
   - Source: 选择 `GitHub Actions`
5. 保存设置

### 3. 配置 Secrets

在 GitHub 仓库中设置 API Key：

1. 进入 `Settings` → `Secrets and variables` → `Actions`
2. 点击 `New repository secret`
3. 添加以下 Secret：
   - Name: `VITE_SILICONFLOW_API_KEY`
   - Value: 你的硅基流动 API Key

### 4. 自动部署

推送到 `main` 分支后会自动触发部署：
- 🔄 GitHub Actions 自动构建
- 📦 生成静态文件
- 🌐 部署到 GitHub Pages

部署完成后，访问：
```
https://[你的用户名].github.io/xiaohongshu-ai-writer/
```

## 🌐 其他部署方式

### Vercel 部署

1. 安装 Vercel CLI：
```bash
npm i -g vercel
```

2. 配置环境变量：
```bash
vercel env add VITE_SILICONFLOW_API_KEY
```

3. 部署：
```bash
vercel --prod
```

### Netlify 部署

1. 构建项目：
```bash
npm run build
```

2. 上传 `dist` 文件夹到 Netlify

3. 在 Netlify 控制台设置环境变量：
```
VITE_SILICONFLOW_API_KEY = your_api_key_here
```

## 🔧 本地部署

### Docker 部署

1. 创建 `Dockerfile`：
```dockerfile
FROM node:20-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

2. 构建镜像：
```bash
docker build -t xiaohongshu-ai-writer .
```

3. 运行容器：
```bash
docker run -p 80:80 xiaohongshu-ai-writer
```

## 📊 性能优化

### 1. 构建优化

```bash
# 分析构建包大小
npm run build -- --analyze

# 启用压缩
npm run build -- --minify
```

### 2. CDN 配置

建议使用 CDN 加速静态资源：
- GitHub Pages 自带 CDN
- 可配置自定义 CDN

### 3. 缓存策略

在 `nginx.conf` 中配置：
```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
  expires 1y;
  add_header Cache-Control "public, immutable";
}
```

## 🔍 故障排除

### 1. 部署失败

检查：
- GitHub Actions 日志
- 环境变量配置
- 构建错误信息

### 2. API 调用失败

检查：
- API Key 是否正确设置
- 网络访问权限
- CORS 配置

### 3. 页面空白

检查：
- 控制台错误信息
- 资源加载情况
- 路由配置

## 📈 监控与分析

### 1. 性能监控

使用工具：
- Google PageSpeed Insights
- GTmetrix
- WebPageTest

### 2. 用户分析

集成分析工具：
- Google Analytics
- 百度统计
- 腾讯分析

## 🛡️ 安全注意事项

1. **API Key 安全**
   - 使用环境变量存储
   - 定期轮换 Key
   - 监控使用情况

2. **内容安全**
   - 添加内容过滤
   - 设置使用限制
   - 监控异常请求

3. **数据保护**
   - 不存储用户敏感信息
   - 使用 HTTPS
   - 遵循隐私法规
