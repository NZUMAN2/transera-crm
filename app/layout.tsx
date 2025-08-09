{/* Mobile Responsive Header */}
<header className="bg-gradient-to-r from-purple-700 to-purple-900 text-white shadow-lg">
  <div className="px-4 py-3">
    <div className="flex items-center justify-between">
      {/* Mobile Menu Button */}
      <button className="lg:hidden p-2">
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      
      {/* Logo - Responsive */}
      <div className="flex items-center space-x-2 lg:space-x-3">
        <div className="bg-purple-600 rounded-lg p-1 lg:p-2">
          <span className="text-lg lg:text-2xl font-bold">TS</span>
        </div>
        <div className="hidden lg:block">
          <h1 className="text-xl font-bold">TransEra Solutions</h1>
          <p className="text-xs text-purple-200">Professional Recruitment CRM</p>
        </div>
      </div>

      {/* Rest of header... */}
    </div>
  </div>

  {/* Mobile Navigation */}
  <nav className="bg-purple-800 bg-opacity-50 overflow-x-auto">
    <div className="px-4">
      <div className="flex space-x-1 min-w-max">
        {/* Navigation items... */}
      </div>
    </div>
  </nav>
</header>
