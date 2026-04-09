import { Outlet, Link, useLocation } from 'react-router-dom'

const navItems = [
  { path: '/', icon: 'home', label: 'Feed' },
  { path: '/events/1', icon: 'event', label: 'Events' },
  { path: '/events/new', icon: 'add_circle', label: 'Create' },
  { path: '/profile/1', icon: 'person', label: 'Profile' },
]

const desktopNavItems = [
  { path: '/', label: 'Feed' },
  { path: '/events/1', label: 'Events' },
  { path: '/profile/1', label: 'People' },
]

export default function Layout() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl shadow-[0_10px_40px_rgba(57,50,34,0.05)] hidden md:flex justify-between items-center px-8 h-20">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-2xl font-bold text-primary font-headline tracking-tight">
            We Are Still Here
          </Link>
          <div className="flex gap-6 items-center">
            {desktopNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                  location.pathname === item.path
                    ? 'text-primary font-bold border-b-2 border-primary'
                    : 'text-stone-500 hover:bg-orange-50'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 text-primary hover:bg-orange-50 rounded-full transition-all active:scale-95">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="p-2 text-primary hover:bg-orange-50 rounded-full transition-all active:scale-95">
            <span className="material-symbols-outlined">settings</span>
          </button>
          <Link to="/profile/1" className="h-10 w-10 rounded-full overflow-hidden border-2 border-primary-container">
            <img
              alt="User profile"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVNyrL6UkatX2-8MxDFSLtkcEHX8LnklmFtht1nmcnsDR6HCnXyRPWTMaE7yZlWg90xcey-PT6qkuFHGKgh5X4oQWOLrpixyKIiRecQcUV7bEQy_U9PRiQhalhU1YO1jKqZMIXsI3uzQ2rj-xm66vuFdQOfAooStBb2L27e9_QCadnH7zyvJu8agpdKpabmkMRjnYum_5W87mK9A3w-kV_s_rOtXccQj4jFEQrOFKMVMD9MgSi5jXWeeC7Hj5rUGfZQTE3AmaCIXM"
              className="w-full h-full object-cover"
            />
          </Link>
        </div>
      </nav>

      {/* Mobile TopAppBar */}
      <nav className="fixed top-0 w-full z-50 bg-surface md:hidden flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-3">
          <Link to="/profile/1" className="w-10 h-10 rounded-full overflow-hidden bg-surface-container-highest">
            <img
              alt="User profile"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVNyrL6UkatX2-8MxDFSLtkcEHX8LnklmFtht1nmcnsDR6HCnXyRPWTMaE7yZlWg90xcey-PT6qkuFHGKgh5X4oQWOLrpixyKIiRecQcUV7bEQy_U9PRiQhalhU1YO1jKqZMIXsI3uzQ2rj-xm66vuFdQOfAooStBb2L27e9_QCadnH7zyvJu8agpdKpabmkMRjnYum_5W87mK9A3w-kV_s_rOtXccQj4jFEQrOFKMVMD9MgSi5jXWeeC7Hj5rUGfZQTE3AmaCIXM"
              className="w-full h-full object-cover"
            />
          </Link>
          <h1 className="font-headline font-bold text-2xl tracking-tight text-primary">Hello, Team!</h1>
        </div>
        <button className="p-2 text-stone-500 hover:bg-stone-100 rounded-full transition-colors active:scale-95">
          <span className="material-symbols-outlined">notifications</span>
        </button>
      </nav>

      {/* Main Content */}
      <main className="pt-20 md:pt-24 pb-32 md:pb-12">
        <Outlet />
      </main>

      {/* Mobile FAB */}
      <Link
        to="/events/new"
        className="fixed bottom-28 right-6 w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-container text-white shadow-xl flex items-center justify-center z-50 active:scale-90 transition-transform md:hidden"
      >
        <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 0, 'wght' 600" }}>add</span>
      </Link>

      {/* Desktop FAB */}
      <Link
        to="/events/new"
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-xl shadow-[0_20px_50px_rgba(160,66,35,0.3)] hidden md:flex items-center justify-center group active:scale-90 transition-all duration-300 z-50"
      >
        <span className="material-symbols-outlined text-3xl transition-transform group-hover:rotate-90">add</span>
      </Link>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 w-full z-50 rounded-t-[3rem] bg-surface/80 backdrop-blur-xl shadow-[0_-10px_40px_rgba(57,50,34,0.05)] flex justify-around items-center px-8 pb-8 pt-4 md:hidden">
        {navItems.map((item) => {
          const isActive =
            item.path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.path)
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center p-3 transition-all ${
                isActive
                  ? 'bg-gradient-to-br from-primary to-primary-container text-white rounded-[24px] scale-110 shadow-lg'
                  : 'text-stone-500 hover:text-primary'
              }`}
            >
              <span
                className="material-symbols-outlined"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {item.icon}
              </span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
