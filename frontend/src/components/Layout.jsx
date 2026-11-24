
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="relative z-10 bg-navy text-white shadow-xl">
        <div className="container-page flex flex-wrap items-center justify-between gap-4 py-4">
          <Link
            to="/"
            className="flex items-center gap-3 text-xl font-extrabold tracking-wide transition hover:opacity-80"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-orange-400">
              S
            </span>
            <span>
              SIMS
              <span className="ml-2 text-xs font-medium text-blue-200">
                SCHOOL MANAGEMENT
              </span>
            </span>
          </Link>

          <nav className="flex flex-wrap items-center gap-2 text-sm font-semibold">
            <Link
              to="/login?role=admin"
              className="rounded-lg px-4 py-2 transition hover:bg-white/10 hover:text-orange-300"
            >
              Admin
            </Link>
            <Link
              to="/login?role=animation"
              className="rounded-lg px-4 py-2 transition hover:bg-white/10 hover:text-orange-300"
            >
              Animation
            </Link>
            <Link
              to="/login?role=secretary"
              className="rounded-lg px-4 py-2 transition hover:bg-white/10 hover:text-orange-300"
            >
              Secretary
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-slate-800 bg-slate-950 px-4 py-5 text-center text-sm text-slate-400">
        © {new Date().getFullYear()} School Information Management System
        <span className="mx-2 text-orange-400">•</span>
        All rights reserved
      </footer>
    </div>
  );
}

export function PrivateLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const links =
    user?.role === 'admin'
      ? [
          ['/admin/dashboard', 'Dashboard'],
          ['/admin/students', 'Students'],
          ['/admin/users', 'Users']
        ]
      : user?.role === 'animation'
      ? [
          ['/animation/dashboard', 'Dashboard'],
          ['/animation/attendance', 'Attendance'],
          ['/animation/tickets', 'View Tickets']
        ]
      : [
          ['/secretary/dashboard', 'Dashboard'],
          ['/secretary/students', 'Students']
        ];

  return (
    <div className="min-h-screen bg-slate-100 md:flex">
      <aside className="relative z-10 flex flex-col bg-gradient-to-b from-[#173b70] to-[#10294f] p-5 text-white shadow-xl md:min-h-screen md:w-64 md:shrink-0">
        <Link
          to="/"
          className="mb-2 flex items-center gap-3 rounded-xl p-2 transition hover:bg-white/10"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-xl font-extrabold text-orange-400">
            S
          </span>

          <span>
            <span className="block text-xl font-extrabold tracking-wide">
              SIMS
            </span>
            <span className="block text-[10px] font-medium tracking-[0.18em] text-blue-200">
              MANAGEMENT SYSTEM
            </span>
          </span>
        </Link>

        <div className="mb-6 mt-4 rounded-xl border border-white/10 bg-white/10 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-blue-200">
            Current workspace
          </p>
          <p className="mt-1 text-sm font-bold">
            {user?.role?.toUpperCase()} AREA
          </p>
        </div>

        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-200">
          Main navigation
        </p>

        <nav className="grid gap-2">
          {links.map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `group flex items-center rounded-xl border px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'border-white/30 bg-white text-[#173b70] shadow-lg'
                    : 'border-transparent text-blue-100 hover:translate-x-1 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <span className="mr-3 h-2 w-2 rounded-full bg-current opacity-70 transition" />
              {label}
            </NavLink>
          ))}

          <button
            className="mt-4 flex w-full items-center rounded-xl border border-white/10 px-4 py-3 text-left text-sm font-semibold text-blue-100 transition hover:border-red-300/30 hover:bg-red-500/15 hover:text-white"
            onClick={() => {
              logout();
              navigate('/');
            }}
          >
            <span className="mr-3">↪</span>
            Log out
          </button>
        </nav>

        <div className="mt-auto hidden rounded-xl border border-white/10 bg-white/5 p-4 md:block">
          <p className="text-xs font-semibold text-white">
            School Information Management System
          </p>
          <p className="mt-1 text-[11px] text-blue-200">
            Secure school administration
          </p>
        </div>
      </aside>

      <section className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 border-b border-blue-100 bg-white/95 px-5 py-4 shadow-sm backdrop-blur-md md:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-500">
              SIMS Workspace
            </p>
            <h2 className="text-sm font-bold text-slate-800 md:text-base">
              School Information Management System
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-bold text-slate-800">
                {user?.full_name}
              </p>
              <p className="text-xs capitalize text-slate-500">
                {user?.role}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-blue-100 bg-blue-50 font-bold text-[#173b70]">
              {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8">
          <div className="mx-auto w-full max-w-7xl animate-fade-in">
            <Outlet />
          </div>
        </main>

        <footer className="border-t border-blue-100 bg-white px-5 py-4 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} SIMS
          <span className="mx-2 text-orange-500">•</span>
          School Information Management System
        </footer>
      </section>
    </div>
  );
}
