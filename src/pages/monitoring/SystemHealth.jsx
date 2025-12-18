import { useState } from "react";
import { useCenters } from "../../context/CentersContext";
import { Wifi, WifiOff, RefreshCw, Clock, X } from "lucide-react";

function SystemHealth() {
  const { centers } = useCenters();
  const [selectedCenter, setSelectedCenter] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case "Online":
        return "bg-emerald-500 border-emerald-600";
      case "Offline":
        return "bg-red-500 border-red-600";
      case "Syncing":
        return "bg-yellow-500 border-yellow-600";
      default:
        return "bg-gray-500 border-gray-600";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Online":
        return <Wifi className="h-5 w-5" />;
      case "Offline":
        return <WifiOff className="h-5 w-5" />;
      case "Syncing":
        return <RefreshCw className="h-5 w-5 animate-spin" />;
      default:
        return <WifiOff className="h-5 w-5" />;
    }
  };

  const getMachineStatusColor = (status) => {
    switch (status) {
      case "Online":
        return "text-emerald-600 bg-emerald-50 border-emerald-200";
      case "Offline":
        return "text-red-600 bg-red-50 border-red-200";
      case "Syncing":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const formatLastHeartbeat = (timestamp) => {
    if (!timestamp) return "Never";
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);

    if (diffSec < 60) {
      return `${diffSec} seconds ago`;
    } else if (diffMin < 60) {
      return `${diffMin} minute${diffMin > 1 ? "s" : ""} ago`;
    } else {
      const diffHour = Math.floor(diffMin / 60);
      return `${diffHour} hour${diffHour > 1 ? "s" : ""} ago`;
    }
  };

  return (
    <div className="max-w-7xl mx-auto w-full space-y-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">System Monitoring</h1>
        <p className="text-gray-600">
          Real-time connectivity status of all inspection centers and their equipment.
        </p>
      </div>

      {/* Status Legend */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center gap-6 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-emerald-500 border-2 border-emerald-600"></div>
            <span className="text-sm text-gray-700">Online</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-yellow-500 border-2 border-yellow-600"></div>
            <span className="text-sm text-gray-700">Syncing</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-red-500 border-2 border-red-600"></div>
            <span className="text-sm text-gray-700">Offline</span>
          </div>
        </div>
      </div>

      {/* Matrix Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {centers.map((center) => (
          <button
            key={center.id}
            onClick={() => setSelectedCenter(center)}
            className={`relative p-4 rounded-xl border-2 transition-all hover:shadow-lg hover:scale-105 ${getStatusColor(
              center.status
            )} text-white`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-white mb-1">{center.name}</h3>
                <p className="text-xs text-white/80">{center.region}</p>
              </div>
              <div className="text-white">{getStatusIcon(center.status)}</div>
            </div>

            <div className="flex items-center gap-2 text-xs text-white/90">
              <Clock className="h-3 w-3" />
              <span>{formatLastHeartbeat(center.lastHeartbeat)}</span>
            </div>

            <div className="mt-3 pt-3 border-t border-white/20">
              <p className="text-xs text-white/80">
                {center.machineStatus?.filter((m) => m.status === "Online").length || 0} /{" "}
                {center.machineStatus?.length || 0} machines online
              </p>
            </div>

            {/* Status Badge */}
            <div className="absolute top-2 right-2">
              <span className="px-2 py-1 text-xs font-semibold bg-white/20 backdrop-blur-sm rounded-full text-white">
                {center.status}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedCenter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-2xl border border-gray-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{selectedCenter.name}</h2>
                <p className="text-sm text-gray-600 mt-1">{selectedCenter.region}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCenter(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors rounded-lg p-1 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              {/* Center Status */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-200">
                <div className="flex items-center gap-3">
                  {getStatusIcon(selectedCenter.status)}
                  <div>
                    <p className="text-sm font-medium text-gray-900">Center Status</p>
                    <p className="text-xs text-gray-600">
                      Last heartbeat: {formatLastHeartbeat(selectedCenter.lastHeartbeat)}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    selectedCenter.status === "Online"
                      ? "bg-emerald-100 text-emerald-700"
                      : selectedCenter.status === "Syncing"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {selectedCenter.status}
                </span>
              </div>

              {/* Machine Status List */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Machine Status</h3>
                <div className="space-y-2">
                  {selectedCenter.machineStatus?.map((machine, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        getMachineStatusColor(machine.status)
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {getStatusIcon(machine.status)}
                        <span className="text-sm font-medium">{machine.name}</span>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded ${
                          machine.status === "Online"
                            ? "bg-emerald-100 text-emerald-700"
                            : machine.status === "Syncing"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {machine.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="pt-4 border-t border-gray-200">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-emerald-600">
                      {selectedCenter.machineStatus?.filter((m) => m.status === "Online").length || 0}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">Online</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-yellow-600">
                      {selectedCenter.machineStatus?.filter((m) => m.status === "Syncing").length || 0}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">Syncing</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-red-600">
                      {selectedCenter.machineStatus?.filter((m) => m.status === "Offline").length || 0}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">Offline</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SystemHealth;

