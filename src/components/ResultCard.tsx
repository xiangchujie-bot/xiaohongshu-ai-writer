import React from 'react';
import type { GeneratedCopy } from '../types';
import { Copy, Share2, Bookmark } from 'lucide-react';

interface ResultCardProps {
  copy: GeneratedCopy;
  onCopy: (content: string) => void;
  onFavorite: (id: string) => void;
  onShare: (content: string) => void;
}

const ResultCard: React.FC<ResultCardProps> = ({ copy, onCopy, onFavorite, onShare }) => {
  const handleCopy = () => {
    onCopy(copy.content);
  };

  const handleFavorite = () => {
    onFavorite(copy.id);
  };

  const handleShare = () => {
    onShare(copy.content);
  };

  return (
    <div className="xiaohongshu-card relative group">
      {/* 收藏按钮 */}
      <button
        onClick={handleFavorite}
        className={`absolute top-4 right-4 z-10 p-2 rounded-full transition-all ${
          copy.isFavorite
            ? 'bg-xiaohongshu-red text-white'
            : 'bg-white/80 backdrop-blur text-gray-600 hover:text-xiaohongshu-red'
        }`}
      >
        <Bookmark className={`w-4 h-4 ${copy.isFavorite ? 'fill-current' : ''}`} />
      </button>

      {/* 标题 */}
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
          <span className="text-xl">{copy.emojis.slice(0, 2).join('')}</span>
          {copy.title}
        </h3>
        <div className="flex flex-wrap gap-1">
          {copy.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-block px-2 py-1 bg-xiaohongshu-light text-xiaohongshu-red rounded-full text-xs font-medium"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* 内容 */}
      <div className="mb-4">
        <p className="text-gray-800 leading-relaxed whitespace-pre-line">
          {copy.content}
        </p>
      </div>

      {/* 操作按钮 */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all"
          >
            <Copy className="w-4 h-4" />
            <span className="text-sm font-medium">复制</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all"
          >
            <Share2 className="w-4 h-4" />
            <span className="text-sm font-medium">分享</span>
          </button>
        </div>

        <div className="text-xs text-gray-500">
          {new Date(copy.timestamp).toLocaleString('zh-CN', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
