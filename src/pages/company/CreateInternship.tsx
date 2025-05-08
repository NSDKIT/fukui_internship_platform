import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, MapPin, Clock, DollarSign, Calendar, Users, Plus, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

const CreateInternship: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    isRemote: false,
    workType: 'onsite',
    startDate: '',
    endDate: '',
    hoursPerWeek: '',
    applicationDeadline: '',
    salaryAmount: '',
    salaryPeriod: 'hourly',
    requirements: [''],
    responsibilities: [''],
    skills: [''],
    industry: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (!user) {
        throw new Error('認証が必要です');
      }

      // Validate dates
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const deadline = new Date(formData.applicationDeadline);
      const now = new Date();

      if (deadline < now) {
        throw new Error('応募締切は現在より後の日付を設定してください');
      }
      if (start > end) {
        throw new Error('開始日は終了日より前の日付を設定してください');
      }
      if (deadline > start) {
        throw new Error('応募締切は開始日より前の日付を設定してください');
      }

      const { data: internship, error: insertError } = await supabase
        .from('internships')
        .insert({
          company_id: user.id,
          title: formData.title,
          description: formData.description,
          location: formData.location,
          is_remote: formData.workType === 'remote' || formData.isRemote,
          requirements: formData.requirements.filter(Boolean),
          responsibilities: formData.responsibilities.filter(Boolean),
          salary_amount: parseInt(formData.salaryAmount),
          salary_period: formData.salaryPeriod,
          start_date: formData.startDate,
          end_date: formData.endDate,
          hours_per_week: parseInt(formData.hoursPerWeek),
          application_deadline: formData.applicationDeadline,
          industry: formData.industry,
          skills: formData.skills.filter(Boolean),
          status: 'published'
        })
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      navigate('/company/manage-internships');
    } catch (err) {
      console.error('インターンシップの作成に失敗:', err);
      setError(err instanceof Error ? err.message : 'インターンシップの作成に失敗しました');
      setIsSubmitting(false);
    }
  };

  const addListItem = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    setFormData(prev => ({
      ...prev,
      [list]: [...prev[list], '']
    }));
  };

  const removeListItem = (index: number, list: 'requirements' | 'responsibilities' | 'skills') => {
    setFormData(prev => ({
      ...prev,
      [list]: prev[list].filter((_, i) => i !== index)
    }));
  };

  const updateListItem = (
    index: number,
    value: string,
    list: 'requirements' | 'responsibilities' | 'skills'
  ) => {
    setFormData(prev => ({
      ...prev,
      [list]: prev[list].map((item, i) => i === index ? value : item)
    }));
  };

  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">新規インターンシップの作成</h1>
        <p className="text-gray-600">
          新しいインターンシップを掲載して、優秀な学生を見つけましょう。
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 基本情報 */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">基本情報</h2>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                インターンシップタイトル
              </label>
              <input
                type="text"
                id="title"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="例：フロントエンド開発インターン"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                説明
              </label>
              <textarea
                id="description"
                rows={4}
                required
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="インターンシップの内容について説明してください..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  勤務地
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="location"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="例：東京都渋谷区"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="workType" className="block text-sm font-medium text-gray-700">
                  勤務形態
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="workType"
                    required
                    value={formData.workType}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      workType: e.target.value,
                      isRemote: e.target.value === 'remote'
                    }))}
                    className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="onsite">オフィスワークのみ</option>
                    <option value="remote">リモートワークのみ</option>
                    <option value="hybrid">ハイブリッド</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 期間とスケジュール */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">期間とスケジュール</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                開始日
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  id="startDate"
                  required
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                終了日
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  id="endDate"
                  required
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="hoursPerWeek" className="block text-sm font-medium text-gray-700">
                週間勤務時間
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Clock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  id="hoursPerWeek"
                  required
                  min="1"
                  max="40"
                  value={formData.hoursPerWeek}
                  onChange={(e) => setFormData(prev => ({ ...prev, hoursPerWeek: e.target.value }))}
                  className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="例：20"
                />
              </div>
            </div>

            <div>
              <label htmlFor="applicationDeadline" className="block text-sm font-medium text-gray-700">
                応募締切日
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  id="applicationDeadline"
                  required
                  value={formData.applicationDeadline}
                  onChange={(e) => setFormData(prev => ({ ...prev, applicationDeadline: e.target.value }))}
                  className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 給与 */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">給与</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="salaryAmount" className="block text-sm font-medium text-gray-700">
                給与額
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  id="salaryAmount"
                  required
                  min="0"
                  value={formData.salaryAmount}
                  onChange={(e) => setFormData(prev => ({ ...prev, salaryAmount: e.target.value }))}
                  className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="例：2000"
                />
              </div>
            </div>

            <div>
              <label htmlFor="salaryPeriod" className="block text-sm font-medium text-gray-700">
                支払い期間
              </label>
              <select
                id="salaryPeriod"
                required
                value={formData.salaryPeriod}
                onChange={(e) => setFormData(prev => ({ ...prev, salaryPeriod: e.target.value as 'hourly' | 'monthly' }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="hourly">時給</option>
                <option value="monthly">月給</option>
              </select>
            </div>
          </div>
        </div>

        {/* 応募要件 */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">応募要件</h2>
            <button
              type="button"
              onClick={() => addListItem(formData.requirements, () => {})}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <Plus className="h-4 w-4 mr-1" />
              要件を追加
            </button>
          </div>
          <div className="space-y-3">
            {formData.requirements.map((requirement, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={requirement}
                  onChange={(e) => updateListItem(index, e.target.value, 'requirements')}
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="応募要件を入力"
                />
                {formData.requirements.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeListItem(index, 'requirements')}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 職務内容 */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">職務内容</h2>
            <button
              type="button"
              onClick={() => addListItem(formData.responsibilities, () => {})}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <Plus className="h-4 w-4 mr-1" />
              職務を追加
            </button>
          </div>
          <div className="space-y-3">
            {formData.responsibilities.map((responsibility, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={responsibility}
                  onChange={(e) => updateListItem(index, e.target.value, 'responsibilities')}
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="職務内容を入力"
                />
                {formData.responsibilities.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeListItem(index, 'responsibilities')}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 必要なスキル */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">必要なスキル</h2>
            <button
              type="button"
              onClick={() => addListItem(formData.skills, () => {})}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <Plus className="h-4 w-4 mr-1" />
              スキルを追加
            </button>
          </div>
          <div className="space-y-3">
            {formData.skills.map((skill, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={skill}
                  onChange={(e) => updateListItem(index, e.target.value, 'skills')}
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="必要なスキルを入力"
                />
                {formData.skills.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeListItem(index, 'skills')}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 業界 */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">業界</h2>
          <div>
            <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
              業界を選択
            </label>
            <select
              id="industry"
              required
              value={formData.industry}
              onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">業界を選択してください</option>
              <option value="テクノロジー">テクノロジー</option>
              <option value="金融">金融</option>
              <option value="医療">医療</option>
              <option value="教育">教育</option>
              <option value="製造">製造</option>
              <option value="小売">小売</option>
              <option value="その他">その他</option>
            </select>
          </div>
        </div>

        {/* 送信ボタン */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/company/manage-internships')}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            キャンセル
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? '作成中...' : 'インターンシップを作成'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateInternship;