import { useMemo } from 'react';
import { AlertCircle, CheckCircle, Clock, TrendingUp } from 'lucide-react';

function OperationsListView({ centers, onCenterClick, sortBy, filters }) {
  const formatLastHeartbeat = (timestamp) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString('en-ET');
  };

  const getStatusBadge = (status) => {
    const config = {
      Online: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
      Degraded: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: AlertCircle },
      Offline: { bg: 'bg-red-100', text: 'text-red-800', icon: AlertCircle },
    };
    const c = config[status] || config.Offline;
    const Icon = c.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
        <Icon className="h-3 w-3" />
        {status}
      </span>
    );
  };

  const getSeverityBadge = (severity) => {
    const config = {
      Critical: { bg: 'bg-red-100', text: 'text-red-800' },
      High: { bg: 'bg-orange-100', text: 'text-orange-800' },
      Medium: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
      Low: { bg: 'bg-blue-100', text: 'text-blue-800' },
    };
    const c = config[severity] || config.Low;
    
    return (
      <span className={`px-2 py-0.5 rounded text-xs font-medium ${c.bg} ${c.text}`}>
        {severity}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Centers ({centers.length})
        </h2>
        <div className="text-sm text-gray-500">
          Sorted by {sortBy.replace('_', ' ')}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Center
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Last Heartbeat
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Incidents
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Attention Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Throughput
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {centers.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                  No centers found matching your filters
                </td>
              </tr>
            ) : (
              centers.map((center) => (
                <tr
                  key={center.center_id}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => onCenterClick(center)}
                >
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {center.center_name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {center.jurisdiction_path || center.region}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(center.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatLastHeartbeat(center.last_heartbeat_at)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {center.last_heartbeat_at 
                        ? new Date(center.last_heartbeat_at).toLocaleTimeString('en-ET')
                        : ''}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {center.open_incidents_count?.critical > 0 && (
                        <span className="text-xs font-medium text-red-600">
                          {center.open_incidents_count.critical} Critical
                        </span>
                      )}
                      {center.open_incidents_count?.high > 0 && (
                        <span className="text-xs font-medium text-orange-600">
                          {center.open_incidents_count.high} High
                        </span>
                      )}
                      <span className="text-sm text-gray-600">
                        {center.open_incidents_count?.total || 0} total
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                        <div
                          className={`h-2 rounded-full ${
                            center.attention_score >= 70 ? 'bg-red-500' :
                            center.attention_score >= 50 ? 'bg-orange-500' :
                            center.attention_score >= 30 ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}
                          style={{ width: `${center.attention_score}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {center.attention_score || 0}
                      </span>
                      {center.severity_bucket && getSeverityBadge(center.severity_bucket)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {center.inspections_today || 0} today
                    </div>
                    <div className="text-xs text-gray-500">
                      {center.avg_cycle_time_today ? `${center.avg_cycle_time_today} min avg` : 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onCenterClick(center);
                      }}
                      className="text-[#88bf47] hover:text-[#0fa84a]"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OperationsListView;

