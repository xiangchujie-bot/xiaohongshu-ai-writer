import { useState } from 'react';
import InputPanel from './components/InputPanel';
import ResultCard from './components/ResultCard';
import HistoryPanel from './components/HistoryPanel';
import Toast from './components/Toast';
import type { CopywritingInput, GeneratedCopy, HistoryItem } from './types';
import { MessageCircle, History, Sparkles } from 'lucide-react';
import { siliconFlowService } from './services/siliconflow';
import { useToast } from './hooks/useToast';
import { useLocalStorage } from './hooks/useLocalStorage';
import { mockHistoryData } from './data/mockData';

function App() {
  const [currentResults, setCurrentResults] = useState<GeneratedCopy[]>([]);
  const [history, setHistory] = useLocalStorage<HistoryItem[]>('xiaohongshu-history', mockHistoryData);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'generate' | 'history'>('generate');
  const { toasts, showSuccess, showError, removeToast } = useToast();

  const handleGenerate = async (input: CopywritingInput) => {
    setIsLoading(true);
    try {
      // 调用硅基流动 API
      const results = await siliconFlowService.generateCopywritingWithRetry(input, 3);
      setCurrentResults(results);
      
      // 添加到历史记录
      const historyItem: HistoryItem = {
        id: Date.now().toString(),
        input,
        outputs: results,
        timestamp: new Date().toISOString()
      };
      setHistory(prev => [historyItem, ...prev]);
      
      showSuccess('文案生成成功！');
    } catch (error) {
      console.error('生成失败:', error);
      showError(error instanceof Error ? error.message : '生成失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content).then(() => {
      showSuccess('内容已复制到剪贴板');
    }).catch(() => {
      showError('复制失败，请手动复制');
    });
  };

  const handleFavorite = (id: string) => {
    setCurrentResults(prev => 
      prev.map(item => 
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
    
    const item = currentResults.find(r => r.id === id);
    if (item) {
      showSuccess(item.isFavorite ? '已取消收藏' : '已添加到收藏');
    }
  };

  const handleShare = (content: string) => {
    if (navigator.share) {
      navigator.share({
        title: '小红书文案',
        text: content
      }).then(() => {
        showSuccess('分享成功');
      }).catch(() => {
        showError('分享失败');
      });
    } else {
      navigator.clipboard.writeText(content).then(() => {
        showSuccess('内容已复制，可以分享给朋友');
      });
    }
  };

  const handleDeleteHistory = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
    showSuccess('历史记录已删除');
  };

  const handleSelectHistory = (item: HistoryItem) => {
    setCurrentResults(item.outputs);
    setActiveTab('generate');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-xiaohongshu-light/50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* 头部 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
            <Sparkles className="w-8 h-8 text-xiaohongshu-red" />
            小红书爆款文案生成器
          </h1>
          <p className="text-gray-600">AI 驱动，一键生成种草文案</p>
        </div>

        {/* 标签页 */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-xl bg-white shadow-sm border border-gray-200 p-1">
            <button
              onClick={() => setActiveTab('generate')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'generate'
                  ? 'bg-xiaohongshu-red text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <MessageCircle className="w-4 h-4" />
              文案生成
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'history'
                  ? 'bg-xiaohongshu-red text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <History className="w-4 h-4" />
              历史记录
            </button>
          </div>
        </div>

        {/* 内容区域 */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* 左侧 */}
          <div>
            {activeTab === 'generate' ? (
              <InputPanel onSubmit={handleGenerate} isLoading={isLoading} />
            ) : (
              <HistoryPanel
                history={history}
                onSelect={handleSelectHistory}
                onDelete={handleDeleteHistory}
              />
            )}
          </div>

          {/* 右侧 */}
          <div>
            {currentResults.length > 0 ? (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4">📝 生成结果</h3>
                {currentResults.map((result) => (
                  <ResultCard
                    key={result.id}
                    copy={result}
                    onCopy={handleCopy}
                    onFavorite={handleFavorite}
                    onShare={handleShare}
                  />
                ))}
              </div>
            ) : (
              <div className="xiaohongshu-card text-center py-12">
                <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">等待生成</h3>
                <p className="text-gray-600">填写左侧表单，开始生成你的专属文案</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Toast 通知 */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}

export default App;
