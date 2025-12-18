import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";
import { Bell, AlertTriangle, MapPin, X } from "lucide-react";

function Header() {
  const { user } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);

  const getNotificationIcon = (type) => {
    switch (type) {
      case "geofence":
        return <MapPin className="h-4 w-4 text-red-600" />;
      case "vehicle_presence":
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "geofence":
        return "bg-red-50 border-red-200";
      case "vehicle_presence":
        return "bg-orange-50 border-orange-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 shadow-sm flex items-center justify-between px-8 flex-shrink-0">
      {/* Page Title - Left */}
      <div className="text-sm font-semibold text-gray-800">
        Vehicle Inspection Management System – Admin
      </div>
      
      {/* User/Language Controls - Right */}
      <div className="flex items-center gap-5">
        {/* Notifications */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg hover:bg-gray-100 transition text-gray-600"
            title="Notifications"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </button>
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <div className="p-3 border-b border-gray-100 flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-700">Notifications</p>
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
                    <div
                      key={n.id}
                      className={`px-3 py-3 hover:bg-gray-50 border-b border-gray-50 ${!n.read ? getNotificationColor(n.type) : ""}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">{getNotificationIcon(n.type)}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{n.title}</p>
                          <p className="text-xs text-gray-600 mt-1">{n.message}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(n.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <button
                          onClick={() => removeNotification(n.id)}
                          className="p-1 hover:bg-gray-200 rounded transition"
                        >
                          <X className="h-3 w-3 text-gray-400" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 border border-gray-300 rounded-full px-2 py-1 bg-white shadow-sm">
          <button className="px-3 py-1 rounded-full bg-gray-900 text-white text-xs font-medium">
            EN
          </button>
          <button className="px-3 py-1 rounded-full text-xs text-gray-600 hover:bg-gray-100 transition-colors">
            አማ
          </button>
        </div>
        <div className="flex items-center gap-3 pl-5 border-l border-gray-200">
          <div className="h-9 w-9 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-semibold">
            {user?.name?.[0] ?? "A"}
          </div>
          <div className="leading-tight hidden sm:block">
            <p className="text-sm font-semibold text-gray-900">
              {user?.name ?? "Super Admin"}
            </p>
            <p className="text-xs text-gray-500">{user?.role ?? "Super Administrator"}</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;


