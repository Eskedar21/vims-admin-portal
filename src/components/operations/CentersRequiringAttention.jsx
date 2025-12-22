import { useMemo } from 'react';
import { AlertCircle, TrendingUp, CheckCircle } from 'lucide-react';

function CentersRequiringAttention({ centers, onCenterClick }) {
  const rankedCenters = useMemo(() => {
    return [...centers]
      .filter(c => c.attention_score > 0)
      .sort((a, b) => b.attention_score - a.attention_score)
      .slice(0, 10);
  }, [centers]);

  const getSeverityColor = (severity) => {
    const colors = {
      Critical: 'bg-red-50 border-red-200',
      High: 'bg-orange-50 border-orange-200',
      Medium: 'bg-yellow-50 border-yellow-200',
      Low: 'bg-blue-50 border-blue-200',
    };
    return colors[severity] || colors.Low;
  };

  const getSeverityTextColor = (severity) => {
    const colors = {
      Critical: 'text-red-800',
      High: 'text-orange-800',
      Medium: 'text-yellow-800',
      Low: 'text-blue-800',
    };
    return colors[severity] || colors.Low;
  };

  if (rankedCenters.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900">
            Centers Requiring Attention
          </h3>
        </div>
        <div className="text-center py-8 text-gray-500">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
          <p className="text-sm">All centers are operating normally</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-orange-500" />
          <h3 className="text-lg font-semibold text-gray-900">
            Centers Requiring Attention
          </h3>
        </div>
        <span className="text-xs text-gray-500">
          {rankedCenters.length} center{rankedCenters.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="divide-y divide-gray-200">
        {rankedCenters.map((center, idx) => (
          <div
            key={center.center_id}
            className={`p-4 hover:bg-gray-50 transition cursor-pointer ${
              getSeverityColor(center.severity_bucket)
            }`}
            onClick={() => onCenterClick(center)}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-gray-500">
                    #{idx + 1}
                  </span>
                  <h4 className="text-sm font-semibold text-gray-900">
                    {center.center_name}
                  </h4>
                </div>
                <p className="text-xs text-gray-500">
                  {center.jurisdiction_path || center.region}
                </p>
              </div>
              <div className="text-right">
                <div className={`text-sm font-bold ${getSeverityTextColor(center.severity_bucket)}`}>
                  {center.attention_score}
                </div>
                <div className="text-xs text-gray-500">score</div>
              </div>
            </div>

            {/* Attention Score Bar */}
            <div className="mb-2">
              <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full ${
                    center.attention_score >= 70 ? 'bg-red-500' :
                    center.attention_score >= 50 ? 'bg-orange-500' :
                    center.attention_score >= 30 ? 'bg-yellow-500' :
                    'bg-blue-500'
                  }`}
                  style={{ width: `${center.attention_score}%` }}
                />
              </div>
            </div>

            {/* Top Reasons */}
            {center.top_reasons && center.top_reasons.length > 0 && (
              <div className="mt-2">
                <div className="flex flex-wrap gap-1">
                  {center.top_reasons
                    .filter(reason => !reason.includes('machine(s) offline'))
                    .map((reason, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-white/80 text-gray-700 border border-gray-200"
                      >
                        {reason}
                      </span>
                    ))}
                </div>
              </div>
            )}

            {/* Status and Incidents */}
            <div className="flex items-center gap-3 mt-2 text-xs">
              <span className={`px-2 py-0.5 rounded font-medium ${
                center.status === 'Online' ? 'bg-green-100 text-green-800' :
                center.status === 'Degraded' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {center.status}
              </span>
              {center.open_incidents_count?.total > 0 && (
                <span className="text-gray-600">
                  {center.open_incidents_count.total} incident{center.open_incidents_count.total !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {rankedCenters.length >= 10 && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">
            Showing top 10 centers. View all in list view.
          </p>
        </div>
      )}
    </div>
  );
}

export default CentersRequiringAttention;

