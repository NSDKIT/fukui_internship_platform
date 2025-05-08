import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Building, GraduationCap, Filter, Star, Mail } from 'lucide-react';

const StudentSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState('');
  const [selectedMajor, setSelectedMajor] = useState('');
  const [selectedGradYear, setSelectedGradYear] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Mock data for demonstration
  const students = [
    {
      id: 's1',
      name: '田中 優希',
      university: '東京大学',
      major: '情報工学',
      graduationYear: 2025,
      location: '東京',
      skills: ['React', 'TypeScript', 'Node.js'],
      bio: 'Web開発に情熱を持ち、ユーザーフレンドリーなインターフェースの作成を得意としています...',
    },
    // Add more mock students as needed
  ];

  const universities = [
    '東京大学',
    '京都大学',
    '大阪大学',
    '早稲田大学',
    '慶應義塾大学',
  ];

  const majors = [
    '情報工学',
    '経営学',
    '工学',
    'デザイン',
    'マーケティング',
  ];

  const gradYears = ['2024', '2025', '2026', '2027'];

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesUniversity = !selectedUniversity || student.university === selectedUniversity;
    const matchesMajor = !selectedMajor || student.major === selectedMajor;
    const matchesGradYear = !selectedGradYear || student.graduationYear.toString() === selectedGradYear;

    return matchesSearch && matchesUniversity && matchesMajor && matchesGradYear;
  });

  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">優秀な学生を見つける</h1>
        <p className="text-gray-600">
          インターンシップの要件に合った学生を検索し、コンタクトを取ることができます。
        </p>
      </div>

      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="名前やスキルで検索"
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
                <label className="block text-sm font-medium text-gray-700 mb-1">大学</label>
                <select
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 pl-3 pr-10 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={selectedUniversity}
                  onChange={(e) => setSelectedUniversity(e.target.value)}
                >
                  <option value="">すべての大学</option>
                  {universities.map(uni => (
                    <option key={uni} value={uni}>{uni}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">専攻</label>
                <select
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 pl-3 pr-10 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={selectedMajor}
                  onChange={(e) => setSelectedMajor(e.target.value)}
                >
                  <option value="">すべての専攻</option>
                  {majors.map(major => (
                    <option key={major} value={major}>{major}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">卒業年度</label>
                <select
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 pl-3 pr-10 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={selectedGradYear}
                  onChange={(e) => setSelectedGradYear(e.target.value)}
                >
                  <option value="">すべての年度</option>
                  {gradYears.map(year => (
                    <option key={year} value={year}>{year}年</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map((student) => (
          <div key={student.id} className="bg-white rounded-lg border hover:shadow-md transition-shadow duration-200">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-lg">
                    {student.name.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">{student.name}</h3>
                    <p className="text-sm text-gray-600">{student.location}</p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-yellow-500">
                  <Star className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center text-gray-600">
                  <GraduationCap className="h-4 w-4 mr-2" />
                  <span>{student.university}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Building className="h-4 w-4 mr-2" />
                  <span>{student.major}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{student.graduationYear}年卒業予定</span>
                </div>
              </div>

              <p className="mt-4 text-sm text-gray-600 line-clamp-2">
                {student.bio}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {student.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <div className="mt-6 flex justify-between">
                <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  プロフィールを見る
                </button>
                <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                  <Mail className="h-4 w-4 mr-1" />
                  連絡する
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredStudents.length === 0 && (
          <div className="col-span-full text-center py-12 bg-white rounded-lg border">
            <Search className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">該当する学生が見つかりません</h3>
            <p className="mt-1 text-gray-500">
              検索条件やフィルターを調整して、より多くの学生を見つけてください。
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentSearch;