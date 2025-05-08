import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building, MapPin, Clock, DollarSign, Plus, Eye, User, Filter } from 'lucide-react';
import { Internship, Application } from '../../types';
import { supabase } from '../../lib/supabase';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const ManageInternships: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [internships, setInternships] = useState<Internship[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch internships
        const { data: internshipsData, error: internshipsError } = await supabase
          .from('internships')
          .select('*')
          .order('created_at', { ascending: false });

        if (internshipsError) {
          throw internshipsError;
        }

        // Fetch applications for these internships
        if (internshipsData && internshipsData.length > 0) {
          const { data: applicationsData, error: applicationsError } = await supabase
            .from('applications')
            .select('*')
            .in('internship_id', internshipsData.map(i => i.id));

          if (applicationsError) {
            throw applicationsError;
          }

          setApplications(applicationsData || []);
        }

        setInternships(internshipsData || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'データの取得に失敗しました');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getApplicationsForInternship = (internshipId: string) => {
    return applications.filter(app => app.internshipId === internshipId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const filteredInternships = internships.filter(internship => {
    if (selectedFilter === 'all') return true;
    return internship.status === selectedFilter;
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">インターンシップ管理</h1>
          <p className="text-gray-600">
            インターンシップの掲載と応募者の管理ができます。
          </p>
        </div>
        <Link
          to="/company/create-internship"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          新規インターンシップを作成
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
          {error}
        </div>
      )}

      <div className="mb-6">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <Filter className="h-5 w-5 mr-2" />
          フィルター
        </button>

        {showFilters && (
          <div className="mt-4 p-4 bg-white rounded-lg border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ステータス</label>
                <select
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 pl-3 pr-10 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                >
                  <option value="all">すべて</option>
                  <option value="published">公開中</option>
                  <option value="draft">下書き</option>
                  <option value="closed">終了</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {filteredInternships.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border">
            <Building className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">インターンシップがありません</h3>
            <p className="mt-1 text-gray-500">
              最初のインターンシップを作成してみましょう。
            </p>
            <div className="mt-6">
              <Link
                to="/company/create-internship"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-5 w-5 mr-2" />
                新規インターンシップを作成
              </Link>
            </div>
          </div>
        ) : (
          filteredInternships.map((internship) => {
            const internshipApplications = getApplicationsForInternship(internship.id);
            
            return (
              <div key={internship.id} className="bg-white rounded-lg border overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-1">
                        {internship.title}
                      </h2>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{internship.location}</span>
                        {internship.isRemote && (
                          <span className="ml-2 text-green-600">(リモート可)</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/internship/${internship.id}`}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        表示
                      </Link>
                      <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                        編集
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">応募数</h3>
                      <p className="mt-1 text-lg font-semibold text-gray-900">
                        {internshipApplications.length}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">応募締切</h3>
                      <p className="mt-1 text-lg font-semibold text-gray-900">
                        {formatDate(internship.applicationDeadline)}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">ステータス</h3>
                      <p className="mt-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          internship.status === 'published'
                            ? 'bg-green-100 text-green-800'
                            : internship.status === 'draft'
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {internship.status === 'published' ? '公開中' : internship.status === 'draft' ? '下書き' : '終了'}
                        </span>
                      </p>
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

                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">最近の応募</h3>
                    {internshipApplications.length > 0 ? (
                      <div className="space-y-3">
                        {internshipApplications.slice(0, 3).map((application) => (
                          <div
                            key={application.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                <User className="h-4 w-4 text-gray-500" />
                              </div>
                              <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900">学生名</p>
                                <p className="text-xs text-gray-500">
                                  応募日: {formatDate(application.appliedAt)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100">
                                確認する
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">まだ応募はありません</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ManageInternships;