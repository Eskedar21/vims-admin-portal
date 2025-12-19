import { useState, useMemo } from 'react';
import { Plus, Edit, Trash2, AlertCircle, CheckCircle, ChevronRight, ChevronDown } from 'lucide-react';
import { mockAdminUnits, ADMIN_UNIT_TYPES, getAdminUnitTree, validateHierarchy } from '../../data/mockGovernance';
import { useAuth } from '../../context/AuthContext';

function AdministrationUnits() {
  const { user } = useAuth();
  const [units, setUnits] = useState(mockAdminUnits);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUnit, setEditingUnit] = useState(null);
  const [expandedNodes, setExpandedNodes] = useState(new Set(['AU-NATIONAL']));
  const [formData, setFormData] = useState({
    admin_unit_type: ADMIN_UNIT_TYPES.REGION,
    admin_unit_name_en: '',
    admin_unit_name_am: '',
    admin_unit_code: '',
    parent_admin_unit_id: null,
    status: 'Active',
    effective_from: new Date().toISOString().split('T')[0],
    effective_to: null,
  });

  const unitTree = useMemo(() => getAdminUnitTree(units), [units]);

  // Compute available parents based on current form data and units state
  // This ensures newly created units appear immediately in the dropdown
  const availableParents = useMemo(() => {
    const typeHierarchy = [
      ADMIN_UNIT_TYPES.NATIONAL,
      ADMIN_UNIT_TYPES.REGION,
      ADMIN_UNIT_TYPES.ZONE,
      ADMIN_UNIT_TYPES.SUB_CITY,
      ADMIN_UNIT_TYPES.WOREDA,
    ];
    const currentIndex = typeHierarchy.indexOf(formData.admin_unit_type);
    const parentType = currentIndex > 0 ? typeHierarchy[currentIndex - 1] : null;
    
    if (!parentType) return [];
    
    return units.filter(u => 
      u.admin_unit_type === parentType && 
      u.status === 'Active' &&
      u.admin_unit_id !== editingUnit?.admin_unit_id
    );
  }, [units, formData.admin_unit_type, editingUnit?.admin_unit_id]);

  const toggleNode = (unitId) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(unitId)) {
      newExpanded.delete(unitId);
    } else {
      newExpanded.add(unitId);
    }
    setExpandedNodes(newExpanded);
  };

  const handleCreate = () => {
    // Validate hierarchy
    const validation = validateHierarchy(formData, units);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    const newUnit = {
      admin_unit_id: `AU-${Date.now()}`,
      ...formData,
      jurisdiction_path: formData.parent_admin_unit_id
        ? `${units.find(u => u.admin_unit_id === formData.parent_admin_unit_id)?.jurisdiction_path} > ${formData.admin_unit_name_en}`
        : formData.admin_unit_name_en,
      created_by: user?.id || 'admin-001',
      created_at: new Date().toISOString(),
      updated_by: user?.id || 'admin-001',
      updated_at: new Date().toISOString(),
    };

    setUnits([...units, newUnit]);
    setShowCreateModal(false);
    setFormData({
      admin_unit_type: ADMIN_UNIT_TYPES.REGION,
      admin_unit_name_en: '',
      admin_unit_name_am: '',
      admin_unit_code: '',
      parent_admin_unit_id: null,
      status: 'Active',
      effective_from: new Date().toISOString().split('T')[0],
      effective_to: null,
    });
    
    // In real app, this would trigger change request workflow
    console.log('Admin unit created (would trigger change request)', newUnit);
  };

  const handleUpdate = () => {
    const validation = validateHierarchy({ ...editingUnit, ...formData }, units);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    const updated = units.map(u =>
      u.admin_unit_id === editingUnit.admin_unit_id
        ? {
            ...u,
            ...formData,
            jurisdiction_path: formData.parent_admin_unit_id
              ? `${units.find(p => p.admin_unit_id === formData.parent_admin_unit_id)?.jurisdiction_path} > ${formData.admin_unit_name_en}`
              : formData.admin_unit_name_en,
            updated_by: user?.id || 'admin-001',
            updated_at: new Date().toISOString(),
          }
        : u
    );

    setUnits(updated);
    setEditingUnit(null);
    setFormData({
      admin_unit_type: ADMIN_UNIT_TYPES.REGION,
      admin_unit_name_en: '',
      admin_unit_name_am: '',
      admin_unit_code: '',
      parent_admin_unit_id: null,
      status: 'Active',
      effective_from: new Date().toISOString().split('T')[0],
      effective_to: null,
    });
    
    console.log('Admin unit updated (would trigger change request)');
  };

  const handleDeactivate = (unit) => {
    if (window.confirm(`Deactivate ${unit.admin_unit_name_en}? This will prevent it from being assigned to new centers/users.`)) {
      const updated = units.map(u =>
        u.admin_unit_id === unit.admin_unit_id
          ? { ...u, status: 'Inactive', updated_by: user?.id, updated_at: new Date().toISOString() }
          : u
      );
      setUnits(updated);
      console.log('Admin unit deactivated (would trigger change request)');
    }
  };

  const renderTreeNode = (node, level = 0) => {
    const isExpanded = expandedNodes.has(node.admin_unit_id);
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div key={node.admin_unit_id}>
        <div
          className={`flex items-center gap-2 p-3 hover:bg-gray-50 rounded-lg ${
            level > 0 ? 'ml-6' : ''
          }`}
          style={{ paddingLeft: `${level * 24 + 12}px` }}
        >
          {hasChildren ? (
            <button
              onClick={() => toggleNode(node.admin_unit_id)}
              className="p-1 hover:bg-gray-200 rounded"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronRight className="h-4 w-4 text-gray-500" />
              )}
            </button>
          ) : (
            <div className="w-6" />
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-900">
                {node.admin_unit_name_en}
              </span>
              {node.status === 'Active' ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-gray-400" />
              )}
              <span className="text-xs text-gray-500">
                ({node.admin_unit_type})
              </span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {node.jurisdiction_path}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setEditingUnit(node);
                setFormData({
                  admin_unit_type: node.admin_unit_type,
                  admin_unit_name_en: node.admin_unit_name_en,
                  admin_unit_name_am: node.admin_unit_name_am,
                  admin_unit_code: node.admin_unit_code,
                  parent_admin_unit_id: node.parent_admin_unit_id,
                  status: node.status,
                  effective_from: node.effective_from?.split('T')[0] || '',
                  effective_to: node.effective_to?.split('T')[0] || '',
                });
              }}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
            >
              <Edit className="h-4 w-4" />
            </button>
            {node.status === 'Active' && (
              <button
                onClick={() => handleDeactivate(node)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
        {hasChildren && isExpanded && (
          <div>
            {node.children.map(child => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Administration Unit Registry
          </h1>
          <p className="text-gray-600">
            Manage hierarchical government structure (National {'>'} Region {'>'} Zone {'>'} Sub-city {'>'} Woreda)
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-[#009639] text-white rounded-lg hover:bg-[#007A2F] transition flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Create Unit
        </button>
      </div>

      {/* Hierarchy Tree */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Administration Unit Hierarchy</h2>
        <div className="space-y-1">
          {unitTree.map(root => renderTreeNode(root))}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || editingUnit) && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {editingUnit ? 'Edit Administration Unit' : 'Create Administration Unit'}
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.admin_unit_type}
                  onChange={(e) => setFormData({ ...formData, admin_unit_type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009639]"
                >
                  {Object.values(ADMIN_UNIT_TYPES).map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name (English) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.admin_unit_name_en}
                  onChange={(e) => setFormData({ ...formData, admin_unit_name_en: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009639]"
                  placeholder="Enter name in English"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name (Amharic)
                </label>
                <input
                  type="text"
                  value={formData.admin_unit_name_am}
                  onChange={(e) => setFormData({ ...formData, admin_unit_name_am: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009639]"
                  placeholder="Enter name in Amharic"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit Code
                </label>
                <input
                  type="text"
                  value={formData.admin_unit_code}
                  onChange={(e) => setFormData({ ...formData, admin_unit_code: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009639]"
                  placeholder="Official code if available"
                />
              </div>

              {formData.admin_unit_type !== ADMIN_UNIT_TYPES.NATIONAL && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Parent Unit <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.parent_admin_unit_id || ''}
                    onChange={(e) => setFormData({ ...formData, parent_admin_unit_id: e.target.value || null })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009639]"
                  >
                    <option value="">Select parent unit...</option>
                    {availableParents.map(parent => (
                      <option key={parent.admin_unit_id} value={parent.admin_unit_id}>
                        {parent.jurisdiction_path || parent.admin_unit_name_en}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009639]"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Effective From
                  </label>
                  <input
                    type="date"
                    value={formData.effective_from}
                    onChange={(e) => setFormData({ ...formData, effective_from: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009639]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Effective To (optional)
                  </label>
                  <input
                    type="date"
                    value={formData.effective_to || ''}
                    onChange={(e) => setFormData({ ...formData, effective_to: e.target.value || null })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009639]"
                  />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingUnit(null);
                  setFormData({
                    admin_unit_type: ADMIN_UNIT_TYPES.REGION,
                    admin_unit_name_en: '',
                    admin_unit_name_am: '',
                    admin_unit_code: '',
                    parent_admin_unit_id: null,
                    status: 'Active',
                    effective_from: new Date().toISOString().split('T')[0],
                    effective_to: null,
                  });
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={editingUnit ? handleUpdate : handleCreate}
                className="px-4 py-2 bg-[#009639] text-white rounded-lg hover:bg-[#007A2F] transition"
              >
                {editingUnit ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdministrationUnits;

