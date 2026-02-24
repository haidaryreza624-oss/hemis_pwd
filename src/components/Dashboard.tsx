import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Calendar, User, Settings as SettingsIcon, LogOut } from 'lucide-react';
import { motion } from 'motion/react';
import { useSettings, getPrimaryColor } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';

export default function DashboardLayout() {
  const location = useLocation();
  const { color } = useSettings();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'نتایج' },
    { path: '/dashboard/score', icon: FileText, label: 'نمرات' },
    { path: '/dashboard/schedule', icon: Calendar, label: 'تقسیم اوقات' },
    { path: '/dashboard/profile', icon: User, label: 'پروفایل' },
    { path: '/dashboard/settings', icon: SettingsIcon, label: 'تنظیمات' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300" dir="rtl">
      <div className="max-w-md mx-auto min-h-screen bg-white dark:bg-slate-950 shadow-2xl relative transition-colors duration-300">
        {/* Header */}
        <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-20 px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <h1 className={`text-xl font-bold ${getPrimaryColor(color)}`}>پیوند</h1>
            <button onClick={handleLogout} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors">
              <LogOut size={20} />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="relative">
          <Outlet />
        </main>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pb-safe">
          <div className="max-w-md mx-auto flex justify-around items-center px-2 py-3">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/dashboard'}
                  className="relative flex flex-col items-center p-2 flex-1"
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.div
                          layoutId="nav-pill"
                          className={`absolute -top-3 w-8 h-1 rounded-full ${getPrimaryColor(color).replace('text-', 'bg-')}`}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                      <Icon
                        size={24}
                        className={`transition-colors duration-200 ${isActive ? getPrimaryColor(color) : 'text-slate-400 dark:text-slate-500'}`}
                        strokeWidth={isActive ? 2.5 : 2}
                      />
                      <span className={`text-[10px] mt-1 font-medium transition-colors duration-200 ${isActive ? getPrimaryColor(color) : 'text-slate-400 dark:text-slate-500'}`}>
                        {item.label}
                      </span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
