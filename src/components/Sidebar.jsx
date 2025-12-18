import { NavLink } from "react-router-dom";
import { LayoutDashboard, Activity, Car, Building2, FileText, Settings, Shield, Users } from "lucide-react";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/system-monitoring", label: "System Monitoring", icon: Activity },
  { to: "/inspection-operations", label: "Inspection Operations", icon: Car },
  { to: "/center-management", label: "Center Management", icon: Building2 },
  { to: "/reports", label: "Reports & Analytics", icon: FileText },
  { to: "/configuration", label: "Configuration", icon: Settings },
  { to: "/administration", label: "Administration", icon: Users },
  { to: "/security", label: "Security", icon: Shield },
];

function Sidebar() {
  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col flex-shrink-0 border-r border-gray-800">
      {/* Logo Area */}
      <div className="h-16 flex items-center px-6 border-b border-gray-800">
        <span className="font-bold text-lg tracking-tight text-white">VIMS Admin</span>
      </div>
      
      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                isActive
                  ? "bg-gray-800 text-white shadow-sm"
                  : "text-gray-300 hover:bg-gray-800/60 hover:text-white"
              }`
            }
          >
            <Icon className="h-5 w-5 flex-shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;


