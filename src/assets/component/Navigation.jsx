import { NavLink } from 'react-router-dom';
import { Users, BookOpen, Calendar, FileText, Settings, BarChart3, User, X } from 'lucide-react';

const Navigation = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const navItems = [
    { id: 'dashboard', label: 'القائمة الرئيسية', icon: BarChart3, path: '/' },
    { id: 'students', label: 'شئون الطلاب', icon: Users, path: '/students' },
    { id: 'staff', label: 'شئون العاملين', icon: BookOpen, path: '/staff' },
    { id: 'schedule', label: 'الجدول المدرسي', icon: Calendar, path: '/schedule' },
    { id: 'inventory', label: 'العهد والمخازن', icon: FileText, path: '/inventory' },
    { id: 'contact', label: 'التواصل والاعلام', icon: User, path: '/contact' },
    { id: 'settings', label: 'الاعدادات', icon: Settings, path: '/settings' }
  ];

  return (
    <>
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden ltr:text-left rtl:text-right" 
          onClick={() => setIsMobileMenuOpen(false)} 
        />
      )}
      
      <div className={`fixed right-0 top-0 h-full w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white transform transition-transform duration-300 ease-in-out z-50 lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 border-b border-blue-700">
          <div className="flex items-center justify-between">
            <NavLink 
              to="/" 
              className="flex items-center space-x-3"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-900" />
              </div>
              <div>
                <h1 className="text-xl font-bold">مدرستي ذكية</h1>
                <p className="text-blue-200 text-sm">نظام إدارة المدارس</p>
              </div>
            </NavLink>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden text-white hover:text-blue-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <nav className="mt-6 ltr:ml-4 rtl:mr-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.id}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) => 
                  `w-full flex items-center space-x-3 px-6 py-3 text-left hover:bg-blue-700 transition-colors ${
                    isActive ? 'bg-blue-700 border-r-4 border-white' : ''
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default Navigation;