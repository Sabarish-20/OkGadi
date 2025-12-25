import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '../components/ui/sheet';
import { Badge } from '../components/ui/badge';
import {
  LayoutDashboard,
  Truck,
  Users,
  Route,
  TrendingUp,
  Bell,
  LogOut,
  Menu,
  Sun,
  Moon,
  Settings,
  PlusCircle
} from 'lucide-react';
import { mockAlerts } from '../mock/data';

const DashboardLayout = () => {
  const { user, logout, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadAlerts = mockAlerts.filter(a => !a.read).length;

  const adminNavItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: PlusCircle, label: 'Create Trip', path: '/trips/create' },
    { icon: Truck, label: 'Vehicles', path: '/vehicles' },
    { icon: Users, label: 'Drivers', path: '/drivers' },
    { icon: Route, label: 'Routes', path: '/routes' },
    { icon: TrendingUp, label: 'Analytics', path: '/analytics' },
    { icon: Bell, label: 'Alerts', path: '/alerts', badge: unreadAlerts }
  ];

  const userNavItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: PlusCircle, label: 'Book Trip', path: '/trips/create' },
    { icon: Truck, label: 'Vehicles', path: '/vehicles' },
    { icon: Users, label: 'Drivers', path: '/drivers' },
    { icon: Route, label: 'Routes', path: '/routes' },
    { icon: TrendingUp, label: 'Analytics', path: '/analytics' },
    { icon: Bell, label: 'Notifications', path: '/alerts', badge: unreadAlerts }
  ];

  const navItems = isAdmin ? adminNavItems : userNavItems;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const NavItem = ({ item, mobile = false }) => {
    const isActive = location.pathname === item.path;
    return (
      <button
        onClick={() => {
          navigate(item.path);
          if (mobile) setMobileMenuOpen(false);
        }}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 ${isActive
          ? 'bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-lg'
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
      >
        <div className="flex items-center space-x-3">
          <item.icon className="h-5 w-5" />
          <span className="font-medium">{item.label}</span>
        </div>
        {item.badge > 0 && (
          <Badge className="bg-orange-500 text-white">{item.badge}</Badge>
        )}
      </button>
    );
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-teal-600 rounded-xl">
              <Truck className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">OkGadi</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">AI Transport</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item, index) => (
            <NavItem key={index} item={item} />
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
          <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400">Logged in as</p>
            <p className="font-medium text-gray-900 dark:text-white truncate">{user?.name}</p>
            <Badge className="mt-1" variant="outline">
              {user?.role}
            </Badge>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Mobile Menu */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0">
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gradient-to-br from-blue-600 to-teal-600 rounded-xl">
                        <Truck className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h1 className="text-xl font-bold">OkGadi</h1>
                        <p className="text-xs text-gray-500">AI Transport</p>
                      </div>
                    </div>
                  </div>
                  <nav className="p-4 space-y-2">
                    {navItems.map((item, index) => (
                      <NavItem key={index} item={item} mobile />
                    ))}
                  </nav>
                </SheetContent>
              </Sheet>

              <div className="hidden lg:block">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {navItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
                </h2>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full"
              >
                {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="rounded-full text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;