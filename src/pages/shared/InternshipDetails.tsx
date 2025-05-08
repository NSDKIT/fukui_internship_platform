import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Building, Clock, DollarSign, Calendar, Users, Globe, ChevronRight, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Internship } from '../../types';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const InternshipDetails: React.FC = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [internship, setInternship] = useState<Internship | null>(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock data for demonstration
  React.useEffect(() => {
    const fetchInternship = async () => {
      try {
        // Simulate API call
        const mockInternship: Internship = {
          id: '101',
          companyId: 'c1',
          title: 'フロントエンド開発インターン',
          description: '当社の開発チームに参加し、フロントエンド開発インターンとして活動していただきます。シニア開発者と密接に協力しながら、ReactとTypeScriptを使用したモダンなWebアプリケーションの構築とメンテナンスを行います。これは急成長中のスタートアップ環境で実践的な経験を積む絶好の機会です。',
          requirements: [
            '情報工学または関連分野を専攻中の学生',
            'HTML、CSS、JavaScriptの基本的な理解',
            'Reactとモダンなフロントエンド開発手法への理解',
            '優れた問題解決能力と細部への注意力',
            '個人作業とチーム作業の両方が可能な方',
            'バージョン管理システム（Git）の基本的な理解'
          ],
          responsibilities: [
            'ReactとTypeScriptを使用したフロントエンドコンポーネントの開発とメンテナンス',
            'デザインチームと協力してユーザーインターフェースを実装',
            'クリーンで保守可能な効率的なコードの作成',
            'コードレビューとチームミーティングへの参加',
            'バグの特定と修正',
            'コードと開発プロセスのドキュメント化'
          ],
          location: '東京',
          isRemote: true,
          salary: {
            amount: 2000,
            period: 'hourly'
          },
          startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString(),
          hoursPerWeek: 20,
          applicationDeadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          industry: 'テクノロジー',
          skills: ['React', 'TypeScript', 'HTML', 'CSS', 'Git', 'REST APIs'],
          status: 'published',
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        };

        // Simulate loading delay
        setTimeout(() => {
          setInternship(mockInternship);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('インターンシップの取得に失敗:', error);
        setIsLoading(false);
      }
    };

    fetchInternship();
  }, [id]);

  const handleApply = async () => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setHasApplied(true);
    } catch (error) {
      console.error('インターンシップへの応募に失敗:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!internship) {
    return (
      <div className="py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">インターンシップが見つかりません</h1>
            <p className="mt-2 text-gray-600">
              お探しのインターンシップは存在しないか、削除された可能性があります。
            </p>
            <Link
              to="/student/search"
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              インターンシップを探す
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* パンくずリスト */}
        <nav className="flex mb-8" aria-label="パンくずリスト">
          <ol className="flex items-center space-x-2">
            <li>
              <Link to="/student/search" className="text-gray-500 hover:text-gray-700">
                インターンシップ一覧
              </Link>
            </li>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <li className="text-gray-900 font-medium truncate">
              {internship.title}
            </li>
          </ol>
        </nav>

        {/* ヘッダー */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {internship.title}
              </h1>
              <div className="flex items-center text-gray-600 mb-4">
                <Building className="h-5 w-5 mr-2" />
                <span className="font-medium">テックコープ株式会社</span>
              </div>
            </div>
            {user?.userType === 'student' && (
              <div>
                {hasApplied ? (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    <span className="font-medium">応募済み</span>
                  </div>
                ) : (
                  <button
                    onClick={handleApply}
                    disabled={isSubmitting}
                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                      isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? '応募中...' : '応募する'}
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="flex items-center text-gray-600">
              <MapPin className="h-5 w-5 mr-2 text-gray-400" />
              <span>{internship.location}</span>
              {internship.isRemote && (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  リモート可
                </span>
              )}
            </div>
            <div className="flex items-center text-gray-600">
              <DollarSign className="h-5 w-5 mr-2 text-gray-400" />
              <span>¥{internship.salary.amount}/{internship.salary.period === 'hourly' ? '時間' : '月'}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Clock className="h-5 w-5 mr-2 text-gray-400" />
              <span>{internship.hoursPerWeek}時間/週</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Calendar className="h-5 w-5 mr-2 text-gray-400" />
              <span>
                {formatDate(internship.startDate)} - {formatDate(internship.endDate)}
              </span>
            </div>
          </div>

          <div className="mt-6 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-red-500" />
            <span className="text-red-600 font-medium">
              応募締切: {formatDate(internship.applicationDeadline)}
            </span>
          </div>
        </div>

        {/* 説明 */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">インターンシップの概要</h2>
          <p className="text-gray-600 whitespace-pre-line">
            {internship.description}
          </p>
        </div>

        {/* 応募要件と職務内容 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">応募要件</h2>
            <ul className="space-y-3">
              {internship.requirements.map((requirement, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span className="text-gray-600">{requirement}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">職務内容</h2>
            <ul className="space-y-3">
              {internship.responsibilities.map((responsibility, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span className="text-gray-600">{responsibility}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* スキル */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">必要なスキル</h2>
          <div className="flex flex-wrap gap-2">
            {internship.skills.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* 応募ボタン */}
        {user?.userType === 'student' && !hasApplied && (
          <div className="bg-gray-50 border-t fixed bottom-0 left-0 right-0 p-4">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <button
                onClick={handleApply}
                disabled={isSubmitting}
                className={`w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? '応募中...' : 'このインターンシップに応募する'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InternshipDetails;