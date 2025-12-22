import { useState, useMemo } from 'react';
import { Plus, Edit, Trash2, Camera, AlertCircle, CheckCircle } from 'lucide-react';
import { mockChecklistItems, mockVehicleClasses } from '../../data/mockInspectionProgram';
import { useAuth } from '../../context/AuthContext';

const CATEGORIES = ['Exterior', 'Lights', 'Tires', 'Interior', 'Documents', 'Safety'];
const SEVERITY_LEVELS = ['Info', 'Minor', 'Major', 'Critical'];
const APPROVAL_STATUSES = ['Draft', 'Approved'];

function ChecklistLibrary() {
  const { user } = useAuth();
  const [items, setItems] = useState(mockChecklistItems);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [vehicleClassFilter, setVehicleClassFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [formData, setFormData] = useState({
    vehicle_class_id: '',
    category: 'Exterior',
    item_label_en: '',
    item_label_am: '',
    severity_on_fail: 'Major',
    fail_code: '',
    photo_required_on_fail: false,
    enabled: true,
    sort_order: 1,
    approval_status: 'Draft',
    effective_from: new Date().toISOString().split('T')[0],
    effective_to: null,
  });

  const filteredItems = useMemo(() => {
    let filtered = [...items];
    if (vehicleClassFilter !== 'all') {
      filtered = filtered.filter(i => i.vehicle_class_id === vehicleClassFilter);
    }
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(i => i.category === categoryFilter);
    }
    return filtered.sort((a, b) => a.sort_order - b.sort_order);
  }, [items, vehicleClassFilter, categoryFilter]);

  const handleCreate = () => {
    const newItem = {
      checklist_item_id: `CHK-${Date.now()}`,
      ...formData,
      version: '1.0',
    };
    setItems([...items, newItem]);
    setShowCreateModal(false);
    resetForm();
    console.log('Checklist item created (versioned and audit logged)', newItem);
  };

  const handleUpdate = () => {
    const updated = items.map(i =>
      i.checklist_item_id === editingItem.checklist_item_id
        ? {
            ...i,
            ...formData,
            version: (parseFloat(i.version) + 0.1).toFixed(1),
          }
        : i
    );
    setItems(updated);
    setEditingItem(null);
    resetForm();
    console.log('Checklist item updated (versioned and audit logged)');
  };

  const handleDeactivate = (item) => {
    if (window.confirm(`Deactivate ${item.item_label_en}?`)) {
      const updated = items.map(i =>
        i.checklist_item_id === item.checklist_item_id
          ? { ...i, enabled: false }
          : i
      );
      setItems(updated);
      console.log('Checklist item deactivated (audit logged)');
    }
  };

  const resetForm = () => {
    setFormData({
      vehicle_class_id: '',
      category: 'Exterior',
      item_label_en: '',
      item_label_am: '',
      severity_on_fail: 'Major',
      fail_code: '',
      photo_required_on_fail: false,
      enabled: true,
      sort_order: 1,
      approval_status: 'Draft',
      effective_from: new Date().toISOString().split('T')[0],
      effective_to: null,
    });
  };

  const getVehicleClassName = (classId) => {
    const vc = mockVehicleClasses.find(c => c.vehicle_class_id === classId);
    return vc ? vc.name_en : classId;
  };

  const getSeverityColor = (severity) => {
    const colors = {
      Info: 'bg-blue-100 text-blue-800',
      Minor: 'bg-gray-100 text-gray-800',
      Major: 'bg-yellow-100 text-yellow-800',
      Critical: 'bg-red-100 text-red-800',
    };
    return colors[severity] || colors.Minor;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Visual Checklist Library</h1>
          <p className="text-gray-600">
            Manage checklist items per vehicle class for consistent visual inspection
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-[#88bf47] text-white rounded-lg hover:bg-[#0fa84a] transition flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Create Item
        </button>
      </div>

      {/* Info Banner */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="h-5 w-5 text-yellow-600" />
          <span className="text-sm font-semibold text-yellow-800">
            Evidence Enforcement
          </span>
        </div>
        <p className="text-sm text-yellow-700">
          If photo_required_on_fail = true, the inspection cannot be finalized unless required photo evidence is attached (or exception approved).
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Class</label>
            <select
              value={vehicleClassFilter}
              onChange={(e) => setVehicleClassFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
            >
              <option value="all">All Classes</option>
              {mockVehicleClasses.map(vc => (
                <option key={vc.vehicle_class_id} value={vc.vehicle_class_id}>
                  {vc.name_en}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Checklist Items Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Checklist Items ({filteredItems.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Order</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Vehicle Class</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Item Label</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Severity</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Photo Required</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredItems.map(item => (
                <tr key={item.checklist_item_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.sort_order}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getVehicleClassName(item.vehicle_class_id)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{item.item_label_en}</div>
                    {item.item_label_am && (
                      <div className="text-xs text-gray-500">{item.item_label_am}</div>
                    )}
                    <div className="text-xs text-gray-400 mt-1">{item.fail_code}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(item.severity_on_fail)}`}>
                      {item.severity_on_fail}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.photo_required_on_fail ? (
                      <div className="flex items-center gap-1">
                        <Camera className="h-4 w-4 text-red-500" />
                        <span className="text-xs text-red-600">Required</span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">No</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.enabled ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-gray-400" />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditingItem(item);
                          setFormData({
                            vehicle_class_id: item.vehicle_class_id,
                            category: item.category,
                            item_label_en: item.item_label_en,
                            item_label_am: item.item_label_am || '',
                            severity_on_fail: item.severity_on_fail,
                            fail_code: item.fail_code,
                            photo_required_on_fail: item.photo_required_on_fail,
                            enabled: item.enabled,
                            sort_order: item.sort_order,
                            approval_status: item.approval_status,
                            effective_from: item.effective_from?.split('T')[0] || '',
                            effective_to: item.effective_to?.split('T')[0] || '',
                          });
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      {item.enabled && (
                        <button
                          onClick={() => handleDeactivate(item)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || editingItem) && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {editingItem ? 'Edit Checklist Item' : 'Create Checklist Item'}
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle Class <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.vehicle_class_id}
                  onChange={(e) => setFormData({ ...formData, vehicle_class_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                >
                  <option value="">Select vehicle class...</option>
                  {mockVehicleClasses.map(vc => (
                    <option key={vc.vehicle_class_id} value={vc.vehicle_class_id}>
                      {vc.name_en}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Item Label (English) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.item_label_en}
                    onChange={(e) => setFormData({ ...formData, item_label_en: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Item Label (Amharic)
                  </label>
                  <input
                    type="text"
                    value={formData.item_label_am}
                    onChange={(e) => setFormData({ ...formData, item_label_am: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fail Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.fail_code}
                    onChange={(e) => setFormData({ ...formData, fail_code: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                    placeholder="EXT-WS-FAIL"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Severity on Fail <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.severity_on_fail}
                    onChange={(e) => setFormData({ ...formData, severity_on_fail: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                  >
                    {SEVERITY_LEVELS.map(severity => (
                      <option key={severity} value={severity}>{severity}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Approval Status
                  </label>
                  <select
                    value={formData.approval_status}
                    onChange={(e) => setFormData({ ...formData, approval_status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                  >
                    {APPROVAL_STATUSES.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.photo_required_on_fail}
                    onChange={(e) => setFormData({ ...formData, photo_required_on_fail: e.target.checked })}
                    className="rounded border-gray-300 text-[#88bf47] focus:ring-[#88bf47]"
                  />
                  <span className="text-sm text-gray-700">Photo Required on Fail</span>
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  If checked, inspection cannot be finalized without photo evidence when this item fails
                </p>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingItem(null);
                  resetForm();
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={editingItem ? handleUpdate : handleCreate}
                className="px-4 py-2 bg-[#88bf47] text-white rounded-lg hover:bg-[#0fa84a] transition"
              >
                {editingItem ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChecklistLibrary;












