import { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, AlertCircle, Info } from 'lucide-react';
import { mockScorecardData, getTrendIcon, getTrendColor, formatCurrency } from '../../data/mockReports';
import { useAuth } from '../../context/AuthContext';

const TIME_WINDOWS = ['Today', '7D', 'MTD', 'Custom'];

function ExecutiveScorecard() {
  const { user } = useAuth();
  const [scorecard, setScorecard] = useState(mockScorecardData);
  const [timeWindow, setTimeWindow] = useState('Today');
  const [scope, setScope] = useState('National');
  const [hoveredWidget, setHoveredWidget] = useState(null);

  const handleWidgetClick = (widget) => {
    console.log('Widget clicked (drill-down)', { widget_id: widget.widget_id, scope, timeWindow });
    // In real app, would navigate to detailed report with filters pre-applied
    alert(`Drill-down to detailed report for: ${widget.definition}`);
  };

  const getWidgetCard = (widget) => {
    const TrendIcon = widget.trend === 'up' ? TrendingUp : widget.trend === 'down' ? TrendingDown : Minus;
    const trendColor = getTrendColor(widget.trend);
    
    return (
      <div
        key={widget.widget_id}
        onClick={() => handleWidgetClick(widget)}
        onMouseEnter={() => setHoveredWidget(widget.widget_id)}
        onMouseLeave={() => setHoveredWidget(null)}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-600 mb-1">{widget.definition}</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900">
                {widget.currency ? formatCurrency(widget.value, widget.currency) : widget.value.toLocaleString()}
                {widget.widget_id === 'pass_rate' && '%'}
              </span>
              {widget.comparison_value && (
                <div className={`flex items-center gap-1 text-sm ${trendColor}`}>
                  <TrendIcon className="h-4 w-4" />
                  <span>{Math.abs(widget.trend_percent).toFixed(1)}%</span>
                </div>
              )}
            </div>
          </div>
          {hoveredWidget === widget.widget_id && (
            <div className="absolute bg-gray-900 text-white text-xs rounded-lg p-2 shadow-lg z-10">
              <div className="font-semibold mb-1">{widget.definition}</div>
              <div>Last updated: {new Date(scorecard.last_updated_at).toLocaleString('en-ET')}</div>
              <div>Data latency: {scorecard.data_latency}</div>
            </div>
          )}
        </div>
        {widget.comparison_value && (
          <div className="text-xs text-gray-500">
            Previous: {widget.currency ? formatCurrency(widget.comparison_value, widget.currency) : widget.comparison_value.toLocaleString()}
            {widget.widget_id === 'pass_rate' && '%'}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Executive Scorecard</h1>
          <p className="text-gray-600">
            High-level metrics for leadership visibility and monitoring
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={scope}
            onChange={(e) => setScope(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
          >
            <option value="National">National</option>
            <option value="Region">Region</option>
            <option value="Zone">Zone</option>
            <option value="Center">Center</option>
          </select>
          <select
            value={timeWindow}
            onChange={(e) => setTimeWindow(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
          >
            {TIME_WINDOWS.map(window => (
              <option key={window} value={window}>{window}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Data Freshness Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <Info className="h-5 w-5 text-blue-600" />
          <div className="flex-1">
            <span className="text-sm font-semibold text-blue-800">Data Freshness</span>
            <div className="text-sm text-blue-700 mt-1">
              Last updated: {new Date(scorecard.last_updated_at).toLocaleString('en-ET')} • 
              Latency: <span className="font-medium">{scorecard.data_latency}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Volume Metrics */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Volume Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {scorecard.widgets.filter(w => ['total_inspections', 'pass_rate', 'fail_count'].includes(w.widget_id)).map(getWidgetCard)}
        </div>
      </div>

      {/* Performance Metrics */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scorecard.widgets.filter(w => ['avg_cycle_time', 'revenue', 'active_centers', 'degraded_centers'].includes(w.widget_id)).map(getWidgetCard)}
        </div>
      </div>

      {/* Integrity Metrics */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-600" />
          Integrity & Compliance Metrics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {scorecard.widgets.filter(w => ['red_geofence_breaches', 'evidence_gaps', 'camera_offline_events', 'fraud_flags'].includes(w.widget_id)).map(getWidgetCard)}
        </div>
      </div>

      {/* Info Footer */}
      <div className="bg-gray-50 rounded-lg p-4">
        <p className="text-xs text-gray-600">
          <strong>Note:</strong> Click any widget to drill down into detailed reports. All metrics respect scope and time window filters.
          Data latency indicates freshness: "Live" = real-time, "Near-real-time" = {'<'} 5 minutes delay, "Daily batch" = updated once per day.
        </p>
      </div>
    </div>
  );
}

export default ExecutiveScorecard;

