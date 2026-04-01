import { Link } from 'react-router-dom';

const AppMockup = () => (
  <div className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-lg border border-slate-200">
    {/* Mockup top bar */}
    <div className="bg-slate-100 px-4 py-2 flex items-center gap-2 border-b border-slate-200">
      <div className="w-3 h-3 rounded-full bg-red-400" />
      <div className="w-3 h-3 rounded-full bg-yellow-400" />
      <div className="w-3 h-3 rounded-full bg-green-400" />
      <div className="flex-1 mx-4 bg-white rounded h-5 text-xs text-slate-400 flex items-center px-2">
        clouddoc.app/dashboard
      </div>
    </div>
    <div className="flex h-64">
      {/* Sidebar */}
      <div className="w-36 bg-slate-800 p-3 flex flex-col gap-1 shrink-0">
        <div className="flex items-center gap-1.5 mb-3">
          <div className="w-5 h-5 bg-teal-500 rounded" />
          <span className="text-white text-xs font-semibold">CloudDoc</span>
        </div>
        {[{ active: true }, {}, {}, {}, {}].map((item, i) => (
          <div
            key={i}
            className={`h-6 rounded flex items-center gap-1.5 px-2 ${item.active ? 'bg-teal-700' : ''}`}
          >
            <div className={`w-3 h-3 rounded-sm ${item.active ? 'bg-teal-300' : 'bg-slate-600'}`} />
            <div className={`h-2 rounded flex-1 ${item.active ? 'bg-teal-300' : 'bg-slate-600'}`} />
          </div>
        ))}
        <div className="mt-auto">
          <div className="h-1.5 rounded-full bg-slate-600 mb-1" />
          <div className="h-1.5 rounded-full bg-teal-500 w-2/3" />
        </div>
      </div>
      {/* Main content */}
      <div className="flex-1 bg-slate-50 p-3 flex flex-col gap-2 overflow-hidden">
        <div className="flex items-center justify-between mb-1">
          <div className="h-3 bg-slate-300 rounded w-24" />
          <div className="h-6 bg-teal-700 rounded w-16" />
        </div>
        {/* Upload zone */}
        <div className="border-2 border-dashed border-slate-300 rounded-lg p-3 flex flex-col items-center justify-center gap-1 bg-white">
          <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-teal-400 rounded-sm" />
          </div>
          <div className="h-2 bg-slate-200 rounded w-24" />
          <div className="h-2 bg-slate-100 rounded w-16" />
        </div>
        {/* Doc rows */}
        {[
          { color: 'bg-red-300', tag: 'bg-yellow-200' },
          { color: 'bg-blue-300', tag: 'bg-green-200' },
          { color: 'bg-teal-300', tag: 'bg-slate-200' },
        ].map((row, i) => (
          <div key={i} className="flex items-center gap-2 bg-white rounded px-2 py-1.5 border border-slate-100">
            <div className={`w-4 h-4 rounded ${row.color}`} />
            <div className="h-2 bg-slate-200 rounded flex-1" />
            <div className={`h-4 w-10 rounded-full ${row.tag}`} />
          </div>
        ))}
      </div>
    </div>
  </div>
);

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow">
    <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center mb-4 text-teal-700">
      {icon}
    </div>
    <h3 className="font-semibold text-slate-800 mb-2">{title}</h3>
    <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
  </div>
);

