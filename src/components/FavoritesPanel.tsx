import { useState } from 'react';
import { Heart, Trash2, Search } from 'lucide-react';
import type { HistoryItem, GeneratedCopy } from '../types';
import DetailCard from './DetailCard';

interface FavoritesPanelProps {
  history: HistoryItem[];
  onDeleteHistory: (id: string) => void;
  onCopy: (content: string) => void;
  onShare: (copy: GeneratedCopy) => void;
  onFavorite: (copy: GeneratedCopy) => void;
}

const FavoritesPanel: React.FC<FavoritesPanelProps> = ({
  history,
  onDeleteHistory,
  onCopy,
  onShare,
  onFavorite
}) => {
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // 筛选收藏的项目
  const favorites = history.filter(item => 
    item.outputs.some(copy => copy.isFavorite)
  );

  // 搜索过滤
  const filteredFavorites = favorites.filter(item => {
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

  // 获取收藏的文案
  const getFavoriteCopies = (item: HistoryItem): GeneratedCopy[] => {
    return item.outputs.filter(copy => copy.isFavorite);
  };

  return (
    <div className="flex gap-6">
      {/* 左侧收藏列表 */}
      <div className="w-1/3 space-y-4">
        <div className="xiaohongshu-card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-xiaohongshu-red fill-current" />
              <h3 className="text-lg font-bold text-gray-900">收藏合集</h3>
            </div>
            <span className="px-2 py-1 bg-xiaohongshu-light text-xiaohongshu-red rounded-full text-sm font-medium">
              {favorites.length}
            </span>
          </div>

          {/* 搜索框 */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索收藏的文案..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="xiaohongshu-input w-full pl-10"
            />
          </div>

          {/* 收藏列表 */}
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {filteredFavorites.length === 0 ? (
              <div className="text-center py-8">
                <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">
                  {searchTerm ? '没有找到匹配的收藏' : '还没有收藏任何文案'}
                </p>
                {!searchTerm && (
                  <p className="text-sm text-gray-400 mt-1">
                    在生成结果中点击收藏按钮即可添加
                  </p>
                )}
              </div>
            ) : (
              filteredFavorites.map((item) => {
                const favoriteCopies = getFavoriteCopies(item);
                return (
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
                      <span className="px-2 py-1 bg-xiaohongshu-red text-white rounded-full text-xs">
                        {favoriteCopies.length}
                      </span>
                    </div>
                    
                    {/* 显示收藏的文案标题 */}
                    <div className="space-y-1">
                      {favoriteCopies.slice(0, 2).map((copy, index) => (
                        <p key={index} className="text-xs text-gray-600 line-clamp-1">
                          • {copy.title}
                        </p>
                      ))}
                      {favoriteCopies.length > 2 && (
                        <p className="text-xs text-gray-400">
                          还有 {favoriteCopies.length - 2} 条...
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-gray-400">
                        {new Date(item.timestamp).toLocaleDateString()}
                      </span>
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
                );
              })
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
            showOnlyFavorites={true}
          />
        ) : (
          <div className="xiaohongshu-card">
            <div className="text-center py-16">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">选择收藏查看详情</h3>
              <p className="text-gray-500">
                点击左侧收藏项目查看完整的文案内容
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPanel;
