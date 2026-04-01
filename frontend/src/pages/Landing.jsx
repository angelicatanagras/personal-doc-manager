import { Link } from 'react-router-dom';

const HERO_IMG =
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=80';
const WORKSPACE_IMG =
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=80';
const TEAM_IMG =
  'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=900&q=80';

const features = [
  {
    title: 'Easy Upload',
    description:
      'Drag and drop or choose files. Supports PDF, DOCX, JPG, PNG, and XLSX up to 50 MB.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
      </svg>
    ),
  },
  {
    title: 'Folder Organisation',
    description: 'Create folders and subfolders to keep documents structured the way you think.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7a2 2 0 012-2h3.586a1 1 0 01.707.293L10.414 6.5H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
      </svg>
    ),
  },
  {
    title: 'Smart Search',
    description: 'Find any document instantly by name, type, category, or date range.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    title: 'Secure Storage',
    description: 'Authentication-protected access on every request. Your files stay private.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: 'Expiry Reminders',
    description: 'Get alerts when passports, insurance, or contracts are about to expire.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Version History',
    description: 'Re-upload documents and keep every previous version. Restore any revision.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
];

const steps = [
  {
    number: '01',
    title: 'Create your account',
    description: 'Sign up for free in seconds. No credit card required. 5 GB included from day one.',
  },
  {
    number: '02',
    title: 'Upload your documents',
    description: 'Drag and drop files or browse to upload. Organise into folders and add tags instantly.',
  },
  {
    number: '03',
    title: 'Access anywhere',
    description: 'Log in from any device and find what you need in seconds with powerful search and filters.',
  },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-white font-sans">

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-teal-700 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            </div>
            <span className="font-bold text-slate-800 text-lg tracking-tight">CloudDoc</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-slate-600 hover:text-teal-700 text-sm font-medium transition-colors">Features</a>
            <a href="#how-it-works" className="text-slate-600 hover:text-teal-700 text-sm font-medium transition-colors">How it works</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-slate-600 hover:text-slate-900 text-sm font-medium px-3 py-2 transition-colors">
              Sign in
            </Link>
            <Link
              to="/register"
              className="bg-teal-700 hover:bg-teal-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors shadow-sm"
            >
              Get started free →
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        {/* Background photo */}
        <div className="absolute inset-0">
          <img
            src={HERO_IMG}
            alt="Hero background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-900/30" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-32">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-medium px-4 py-2 rounded-full mb-8">
              <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
              Free 5 GB · No credit card needed
            </div>

            <h1 className="font-display text-5xl md:text-7xl font-extrabold leading-[1.05] mb-6 text-white">
              Your personal{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-teal-300">
                document vault
              </span>{' '}
              in the cloud
            </h1>

            <p className="text-slate-300 text-xl leading-relaxed mb-10 max-w-xl">
              Upload, organise, and access all your important files — passports, contracts,
              insurance, and more — from any device, securely.
            </p>

            <div className="flex flex-wrap gap-4 mb-10">
              <Link
                to="/register"
                className="flex items-center gap-2 bg-teal-700 hover:bg-teal-600 text-white font-medium px-6 py-3 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Start for free
              </Link>
              <a
                href="#how-it-works"
                className="flex items-center gap-2 border border-white/30 hover:border-white/60 text-white font-medium px-6 py-3 rounded-lg transition-colors"
              >
                See how it works
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </a>
            </div>

            <p className="text-slate-400 text-sm">
              Supports <span className="text-slate-300">PDF · DOCX · JPG · PNG · XLSX</span> · Max 50 MB
            </p>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 animate-bounce">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* Trust bar */}
      <section className="bg-slate-50 border-y border-slate-100 py-6">
        <div className="max-w-5xl mx-auto px-6 flex flex-wrap items-center justify-center gap-8 text-slate-400 text-sm font-medium">
          {['PDF', 'DOCX', 'JPG', 'PNG', 'XLSX'].map((type) => (
            <span key={type} className="flex items-center gap-2">
              <span className="w-2 h-2 bg-teal-400 rounded-full" />
              {type} supported
            </span>
          ))}
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-teal-400 rounded-full" />
            Up to 50 MB per file
          </span>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block bg-teal-50 text-teal-700 text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full mb-4">
              Why CloudDoc
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-extrabold text-slate-800 mb-5">
              Everything you need to stay organised
            </h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              One place for all your personal documents — always accessible, always secure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="group bg-white border border-slate-100 rounded-xl p-6 hover:border-slate-200 hover:shadow-md transition-all duration-200"
              >
                <div className="w-12 h-12 bg-teal-50 group-hover:bg-teal-100 text-teal-700 rounded-xl flex items-center justify-center mb-5 transition-colors">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-slate-800 text-lg mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works — with real photo */}
      <section id="how-it-works" className="py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Photo */}
            <div className="relative">
              <img
                src={WORKSPACE_IMG}
                alt="Person organising documents at their desk"
                className="rounded-3xl object-cover w-full h-[520px] shadow-2xl"
              />
              {/* Floating badge */}
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-5 flex items-center gap-4 border border-slate-100">
                <div className="w-12 h-12 bg-teal-600 rounded-xl flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-lg leading-none">5 GB free</p>
                  <p className="text-slate-500 text-sm mt-1">No credit card needed</p>
                </div>
              </div>
            </div>

            {/* Steps */}
            <div>
              <span className="inline-block bg-teal-50 text-teal-700 text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full mb-6">
                How it works
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-extrabold text-slate-800 mb-12">
                Up and running in minutes
              </h2>
              <div className="flex flex-col gap-10">
                {steps.map((step, i) => (
                  <div key={step.number} className="flex gap-6">
                    <div className="shrink-0 w-12 h-12 rounded-lg bg-teal-700 text-white font-bold text-base flex items-center justify-center">
                      {step.number}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 text-lg mb-1">{step.title}</h3>
                      <p className="text-slate-500 leading-relaxed">{step.description}</p>
                      {i < steps.length - 1 && (
                        <div className="w-px h-8 bg-slate-200 ml-0 mt-6" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats — photo background */}
      <section className="relative py-24 overflow-hidden">
        <img
          src={TEAM_IMG}
          alt="Team working"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-900/80" />
        <div className="relative max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 text-center">
            {[
              { value: '5', unit: 'GB', label: 'Free storage included' },
              { value: '100', unit: '%', label: 'Web-based, any device' },
              { value: '50', unit: 'MB', label: 'Max file size supported' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-6xl font-bold text-white mb-1">
                  {stat.value}
                  <span className="text-teal-400">{stat.unit}</span>
                </div>
                <p className="text-slate-300 text-sm mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-display text-4xl md:text-5xl font-extrabold text-slate-800 mb-5">
            Ready to organise your documents?
          </h2>
          <p className="text-slate-500 text-lg mb-10">
            Get started for free — no credit card required. 5 GB included from day one.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="flex items-center justify-center gap-2 bg-teal-700 hover:bg-teal-600 text-white font-medium px-6 py-3 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Create free account
            </Link>
            <Link
              to="/login"
              className="flex items-center justify-center gap-2 border border-slate-300 text-slate-600 hover:border-slate-400 hover:text-slate-800 font-medium px-6 py-3 rounded-lg transition-colors"
            >
              Sign in →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-teal-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            </div>
            <span className="font-bold text-white text-sm">CloudDoc</span>
          </div>
          <p className="text-slate-500 text-sm">© 2026 CloudDoc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            {['Privacy', 'Terms', 'Contact'].map((link) => (
              <a key={link} href="#" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
