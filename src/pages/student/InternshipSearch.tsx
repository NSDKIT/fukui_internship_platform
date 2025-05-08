import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Building, Clock, DollarSign, Filter, X } from 'lucide-react';

const InternshipSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [industry, setIndustry] = useState('');
  const [isRemote, setIsRemote] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Mock data for demonstration
  const internships = [
    {
      id: '1',
      title: 'フロントエンド開発インターン',
      company: 'テックコープ',
      location: '東京',
      isRemote: true,
      salary: '¥2000/時間',
      deadline: '2025-04-01',
      description: '当社の開発チームに参加し、フロントエンド開発インターンとして...',
      skills: ['React', 'TypeScript', 'CSS'],
      industry: 'テクノロジー'
    },
    {
      id: '2',
      title: 'マーケティングインターン',
      company: 'グローバルブランド',
      location: '大阪',
      isRemote: false,
      salary: '¥1800/時間',
      deadline: '2025-03-15',
      description: 'マーケティング戦略の開発と実施をサポート...',
      skills: ['SNSマーケティング', 'コンテンツ作成', '分析'],
      industry: 'マーケティング'
    },
  ];

  const industries = [
    'テクノロジー',
    'マーケティング',
    '金融',
    '医療',
    '教育',
    '製造',
    'デザイン',
    '研究'
  ];

  const locations = [
    '東京',
    '大阪',
    '京都',
    '福岡',
    '札幌',
    '名古屋',
    '横浜'
  ];

  const filteredInternships = internships.filter(internship => {
    const matchesSearch = internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         internship.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         internship.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLocation = !location || internship.location === location;
    const matchesIndustry = !industry || internship.industry === industry;
    const matchesRemote = !isRemote || internship.isRemote;

    return matchesSearch && matchesLocation && matchesIndustry && matchesRemote;
  });

  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">理想のインターンシップを見つける</h1>
        <p className="text-gray-600">
          あなたのスキルと興味に合った数百のインターンシップ機会から探すことができます。
        </p>
      </div>

      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="タイトル、企業名、またはキーワードで検索"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Filter className="h-5 w-5 mr-2" />
            フィルター
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">勤務地</label>
                <select
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 pl-3 pr-10 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                >
                  <option value="">すべての勤務地</option>
                  {locations.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">業界</label>
                <select
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 pl-3 pr-10 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                >
                  <option value="">すべての業界</option>
                  {industries.map(ind => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">勤務形態</label>
                <div className="flex items-center mt-2">
                  <input
                    type="checkbox"
                    id="remote"
                    checked={isRemote}
                    onChange={(e) => setIsRemote(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remote" className="ml-2 text-sm text-gray-700">
                    リモート可
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {filteredInternships.map((internship) => (
          <div key={internship.id} className="bg-white rounded-lg border hover:shadow-md transition-shadow duration-200">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">
                    {internship.title}
                  </h2>
                  <div className="flex items-center text-gray-600 mb-4">
                    <Building className="h-4 w-4 mr-1" />
                    <span>{internship.company}</span>
                  </div>
                </div>
                <Link
                  to={`/internship/${internship.id}`}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  詳細を見る
                </Link>
              </div>

              <p className="text-gray-600 mb-4 line-clamp-2">
                {internship.description}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                  <span>{internship.location}</span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-1 text-gray-400" />
                  <span>{internship.salary}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-gray-400" />
                  <span>締切: {new Date(internship.deadline).toLocaleDateString('ja-JP')}</span>
                </div>
                {internship.isRemote && (
                  <div className="flex items-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      リモート可
                    </span>
                  </div>
                )}
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
            </div>
          </div>
        ))}

        {filteredInternships.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border">
            <Search className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">検索結果なし</h3>
            <p className="mt-1 text-gray-500">
              検索条件やフィルターを調整して、より多くの機会を見つけてください。
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InternshipSearch;