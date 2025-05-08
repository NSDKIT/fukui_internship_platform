import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, Menu, MessageSquare, User, LogOut, Briefcase } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();

  // Change navbar style when scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeDropdown = () => setDropdownOpen(false);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${
        scrolled 
          ? 'bg-white shadow-md py-2' 
          : location.pathname === '/' && !isAuthenticated
            ? 'bg-transparent py-4' 
            : 'bg-white shadow py-3'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            {isAuthenticated && (
              <button 
                className="mr-2 md:hidden"
                onClick={onMenuClick}
                aria-label="メニューを開く"
              >
                <Menu className="h-6 w-6 text-gray-700" />
              </button>
            )}
            <Link to="/" className="flex items-center">
              <Briefcase className={`h-7 w-7 ${location.pathname === '/' && !scrolled && !isAuthenticated ? 'text-white' : 'text-blue-600'}`} />
              <span className={`ml-2 text-xl font-bold ${
                location.pathname === '/' && !scrolled && !isAuthenticated ? 'text-white' : 'text-gray-800'
              }`}>InternMatch</span>
            </Link>
          </div>

          <div className="flex items-center">
            {isAuthenticated ? (
              <>
                <Link 
                  to="/messages" 
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 mr-2"
                  aria-label="メッセージ"
                >
                  <MessageSquare className="h-5 w-5 text-gray-700" />
                </Link>
                
                <div className="relative mr-2">
                  <Link 
                    to="#" 
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                    aria-label="通知"
                  >
                    <Bell className="h-5 w-5 text-gray-700" />
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </Link>
                </div>
                
                <div className="relative ml-2">
                  <button
                    className="flex items-center focus:outline-none"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    aria-label="ユーザーメニューを開く"
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                      {user?.name ? (
                        <span className="text-sm font-medium text-gray-700">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      ) : (
                        <User className="h-5 w-5 text-gray-700" />
                      )}
                    </div>
                  </button>
                  
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5">
                      <div className="px-4 py-2 border-b">
                        <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      </div>
                      <Link
                        to={user?.userType === 'student' ? '/student/profile' : '/company/profile'}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={closeDropdown}
                      >
                        <User className="mr-2 h-4 w-4" />
                        プロフィール
                      </Link>
                      <button
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          closeDropdown();
                          logout();
                        }}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        ログアウト
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div>
                <Link 
                  to="/login" 
                  className={`mr-3 ${
                    location.pathname === '/' && !scrolled 
                      ? 'text-white hover:text-gray-200' 
                      : 'text-gray-800 hover:text-gray-600'
                  }`}
                >
                  ログイン
                </Link>
                <Link 
                  to="/register" 
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors duration-200"
                >
                  会員登録
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;