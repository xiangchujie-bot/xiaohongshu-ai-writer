import { X, Copy, Share2, Heart } from 'lucide-react';
import type { GeneratedCopy } from '../types';

interface DetailModalProps {
  copy: GeneratedCopy | null;
  isOpen: boolean;
  onClose: () => void;
  onCopy: (content: string) => void;
  onShare: (copy: GeneratedCopy) => void;
  onFavorite: (copy: GeneratedCopy) => void;
}

const DetailModal: React.FC<DetailModalProps> = ({
  copy,
  isOpen,
  onClose,
  onCopy,
  onShare,
  onFavorite
}) => {
  if (!isOpen || !copy) return null;

  const handleCopy = () => {
    const fullContent = `${copy.title}\n\n${copy.content}\n\n${copy.tags.map(tag => `#${tag}`).join(' ')}`;
    onCopy(fullContent);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* 头部 */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">文案详情</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* 内容 */}
        <div className="p-6 space-y-6">
          {/* 标题 */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{copy.title}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>{new Date(copy.timestamp).toLocaleDateString()}</span>
              {copy.isFavorite && (
                <span className="text-xiaohongshu-red">已收藏</span>
              )}
            </div>
          </div>

          {/* 正文 */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">文案内容</h4>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                {copy.content}
              </p>
            </div>
          </div>

          {/* 标签 */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">话题标签</h4>
            <div className="flex flex-wrap gap-2">
              {copy.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-xiaohongshu-light text-xiaohongshu-red rounded-full text-sm font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Emoji */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">推荐 Emoji</h4>
            <div className="flex gap-2 text-2xl">
              {copy.emojis.map((emoji, index) => (
                <span key={index} className="p-2 bg-gray-50 rounded-lg">
                  {emoji}
                </span>
              ))}
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button
              onClick={handleCopy}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-xiaohongshu-red text-white rounded-xl font-medium hover:bg-red-600 transition-colors"
            >
              <Copy className="w-4 h-4" />
              复制全文
            </button>
            <button
              onClick={() => onShare(copy)}
              className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              分享
            </button>
            <button
              onClick={() => onFavorite(copy)}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-colors ${
                copy.isFavorite
                  ? 'bg-xiaohongshu-red text-white'
                  : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Heart className={`w-4 h-4 ${copy.isFavorite ? 'fill-current' : ''}`} />
              {copy.isFavorite ? '已收藏' : '收藏'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;
