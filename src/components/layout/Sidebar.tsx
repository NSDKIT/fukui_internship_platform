import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { X, Home, Search, Briefcase, Users, MessageSquare, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const { user } = useAuth();
  
  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (open && window.innerWidth < 768) {
        const target = e.target as HTMLElement;
        if (!target.closest('#sidebar') && !target.closest('#sidebar-toggle')) {
          onClose();
        }
      }
    };
    
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [open, onClose]);

  // Prevent scrolling when sidebar is open on mobile
  useEffect(() => {
    if (open && window.innerWidth < 768) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const getLinkClasses = ({ isActive }: { isActive: boolean }) => {
    return `flex items-center px-4 py-3 text-gray-600 transition-colors duration-200 ${
      isActive 
        ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600 font-medium' 
        : 'hover:bg-blue-50'
    }`;
  };

  // Different navigation items based on user type
  const studentNavItems = [
    { to: '/student/dashboard', icon: <Home className="h-5 w-5 mr-3" />, label: 'Dashboard' },
    { to: '/student/search', icon: <Search className="h-5 w-5 mr-3" />, label: 'Find Internships' },
    { to: '/student/applications', icon: <Briefcase className="h-5 w-5 mr-3" />, label: 'My Applications' },
    { to: '/student/profile', icon: <User className="h-5 w-5 mr-3" />, label: 'Profile' },
    { to: '/messages', icon: <MessageSquare className="h-5 w-5 mr-3" />, label: 'Messages' },
  ];

  const companyNavItems = [
    { to: '/company/dashboard', icon: <Home className="h-5 w-5 mr-3" />, label: 'Dashboard' },
    { to: '/company/create-internship', icon: <Briefcase className="h-5 w-5 mr-3" />, label: 'Create Internship' },
    { to: '/company/manage-internships', icon: <Briefcase className="h-5 w-5 mr-3" />, label: 'Manage Internships' },
    { to: '/company/student-search', icon: <Users className="h-5 w-5 mr-3" />, label: 'Find Students' },
    { to: '/company/profile', icon: <User className="h-5 w-5 mr-3" />, label: 'Company Profile' },
    { to: '/messages', icon: <MessageSquare className="h-5 w-5 mr-3" />, label: 'Messages' },
  ];

  const navItems = user?.userType === 'student' ? studentNavItems : companyNavItems;

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside
        id="sidebar"
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-40 transition-transform duration-300 transform ${
          open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } pt-16`}
      >
        <div className="p-4 flex flex-col h-full">
          <div className="flex justify-between items-center mb-6 md:hidden">
            <h2 className="text-xl font-bold text-gray-800">Navigation</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <nav className="flex-1">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink to={item.to} className={getLinkClasses} onClick={() => window.innerWidth < 768 && onClose()}>
                    {item.icon}
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="mt-auto pt-4 border-t border-gray-200">
            <div className="px-4 py-2">
              <p className="text-sm text-gray-500">© 2025 InternMatch</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;