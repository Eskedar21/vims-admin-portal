import { useState } from 'react';
import { Plus, Edit, Trash2, AlertCircle, CheckCircle } from 'lucide-react';
import { mockInstitutions, mockAdminUnits } from '../../data/mockGovernance';
import { useAuth } from '../../context/AuthContext';

const INSTITUTION_TYPES = ['Government', 'Partner', 'Vendor', 'Oversight Body'];

function Institutions() {
  const { user } = useAuth();
  const [institutions, setInstitutions] = useState(mockInstitutions);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingInstitution, setEditingInstitution] = useState(null);
  const [formData, setFormData] = useState({
    institution_type: 'Government',
    institution_name_en: '',
    institution_name_am: '',
    institution_short_name: '',
    registration_number: '',
    contact_person_name: '',
    contact_phone: '',
    contact_email: '',
    address_text: '',
    region_id: '',
    status: 'Active',
    notes: '',
  });

  const handleCreate = () => {
    const newInstitution = {
      institution_id: `INST-${Date.now()}`,
      ...formData,
    };
    setInstitutions([...institutions, newInstitution]);
    setShowCreateModal(false);
    resetForm();
    console.log('Institution created (audit logged)', newInstitution);
  };

  const handleUpdate = () => {
    const updated = institutions.map(i =>
      i.institution_id === editingInstitution.institution_id
        ? { ...i, ...formData }
        : i
    );
    setInstitutions(updated);
    setEditingInstitution(null);
    resetForm();
    console.log('Institution updated (audit logged)');
  };

  const handleDeactivate = (institution) => {
    if (window.confirm(`Deactivate ${institution.institution_name_en}? Deactivated institutions cannot be selected for new assignments.`)) {
      const updated = institutions.map(i =>
        i.institution_id === institution.institution_id
          ? { ...i, status: 'Inactive' }
          : i
      );
      setInstitutions(updated);
      console.log('Institution deactivated (audit logged)');
    }
  };

  const resetForm = () => {
    setFormData({
      institution_type: 'Government',
      institution_name_en: '',
      institution_name_am: '',
      institution_short_name: '',
      registration_number: '',
      contact_person_name: '',
      contact_phone: '',
      contact_email: '',
      address_text: '',
      region_id: '',
      status: 'Active',
      notes: '',
    });
  };

  const getRegionName = (regionId) => {
    const region = mockAdminUnits.find(u => u.admin_unit_id === regionId);
    return region ? region.admin_unit_name_en : regionId;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Institution Registry
          </h1>
          <p className="text-gray-600">
            Manage government agencies and partner institutions
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-[#009639] text-white rounded-lg hover:bg-[#007A2F] transition flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Create Institution
        </button>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="h-5 w-5 text-blue-600" />
          <span className="text-sm font-semibold text-blue-800">
            Access Restricted
          </span>
        </div>
        <p className="text-sm text-blue-700">
          Institutions can be created/edited/deactivated only by Super Admin (or delegated policy admin). All changes are audit-logged.
        </p>
      </div>

      {/* Institutions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Institutions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Short Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Region</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {institutions.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    No institutions found
                  </td>
                </tr>
              ) : (
                institutions.map(institution => (
                  <tr key={institution.institution_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {institution.institution_name_en}
                      </div>
                      {institution.institution_name_am && (
                        <div className="text-xs text-gray-500">
                          {institution.institution_name_am}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        institution.institution_type === 'Government' ? 'bg-blue-100 text-blue-800' :
                        institution.institution_type === 'Partner' ? 'bg-green-100 text-green-800' :
                        institution.institution_type === 'Vendor' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {institution.institution_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {institution.institution_short_name || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {institution.contact_person_name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {institution.contact_email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {institution.region_id ? getRegionName(institution.region_id) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {institution.status === 'Active' ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-gray-400" />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingInstitution(institution);
                            setFormData({
                              institution_type: institution.institution_type,
                              institution_name_en: institution.institution_name_en,
                              institution_name_am: institution.institution_name_am || '',
                              institution_short_name: institution.institution_short_name || '',
                              registration_number: institution.registration_number || '',
                              contact_person_name: institution.contact_person_name,
                              contact_phone: institution.contact_phone,
                              contact_email: institution.contact_email,
                              address_text: institution.address_text,
                              region_id: institution.region_id || '',
                              status: institution.status,
                              notes: institution.notes || '',
                            });
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        {institution.status === 'Active' && (
                          <button
                            onClick={() => handleDeactivate(institution)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || editingInstitution) && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {editingInstitution ? 'Edit Institution' : 'Create Institution'}
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Institution Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.institution_type}
                  onChange={(e) => setFormData({ ...formData, institution_type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009639]"
                >
                  {INSTITUTION_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name (English) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.institution_name_en}
                    onChange={(e) => setFormData({ ...formData, institution_name_en: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009639]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name (Amharic)
                  </label>
                  <input
                    type="text"
                    value={formData.institution_name_am}
                    onChange={(e) => setFormData({ ...formData, institution_name_am: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009639]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Short Name
                  </label>
                  <input
                    type="text"
                    value={formData.institution_short_name}
                    onChange={(e) => setFormData({ ...formData, institution_short_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009639]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Registration Number
                  </label>
                  <input
                    type="text"
                    value={formData.registration_number}
                    onChange={(e) => setFormData({ ...formData, registration_number: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009639]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Person Name
                </label>
                <input
                  type="text"
                  value={formData.contact_person_name}
                  onChange={(e) => setFormData({ ...formData, contact_person_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009639]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.contact_phone}
                    onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009639]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={formData.contact_email}
                    onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009639]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  value={formData.address_text}
                  onChange={(e) => setFormData({ ...formData, address_text: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009639]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Region
                </label>
                <select
                  value={formData.region_id}
                  onChange={(e) => setFormData({ ...formData, region_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009639]"
                >
                  <option value="">Select region...</option>
                  {mockAdminUnits.filter(u => u.admin_unit_type === 'Region').map(region => (
                    <option key={region.admin_unit_id} value={region.admin_unit_id}>
                      {region.admin_unit_name_en}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009639]"
                  placeholder="Optional notes..."
                />
              </div>

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
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingInstitution(null);
                  resetForm();
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={editingInstitution ? handleUpdate : handleCreate}
                className="px-4 py-2 bg-[#009639] text-white rounded-lg hover:bg-[#007A2F] transition"
              >
                {editingInstitution ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Institutions;

