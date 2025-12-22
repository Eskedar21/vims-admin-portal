import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Wifi, WifiOff, Plus } from "lucide-react";
import MapPicker from "../../components/MapPicker";
import { useCenters } from "../../context/CentersContext";

const REGIONS = ["Addis Ababa", "Oromia", "Amhara", "Tigray", "SNNPR", "Afar", "Somali", "Gambela", "Harari", "Dire Dawa"];

function CenterList() {
  const navigate = useNavigate();
  const { centers, addCenter } = useCenters();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    // Basic Information
    name: "",
    region: "",
    status: "Online",
    lat: 9.1450, // Default to Addis Ababa
    lng: 38.7618,
    radius: 500,
    
    // Business Registration
    tin: "",
    vat: "",
    principalRegistrationNo: "",
    businessLicenseNo: "",
    businessLicenseDateOfIssuance: "",
    placeOfIssue: "",
    dateOfIssue: "",
    
    // Owner/Company Information
    ownerCompanyName: "",
    nationality: "",
    tradeName: "",
    generalManagerName: "",
    
    // Location Details
    zoneSubCity: "",
    woreda: "",
    kebele: "",
    houseNo: "",
    
    // Contact Information
    telephone: "",
    fax: "",
    email: "",
    
    // Business Details
    fieldOfBusiness: "",
    capitalInETB: "",
    
    // Additional
    telebirrNumber: "",
    cameraConfiguration: "",
    commercialRegistrationProcedure: "",
  });

  const statusClass = (status) =>
    status === "Online"
      ? "inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200"
      : "inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 border border-red-200";

  const StatusIcon = ({ status }) =>
    status === "Online" ? (
      <Wifi className="h-3 w-3" />
    ) : (
      <WifiOff className="h-3 w-3" />
    );

  const handleViewDetails = (centerId) => {
    navigate(`/center-management/${centerId}`);
  };

  const handleOpenModal = () => {
    setForm({
      // Basic Information
      name: "",
      region: "",
      status: "Online",
      lat: 9.1450,
      lng: 38.7618,
      radius: 500,
      
      // Business Registration
      tin: "",
      vat: "",
      principalRegistrationNo: "",
      businessLicenseNo: "",
      businessLicenseDateOfIssuance: "",
      placeOfIssue: "",
      dateOfIssue: "",
      
      // Owner/Company Information
      ownerCompanyName: "",
      nationality: "",
      tradeName: "",
      generalManagerName: "",
      
      // Location Details
      zoneSubCity: "",
      woreda: "",
      kebele: "",
      houseNo: "",
      
      // Contact Information
      telephone: "",
      fax: "",
      email: "",
      
      // Business Details
      fieldOfBusiness: "",
      capitalInETB: "",
      
      // Additional
      telebirrNumber: "",
      cameraConfiguration: "",
      commercialRegistrationProcedure: "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newCenter = {
      id: `CTR-${String(centers.length + 1).padStart(3, "0")}`,
      name: form.name,
      region: form.region,
      status: form.status,
      lat: form.lat,
      lng: form.lng,
      radius: form.radius,
      // Business Registration
      tin: form.tin,
      vat: form.vat,
      principalRegistrationNo: form.principalRegistrationNo,
      businessLicenseNo: form.businessLicenseNo,
      businessLicenseDateOfIssuance: form.businessLicenseDateOfIssuance,
      placeOfIssue: form.placeOfIssue,
      dateOfIssue: form.dateOfIssue,
      // Owner/Company Information
      ownerCompanyName: form.ownerCompanyName,
      nationality: form.nationality,
      tradeName: form.tradeName,
      generalManagerName: form.generalManagerName,
      // Location Details
      zoneSubCity: form.zoneSubCity,
      woreda: form.woreda,
      kebele: form.kebele,
      houseNo: form.houseNo,
      // Contact Information
      telephone: form.telephone,
      fax: form.fax,
      email: form.email,
      // Business Details
      fieldOfBusiness: form.fieldOfBusiness,
      capitalInETB: form.capitalInETB,
      // Additional
      telebirrNumber: form.telebirrNumber,
      cameraConfiguration: form.cameraConfiguration,
      commercialRegistrationProcedure: form.commercialRegistrationProcedure,
    };
    addCenter(newCenter);
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto w-full space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Center Management</h1>
          <p className="text-gray-600">
            Manage inspection centers and their geo-fencing coordinates.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenModal}
          className="inline-flex items-center gap-2 rounded-lg bg-gray-900 text-white text-sm font-medium px-5 py-2.5 hover:bg-gray-800 transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Add Center
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Center Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Region
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Coordinates
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Geo-Fence Radius
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {centers.map((center) => (
                <tr key={center.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <div className="text-sm font-medium text-gray-900">{center.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700">{center.region}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700">
                      {center.lat.toFixed(4)}, {center.lng.toFixed(4)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700">{center.radius} m</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={statusClass(center.status)}>
                      <StatusIcon status={center.status} />
                      {center.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleViewDetails(center.id)}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
              {centers.length === 0 && (
                <tr>
                  <td
                    className="px-6 py-12 text-center text-sm text-gray-500"
                    colSpan={6}
                  >
                    No centers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Center Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-6xl rounded-xl bg-white shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 sticky top-0 bg-white z-10">
              <h2 className="text-xl font-semibold text-gray-900">Create New Inspection Center</h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors rounded-lg p-1 hover:bg-gray-100"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-8">
              {/* Basic Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Center Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#88bf47] focus:border-transparent transition-colors"
                      placeholder="Enter center name"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Region *
                    </label>
                    <select
                      required
                      value={form.region}
                      onChange={(e) => setForm({ ...form, region: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#88bf47] focus:border-transparent transition-colors"
                    >
                      <option value="">Select region</option>
                      {REGIONS.map((region) => (
                        <option key={region} value={region}>
                          {region}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Status *
                    </label>
                    <select
                      required
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#88bf47] focus:border-transparent transition-colors"
                    >
                      <option value="Online">Online</option>
                      <option value="Offline">Offline</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Geo-Fence Radius (Meters) *
                    </label>
                    <div className="space-y-2">
                      <input
                        type="range"
                        min="100"
                        max="2000"
                        step="50"
                        value={form.radius}
                        onChange={(e) => setForm({ ...form, radius: Number(e.target.value) })}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#88bf47]"
                      />
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">100 m</span>
                        <span className="text-sm font-semibold text-gray-900">{form.radius} m</span>
                        <span className="text-xs text-gray-500">2000 m</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Registration Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Business Registration Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      TIN (Tax Identification Number) *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.tin}
                      onChange={(e) => setForm({ ...form, tin: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#88bf47] focus:border-transparent transition-colors"
                      placeholder="Enter TIN"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      VAT Number
                    </label>
                    <input
                      type="text"
                      value={form.vat}
                      onChange={(e) => setForm({ ...form, vat: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#88bf47] focus:border-transparent transition-colors"
                      placeholder="Enter VAT number"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Principal Registration No. *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.principalRegistrationNo}
                      onChange={(e) => setForm({ ...form, principalRegistrationNo: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#88bf47] focus:border-transparent transition-colors"
                      placeholder="Enter principal registration number"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Business License No. *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.businessLicenseNo}
                      onChange={(e) => setForm({ ...form, businessLicenseNo: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#88bf47] focus:border-transparent transition-colors"
                      placeholder="Enter business license number"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Business License Date of Issuance *
                    </label>
                    <input
                      type="date"
                      required
                      value={form.businessLicenseDateOfIssuance}
                      onChange={(e) => setForm({ ...form, businessLicenseDateOfIssuance: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#88bf47] focus:border-transparent transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Place of Issue *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.placeOfIssue}
                      onChange={(e) => setForm({ ...form, placeOfIssue: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#88bf47] focus:border-transparent transition-colors"
                      placeholder="Enter place of issue"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Date of Issue *
                    </label>
                    <input
                      type="date"
                      required
                      value={form.dateOfIssue}
                      onChange={(e) => setForm({ ...form, dateOfIssue: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#88bf47] focus:border-transparent transition-colors"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Commercial Registration & Business License Procedure
                    </label>
                    <textarea
                      value={form.commercialRegistrationProcedure}
                      onChange={(e) => setForm({ ...form, commercialRegistrationProcedure: e.target.value })}
                      rows={3}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#88bf47] focus:border-transparent transition-colors"
                      placeholder="Enter commercial registration and business license procedure details"
                    />
                  </div>
                </div>
              </div>

              {/* Owner/Company Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Owner/Company Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Owner/Company Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.ownerCompanyName}
                      onChange={(e) => setForm({ ...form, ownerCompanyName: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#88bf47] focus:border-transparent transition-colors"
                      placeholder="Enter owner or company name"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Nationality *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.nationality}
                      onChange={(e) => setForm({ ...form, nationality: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#88bf47] focus:border-transparent transition-colors"
                      placeholder="Enter nationality"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Trade Name
                    </label>
                    <input
                      type="text"
                      value={form.tradeName}
                      onChange={(e) => setForm({ ...form, tradeName: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#88bf47] focus:border-transparent transition-colors"
                      placeholder="Enter trade name"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      General Manager Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.generalManagerName}
                      onChange={(e) => setForm({ ...form, generalManagerName: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#88bf47] focus:border-transparent transition-colors"
                      placeholder="Enter general manager name"
                    />
                  </div>
                </div>
              </div>

              {/* Location Details Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Location Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Zone / Sub City *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.zoneSubCity}
                      onChange={(e) => setForm({ ...form, zoneSubCity: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#88bf47] focus:border-transparent transition-colors"
                      placeholder="Enter zone or sub city"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Woreda *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.woreda}
                      onChange={(e) => setForm({ ...form, woreda: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#88bf47] focus:border-transparent transition-colors"
                      placeholder="Enter woreda"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Kebele *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.kebele}
                      onChange={(e) => setForm({ ...form, kebele: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#88bf47] focus:border-transparent transition-colors"
                      placeholder="Enter kebele"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      House No. *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.houseNo}
                      onChange={(e) => setForm({ ...form, houseNo: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#88bf47] focus:border-transparent transition-colors"
                      placeholder="Enter house number"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Telephone No. *
                    </label>
                    <input
                      type="tel"
                      required
                      value={form.telephone}
                      onChange={(e) => setForm({ ...form, telephone: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#88bf47] focus:border-transparent transition-colors"
                      placeholder="Enter telephone number"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Fax
                    </label>
                    <input
                      type="text"
                      value={form.fax}
                      onChange={(e) => setForm({ ...form, fax: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#88bf47] focus:border-transparent transition-colors"
                      placeholder="Enter fax number"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      E-mail *
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#88bf47] focus:border-transparent transition-colors"
                      placeholder="Enter email address"
                    />
                  </div>
                </div>
              </div>

              {/* Business Details Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Business Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Field of Business *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.fieldOfBusiness}
                      onChange={(e) => setForm({ ...form, fieldOfBusiness: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#88bf47] focus:border-transparent transition-colors"
                      placeholder="Enter field of business"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Capital in ETB *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={form.capitalInETB}
                      onChange={(e) => setForm({ ...form, capitalInETB: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#88bf47] focus:border-transparent transition-colors"
                      placeholder="Enter capital in ETB"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Additional Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Telebirr Number
                    </label>
                    <input
                      type="text"
                      value={form.telebirrNumber}
                      onChange={(e) => setForm({ ...form, telebirrNumber: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#88bf47] focus:border-transparent transition-colors"
                      placeholder="Enter Telebirr number"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Camera Configuration
                    </label>
                    <input
                      type="text"
                      value={form.cameraConfiguration}
                      onChange={(e) => setForm({ ...form, cameraConfiguration: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#88bf47] focus:border-transparent transition-colors"
                      placeholder="Enter camera configuration details"
                    />
                  </div>
                </div>
              </div>

              {/* Map and Coordinates Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Geographic Location</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Set Location on Map *
                  </label>
                  <p className="text-xs text-gray-500 mb-3">
                    Click on the map to set the center coordinates. The circle shows the geo-fence radius.
                  </p>
                  <div className="h-96 rounded-lg border border-gray-300 overflow-hidden">
                    <MapPicker
                      lat={form.lat}
                      lng={form.lng}
                      radius={form.radius}
                      onCoordinateChange={(lat, lng) => setForm({ ...form, lat, lng })}
                      className="h-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Latitude *
                    </label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={form.lat}
                      onChange={(e) => setForm({ ...form, lat: Number(e.target.value) })}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#88bf47] focus:border-transparent transition-colors"
                      placeholder="Enter latitude"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Longitude *
                    </label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={form.lng}
                      onChange={(e) => setForm({ ...form, lng: Number(e.target.value) })}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#88bf47] focus:border-transparent transition-colors"
                      placeholder="Enter longitude"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-gray-900 text-white px-5 py-2.5 text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm"
                >
                  Save Center
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CenterList;

