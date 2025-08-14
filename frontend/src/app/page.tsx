export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-6 py-12 text-center">
        <div className="bg-white rounded-2xl shadow-xl p-12">
          <div className="mb-8">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Trakit
            </h1>
            <div className="w-24 h-1 bg-indigo-600 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 mb-8">
              Concept prototype system for accounting automation
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="p-6 bg-indigo-50 rounded-lg">
              <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Document Automation</h3>
              <p className="text-gray-600">Digitization and processing of financial documents</p>
            </div>
            
            <div className="p-6 bg-green-50 rounded-lg">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Company Management</h3>
              <p className="text-gray-600">Centralized management of multiple organizations</p>
            </div>
            
            <div className="p-6 bg-purple-50 rounded-lg">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics & Reports</h3>
              <p className="text-gray-600">Intelligent data processing and report generation</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <a 
              href="/auth" 
              className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Login
            </a>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              This is a demonstration version of the Trakit system. All features are under development.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}