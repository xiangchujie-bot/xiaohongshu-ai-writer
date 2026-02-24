import React from 'react';
import type { HistoryItem } from '../types';
import { Clock, Trash2, ExternalLink } from 'lucide-react';

interface HistoryPanelProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onSelect, onDelete }) => {
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return '今天 ' + date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return '昨天 ' + date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays < 7) {
      return `${diffDays}天前`;
    } else {
      return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
    }
  };

  const getStyleLabel = (style: string) => {
    const styleMap = {
      planting: '种草',
      review: '测评',
      tutorial: '教程',
      story: '故事'
    };
    return styleMap[style as keyof typeof styleMap] || style;
  };

  const getStyleColor = (style: string) => {
    const colorMap = {
      planting: 'bg-pink-100 text-pink-600',
      review: 'bg-blue-100 text-blue-600',
      tutorial: 'bg-green-100 text-green-600',
      story: 'bg-purple-100 text-purple-600'
    };
    return colorMap[style as keyof typeof colorMap] || 'bg-gray-100 text-gray-600';
  };

  if (history.length === 0) {
    return (
      <div className="xiaohongshu-card text-center py-12">
        <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">暂无历史记录</h3>
        <p className="text-gray-600">开始生成你的第一条小红书文案吧！</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">📝 历史记录</h3>
        <span className="text-sm text-gray-500">{history.length} 条记录</span>
      </div>

      {history.map((item) => (
        <div
          key={item.id}
          className="xiaohongshu-card hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-start justify-between">
            <div
              className="flex-1 min-w-0"
              onClick={() => onSelect(item)}
            >
              {/* 头部信息 */}
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStyleColor(item.input.style)}`}>
                  {getStyleLabel(item.input.style)}
                </span>
                <span className="text-xs text-gray-500">{formatDate(item.timestamp)}</span>
              </div>

              {/* 话题和产品 */}
              <div className="mb-2">
                <h4 className="font-medium text-gray-900 truncate mb-1">
                  🎯 {item.input.topic}
                </h4>
                <p className="text-sm text-gray-600 truncate">
                  📦 {item.input.productName}
                </p>
              </div>

              {/* 特点标签 */}
              {item.input.features.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {item.input.features.slice(0, 3).map((feature, index) => (
                    <span
                      key={index}
                      className="inline-block px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                    >
                      {feature}
                    </span>
                  ))}
                  {item.input.features.length > 3 && (
                    <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                      +{item.input.features.length - 3}
                    </span>
                  )}
                </div>
              )}

              {/* 生成结果预览 */}
              <div className="text-xs text-gray-500">
                生成了 {item.outputs.length} 条文案
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex items-center gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(item);
                }}
                className="p-2 text-gray-400 hover:text-xiaohongshu-red transition-colors"
                title="查看详情"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(item.id);
                }}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                title="删除记录"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HistoryPanel;
