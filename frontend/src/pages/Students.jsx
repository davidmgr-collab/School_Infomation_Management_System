
import { useEffect, useState } from 'react';
import api, { getResponseData } from '../services/api';

const emptyForm = {
  admission_number: '',
  first_name: '',
  last_name: '',
  gender: 'Male',
  date_of_birth: '',
  phone: '',
  guardian_name: '',
  guardian_phone: '',
  address: '',
  academic_year_id: '',
  combination_id: ''
};

export default function Students() {
  const [students, setStudents] = useState([]);
  const [years, setYears] = useState([]);
  const [levels, setLevels] = useState([]);
  const [combinations, setCombinations] = useState([]);
  const [levelId, setLevelId] = useState('');
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState('');

  const load = async () => {
    const [s, y, l] = await Promise.all([
      api.get('/students', { params: { search } }),
      api.get('/academic/years'),
      api.get('/academic/levels')
    ]);

    setStudents(getResponseData(s));
    setYears(getResponseData(y));
    setLevels(getResponseData(l));
  };

  useEffect(() => {
    load().catch(e =>
      setMessage(e.response?.data?.message || 'Could not load data.')
    );
  }, [search]);

  useEffect(() => {
    api.get('/academic/combinations', {
      params: { level_id: levelId || undefined }
    })
      .then(r => setCombinations(getResponseData(r)))
      .catch(() => setCombinations([]));
  }, [levelId]);

  const save = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      if (editing) await api.put(`/students/${editing}`, form);
      else await api.post('/students', form);

      setForm(emptyForm);
      setEditing(null);
      await load();
      setMessage('Student saved successfully.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Could not save student.');
    }
  };

  const edit = (s) => {
    setEditing(s.id);

    setForm({
      admission_number: s.admission_number,
      first_name: s.first_name,
      last_name: s.last_name,
      gender: s.gender,
      date_of_birth: s.date_of_birth?.slice(0, 10) || '',
      phone: s.phone || '',
      guardian_name: s.guardian_name || '',
      guardian_phone: s.guardian_phone || '',
      address: s.address || '',
      academic_year_id: s.academic_year_id || '',
      combination_id: s.combination_id || ''
    });

    setLevelId(String(s.level_id || ''));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const remove = async (id) => {
    if (!window.confirm('Deactivate this student record?')) return;

    try {
      await api.delete(`/students/${id}`);
      await load();
      setMessage('Student deactivated.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Could not deactivate student.');
    }
  };

  return (
    <div className="animate-fade-in space-y-7">

      {/* Page heading */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
            School administration
          </span>
          <h1 className="page-title mb-1">Manage Students</h1>
          <p className="text-sm text-slate-500">
            Register students and manage existing student records.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 self-start rounded-xl border border-blue-100 bg-white px-4 py-3 shadow-sm">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 font-bold text-[#173b70]">
            {students.length}
          </span>
          <div>
            <p className="text-xs text-slate-500">Student records</p>
            <p className="text-sm font-bold text-[#173b70]">Total loaded</p>
          </div>
        </div>
      </div>

      {/* Registration form */}
      <form onSubmit={save} className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">

        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-blue-100 bg-gradient-to-r from-[#173b70] to-blue-700 px-5 py-5 text-white md:px-7">
          <div>
            <h2 className="text-lg font-extrabold">
              {editing ? 'Edit Student Information' : 'Student Registration'}
            </h2>
            <p className="mt-1 text-xs text-blue-100">
              Enter the required student information below.
            </p>
          </div>

          <span className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-xs font-bold">
            {editing ? 'EDIT MODE' : 'NEW REGISTRATION'}
          </span>
        </div>

        <div className="p-5 md:p-7">

          <div className="mb-5">
            <h3 className="text-sm font-extrabold text-[#173b70]">
              Personal Information
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              Student identity and contact details
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <input
              className="field"
              placeholder="Admission number"
              value={form.admission_number}
              onChange={e => setForm({ ...form, admission_number: e.target.value })}
              required
            />

            <input
              className="field"
              placeholder="First name"
              value={form.first_name}
              onChange={e => setForm({ ...form, first_name: e.target.value })}
              required
            />

            <input
              className="field"
              placeholder="Last name"
              value={form.last_name}
              onChange={e => setForm({ ...form, last_name: e.target.value })}
              required
            />

            <select
              className="field"
              value={form.gender}
              onChange={e => setForm({ ...form, gender: e.target.value })}
            >
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>

            <input
              className="field"
              type="date"
              value={form.date_of_birth}
              onChange={e => setForm({ ...form, date_of_birth: e.target.value })}
            />

            <input
              className="field"
              placeholder="Phone"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
            />

            <input
              className="field"
              placeholder="Guardian name"
              value={form.guardian_name}
              onChange={e => setForm({ ...form, guardian_name: e.target.value })}
            />

            <input
              className="field"
              placeholder="Guardian phone"
              value={form.guardian_phone}
              onChange={e => setForm({ ...form, guardian_phone: e.target.value })}
            />

            <input
              className="field"
              placeholder="Address"
              value={form.address}
              onChange={e => setForm({ ...form, address: e.target.value })}
            />
          </div>

          <div className="mb-5 mt-8 border-t border-slate-100 pt-6">
            <h3 className="text-sm font-extrabold text-[#173b70]">
              Academic Information
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              Select the academic year, level and combination
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <select
              className="field"
              value={form.academic_year_id}
              onChange={e => setForm({ ...form, academic_year_id: e.target.value })}
              required
            >
              <option value="">Select academic year</option>
              {years.map(y => (
                <option key={y.id} value={y.id}>{y.year_name}</option>
              ))}
            </select>

            <select
              className="field"
              value={levelId}
              onChange={e => {
                setLevelId(e.target.value);
                setForm({ ...form, combination_id: '' });
              }}
            >
              <option value="">Select level</option>
              {levels.map(l => (
                <option key={l.id} value={l.id}>{l.level_name}</option>
              ))}
            </select>

            <select
              className="field"
              value={form.combination_id}
              onChange={e => setForm({ ...form, combination_id: e.target.value })}
              required
            >
              <option value="">Select combination</option>
              {combinations.map(c => (
                <option key={c.id} value={c.id}>{c.combination_name}</option>
              ))}
            </select>
          </div>

          <div className="mt-7 flex flex-wrap gap-3 border-t border-slate-100 pt-6">
            <button className="btn-primary">
              {editing ? 'Update Student' : 'Save Student'}
            </button>

            {editing && (
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setEditing(null);
                  setForm(emptyForm);
                  setLevelId('');
                }}
              >
                Cancel
              </button>
            )}
          </div>

          {message && (
            <p className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-3 text-sm font-medium text-slate-700">
              {message}
            </p>
          )}
        </div>
      </form>

      {/* Search */}
      <section className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
        <div className="mb-4">
          <h2 className="font-extrabold text-[#173b70]">Student Directory</h2>
          <p className="mt-1 text-xs text-slate-500">
            Search for registered students.
          </p>
        </div>

        <div className="relative">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-blue-500">
            ⌕
          </span>
          <input
            className="field pl-11"
            placeholder="Search students..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </section>

      {/* Students table */}
      <section className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-blue-100 px-5 py-5">
          <div>
            <h2 className="font-extrabold text-[#173b70]">Registered Students</h2>
            <p className="mt-1 text-xs text-slate-500">
              Student information and available actions
            </p>
          </div>

          <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
            {students.length} records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px] text-left text-sm">
            <thead>
              <tr className="bg-[#edf4ff] text-xs uppercase tracking-wider text-[#173b70]">
                <th className="px-5 py-4 font-extrabold">Admission</th>
                <th className="px-5 py-4 font-extrabold">Student Name</th>
                <th className="px-5 py-4 font-extrabold">Level</th>
                <th className="px-5 py-4 font-extrabold">Combination</th>
                <th className="px-5 py-4 text-center font-extrabold">Actions</th>
              </tr>
            </thead>

            <tbody>
              {students.map(s => (
                <tr
                  className="border-t border-slate-100 transition-colors hover:bg-blue-50/60"
                  key={s.id}
                >
                  <td className="px-5 py-4">
                    <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700">
                      {s.admission_number}
                    </span>
                  </td>

                  <td className="px-5 py-4 font-semibold text-slate-800">
                    {s.first_name} {s.last_name}
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    {s.level_name || '—'}
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    {s.combination_name || '—'}
                  </td>

                  <td className="px-5 py-4 text-center whitespace-nowrap">
                    <button
                      className="mr-3 rounded-lg bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700 transition hover:bg-blue-600 hover:text-white"
                      onClick={() => edit(s)}
                    >
                      Edit
                    </button>

                    <button
                      className="rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-600 hover:text-white"
                      onClick={() => remove(s.id)}
                    >
                      Deactivate
                    </button>
                  </td>
                </tr>
              ))}

              {students.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-5 py-12 text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-2xl text-blue-500">
                      ?
                    </div>
                    <p className="font-bold text-slate-700">No students found</p>
                    <p className="mt-1 text-xs text-slate-400">
                      Try another search or register a student.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
