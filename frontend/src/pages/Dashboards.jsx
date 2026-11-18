
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function DashboardCard({ title, description, to }) {
  return (
    <Link
      to={to}
      className="group relative block overflow-hidden rounded-2xl border border-blue-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-blue-300 hover:shadow-xl"
    >
      <div className="absolute right-0 top-0 h-24 w-24 -translate-y-8 translate-x-8 rounded-full bg-blue-50 transition-all duration-300 group-hover:scale-150 group-hover:bg-blue-100" />

      <div className="relative">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#173b70] to-blue-600 text-xl font-bold text-white shadow-md transition-transform duration-300 group-hover:scale-110">
          <span>↗</span>
        </div>

        <h3 className="text-lg font-extrabold text-[#173b70] transition-colors group-hover:text-blue-600">
          {title}
        </h3>

        <p className="mt-3 min-h-12 text-sm leading-6 text-slate-500">
          {description}
        </p>

        <div className="mt-6 flex items-center justify-between border-t border-blue-50 pt-4">
          <span className="text-sm font-bold text-orange-500">
            Open section
          </span>

          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-[#173b70] transition-all duration-300 group-hover:translate-x-1 group-hover:bg-[#173b70] group-hover:text-white">
            →
          </span>
        </div>
      </div>
    </Link>
  );
}

function DashboardWelcome({ title, description, name }) {
  return (
    <div className="hero-grid relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-[#142B59] to-[#2563EB] p-6 text-white shadow-lg md:p-8">
      <div className="relative z-10">
        <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide text-blue-100">
          SIMS WORKSPACE
        </span>

        <h1 className="mt-4 text-2xl font-extrabold tracking-tight md:text-3xl">
          {title}
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100 md:text-base">
          {description}
        </p>

        {name && (
          <p className="mt-4 text-sm font-semibold text-orange-300">
            Welcome, {name}
          </p>
        )}
      </div>

      <div className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full border-[25px] border-white/5" />
      <div className="pointer-events-none absolute -bottom-24 right-24 h-48 w-48 rounded-full bg-blue-400/10 blur-2xl" />
    </div>
  );
}

function SectionHeading({ title, description }) {
  return (
    <div className="mb-5">
      <h2 className="text-lg font-extrabold text-slate-800">
        {title}
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        {description}
      </p>
    </div>
  );
}

export function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div className="animate-fade-in">
      <DashboardWelcome
        title="Admin Dashboard"
        description="Manage your school's information and administrative activities from one central workspace."
        name={user?.full_name}
      />

      <SectionHeading
        title="Administration"
        description="Choose a section to manage."
      />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <DashboardCard
          title="Manage Students"
          description="Search, add, edit and deactivate student records."
          to="/admin/students"
        />

        <DashboardCard
          title="Manage Users"
          description="Create accounts and assign system roles."
          to="/admin/users"
        />

        <DashboardCard
          title="Public Directory"
          description="Preview the public student directory."
          to="/"
        />
      </div>
    </div>
  );
}

export function AnimationDashboard() {
  return (
    <div className="animate-fade-in">
      <DashboardWelcome
        title="Animation Dashboard"
        description="Manage students' arrival materials and attendance activities."
      />

      <SectionHeading
        title="Student Management"
        description="Access your daily student management activities."
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <DashboardCard
          title="Student Materials Checking"
          description="Check RAM, buckets, IKIYIKO, IFOKE, ISAHANE, IGIKOMBE and other term requirements. View completed and not yet completed students."
          to="/animation/materials-checking"
        />

        <DashboardCard
          title="Student Attendance"
          description="Record regular student attendance separately from materials checking."
          to="/animation/attendance"
        />
      </div>
    </div>
  );
}

export function SecretaryDashboard() {
  return (
    <div className="animate-fade-in">
      <DashboardWelcome
        title="Secretary Dashboard"
        description="Manage student registration and maintain school records."
      />

      <SectionHeading
        title="Student Administration"
        description="Access student registration and record management."
      />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <DashboardCard
          title="Student Records"
          description="Search, view, add and update student information."
          to="/secretary/students"
        />
      </div>
    </div>
  );
}
