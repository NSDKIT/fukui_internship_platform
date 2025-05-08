import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Clock, CheckCircle, XCircle, Briefcase, ArrowUpRight, User, BookOpen, Building, MapPin, DollarSign } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Application, Internship, Scout } from '../../types';
import { supabase } from '../../lib/supabase';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [applications, setApplications] = useState<Application[]>([]);
  const [scouts, setScouts] = useState<Scout[]>([]);
  const [recommendedInternships, setRecommendedInternships] = useState<Internship[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch applications
        const { data: applicationsData, error: applicationsError } = await supabase
          .from('applications')
          .select('*')
          .eq('student_id', user?.id)
          .order('applied_at', { ascending: false });

        if (applicationsError) throw applicationsError;

        // Fetch scouts
        const { data: scoutsData, error: scoutsError } = await supabase
          .from('scouts')
          .select('*')
          .eq('student_id', user?.id)
          .order('created_at', { ascending: false });

        if (scoutsError) throw scoutsError;

        // Fetch recommended internships
        const { data: internshipsData, error: internshipsError } = await supabase
          .from('internships')
          .select('*')
          .eq('status', 'published')
          .order('created_at', { ascending: false })
          .limit(6);

        if (internshipsError) throw internshipsError;

        setApplications(applicationsData || []);
        setScouts(scoutsData || []);
        setRecommendedInternships(internshipsData || []);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err instanceof Error ? err.message : 'データの取得に失敗しました');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user?.id) {
      fetchData();
    }
  }, [user?.id]);

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
        return <XCircle className="h-5 w-5 text-red-500" />;
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          ようこそ、{user?.name}さん！
        </h1>
        <p className="text-gray-600">
          インターンシップの応募状況と機会の概要をご確認ください。
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
          <div className="flex items-center text-blue-600 mb-3">
            <Briefcase className="h-5 w-5 mr-2" />
            <h3 className="font-semibold">応募状況</h3>
          </div>
          <p className="text-3xl font-bold">{applications.length}</p>
          <p className="text-sm text-gray-600">応募したインターンシップ</p>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-6 border border-purple-100">
          <div className="flex items-center text-purple-600 mb-3">
            <User className="h-5 w-5 mr-2" />
            <h3 className="font-semibold">面接</h3>
          </div>
          <p className="text-3xl font-bold">{applications.filter(app => app.status === 'interview').length}</p>
          <p className="text-sm text-gray-600">現在面接段階</p>
        </div>
        
        <div className="bg-green-50 rounded-lg p-6 border border-green-100">
          <div className="flex items-center text-green-600 mb-3">
            <BookOpen className="h-5 w-5 mr-2" />
            <h3 className="font-semibold">新規オファー</h3>
          </div>
          <p className="text-3xl font-bold">{scouts.length}</p>
          <p className="text-sm text-gray-600">新着スカウトメッセージ</p>
        </div>
      </div>

      <div className="mb-10">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold text-gray-900">最近の応募</h2>
          <Link 
            to="/student/applications" 
            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
          >
            すべて見る
            <ArrowUpRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        
        {applications.length === 0 ? (
          <div className="bg-white rounded-lg border p-6 text-center">
            <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">応募履歴なし</h3>
            <p className="text-gray-600 mb-4">インターンシップを探して、興味のある機会に応募してみましょう。</p>
            <Link 
              to="/student/search" 
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              インターンシップを探す
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg border overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {applications.slice(0, 3).map(application => (
                <li key={application.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <Link to={`/internship/${application.internshipId}`} className="block p-4">
                    <div className="sm:flex sm:justify-between sm:items-center">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">
                          {application.internshipId}
                        </h3>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>応募日: {formatDate(application.appliedAt)}</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 sm:mt-0 flex items-center">
                        <div className="flex items-center">
                          {getStatusIcon(application.status)}
                          <span className="ml-2 text-sm font-medium">
                            {getStatusText(application.status)}
                          </span>
                        </div>
                        <ArrowUpRight className="h-4 w-4 ml-3 text-gray-400" />
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="mb-10">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold text-gray-900">興味を持っている企業</h2>
        </div>
        
        {scouts.length === 0 ? (
          <div className="bg-white rounded-lg border p-6 text-center">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">スカウトなし</h3>
            <p className="text-gray-600 mb-4">
              プロフィールを完成させて、企業からの発見率を高めましょう。
            </p>
            <Link 
              to="/student/profile" 
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              プロフィールを更新
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg border overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {scouts.map(scout => (
                <li key={scout.id} className="p-4 hover:bg-gray-50 transition-colors duration-150">
                  <div className="sm:flex sm:items-start">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                      <Building className="h-6 w-6 text-gray-500" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between">
                        <h3 className="text-lg font-medium text-gray-900">
                          {scout.companyId}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {formatDate(scout.createdAt)}
                        </p>
                      </div>
                      
                      {scout.internshipId && (
                        <p className="text-sm font-medium text-blue-600 mt-1">
                          対象: {scout.internshipId}
                        </p>
                      )}
                      
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                        {scout.message}
                      </p>
                      
                      <div className="mt-3 flex gap-2">
                        <button className="inline-flex items-center justify-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                          詳細を見る
                        </button>
                        <button className="inline-flex items-center justify-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                          返信する
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div>
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold text-gray-900">おすすめのインターンシップ</h2>
          <Link 
            to="/student/search" 
            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
          >
            すべて見る
            <ArrowUpRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedInternships.map(internship => (
            <div key={internship.id} className="bg-white rounded-lg border overflow-hidden hover:shadow-md transition-shadow duration-200">
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <Building className="h-5 w-5 text-gray-500" />
                  </div>
                  <p className="text-sm font-medium text-gray-500">
                    {formatDate(internship.createdAt)}
                  </p>
                </div>
                
                <h3 className="text-lg font-medium text-gray-900 mt-3 mb-1">
                  {internship.title}
                </h3>
                <p className="text-sm text-gray-600">{internship.companyId}</p>
                
                <div className="mt-3 flex items-center text-sm text-gray-500">
                  <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                  <span>{internship.location}{internship.isRemote ? ' (リモート可)' : ''}</span>
                </div>
                
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-1 text-gray-400" />
                  <span>{internship.hoursPerWeek}時間/週</span>
                </div>
                
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <DollarSign className="h-4 w-4 mr-1 text-gray-400" />
                  <span>¥{internship.salaryAmount}/{internship.salaryPeriod === 'hourly' ? '時間' : '月'}</span>
                </div>
                
                <div className="mt-4 flex flex-wrap gap-2">
                  {internship.skills.slice(0, 3).map((skill, index) => (
                    <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {skill}
                    </span>
                  ))}
                </div>
                
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <Link
                    to={`/internship/${internship.id}`}
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    詳細を見る
                  </Link>
                  <Link
                    to={`/internship/${internship.id}`}
                    className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    応募する
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;