
import { useEffect, useState } from 'react';
import { Search, Users, GraduationCap, ArrowRight, BookOpen } from 'lucide-react';
import api, { getResponseData } from '../services/api';

export default function PublicHome() {
  const [students, setStudents] = useState([]);
  const [levels, setLevels] = useState([]);
  const [levelId, setLevelId] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/academic/levels')
      .then(r => setLevels(getResponseData(r)))
      .catch(() => setError('Could not load levels.'));
  }, []);

  useEffect(() => {
    setLoading(true);
    api.get('/students', { params: { search, level_id: levelId || undefined } })
      .then(r => setStudents(getResponseData(r)))
      .catch(() => setError('Could not load students. Check that the backend and database are running.'))
      .finally(() => setLoading(false));
  }, [search, levelId]);

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Hero Section */}
      <section className="hero-grid relative overflow-hidden bg-gradient-to-br from-[#142B59] via-[#173b70] to-blue-900 text-white">
        <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full bg-blue-400/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-orange-400/10 blur-3xl" />

        <div className="container-page relative py-20 md:py-28">
          <div className="max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm">
              <GraduationCap size={17} className="text-orange-400" />
              <span className="text-xs font-bold uppercase tracking-[.2em] text-blue-100">
                Welcome to our school
              </span>
            </div>

            <h1 className="max-w-4xl text-4xl font-black leading-tight tracking-tight md:text-6xl lg:text-7xl">
              School Information
              <span className="block text-orange-400">Management System</span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-8 text-blue-100 md:text-lg">
              Discover our school community and easily find student records
              through our student directory.
            </p>

            <a
              href="#students"
              className="group mt-9 inline-flex items-center gap-3 rounded-xl bg-orange-500 px-7 py-4 font-bold text-white shadow-lg shadow-orange-950/20 transition duration-300 hover:-translate-y-1 hover:bg-orange-600 hover:shadow-xl"
            >
              Explore Student Directory
              <ArrowRight size={19} className="transition-transform group-hover:translate-x-1" />
            </a>

            <div className="mt-12 flex flex-wrap gap-8 border-t border-white/15 pt-8">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-white/10 p-3">
                  <Users size={22} className="text-orange-400" />
                </div>
                <div>
                  <p className="text-xl font-bold">{students.length}</p>
                  <p className="text-sm text-blue-200">Student records</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-white/10 p-3">
                  <BookOpen size={22} className="text-orange-400" />
                </div>
                <div>
                  <p className="text-xl font-bold">{levels.length}</p>
                  <p className="text-sm text-blue-200">Academic levels</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Student Directory */}
      <section id="students" className="container-page py-14 md:py-20">

        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="h-1 w-9 rounded-full bg-orange-500" />
              <p className="text-xs font-extrabold uppercase tracking-[.2em] text-orange-600">
                Student Directory
              </p>
            </div>

            <h2 className="text-3xl font-black tracking-tight text-[#142B59] md:text-4xl">
              Explore Our Students
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500 md:text-base">
              Search and browse student information by name, admission number,
              or academic level.
            </p>
          </div>

          <div className="inline-flex w-fit items-center gap-3 rounded-2xl border border-blue-100 bg-white px-5 py-3 shadow-sm">
            <div className="rounded-xl bg-blue-50 p-2.5 text-blue-700">
              <Users size={21} />
            </div>
            <div>
              <p className="text-2xl font-black text-[#142B59]">{students.length}</p>
              <p className="text-xs font-medium text-slate-500">Student records</p>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 rounded-2xl border border-blue-100 bg-white p-5 shadow-sm md:p-6">
          <div className="mb-4 flex items-center gap-2">
            <Search size={18} className="text-blue-600" />
            <h3 className="font-bold text-[#142B59]">Find a Student</h3>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="relative block">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={19}
              />
              <input
                className="field h-12 rounded-xl border-slate-200 pl-12 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="Search by name or admission number"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </label>

            <select
              className="field h-12 rounded-xl border-slate-200 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              value={levelId}
              onChange={e => setLevelId(e.target.value)}
            >
              <option value="">All academic levels</option>
              {levels.map(level => (
                <option key={level.id} value={level.id}>
                  {level.level_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-5 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            {error}
          </div>
        )}

        {/* Student Table */}
        <div className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-blue-100 px-5 py-5 md:px-7">
            <div>
              <h3 className="text-lg font-extrabold text-[#142B59]">
                Student Records
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Available student directory information
              </p>
            </div>

            <span className="rounded-full bg-blue-50 px-4 py-2 text-xs font-bold text-blue-700">
              {students.length} Records
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px] text-left text-sm">
              <thead className="bg-[#142B59] text-white">
                <tr>
                  <th className="px-5 py-4 font-bold">No.</th>
                  <th className="px-5 py-4 font-bold">Admission No.</th>
                  <th className="px-5 py-4 font-bold">Student Name</th>
                  <th className="px-5 py-4 font-bold">Gender</th>
                  <th className="px-5 py-4 font-bold">Level</th>
                  <th className="px-5 py-4 font-bold">Combination</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-blue-50">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-5 py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="h-9 w-9 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
                        <span className="font-medium text-slate-500">
                          Loading students...
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : students.length ? (
                  students.map((s, i) => (
                    <tr
                      className="transition duration-200 hover:bg-blue-50/70"
                      key={s.id}
                    >
                      <td className="px-5 py-4 font-semibold text-slate-500">
                        {i + 1}
                      </td>
                      <td className="px-5 py-4">
                        <span className="rounded-lg bg-blue-50 px-3 py-1.5 font-bold text-blue-700">
                          {s.admission_number}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-bold text-[#142B59]">
                        {s.first_name} {s.last_name}
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {s.gender}
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {s.level_name || '—'}
                      </td>
                      <td className="px-5 py-4">
                        <span className="rounded-lg bg-orange-50 px-3 py-1.5 font-semibold text-orange-700">
                          {s.combination_name || '—'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-5 py-16 text-center">
                      <div className="mx-auto flex max-w-sm flex-col items-center">
                        <div className="mb-4 rounded-2xl bg-blue-50 p-4 text-blue-500">
                          <Users size={30} />
                        </div>
                        <p className="font-bold text-[#142B59]">
                          No students found
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          Try changing your search term or selecting another level.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="border-t border-blue-100 bg-slate-50 px-5 py-4">
            <p className="text-xs text-slate-500">
              Student directory · School Information Management System
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
