import { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { mockBenchmarkData, getPercentileColor } from '../../data/mockReports';
import { useNavigate } from 'react-router-dom';

const SORT_OPTIONS = [
  { value: 'pass_rate', label: 'Pass Rate' },
  { value: 'cycle_time', label: 'Cycle Time' },
  { value: 'evidence', label: 'Evidence Completeness' },
  { value: 'volume', label: 'Inspection Volume' },
  { value: 'attention_score', label: 'Attention Score' },
];

function CenterBenchmarking() {
  const navigate = useNavigate();
  const [benchmarks] = useState(mockBenchmarkData);
  const [sortBy, setSortBy] = useState('pass_rate');
  const [jurisdictionFilter, setJurisdictionFilter] = useState('all');
  const [highlightOutliers, setHighlightOutliers] = useState(true);

  const sortedBenchmarks = useMemo(() => {
    let sorted = [...benchmarks];
    
    if (jurisdictionFilter !== 'all') {
      sorted = sorted.filter(b => b.jurisdiction_path.includes(jurisdictionFilter));
    }
    
    sorted.sort((a, b) => {
      if (sortBy === 'pass_rate') return b.pass_rate - a.pass_rate;
      if (sortBy === 'cycle_time') return a.avg_cycle_time - b.avg_cycle_time;
      if (sortBy === 'evidence') return b.evidence_completeness_rate - a.evidence_completeness_rate;
      if (sortBy === 'volume') return b.inspections_volume - a.inspections_volume;
      if (sortBy === 'attention_score') return a.attention_score - b.attention_score;
      return 0;
    });
    
    return sorted;
  }, [benchmarks, sortBy, jurisdictionFilter]);

  const isOutlier = (benchmark) => {
    if (!highlightOutliers) return false;
    // Top 1% pass rate spike
    if (benchmark.pass_rate > 95) return { type: 'high', metric: 'pass_rate' };
    // Bottom 5% evidence completeness
    if (benchmark.evidence_completeness_rate < 90) return { type: 'low', metric: 'evidence' };
    // High attention score
    if (benchmark.attention_score > 30) return { type: 'high', metric: 'attention' };
    return null;
  };

  const handleViewCenter = (centerId) => {
    navigate(`/center-management/${centerId}`);
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Center Benchmarking</h1>
          <p className="text-gray-600">
            Compare centers, identify outliers, and prioritize interventions
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009639]"
            >
              {SORT_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Jurisdiction</label>
            <select
              value={jurisdictionFilter}
              onChange={(e) => setJurisdictionFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009639]"
            >
              <option value="all">All Jurisdictions</option>
              <option value="Addis Ababa">Addis Ababa</option>
              <option value="Oromia">Oromia</option>
            </select>
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={highlightOutliers}
                onChange={(e) => setHighlightOutliers(e.target.checked)}
                className="rounded border-gray-300 text-[#009639] focus:ring-[#009639]"
              />
              <span className="text-sm text-gray-700">Highlight Outliers</span>
            </label>
          </div>
        </div>
      </div>

      {/* Benchmark Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Center Performance Comparison ({sortedBenchmarks.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Center</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Volume</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Pass Rate</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Cycle Time</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Evidence %</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Camera Uptime</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Red Geofence/1k</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Attention Score</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedBenchmarks.map((benchmark, index) => {
                const outlier = isOutlier(benchmark);
                return (
                  <tr
                    key={benchmark.center_id}
                    className={`hover:bg-gray-50 ${
                      outlier ? (outlier.type === 'high' ? 'bg-yellow-50' : 'bg-red-50') : ''
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{benchmark.center_name}</div>
                      <div className="text-xs text-gray-500">{benchmark.jurisdiction_path}</div>
                      {benchmark.data_quality_flags.length > 0 && (
                        <div className="flex items-center gap-1 mt-1">
                          <AlertCircle className="h-3 w-3 text-yellow-500" />
                          <span className="text-xs text-yellow-600">Telemetry delayed</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {benchmark.inspections_volume.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">{benchmark.pass_rate.toFixed(1)}%</span>
                        <span className={`text-xs font-medium ${getPercentileColor(benchmark.percentile_pass_rate)}`}>
                          P{benchmark.percentile_pass_rate}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {benchmark.avg_cycle_time.toFixed(1)} min
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {benchmark.evidence_completeness_rate.toFixed(1)}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {benchmark.camera_uptime_percent.toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${
                        benchmark.geofence_red_rate_per_1k > 5 ? 'text-red-600' : 'text-gray-900'
                      }`}>
                        {benchmark.geofence_red_rate_per_1k.toFixed(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${
                        benchmark.attention_score > 25 ? 'text-red-600' : 'text-gray-900'
                      }`}>
                        {benchmark.attention_score}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleViewCenter(benchmark.center_id)}
                        className="text-[#009639] hover:text-[#007A2F] hover:underline"
                      >
                        View Center
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">Legend</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-600">
          <div>
            <span className="font-medium">PXX:</span> Percentile rank
          </div>
          <div>
            <span className="font-medium">Red Geofence/1k:</span> Red zone breaches per 1,000 inspections
          </div>
          <div>
            <span className="font-medium">Yellow highlight:</span> Top 1% pass rate spike
          </div>
          <div>
            <span className="font-medium">Red highlight:</span> Bottom 5% evidence completeness
          </div>
        </div>
      </div>
    </div>
  );
}

export default CenterBenchmarking;






