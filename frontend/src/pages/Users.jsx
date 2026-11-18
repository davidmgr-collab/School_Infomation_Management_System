
import { useEffect, useState } from 'react';
import api, { getResponseData } from '../services/api';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    full_name: '',
    username: '',
    email: '',
    password: '',
    role: 'secretary'
  });
  const [message, setMessage] = useState('');

  const load = () =>
    api.get('/users').then(r => setUsers(getResponseData(r)));

  useEffect(() => {
    load().catch(() => setMessage('Could not load users.'));
  }, []);

  const create = async e => {
    e.preventDefault();
    setMessage('');

    try {
      await api.post('/users', form);

      setForm({
        full_name: '',
        username: '',
        email: '',
        password: '',
        role: 'secretary'
      });

      await load();
      setMessage('User created.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Could not create user.');
    }
  };

  const toggle = async u => {
    try {
      await api.patch(`/users/${u.id}/status`, {
        status: u.status === 'active' ? 'inactive' : 'active'
      });

      await load();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Could not update user.');
    }
  };

  return (
    <div className="space-y-7 pb-8">

      {/* Page Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#10294f] via-[#173b70] to-[#2563eb] p-6 text-white shadow-xl sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full border-[35px] border-white/5" />
        <div className="pointer-events-none absolute -bottom-28 right-36 h-64 w-64 rounded-full border-[35px] border-white/5" />

        <div className="relative z-10">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-orange-300">
            <span className="h-2 w-2 rounded-full bg-orange-400" />
            Administration
          </span>

          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Manage Users
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-blue-100 sm:text-base">
            Create user accounts, assign system roles, and manage account
            access from one central location.
          </p>
        </div>
      </div>

      {/* Create User Form */}
      <div className="panel overflow-hidden rounded-2xl border border-blue-100 shadow-sm">
        <div className="flex items-center gap-3 border-b border-blue-100 bg-blue-50/70 p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#173b70] text-xl text-white shadow-md">
            +
          </div>

          <div>
            <h2 className="text-lg font-extrabold text-navy">
              Create New Account
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Enter user information and assign an access role.
            </p>
          </div>
        </div>

        <form onSubmit={create} className="p-5 sm:p-6">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="form-label">Full Name</label>
              <input
                className="field rounded-xl border-slate-200 bg-white transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                placeholder="Enter full name"
                value={form.full_name}
                onChange={e => setForm({...form, full_name: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="form-label">Username</label>
              <input
                className="field rounded-xl border-slate-200 bg-white transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                placeholder="Enter username"
                value={form.username}
                onChange={e => setForm({...form, username: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="form-label">Email Address</label>
              <input
                className="field rounded-xl border-slate-200 bg-white transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                type="email"
                placeholder="Enter email address (optional)"
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
              />
            </div>

            <div>
              <label className="form-label">Temporary Password</label>
              <input
                className="field rounded-xl border-slate-200 bg-white transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                type="password"
                minLength="8"
                placeholder="Minimum 8 characters"
                value={form.password}
                onChange={e => setForm({...form, password: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="form-label">User Role</label>
              <select
                className="field rounded-xl border-slate-200 bg-white transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                value={form.role}
                onChange={e => setForm({...form, role: e.target.value})}
              >
                <option value="animation">Animation</option>
                <option value="secretary">Secretary</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-slate-100 pt-5">
            <button
              className="btn-primary inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-6 shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
            >
              <span>+</span>
              Create User
            </button>

            <p className="text-xs text-slate-400">
              All required fields must be completed.
            </p>
          </div>

          {message && (
            <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm font-semibold text-navy">
              {message}
            </div>
          )}
        </form>
      </div>

      {/* Users Table */}
      <div className="panel overflow-hidden rounded-2xl border border-blue-100 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-blue-100 bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-xl text-blue-700">
              ♙
            </div>

            <div>
              <h2 className="text-lg font-extrabold text-navy">
                Registered Users
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Manage existing system accounts.
              </p>
            </div>
          </div>

          <span className="rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-extrabold text-navy">
            {users.length} Users
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse text-sm">
            <thead className="bg-[#173b70] text-white">
              <tr>
                <th className="p-4 text-left font-bold">No.</th>
                <th className="p-4 text-left font-bold">Name</th>
                <th className="p-4 text-left font-bold">Username</th>
                <th className="p-4 text-left font-bold">Role</th>
                <th className="p-4 text-left font-bold">Status</th>
                <th className="p-4 text-center font-bold">Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u, index) => (
                <tr
                  className="border-b border-slate-100 transition-colors duration-200 odd:bg-white even:bg-blue-50/40 hover:bg-blue-100/60"
                  key={u.id}
                >
                  <td className="p-4 font-semibold text-slate-400">
                    {index + 1}
                  </td>

                  <td className="p-4 font-bold text-navy">
                    {u.full_name}
                  </td>

                  <td className="p-4 font-medium text-slate-600">
                    {u.username}
                  </td>

                  <td className="p-4">
                    <span className={`inline-flex rounded-full px-3 py-1.5 text-xs font-extrabold capitalize ${
                      u.role === 'admin'
                        ? 'border border-blue-200 bg-blue-100 text-blue-800'
                        : u.role === 'animation'
                        ? 'border border-purple-200 bg-purple-100 text-purple-800'
                        : 'border border-orange-200 bg-orange-100 text-orange-800'
                    }`}>
                      {u.role}
                    </span>
                  </td>

                  <td className="p-4">
                    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-extrabold capitalize ${
                      u.status === 'active'
                        ? 'border border-green-200 bg-green-50 text-green-800'
                        : 'border border-red-200 bg-red-50 text-red-700'
                    }`}>
                      <span className={`h-2 w-2 rounded-full ${
                        u.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      {u.status}
                    </span>
                  </td>

                  <td className="p-4 text-center">
                    <button
                      className={`rounded-xl px-4 py-2 text-xs font-extrabold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                        u.status === 'active'
                          ? 'border border-red-200 bg-red-50 text-red-700 hover:bg-red-100'
                          : 'border border-green-200 bg-green-50 text-green-700 hover:bg-green-100'
                      }`}
                      onClick={() => toggle(u)}
                    >
                      {u.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}

              {users.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-2xl text-blue-700">
                        ♙
                      </div>
                      <p className="font-semibold text-slate-500">
                        No users found.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