const Landing = () => {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-teal-700 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            </div>
            <span className="font-bold text-slate-800 text-lg">CloudDoc</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors">Features</a>
            <a href="#how-it-works" className="text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors">How it works</a>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors px-3 py-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Sign in
            </Link>
            <Link
              to="/register"
              className="bg-teal-700 hover:bg-teal-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-1"
            >
              Get started free
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-slate-800 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row min-h-[480px]">
            {/* Left — text */}
            <div className="flex-1 py-20 flex flex-col justify-center pr-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-slate-700 text-slate-200 text-xs font-medium px-3 py-1.5 rounded-full mb-8 w-fit border border-slate-600">
                <div className="w-1.5 h-1.5 bg-teal-400 rounded-full" />
                Free 5 GB · No credit card needed
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
                <span className="text-white italic font-serif">Your personal</span>
                <br />
                <span className="text-teal-400">document vault</span>
                <br />
                <span className="text-white">in the cloud</span>
              </h1>
              <p className="text-slate-300 text-lg leading-relaxed mb-8 max-w-md">
                Upload, organise, and access all your important files — passports,
                contracts, insurance, and more — from any device, securely.
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                <Link
                  to="/register"
                  className="flex items-center gap-2 bg-teal-700 hover:bg-teal-600 text-white font-medium px-6 py-3 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Start for free
                </Link>
                <a
                  href="#how-it-works"
                  className="flex items-center gap-2 border border-slate-500 text-slate-200 hover:border-slate-300 hover:text-white font-medium px-6 py-3 rounded-lg transition-colors"
                >
                  See how it works
                </a>
              </div>
              <p className="text-slate-400 text-sm">
                Supports PDF · DOCX · JPG · PNG · XLSX · Max 50 MB
              </p>
            </div>
            {/* Right — mockup */}
            <div className="hidden lg:flex flex-1 items-center justify-center py-12 bg-slate-50 lg:-mr-6">
              <div className="px-8 w-full max-w-lg">
                <AppMockup />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-teal-700 text-xs font-semibold tracking-widest uppercase mb-3">Why CloudDoc</p>
            <h2 className="text-4xl font-bold text-slate-800 mb-4">Everything you need to stay organised</h2>
            <p className="text-slate-500 text-lg">One place for all your personal documents — always accessible, always secure.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              title="Easy Upload"
              description="Drag and drop or choose files. Supports PDF, DOCX, JPG, PNG, and XLSX up to 50 MB."
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              }
            />
            <FeatureCard
              title="Folder Organisation"
              description="Create folders and subfolders to keep documents structured the way you think."
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7a2 2 0 012-2h3.586a1 1 0 01.707.293L10.414 6.5H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
                </svg>
              }
            />
            <FeatureCard
              title="Search & Filter"
              description="Find any document instantly by name, type, category, or date range."
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
            />
            <FeatureCard
              title="Secure Storage"
              description="Authentication-protected access on every request. Your files stay private."
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              }
            />
            <FeatureCard
              title="Expiry Reminders"
              description="Get alerts when passports, insurance, or contracts are about to expire."
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <FeatureCard
              title="Version History"
              description="Re-upload documents and keep every previous version. Restore any revision."
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
            />
          </div>
        </div>
      </section>

      {/* Stats banner */}
      <section className="bg-slate-800 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-16">
            <div className="text-center">
              <div className="text-5xl font-bold text-white mb-1">
                5<span className="text-teal-400">GB</span>
              </div>
              <p className="text-slate-400 text-sm">Free storage included</p>
            </div>
            <div className="hidden sm:block w-px h-12 bg-slate-600" />
            <div className="text-center">
              <div className="text-5xl font-bold text-white mb-1">
                100<span className="text-teal-400">%</span>
              </div>
              <p className="text-slate-400 text-sm">Web-based, any device</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-slate-800 mb-4">Ready to organise your documents?</h2>
          <p className="text-slate-500 text-lg mb-10">
            Get started for free — no credit card required. 5 GB included from day one.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/register"
              className="flex items-center justify-center gap-2 bg-teal-700 hover:bg-teal-600 text-white font-medium px-6 py-3 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Create free account
            </Link>
            <Link
              to="/login"
              className="flex items-center justify-center gap-2 border border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 font-medium px-6 py-3 rounded-lg transition-colors"
            >
              Sign in
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-teal-700 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            </div>
          </div>
          <p className="text-slate-400 text-sm">© 2026 CloudDoc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-slate-400 hover:text-slate-600 text-sm transition-colors">Privacy</a>
            <a href="#" className="text-slate-400 hover:text-slate-600 text-sm transition-colors">Terms</a>
            <a href="#" className="text-slate-400 hover:text-slate-600 text-sm transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
