import React, { useState } from 'react';
import type { CopywritingInput } from '../types';
import { Sparkles, Users, Target, PenTool } from 'lucide-react';

interface InputPanelProps {
  onSubmit: (input: CopywritingInput) => void;
  isLoading?: boolean;
}

const InputPanel: React.FC<InputPanelProps> = ({ onSubmit, isLoading = false }) => {
  const [input, setInput] = useState<CopywritingInput>({
    topic: '',
    productName: '',
    features: [],
    targetAudience: '',
    style: 'planting'
  });

  const [featureInput, setFeatureInput] = useState('');

  const styleOptions = [
    { value: 'planting', label: '种草文案', icon: Sparkles, color: 'text-pink-500' },
    { value: 'review', label: '测评文案', icon: Target, color: 'text-blue-500' },
    { value: 'tutorial', label: '教程文案', icon: PenTool, color: 'text-green-500' },
    { value: 'story', label: '故事文案', icon: Users, color: 'text-purple-500' }
  ];

  const addFeature = () => {
    if (featureInput.trim() && input.features.length < 5) {
      setInput(prev => ({
        ...prev,
        features: [...prev.features, featureInput.trim()]
      }));
      setFeatureInput('');
    }
  };

  const removeFeature = (index: number) => {
    setInput(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.topic.trim() && input.productName.trim()) {
      onSubmit(input);
    }
  };

  return (
    <div className="xiaohongshu-card">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">✨ 小红书文案生成器</h2>
        <p className="text-gray-600">输入产品信息，AI 为你生成爆款种草文案</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 话题输入 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            🎯 话题主题 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={input.topic}
            onChange={(e) => setInput(prev => ({ ...prev, topic: e.target.value }))}
            placeholder="例如：夏季护肤、数码产品、美食推荐"
            className="xiaohongshu-input w-full"
            disabled={isLoading}
          />
        </div>

        {/* 产品名称 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            📦 产品名称 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={input.productName}
            onChange={(e) => setInput(prev => ({ ...prev, productName: e.target.value }))}
            placeholder="例如：玻尿酸面膜、蓝牙耳机、网红奶茶"
            className="xiaohongshu-input w-full"
            disabled={isLoading}
          />
        </div>

        {/* 产品特点 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            💡 产品特点 (最多5个)
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
              placeholder="例如：补水保湿、便携设计、性价比高"
              className="xiaohongshu-input flex-1"
              disabled={isLoading || input.features.length >= 5}
            />
            <button
              type="button"
              onClick={addFeature}
              disabled={!featureInput.trim() || input.features.length >= 5 || isLoading}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              添加
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {input.features.map((feature, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-xiaohongshu-light text-xiaohongshu-red rounded-full text-sm"
              >
                {feature}
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  disabled={isLoading}
                  className="text-xiaohongshu-red hover:text-xiaohongshu-orange"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* 目标人群 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            👥 目标人群
          </label>
          <input
            type="text"
            value={input.targetAudience}
            onChange={(e) => setInput(prev => ({ ...prev, targetAudience: e.target.value }))}
            placeholder="例如：大学生、职场新人、宝妈群体"
            className="xiaohongshu-input w-full"
            disabled={isLoading}
          />
        </div>

        {/* 文案风格 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            🎨 文案风格
          </label>
          <div className="grid grid-cols-2 gap-3">
            {styleOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setInput(prev => ({ ...prev, style: option.value as any }))}
                  disabled={isLoading}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    input.style === option.value
                      ? 'border-xiaohongshu-red bg-xiaohongshu-light'
                      : 'border-gray-200 hover:border-gray-300'
                  } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${option.color}`} />
                    <span className="text-sm font-medium">{option.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 提交按钮 */}
        <button
          type="submit"
          disabled={!input.topic.trim() || !input.productName.trim() || isLoading}
          className={`w-full py-4 rounded-xl font-medium text-lg transition-all ${
            isLoading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'xiaohongshu-button hover:scale-[1.02] active:scale-[0.98]'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>生成中...</span>
            </div>
          ) : (
            '🚀 生成爆款文案'
          )}
        </button>
      </form>
    </div>
  );
};

export default InputPanel;
