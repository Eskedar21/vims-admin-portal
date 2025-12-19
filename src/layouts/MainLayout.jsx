import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getNavForRole, ROLES, mapRoleIdToNavRole } from '../config/navConfig';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

// Icons
const ICONS = {
  home: (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  'clipboard-list': (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  ),
  'chart-bar': (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  building: (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  'shield-check': (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  activity: (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  settings: (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  users: (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  chevronDown: (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  ),
  logout: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  bell: (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  ),
  user: (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="4" />
      <path strokeLinecap="round" d="M4 21c0-3.866 3.582-7 8-7s8 3.134 8 7" />
    </svg>
  ),
  'dollar-sign': (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  'file-text': (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
};

// Sync status badge
const SyncBadge = ({ status }) => {
  const config = {
    online: { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500', label: 'Online' },
    offline: { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500', label: 'Offline' },
    syncing: { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500 animate-pulse', label: 'Syncing...' },
  };
  const s = config[status] || config.online;
  return (
    <div className={`flex items-center gap-1.5 px-2 py-1 rounded ${s.bg}`}>
      <span className={`w-2 h-2 rounded-full ${s.dot}`} />
      <span className={`text-xs font-medium ${s.text}`}>{s.label}</span>
    </div>
  );
};

function MainLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout: handleLogout } = useAuth();
  const { notifications, unreadCount, markAllAsRead } = useNotifications();
  const [syncStatus] = useState('online');
  const [showNotifications, setShowNotifications] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Get user role from user object and map to navigation role
  const userRole = user?.roleId ? mapRoleIdToNavRole(user.roleId) : ROLES.ADMIN;
  const navItems = getNavForRole(userRole);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        navigate('/');
      }
      if (e.ctrlKey && e.key === 'b') {
        e.preventDefault();
        setSidebarCollapsed(!sidebarCollapsed);
      }
      if (e.key === 'Escape') {
        setShowNotifications(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, sidebarCollapsed]);

  const toggleMenu = (id) => {
    setExpandedMenus(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#F4F6F5' }}>
      {/* Left Sidebar */}
      <aside 
        className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 shadow-sm z-40 flex flex-col transition-all duration-300 ${
          sidebarCollapsed ? 'w-16' : 'w-60'
        }`}
      >
        {/* Logo */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-gray-100">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex items-center gap-2 hover:opacity-80 transition"
          >
            {!sidebarCollapsed && (
              <div className="flex flex-col leading-tight">
                <span className="text-xl font-bold tracking-tight text-[#009639]">VIS</span>
                <span className="text-[9px] text-gray-500 -mt-0.5">
                  powered by <span className="font-semibold text-[#007A2F]">Ethiotelecom</span>
                </span>
              </div>
            )}
            {sidebarCollapsed && (
              <span className="text-xl font-bold text-[#009639]">V</span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1 rounded hover:bg-gray-100 text-gray-400"
            title="Toggle sidebar (Ctrl+B)"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {sidebarCollapsed ? (
                <path d="M13 17l5-5-5-5M6 17l5-5-5-5" />
              ) : (
                <path d="M11 17l-5-5 5-5M18 17l-5-5 5-5" />
              )}
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.route || location.pathname.startsWith(item.route + '/');
            const hasChildren = item.children && item.children.length > 0;
            const isExpanded = expandedMenus[item.id];

            return (
              <div key={item.id} className="mb-1">
                <button
                  type="button"
                  onClick={() => {
                    if (hasChildren) {
                      toggleMenu(item.id);
                    } else {
                      navigate(item.route);
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                    isActive && !hasChildren
                      ? 'bg-[#009639] text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  title={sidebarCollapsed ? item.label : ''}
                >
                  <span className={isActive && !hasChildren ? 'text-white' : 'text-gray-500'}>
                    {ICONS[item.icon]}
                  </span>
                  {!sidebarCollapsed && (
                    <>
                      <span className="flex-1 text-left">{item.label}</span>
                      {hasChildren && (
                        <span className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                          {ICONS.chevronDown}
                        </span>
                      )}
                    </>
                  )}
                </button>

                {/* Submenu */}
                {hasChildren && isExpanded && !sidebarCollapsed && (
                  <div className="ml-4 mt-1 pl-4 border-l border-gray-200">
                    {item.children.map((child) => {
                      const isChildActive = location.pathname === child.route || location.pathname.startsWith(child.route + '/');
                      return (
                        <button
                          key={child.id}
                          type="button"
                          onClick={() => navigate(child.route)}
                          className={`w-full text-left px-3 py-2 text-sm rounded-lg transition ${
                            isChildActive
                              ? 'bg-[#009639]/10 text-[#009639] font-medium'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {child.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-gray-100">
          {!sidebarCollapsed && <SyncBadge status={syncStatus} />}
          <button
            type="button"
            onClick={() => {
              handleLogout();
              navigate('/login');
            }}
            className={`mt-3 w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 rounded-lg border border-red-200 hover:bg-red-50 transition ${
              sidebarCollapsed ? 'justify-center' : ''
            }`}
            title="Logout"
          >
            {ICONS.logout}
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-60'}`}>
        {/* Top Bar */}
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-30">
          {/* Breadcrumb / Page Title */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400">VIS</span>
            <span className="text-gray-300">/</span>
            <span className="font-medium text-gray-700 capitalize">
              {location.pathname.split('/')[1] || 'Dashboard'}
            </span>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg hover:bg-gray-100 transition text-gray-500"
                title="Notifications"
              >
                {ICONS.bell}
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="p-3 border-b border-gray-100 flex items-center justify-between">
                    <p className="font-semibold text-sm text-gray-700">Notifications</p>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-sm text-gray-500">
                        No notifications
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div key={n.id} className="px-3 py-2 hover:bg-gray-50 text-sm text-gray-600 border-b border-gray-50">
                          {n.title || n.message}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className="w-8 h-8 rounded-full bg-[#009639]/10 flex items-center justify-center text-[#009639]">
                {ICONS.user}
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-700">{user?.name ?? 'Admin'}</p>
                <p className="text-[10px] text-gray-400">{user?.role ?? 'Administrator'}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>

        {/* Footer */}
        <footer className="h-10 bg-white border-t border-gray-200 flex items-center justify-between px-6 text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span>v1.0.0 (Admin Portal)</span>
            <span>•</span>
            <span>Production</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Last Sync: Just now</span>
            <span>•</span>
            <span>Ctrl+B: Toggle Sidebar</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default MainLayout;


