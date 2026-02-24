import { useState } from 'react';
import { History, Trash2, Search, Clock } from 'lucide-react';
import type { HistoryItem, GeneratedCopy } from '../types';
import DetailCard from './DetailCard';

interface HistoryPanelProps {
  history: HistoryItem[];
  onDeleteHistory: (id: string) => void;
  onCopy: (content: string) => void;
  onShare: (copy: GeneratedCopy) => void;
  onFavorite: (copy: GeneratedCopy) => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({
  history,
  onDeleteHistory,
  onCopy,
  onShare,
  onFavorite
}) => {
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // 搜索过滤
  const filteredHistory = history.filter(item => {
    const searchLower = searchTerm.toLowerCase();
    return (
      item.input.topic.toLowerCase().includes(searchLower) ||
      item.input.productName.toLowerCase().includes(searchLower) ||
      item.outputs.some(copy => 
        copy.title.toLowerCase().includes(searchLower) ||
        copy.content.toLowerCase().includes(searchLower)
      )
    );
  });

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return '今天';
    } else if (diffDays === 1) {
      return '昨天';
    } else if (diffDays < 7) {
      return `${diffDays}天前`;
    } else {
      return date.toLocaleDateString('zh-CN');
    }
  };

  return (
    <div className="flex gap-6">
      {/* 左侧历史列表 */}
      <div className="w-1/3 space-y-4">
        <div className="xiaohongshu-card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-xiaohongshu-red" />
              <h3 className="text-lg font-bold text-gray-900">历史记录</h3>
            </div>
            <span className="px-2 py-1 bg-xiaohongshu-light text-xiaohongshu-red rounded-full text-sm font-medium">
              {history.length}
            </span>
          </div>

          {/* 搜索框 */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索历史记录..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="xiaohongshu-input w-full pl-10"
            />
          </div>

          {/* 历史列表 */}
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {filteredHistory.length === 0 ? (
              <div className="text-center py-8">
                <History className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">
                  {searchTerm ? '没有找到匹配的记录' : '还没有生成记录'}
                </p>
                {!searchTerm && (
                  <p className="text-sm text-gray-400 mt-1">
                    开始生成文案后会显示在这里
                  </p>
                )}
              </div>
            ) : (
              filteredHistory.map((item) => (
                <div
                  key={item.id}
                  className={`p-3 border rounded-xl cursor-pointer transition-all ${
                    selectedItem?.id === item.id
                      ? 'border-xiaohongshu-red bg-xiaohongshu-light'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">
                        {item.input.productName}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {item.input.topic}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                        {item.outputs.length}
                      </span>
                      {item.outputs.some(copy => copy.isFavorite) && (
                        <span className="text-xiaohongshu-red">♥</span>
                      )}
                    </div>
                  </div>

                  {/* 显示第一个文案标题 */}
                  {item.outputs.length > 0 && (
                    <p className="text-xs text-gray-600 line-clamp-1 mb-2">
                      {item.outputs[0].title}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock className="w-3 h-3" />
                      {formatDate(item.timestamp)}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteHistory(item.id);
                      }}
                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                    >
                      <Trash2 className="w-3 h-3 text-gray-400" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 右侧详情卡片 */}
      <div className="flex-1">
        {selectedItem ? (
          <DetailCard
            historyItem={selectedItem}
            onCopy={onCopy}
            onShare={onShare}
            onFavorite={onFavorite}
          />
        ) : (
          <div className="xiaohongshu-card">
            <div className="text-center py-16">
              <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">选择记录查看详情</h3>
              <p className="text-gray-500">
                点击左侧历史记录查看完整的文案内容
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPanel;
