import { Copy, Share2, Heart, Calendar, Tag, Sparkles } from 'lucide-react';
import type { HistoryItem, GeneratedCopy } from '../types';

interface DetailCardProps {
  historyItem: HistoryItem;
  onCopy: (content: string) => void;
  onShare: (copy: GeneratedCopy) => void;
  onFavorite: (copy: GeneratedCopy) => void;
  showOnlyFavorites?: boolean;
}

const DetailCard: React.FC<DetailCardProps> = ({
  historyItem,
  onCopy,
  onShare,
  onFavorite,
  showOnlyFavorites = false
}) => {
  const displayCopies = showOnlyFavorites 
    ? historyItem.outputs.filter(copy => copy.isFavorite)
    : historyItem.outputs;

  const handleCopy = (copy: GeneratedCopy) => {
    const fullContent = `${copy.title}\n\n${copy.content}\n\n${copy.tags.map(tag => `#${tag}`).join(' ')}`;
    onCopy(fullContent);
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="xiaohongshu-card">
      {/* 头部信息 */}
      <div className="border-b border-gray-100 pb-4 mb-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              {historyItem.input.productName}
            </h3>
            <p className="text-gray-600">{historyItem.input.topic}</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            {formatDate(historyItem.timestamp)}
          </div>
        </div>
        
        {/* 输入信息标签 */}
        <div className="flex flex-wrap gap-2">
          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
            目标人群: {historyItem.input.targetAudience}
          </span>
          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
            风格: {historyItem.input.style === 'planting' ? '种草' : 
                   historyItem.input.style === 'review' ? '测评' : 
                   historyItem.input.style === 'tutorial' ? '教程' : '故事'}
          </span>
          {historyItem.input.features.length > 0 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
              特点: {historyItem.input.features.join('、')}
            </span>
          )}
        </div>
      </div>

      {/* 文案列表 */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-xiaohongshu-red" />
          <h4 className="text-lg font-semibold text-gray-900">
            {showOnlyFavorites ? '收藏的文案' : '生成的文案'}
          </h4>
          <span className="px-2 py-1 bg-xiaohongshu-light text-xiaohongshu-red rounded-full text-sm font-medium">
            {displayCopies.length}
          </span>
        </div>

        {displayCopies.length === 0 ? (
          <div className="text-center py-8">
            <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">
              {showOnlyFavorites ? '该记录下没有收藏的文案' : '暂无文案'}
            </p>
          </div>
        ) : (
          displayCopies.map((copy) => (
            <div
              key={copy.id}
              className="border border-gray-200 rounded-xl p-4 hover:border-xiaohongshu-red transition-colors"
            >
              {/* 标题 */}
              <h5 className="text-lg font-semibold text-gray-900 mb-3">
                {copy.title}
              </h5>

              {/* 内容 */}
              <div className="mb-4">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {copy.content}
                </p>
              </div>

              {/* 标签和 Emoji */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex flex-wrap gap-2">
                  {copy.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-2 py-1 bg-xiaohongshu-light text-xiaohongshu-red rounded-full text-xs font-medium flex items-center gap-1"
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex gap-1 text-lg">
                  {copy.emojis.map((emoji, emojiIndex) => (
                    <span key={emojiIndex} className="p-1 bg-gray-50 rounded">
                      {emoji}
                    </span>
                  ))}
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex gap-2 pt-3 border-t border-gray-100">
                <button
                  onClick={() => handleCopy(copy)}
                  className="flex items-center gap-2 px-3 py-2 bg-xiaohongshu-red text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                >
                  <Copy className="w-3 h-3" />
                  复制
                </button>
                <button
                  onClick={() => onShare(copy)}
                  className="flex items-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  <Share2 className="w-3 h-3" />
                  分享
                </button>
                <button
                  onClick={() => onFavorite(copy)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    copy.isFavorite
                      ? 'bg-xiaohongshu-red text-white'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Heart className={`w-3 h-3 ${copy.isFavorite ? 'fill-current' : ''}`} />
                  {copy.isFavorite ? '已收藏' : '收藏'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DetailCard;
