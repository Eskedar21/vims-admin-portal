function PlaceholderPage({ title }) {
  return (
    <div className="max-w-7xl mx-auto w-full space-y-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-gray-600">
          This section will host the {title.toLowerCase()} features for the VIMS System Administration Portal.
        </p>
      </div>
      
      {/* Coming Soon Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-16">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-lg font-semibold text-gray-900 mb-2">Coming Soon</p>
          <p className="text-sm text-gray-600">This feature is under development.</p>
        </div>
      </div>
    </div>
  );
}

export default PlaceholderPage;


