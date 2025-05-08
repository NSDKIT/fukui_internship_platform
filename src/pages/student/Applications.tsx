import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Building, MapPin, DollarSign, CheckCircle, X, Eye, User, ChevronDown } from 'lucide-react';
import { Application, Internship } from '../../types';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const Applications: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [expandedApplication, setExpandedApplication] = useState<string | null>(null);

  // Mock data for demonstration
  const mockInternships: Record<string, Internship> = {
    '101': {
      id: '101',
      companyId: 'c1',
      title: 'フロントエンド開発インターン',
      description: '当社のチームに参加し、フロントエンド開発インターンとして...',
      requirements: ['React', 'JavaScript', 'CSS'],
      responsibilities: ['ユーザーインターフェースの構築', 'レスポンシブデザインの実装'],
      location: '東京',
      isRemote: false,
      salary: {
        amount: 20,
        period: 'hourly',
      },
      startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString(),
      hoursPerWeek: 20,
      applicationDeadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      industry: 'テクノロジー',
      skills: ['React', 'TypeScript', 'Tailwind CSS'],
      status: 'published',
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
    '102': {
      id: '102',
      companyId: 'c2',
      title: 'データアナリストインターン',
      description: 'データサイエンスチームと協力して...',
      requirements: ['Python', 'SQL', 'データ可視化'],
      responsibilities: ['ユーザーデータの分析', 'レポート作成'],
      location: '大阪',
      isRemote: true,
      salary: {
        amount: 25,
        period: 'hourly',
      },
      startDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 135 * 24 * 60 * 60 * 1000).toISOString(),
      hoursPerWeek: 15,
      applicationDeadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
      industry: '金融',
      skills: ['Python', 'SQL', 'Tableau'],
      status: 'published',
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    },
  };

  const mockCompanies: Record<string, { name: string; logoUrl?: string }> = {
    c1: { name: 'テックコープ株式会社' },
    c2: { name: 'データフロー・アナリティクス' },
  };

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        // Simulate API call
        const mockApplications: Application[] = [
          {
            id: 'a1',
            internshipId: '101',
            studentId: 's1',
            status: 'pending',
            appliedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 'a2',
            internshipId: '102',
            studentId: 's1',
            status: 'reviewing',
            appliedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          },
        ];

        // Simulate loading delay
        setTimeout(() => {
          setApplications(mockApplications);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('応募履歴の取得に失敗:', error);
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'reviewing':
        return <Eye className="h-5 w-5 text-blue-500" />;
      case 'interview':
        return <User className="h-5 w-5 text-purple-500" />;
      case 'accepted':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <X className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return '審査待ち';
      case 'reviewing':
        return '審査中';
      case 'interview':
        return '面接段階';
      case 'accepted':
        return '合格';
      case 'rejected':
        return '不合格';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'reviewing':
        return 'bg-blue-100 text-blue-800';
      case 'interview':
        return 'bg-purple-100 text-purple-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const filteredApplications = applications.filter(application => {
    if (selectedFilter === 'all') return true;
    return application.status === selectedFilter;
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">応募履歴</h1>
        <p className="text-gray-600">
          インターンシップへの応募状況を確認・管理できます。
        </p>
      </div>

      <div className="mb-6 flex justify-between items-center">
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              selectedFilter === 'all'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            すべて
          </button>
          <button
            onClick={() => setSelectedFilter('pending')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              selectedFilter === 'pending'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            審査待ち
          </button>
          <button
            onClick={() => setSelectedFilter('reviewing')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              selectedFilter === 'reviewing'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            審査中
          </button>
          <button
            onClick={() => setSelectedFilter('interview')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              selectedFilter === 'interview'
                ? 'bg-purple-100 text-purple-800'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            面接
          </button>
        </div>

        <Link
          to="/student/search"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          新規応募
        </Link>
      </div>

      <div className="space-y-4">
        {filteredApplications.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border">
            <Clock className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">応募履歴なし</h3>
            <p className="mt-1 text-gray-500">
              {selectedFilter === 'all'
                ? "まだインターンシップに応募していません。"
                : `${getStatusText(selectedFilter)}の応募はありません。`}
            </p>
            <div className="mt-6">
              <Link
                to="/student/search"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                インターンシップを探す
              </Link>
            </div>
          </div>
        ) : (
          filteredApplications.map((application) => {
            const internship = mockInternships[application.internshipId];
            const company = mockCompanies[internship.companyId];
            const isExpanded = expandedApplication === application.id;

            return (
              <div
                key={application.id}
                className="bg-white rounded-lg border overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-6">
                  <div className="sm:flex sm:items-center sm:justify-between">
                    <div className="sm:flex sm:items-center">
                      <div className="mb-4 sm:mb-0 sm:mr-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                          {company.logoUrl ? (
                            <img
                              src={company.logoUrl}
                              alt={company.name}
                              className="w-12 h-12 rounded-full"
                            />
                          ) : (
                            <Building className="h-6 w-6 text-gray-500" />
                          )}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {internship.title}
                        </h3>
                        <p className="text-sm text-gray-600">{company.name}</p>
                      </div>
                    </div>
                    <div className="mt-4 sm:mt-0 flex items-center">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          application.status
                        )}`}
                      >
                        {getStatusIcon(application.status)}
                        <span className="ml-2">{getStatusText(application.status)}</span>
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                      <span>
                        {internship.location}
                        {internship.isRemote && ' (リモート可)'}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                      <span>¥{internship.salary.amount}/{internship.salary.period === 'hourly' ? '時間' : '月'}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-gray-400" />
                      <span>応募日: {formatDate(application.appliedAt)}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {internship.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 flex justify-between items-center">
                    <button
                      onClick={() => setExpandedApplication(isExpanded ? null : application.id)}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
                    >
                      {isExpanded ? '閉じる' : '詳細を見る'}
                      <ChevronDown
                        className={`h-4 w-4 ml-1 transform transition-transform ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    <Link
                      to={`/internship/${internship.id}`}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      募集要項を見る
                    </Link>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-gray-900">応募の進捗状況</h4>
                          <div className="mt-2 space-y-2">
                            <div className="flex items-center text-sm text-gray-600">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              <span>応募日: {formatDate(application.appliedAt)}</span>
                            </div>
                            {application.status === 'reviewing' && (
                              <div className="flex items-center text-sm text-gray-600">
                                <Eye className="h-4 w-4 text-blue-500 mr-2" />
                                <span>審査開始日: {formatDate(application.updatedAt)}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-900">次のステップ</h4>
                          <p className="mt-1 text-sm text-gray-600">
                            {application.status === 'pending' &&
                              '応募書類を受け付けました。企業による審査をお待ちください。'}
                            {application.status === 'reviewing' &&
                              '現在、企業が応募書類を確認しています。追加情報を求められる場合があります。'}
                            {application.status === 'interview' &&
                              'おめでとうございます！企業が面接を希望しています。メールをご確認ください。'}
                            {application.status === 'accepted' &&
                              'おめでとうございます！応募が承認されました。'}
                            {application.status === 'rejected' &&
                              '申し訳ありませんが、今回は他の候補者が選ばれました。'}
                          </p>
                        </div>

                        <div className="flex space-x-3">
                          <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                            企業に連絡
                          </button>
                          <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                            応募内容を確認
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Applications;