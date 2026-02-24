import { useState } from 'react';
import InputPanel from './components/InputPanel';
import ResultCard from './components/ResultCard';
import HistoryPanel from './components/HistoryPanel';
import FavoritesPanel from './components/FavoritesPanel';
import DetailModal from './components/DetailModal';
import Toast from './components/Toast';
import type { CopywritingInput, GeneratedCopy, HistoryItem } from './types';
import { MessageCircle, History, Heart, Sparkles } from 'lucide-react';
import { siliconFlowService } from './services/siliconflow';
import { useToast } from './hooks/useToast';
import { useLocalStorage } from './hooks/useLocalStorage';
import { mockHistoryData } from './data/mockData';

function App() {
  const [currentResults, setCurrentResults] = useState<GeneratedCopy[]>([]);
  const [history, setHistory] = useLocalStorage<HistoryItem[]>('xiaohongshu-history', mockHistoryData);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'generate' | 'history' | 'favorites'>('generate');
  const [selectedCopy, setSelectedCopy] = useState<GeneratedCopy | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
      showSuccess('文案已复制到剪贴板');
    }).catch(() => {
      showError('复制失败，请手动复制');
    });
  };

  const handleShare = (copy: GeneratedCopy) => {
    if (navigator.share) {
      navigator.share({
        title: copy.title,
        text: copy.content,
      }).then(() => {
        showSuccess('分享成功');
      }).catch(() => {
        showError('分享失败');
      });
    } else {
      handleCopy(`${copy.title}\n\n${copy.content}`);
    }
  };

  const handleFavorite = (copy: GeneratedCopy) => {
    // 更新历史记录中的收藏状态
    const updatedHistory = history.map(item => ({
      ...item,
      outputs: item.outputs.map(output => 
        output.id === copy.id 
          ? { ...output, isFavorite: !output.isFavorite }
          : output
      )
    }));
    
    setHistory(updatedHistory);
    
    // 更新当前结果中的收藏状态
    setCurrentResults(prev => prev.map(result => 
      result.id === copy.id 
        ? { ...result, isFavorite: !result.isFavorite }
        : result
    ));
    
    showSuccess(copy.isFavorite ? '已取消收藏' : '已添加到收藏');
  };

  const handleCopyClick = (copy: GeneratedCopy) => {
    setSelectedCopy(copy);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCopy(null);
  };

  const handleDeleteHistory = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
    showSuccess('历史记录已删除');
  };

  return (
    <div className="min-h-screen bg-xiaohongshu-light">
      <div className="container mx-auto px-4 py-8">
        {/* 头部 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            小红书爆款文案 AI 引擎
          </h1>
          <p className="text-gray-600">
            智能生成种草文案，让你的产品一夜爆红
          </p>
        </div>

        {/* 标签导航 */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-xl p-1 shadow-sm">
            <button
              onClick={() => setActiveTab('generate')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'generate'
                  ? 'bg-xiaohongshu-red text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                生成文案
              </div>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'history'
                  ? 'bg-xiaohongshu-red text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <History className="w-4 h-4" />
                历史记录
              </div>
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'favorites'
                  ? 'bg-xiaohongshu-red text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                收藏合集
              </div>
            </button>
          </div>
        </div>

        {/* 内容区域 */}
        {activeTab === 'generate' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 左侧输入面板 */}
            <div>
              <InputPanel onSubmit={handleGenerate} isLoading={isLoading} />
            </div>

            {/* 右侧结果展示 */}
            <div>
              {currentResults.length > 0 ? (
                <div className="space-y-4">
                  {currentResults.map((copy) => (
                    <div key={copy.id} onClick={() => handleCopyClick(copy)}>
                      <ResultCard
                        copy={copy}
                        onCopy={() => handleCopy(`${copy.title}\n\n${copy.content}\n\n${copy.tags.map(tag => `#${tag}`).join(' ')}`)}
                        onShare={() => handleShare(copy)}
                        onFavorite={() => handleFavorite(copy)}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="xiaohongshu-card">
                  <div className="text-center py-16">
                    <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      等待生成文案
                    </h3>
                    <p className="text-gray-500">
                      填写左侧表单，AI 将为你生成爆款文案
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <HistoryPanel
            history={history}
            onDeleteHistory={handleDeleteHistory}
            onCopy={handleCopy}
            onShare={handleShare}
            onFavorite={handleFavorite}
          />
        )}

        {activeTab === 'favorites' && (
          <FavoritesPanel
            history={history}
            onDeleteHistory={handleDeleteHistory}
            onCopy={handleCopy}
            onShare={handleShare}
            onFavorite={handleFavorite}
          />
        )}

        {/* 详情弹窗 */}
        <DetailModal
          copy={selectedCopy}
          isOpen={isModalOpen}
          onClose={closeModal}
          onCopy={handleCopy}
          onShare={handleShare}
          onFavorite={handleFavorite}
        />

        {/* Toast 通知 */}
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            type={toast.type}
            message={toast.message}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
