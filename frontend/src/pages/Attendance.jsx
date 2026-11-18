
import { useEffect, useState } from 'react';
import api, { getResponseData } from '../services/api';

export default function Attendance() {
  const [years, setYears] = useState([]), [terms, setTerms] = useState([]), [levels, setLevels] = useState([]), [combinations, setCombinations] = useState([]);
  const [yearId, setYearId] = useState(''), [termId, setTermId] = useState(''), [levelId, setLevelId] = useState(''), [combinationId, setCombinationId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10)), [students, setStudents] = useState([]), [message, setMessage] = useState('');

  useEffect(() => {
    Promise.all([api.get('/academic/years'), api.get('/academic/levels')])
      .then(([y, l]) => {
        setYears(getResponseData(y));
        setLevels(getResponseData(l));
      })
      .catch(() => setMessage('Could not load academic options.'));
  }, []);

  useEffect(() => {
    if (yearId) api.get('/academic/terms', { params: { academic_year_id: yearId } }).then(r => setTerms(getResponseData(r)));
    else { setTerms([]); setTermId(''); }
  }, [yearId]);

  useEffect(() => {
    if (levelId) api.get('/academic/combinations', { params: { level_id: levelId } }).then(r => setCombinations(getResponseData(r)));
    else { setCombinations([]); setCombinationId(''); }
  }, [levelId]);

  const load = async () => {
    if (!termId || !combinationId || !date) return;

    try {
      const r = await api.get('/attendance', {
        params: { term_id: termId, attendance_date: date, level_id: levelId, combination_id: combinationId }
      });

      setStudents(getResponseData(r).map(s => ({
        ...s,
        attendance_status: s.attendance_status || 'Present'
      })));

      setMessage('');
    } catch (e) {
      setMessage(e.response?.data?.message || 'Could not load attendance.');
    }
  };

  const setStatus = (id, status) => setStudents(rows =>
    rows.map(s => s.enrollment_id === id ? { ...s, attendance_status: status } : s)
  );

  const save = async () => {
    try {
      await api.post('/attendance', {
        term_id: termId,
        attendance_date: date,
        records: students.map(s => ({
          enrollment_id: s.enrollment_id,
          attendance_status: s.attendance_status
        }))
      });

      setMessage('Attendance saved successfully.');
    } catch (e) {
      setMessage(e.response?.data?.message || 'Could not save attendance.');
    }
  };

  const statusStyle = {
    Present: 'border-green-200 bg-green-50 text-green-700',
    Absent: 'border-red-200 bg-red-50 text-red-700',
    Late: 'border-amber-200 bg-amber-50 text-amber-700',
    Excused: 'border-blue-200 bg-blue-50 text-blue-700'
  };

  const presentCount = students.filter(s => s.attendance_status === 'Present').length;
  const absentCount = students.filter(s => s.attendance_status === 'Absent').length;
  const lateCount = students.filter(s => s.attendance_status === 'Late').length;
  const excusedCount = students.filter(s => s.attendance_status === 'Excused').length;

  return (
    <div className="animate-fade-in space-y-7">

      {/* Page heading */}
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
          Student administration
        </span>
        <h1 className="page-title mb-1">Student Attendance</h1>
        <p className="text-sm text-slate-500">
          Record, review and manage daily student attendance.
        </p>
      </div>

      {/* Filters */}
      <section className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
        <div className="border-b border-blue-100 bg-gradient-to-r from-[#173b70] to-blue-700 px-5 py-5 text-white">
          <h2 className="font-extrabold">Attendance Session</h2>
          <p className="mt-1 text-xs text-blue-100">
            Select academic details and date to load students.
          </p>
        </div>

        <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
          <select className="field" value={yearId} onChange={e => { setYearId(e.target.value); setTermId(''); }}>
            <option value="">Academic year</option>
            {years.map(y => <option key={y.id} value={y.id}>{y.year_name}</option>)}
          </select>

          <select className="field" value={termId} onChange={e => setTermId(e.target.value)}>
            <option value="">Term</option>
            {terms.map(t => <option key={t.id} value={t.id}>{t.term_name}</option>)}
          </select>

          <select className="field" value={levelId} onChange={e => { setLevelId(e.target.value); setCombinationId(''); }}>
            <option value="">Level</option>
            {levels.map(l => <option key={l.id} value={l.id}>{l.level_name}</option>)}
          </select>

          <select className="field" value={combinationId} onChange={e => setCombinationId(e.target.value)}>
            <option value="">Combination</option>
            {combinations.map(c => <option key={c.id} value={c.id}>{c.combination_name}</option>)}
          </select>

          <input className="field" type="date" value={date} onChange={e => setDate(e.target.value)} />

          <button className="btn-primary" onClick={load}>
            Load Students →
          </button>
        </div>
      </section>

      {/* Feedback */}
      {message && (
        <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm font-medium text-slate-700">
          {message}
        </div>
      )}

      {/* Attendance summary */}
      {students.length > 0 && (
        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            ['Present', presentCount, 'bg-green-50 text-green-700', 'border-green-200'],
            ['Absent', absentCount, 'bg-red-50 text-red-700', 'border-red-200'],
            ['Late', lateCount, 'bg-amber-50 text-amber-700', 'border-amber-200'],
            ['Excused', excusedCount, 'bg-blue-50 text-blue-700', 'border-blue-200']
          ].map(([label, count, colors, border]) => (
            <div key={label} className={`rounded-2xl border ${border} bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md`}>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</p>
              <p className={`mt-2 text-3xl font-black ${colors.split(' ')[1]}`}>{count}</p>
              <p className="mt-1 text-xs text-slate-400">Students</p>
            </div>
          ))}
        </section>
      )}

      {/* Student table */}
      <section className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-blue-100 px-5 py-5">
          <div>
            <h2 className="font-extrabold text-[#173b70]">Attendance Register</h2>
            <p className="mt-1 text-xs text-slate-500">
              Select the attendance status for each student.
            </p>
          </div>

          <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
            {students.length} students
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-sm text-left">
            <thead>
              <tr className="bg-[#edf4ff] text-xs uppercase tracking-wider text-[#173b70]">
                <th className="px-5 py-4 font-extrabold">No.</th>
                <th className="px-5 py-4 font-extrabold">Admission No.</th>
                <th className="px-5 py-4 font-extrabold">Student</th>
                <th className="px-5 py-4 font-extrabold">Attendance Status</th>
              </tr>
            </thead>

            <tbody>
              {students.map((s, i) => (
                <tr key={s.enrollment_id} className="border-t border-slate-100 transition-colors hover:bg-blue-50/60">
                  <td className="px-5 py-4 text-slate-400">{i + 1}</td>

                  <td className="px-5 py-4">
                    <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700">
                      {s.admission_number}
                    </span>
                  </td>

                  <td className="px-5 py-4 font-semibold text-slate-800">
                    {s.first_name} {s.last_name}
                  </td>

                  <td className="px-5 py-4">
                    <select
                      className={`w-full max-w-44 rounded-lg border px-3 py-2 text-sm font-bold outline-none transition focus:ring-2 focus:ring-blue-200 ${statusStyle[s.attendance_status] || 'border-slate-200 bg-white text-slate-700'}`}
                      value={s.attendance_status}
                      onChange={e => setStatus(s.enrollment_id, e.target.value)}
                    >
                      {['Present', 'Absent', 'Late', 'Excused'].map(v => (
                        <option key={v}>{v}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}

              {!students.length && (
                <tr>
                  <td colSpan="4" className="px-5 py-14 text-center">
                    <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-2xl text-blue-600">
                      ✓
                    </div>
                    <p className="font-bold text-slate-700">No attendance records loaded</p>
                    <p className="mt-1 text-xs text-slate-400">
                      Choose year, term, level, combination and date, then load students.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-blue-100 bg-slate-50 px-5 py-4">
          <p className="text-xs text-slate-500">
            {students.length} student records loaded
          </p>

          <button
            disabled={!students.length}
            className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
            onClick={save}
          >
            Save Attendance →
          </button>
        </div>
      </section>
    </div>
  );
}
