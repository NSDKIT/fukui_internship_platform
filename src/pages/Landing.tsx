import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, BookOpen, Building, Search, Heart, Award, Clock, DollarSign } from 'lucide-react';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-500 text-white py-20 md:py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                学生とインターンシップを繋ぐプラットフォーム
              </h1>
              <p className="text-lg md:text-xl opacity-90">
                キャリア目標に合った理想のインターンシップを見つけるか、貴社に最適な学生を見つけましょう。
              </p>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                <Link 
                  to="/register" 
                  className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-medium text-center transition-colors duration-200"
                >
                  無料会員登録
                </Link>
                <Link 
                  to="/login" 
                  className="border border-white text-white hover:bg-white/10 px-6 py-3 rounded-lg font-medium text-center transition-colors duration-200"
                >
                  ログイン
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <img 
                src="https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="学生とプロフェッショナルのコラボレーション" 
                className="rounded-lg shadow-lg object-cover h-80 w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">ご利用の流れ</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              シンプルで効率的なプロセスを通じて、大学生と企業をマッチングします。
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* For Students */}
            <div className="bg-blue-50 rounded-lg p-6 transition-transform duration-300 hover:transform hover:-translate-y-2">
              <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">学生の方</h3>
              <p className="text-gray-600 mb-4">プロフィールを作成し、スキルに合ったインターンシップに直接応募できます。</p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-600">プロフィール作成</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-600">関連インターンシップへの応募</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-600">企業からのメッセージ受信</span>
                </li>
              </ul>
            </div>
            
            {/* For Companies */}
            <div className="bg-blue-50 rounded-lg p-6 transition-transform duration-300 hover:transform hover:-translate-y-2">
              <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <Building className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">企業の方</h3>
              <p className="text-gray-600 mb-4">インターンシップを掲載し、優秀な学生を見つけ、採用プロセスを管理できます。</p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-600">インターンシップの掲載</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-600">学生データベースの検索</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-600">応募状況の追跡</span>
                </li>
              </ul>
            </div>
            
            {/* Find Matches */}
            <div className="bg-blue-50 rounded-lg p-6 transition-transform duration-300 hover:transform hover:-translate-y-2">
              <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <Search className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">マッチング</h3>
              <p className="text-gray-600 mb-4">インテリジェントなマッチングアルゴリズムで、最適な学生と企業を結びつけます。</p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-600">高度な検索フィルター</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-600">スキルベースのマッチング</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-600">ダイレクトメッセージ機能</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">InternMatchの特徴</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              質の高いインターンシップを通じて、学生と企業の意味のある出会いを創出します。
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Heart className="h-10 w-10 text-red-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-800">最適なマッチング</h3>
              <p className="text-gray-600">インテリジェントなマッチングシステムで、学生と企業の最適な組み合わせを見つけます。</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Award className="h-10 w-10 text-amber-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-800">検証済みの機会</h3>
              <p className="text-gray-600">すべてのインターンシップは、価値ある学習機会を提供することを確認しています。</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Clock className="h-10 w-10 text-green-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-800">効率的なプロセス</h3>
              <p className="text-gray-600">直感的なインターフェースで、学生と企業の時間を節約します。</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <DollarSign className="h-10 w-10 text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-800">有給インターンシップ</h3>
              <p className="text-gray-600">学生の時間と貢献を評価する、有給のインターンシップを重視しています。</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">成功事例</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              プラットフォームを通じて成功を収めた学生と企業の声をご紹介します。
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl mr-4">
                  田
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">田中 優希</h4>
                  <p className="text-gray-600 text-sm">情報工学専攻</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "InternMatchを通じて、私のキャリア目標に完璧にマッチするテック企業でのインターンシップを見つけることができました。応募プロセスもスムーズで、自分のプロジェクトやスキルを効果的にアピールできました。"
              </p>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl mr-4">
                  テ
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">テックノバ株式会社</h4>
                  <p className="text-gray-600 text-sm">ソフトウェア開発企業</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "InternMatchを通じて素晴らしい人材と出会うことができました。プラットフォームのおかげで、必要なスキルを持つ学生を簡単に見つけることができ、採用プロセスも大幅に効率化されました。"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">理想のマッチングを見つける準備はできましたか？</h2>
          <p className="text-xl opacity-90 mb-8">
            すでに多くの学生と企業が理想のマッチングを見つけています。
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link 
              to="/register" 
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              はじめる
            </Link>
            <Link 
              to="/login" 
              className="border border-white text-white hover:bg-white/10 px-8 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              詳しく見る
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Briefcase className="h-6 w-6 text-blue-400 mr-2" />
                <span className="text-white font-bold text-lg">InternMatch</span>
              </div>
              <p className="text-sm text-gray-400 mb-4">
                2025年から、大学生と質の高い有給インターンシップを繋いでいます。
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">学生の方</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-blue-400 transition-colors duration-200">インターンシップを探す</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors duration-200">プロフィール作成</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors duration-200">キャリアリソース</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors duration-200">成功事例</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">企業の方</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-blue-400 transition-colors duration-200">インターンシップを掲載</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors duration-200">学生を探す</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors duration-200">採用ツール</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors duration-200">成功事例</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">企業情報</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-blue-400 transition-colors duration-200">会社概要</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors duration-200">ブログ</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors duration-200">お問い合わせ</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors duration-200">プライバシーポリシー</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>© 2025 InternMatch. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;