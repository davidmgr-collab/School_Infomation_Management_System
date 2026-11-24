
import { Fragment, useEffect, useMemo, useState } from 'react';
import api, { getResponseData } from '../services/api';
import { Search, Download, FileText, X } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const MINES_REQUIRED_AMOUNT = 110000;

const TICKET_LOCATIONS = {
  Gicumbi: 0,
  Byumba: 4500,
  Kigali: 5500,
  Musanze: 9000,
  Nyagatare: 5000
};

const today = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const TERM_MATERIALS = {
  1: [
    { key: 'ram', label: 'RAM' },
    { key: 'buckets', label: 'BUCKETS' },
    { key: 'ikiyiko', label: 'IKIYIKO' },
    { key: 'ifoke', label: 'IFOKE' },
    { key: 'isahane', label: 'ISAHANE' },
    { key: 'igikombe', label: 'IGIKOMBE' },
    { key: 'ph', label: 'PH' },
    { key: 'net', label: 'NET' },
    { key: 'enter_mines', label: 'ENTER MINES (IN NUMBERS)' },
    { key: 'decision', label: 'DECISION' }
  ],

  2: [
    { key: 'ph', label: 'PH' },
    { key: 'enter_mines', label: 'ENTER MINES (IN NUMBERS)' },
    { key: 'decision', label: 'DECISION' },
    { key: 'trip', label: 'TRIP' }
  ],

  3: [
    { key: 'ph', label: 'PH' },
    { key: 'enter_mines', label: 'ENTER MINES (IN NUMBERS)' },
    { key: 'decision', label: 'DECISION' }
  ]
};

function StatusSelect({ value, onChange }) {
  const status = value || 'NYC';

  return (
    <select
      value={status}
      onChange={event => onChange(event.target.value)}
      className={`w-full min-w-24 rounded-xl border px-3 py-2.5 text-sm font-bold outline-none transition-all duration-200 focus:ring-4 ${
        status === 'OK'
          ? 'border-green-200 bg-green-50 text-green-800 focus:ring-green-100'
          : 'border-orange-200 bg-orange-50 text-orange-800 focus:ring-orange-100'
      }`}
    >
      <option value="OK">OK</option>
      <option value="NYC">NYC</option>
    </select>
  );
}

function StudentTable({
  title,
  students,
  materials,
  onStatusChange,
  onPaymentChange,
  onTicketChange,
  emptyMessage,
  completed = false
}) {
  return (
    <div className="panel mb-7 overflow-hidden rounded-2xl border border-blue-100 shadow-sm transition-shadow duration-300 hover:shadow-lg">
      <div className={`flex flex-wrap items-center justify-between gap-4 border-b p-5 ${
        completed
          ? 'border-green-100 bg-gradient-to-r from-green-50 to-white'
          : 'border-orange-100 bg-gradient-to-r from-orange-50 to-white'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl text-xl ${
            completed
              ? 'bg-green-100 text-green-700'
              : 'bg-orange-100 text-orange-700'
          }`}>
            {completed ? '✓' : '◷'}
          </div>

          <div>
            <h2 className="text-lg font-extrabold text-navy">{title}</h2>
            <p className="mt-1 text-sm text-slate-500">
              {completed
                ? 'Students with all required materials.'
                : 'Students with missing materials or not yet checked.'}
            </p>
          </div>
        </div>

        <span className={`rounded-full px-4 py-2 text-sm font-extrabold shadow-sm ${
          completed
            ? 'bg-green-100 text-green-800'
            : 'bg-orange-100 text-orange-800'
        }`}>
          {students.length} Students
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-max border-collapse text-sm">
          <thead className="bg-[#173b70] text-white">
            <tr>
              <th className="p-4 text-left font-bold">No.</th>
              <th className="p-4 text-left font-bold">Admission No.</th>
              <th className="p-4 text-left font-bold">Student Name</th>

              {materials.map(material => (
                <Fragment key={material.key}>
                  <th className="p-4 text-center font-bold">
                    {material.label}

                    {material.key === 'enter_mines' && (
                      <div className="mt-1 text-xs font-medium text-blue-100">
                        Required: 110,000 FRW
                      </div>
                    )}
                  </th>

                  {material.key === 'enter_mines' && (
                    <th className="p-4 text-center font-bold">TICKET</th>
                  )}
                </Fragment>
              ))}

              <th className="p-4 text-center font-bold">DECISION STATUS</th>
              <th className="p-4 text-center font-bold">CHECKED AT</th>
            </tr>
          </thead>

          <tbody>
            {students.map((student, index) => {
              const allAvailable = materials.every(
                material => student.items?.[material.key] === 'OK'
              );

              return (
                <tr
                  key={student.enrollment_id}
                  className="border-b border-slate-100 transition-colors duration-200 odd:bg-white even:bg-blue-50/40 hover:bg-blue-100/60"
                >
                  <td className="p-4 font-semibold text-slate-500">
                    {index + 1}
                  </td>

                  <td className="p-4 font-bold text-slate-600">
                    {student.admission_number}
                  </td>

                  <td className="p-4 font-bold text-navy">
                    {student.first_name} {student.last_name}
                  </td>

                  {materials.map(material => (
                    <Fragment key={material.key}>
                      <td className="p-3">
                      {material.key === 'enter_mines' ? (
                        <div className="min-w-44 space-y-2">
                          <input
                            type="number"
                            min="0"
                            step="1"
                            placeholder="Amount in FRW"
                            value={
                              student.paid_amounts?.enter_mines ?? ''
                            }
                            onChange={event =>
                              onPaymentChange(
                                student.enrollment_id,
                                event.target.value
                              )
                            }
                            className="field w-full rounded-xl border-slate-200 bg-white text-sm shadow-sm transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                          />

                          <span
                            className={`block rounded-lg px-3 py-1.5 text-center text-xs font-extrabold ${
                              student.items?.enter_mines === 'OK'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-orange-100 text-orange-800'
                            }`}
                          >
                            {student.items?.enter_mines || 'NYC'}
                          </span>

                          <p className="text-center text-xs font-semibold text-slate-500">
                            {Number(
                              student.paid_amounts?.enter_mines || 0
                            ).toLocaleString('en-RW')} FRW
                          </p>
                        </div>
                      ) : (
                        <StatusSelect
                          value={student.items?.[material.key] || 'NYC'}
                          onChange={value =>
                            onStatusChange(
                              student.enrollment_id,
                              material.key,
                              value
                            )
                          }
                        />
                      )}
                    </td>

                    {material.key === 'enter_mines' && (
                      <td className="p-3">
                        <div className="min-w-40 space-y-2">
                          <select
                            value={student.ticket_location || ''}
                            onChange={event =>
                              onTicketChange(
                                student.enrollment_id,
                                event.target.value
                              )
                            }
                            className="field w-full rounded-xl border-slate-200 bg-white text-sm shadow-sm transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                          >
                            <option value="">Select location</option>
                            <option value="Gicumbi">Gicumbi</option>
                            <option value="Byumba">Byumba</option>
                            <option value="Kigali">Kigali</option>
                            <option value="Musanze">Musanze</option>
                            <option value="Nyagatare">Nyagatare</option>
                          </select>

                          <p className="text-center text-xs font-bold text-slate-600">
                            {student.ticket_location
                              ? `${Number(
                                  student.ticket_amount ?? TICKET_LOCATIONS[student.ticket_location]
                                ).toLocaleString('en-RW')} FRW`
                              : 'No location selected'}
                          </p>
                        </div>
                      </td>
                    )}
                    </Fragment>
                  ))}

                  <td className="p-4 text-center">
                    {allAvailable && student.isChecked ? (
                      <span className="inline-flex rounded-full border border-green-200 bg-green-50 px-3 py-2 text-xs font-extrabold tracking-wide text-green-800">
                        COMPLETED
                      </span>
                    ) : !student.isChecked ? (
                      <span className="inline-flex rounded-full border border-slate-200 bg-slate-100 px-3 py-2 text-xs font-extrabold tracking-wide text-slate-600">
                        NOT CHECKED
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full border border-orange-200 bg-orange-50 px-3 py-2 text-xs font-extrabold tracking-wide text-orange-800">
                        NOT YET
                      </span>
                    )}
                  </td>

                  <td className="p-4 text-center font-medium text-slate-500">
                    {student.checked_at
                      ? new Date(student.checked_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : '—'}
                  </td>
                </tr>
              );
            })}

            {students.length === 0 && (
              <tr>
                <td
                  colSpan={materials.length + 7}
                  className="p-12 text-center"
                >
                  <div className="mx-auto flex max-w-sm flex-col items-center gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-2xl text-blue-700">
                      <span>📋</span>
                    </div>
                    <p className="font-semibold text-slate-600">
                      {emptyMessage}
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function MaterialsChecking() {
  const [years, setYears] = useState([]);
  const [terms, setTerms] = useState([]);
  const [levels, setLevels] = useState([]);
  const [combinations, setCombinations] = useState([]);

  const [yearId, setYearId] = useState('');
  const [termId, setTermId] = useState('');
  const [levelId, setLevelId] = useState('');
  const [combinationId, setCombinationId] = useState('');
  const [date, setDate] = useState(today());

  const [students, setStudents] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    Promise.all([
      api.get('/academic/years'),
      api.get('/academic/levels')
    ])
      .then(([yearResponse, levelResponse]) => {
        setYears(getResponseData(yearResponse) || []);
        setLevels(getResponseData(levelResponse) || []);
      })
      .catch(error => {
        console.error(error);
        setMessage('Could not load academic years or levels.');
      });
  }, []);

  useEffect(() => {
    if (!yearId) {
      setTerms([]);
      setTermId('');
      return;
    }

    api.get('/academic/terms', {
      params: { academic_year_id: yearId }
    })
      .then(response => setTerms(getResponseData(response) || []))
      .catch(() => setMessage('Could not load academic terms.'));
  }, [yearId]);

  useEffect(() => {
    if (!levelId) {
      setCombinations([]);
      setCombinationId('');
      return;
    }

    api.get('/academic/combinations', {
      params: { level_id: levelId }
    })
      .then(response => setCombinations(getResponseData(response) || []))
      .catch(() => setMessage('Could not load combinations.'));
  }, [levelId]);

  const selectedTerm = useMemo(
    () => terms.find(term => String(term.id) === String(termId)),
    [terms, termId]
  );

  const termNumber = Number(selectedTerm?.term_number || 0);
  const materials = TERM_MATERIALS[termNumber] || [];

  const filteredStudents = students.filter(student => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return true;
    const fullName = `${student.first_name || ''} ${student.last_name || ''}`.toLowerCase();
    return fullName.includes(query) || String(student.admission_number || '').toLowerCase().includes(query);
  });

  const completedStudents = filteredStudents.filter(student =>
    student.isChecked &&
    materials.length > 0 &&
    materials.every(material => student.items?.[material.key] === 'OK')
  );

  const notYetStudents = filteredStudents.filter(
    student => !completedStudents.some(
      completed => completed.enrollment_id === student.enrollment_id
    )
  );

  const downloadMaterialPDF = (materialKey, materialLabel) => {
    if (!students.length || !selectedTerm) return;

    const doc = new jsPDF({ orientation: 'landscape' });
    const yearName = years.find(year => String(year.id) === String(yearId))?.year_name || '';
    const combinationName = combinations.find(item => String(item.id) === String(combinationId))?.combination_name || '';
    const levelName = levels.find(item => String(item.id) === String(levelId))?.level_name || '';

    doc.setFillColor(23, 59, 112);
    doc.rect(0, 0, 297, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(17);
    doc.text('SCHOOL INFORMATION MANAGEMENT SYSTEM', 14, 12);
    doc.setFontSize(11);
    doc.text(`${materialLabel} MATERIAL REPORT`, 14, 21);

    doc.setTextColor(35, 48, 68);
    doc.setFontSize(10);
    doc.text(`Academic Year: ${yearName}   |   ${selectedTerm.term_name}   |   Level: ${levelName}   |   Combination: ${combinationName}`, 14, 39);
    doc.text(`Checking Date: ${date}`, 14, 46);

    const rows = students.map((student, index) => {
      const status = student.items?.[materialKey] || 'NYC';
      const row = [index + 1, student.admission_number || '-', `${student.first_name || ''} ${student.last_name || ''}`.trim(), status];
      if (materialKey === 'enter_mines') {
        row.push(`${Number(student.paid_amounts?.enter_mines || 0).toLocaleString('en-RW')} FRW`);
      }
      return row;
    });

    const headers = materialKey === 'enter_mines'
      ? [['No.', 'Admission Number', 'Student Name', 'MINES Status', 'Amount Paid']]
      : [['No.', 'Admission Number', 'Student Name', `${materialLabel} Status`]];

    autoTable(doc, {
      head: headers,
      body: rows,
      startY: 53,
      theme: 'grid',
      headStyles: { fillColor: [23, 59, 112], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [241, 245, 249] },
      styles: { fontSize: 9, cellPadding: 3 },
      didParseCell: data => {
        if (data.section === 'body' && data.column.index === 3) {
          data.cell.styles.textColor = data.cell.raw === 'OK' ? [21, 128, 61] : [194, 65, 12];
          data.cell.styles.fontStyle = 'bold';
        }
      }
    });

    const filename = `${materialLabel.replace(/[^a-z0-9]/gi, '_')}_${selectedTerm.term_name.replace(/[^a-z0-9]/gi, '_')}_${date}.pdf`;
    doc.save(filename);
  };

  const loadStudents = async () => {
    if (!yearId || !termId || !levelId || !combinationId || !date) {
      setMessage(
        'Please select academic year, term, level, combination and date.'
      );
      return;
    }

    if (!materials.length) {
      setMessage('The selected term does not have configured materials.');
      return;
    }

    setLoading(true);
    setMessage('');
    setStudents([]);

    try {
      const response = await api.get('/materials-checking', {
        params: {
          term_id: termId,
          checking_date: date,
          combination_id: combinationId
        }
      });

      const rows = getResponseData(response) || [];

      const formattedStudents = rows.map(student => {
        const savedItems = student.items || {};
        const savedAmounts = student.paid_amounts || {};

        const amount = savedAmounts.enter_mines ?? '';

        const items = {};

        materials.forEach(material => {
          items[material.key] = savedItems[material.key] || 'NYC';
        });

        items.enter_mines =
          amount !== '' &&
          Number(amount) >= MINES_REQUIRED_AMOUNT
            ? 'OK'
            : 'NYC';

        return {
          ...student,
          items,
          paid_amounts: {
            enter_mines: amount
          },
          ticket_location: student.ticket_location || '',
          ticket_amount: student.ticket_amount ?? null,
          isChecked: Boolean(student.check_id)
        };
      });

      setStudents(formattedStudents);

      if (formattedStudents.length === 0) {
        setMessage('No active students were found in this combination.');
      }
    } catch (error) {
      console.error(error);
      setMessage(
        error.response?.data?.message || 'Could not load students.'
      );
    } finally {
      setLoading(false);
    }
  };

  const updateStudentStatus = (enrollmentId, materialKey, value) => {
    setStudents(current =>
      current.map(student =>
        student.enrollment_id === enrollmentId
          ? {
              ...student,
              items: {
                ...student.items,
                [materialKey]: value
              },
              isChecked: true
            }
          : student
      )
    );
  };

  const updateStudentPayment = (enrollmentId, amount) => {
    if (amount !== '' && (!/^\d+(\.\d{0,2})?$/.test(amount) || Number(amount) < 0)) {
      return;
    }

    setStudents(current =>
      current.map(student => {
        if (student.enrollment_id !== enrollmentId) {
          return student;
        }

        const numericAmount = Number(amount);

        return {
          ...student,
          isChecked: true,
          paid_amounts: {
            ...student.paid_amounts,
            enter_mines: amount
          },
          items: {
            ...student.items,
            enter_mines:
              amount !== '' && numericAmount >= MINES_REQUIRED_AMOUNT
                ? 'OK'
                : 'NYC'
          }
        };
      })
    );
  };

  const updateStudentTicket = (enrollmentId, location) => {
    setStudents(current =>
      current.map(student => {
        if (student.enrollment_id !== enrollmentId) {
          return student;
        }

        return {
          ...student,
          ticket_location: location,
          ticket_amount: location ? TICKET_LOCATIONS[location] : null,
          isChecked: true
        };
      })
    );
  };

  const saveChecks = async () => {
    const records = students
      .filter(student => student.isChecked)
      .map(student => ({
        enrollment_id: student.enrollment_id,
        items: student.items,
        ticket_location: student.ticket_location || '',
        paid_amounts: {
          enter_mines: student.paid_amounts?.enter_mines === ''
            ? 0
            : Number(student.paid_amounts?.enter_mines || 0)
        }
      }));

    if (records.length === 0) {
      setMessage('Please check at least one student before saving.');
      return;
    }

    setSaving(true);
    setMessage('');

    try {
      await api.post('/materials-checking', {
        term_id: termId,
        checking_date: date,
        combination_id: combinationId,
        records
      });

      setMessage('Materials checking saved successfully.');

      await loadStudents();
    } catch (error) {
      console.error(error);
      setMessage(
        error.response?.data?.message || 'Could not save materials checking.'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-7 pb-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#10294f] via-[#173b70] to-[#2563eb] p-6 text-white shadow-xl sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full border-[35px] border-white/5" />
        <div className="pointer-events-none absolute -bottom-28 right-36 h-64 w-64 rounded-full border-[35px] border-white/5" />

        <div className="relative z-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-orange-300">
            <span className="h-2 w-2 rounded-full bg-orange-400" />
            Animation Department
          </div>

          <h1 className="mb-3 text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">
            Student Materials Checking
          </h1>

          <p className="max-w-2xl text-sm leading-7 text-blue-100 sm:text-base">
            Check students' required materials when they arrive at school.
            Track completion and payment records from one place.
          </p>
        </div>
      </div>

      <div className="panel overflow-hidden rounded-2xl border border-blue-100 shadow-sm">
        <div className="flex items-center gap-3 border-b border-blue-100 bg-blue-50/70 p-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#173b70] text-xl text-white shadow-md">
            <span>⚙</span>
          </div>

          <div>
            <h2 className="font-extrabold text-navy text-lg">
              Select Checking Information
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Choose the academic details before loading the arrival register.
            </p>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            <div>
              <label className="form-label">Academic Year</label>
              <select
                className="field rounded-xl border-slate-200 bg-white shadow-sm transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                value={yearId}
                onChange={event => {
                  setYearId(event.target.value);
                  setTermId('');
                  setStudents([]);
                }}
              >
                <option value="">Select academic year</option>
                {years.map(year => (
                  <option key={year.id} value={year.id}>
                    {year.year_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label">Term</label>
              <select
                className="field rounded-xl border-slate-200 bg-white shadow-sm transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                value={termId}
                onChange={event => {
                  setTermId(event.target.value);
                  setStudents([]);
                }}
              >
                <option value="">Select term</option>
                {terms.map(term => (
                  <option key={term.id} value={term.id}>
                    {term.term_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label">Level</label>
              <select
                className="field rounded-xl border-slate-200 bg-white shadow-sm transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                value={levelId}
                onChange={event => {
                  setLevelId(event.target.value);
                  setCombinationId('');
                  setStudents([]);
                }}
              >
                <option value="">Select level</option>
                {levels.map(level => (
                  <option key={level.id} value={level.id}>
                    {level.level_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label">Combination</label>
              <select
                className="field rounded-xl border-slate-200 bg-white shadow-sm transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                value={combinationId}
                onChange={event => {
                  setCombinationId(event.target.value);
                  setStudents([]);
                }}
              >
                <option value="">Select combination</option>
                {combinations.map(combination => (
                  <option key={combination.id} value={combination.id}>
                    {combination.combination_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label">Checking Date</label>
              <input
                type="date"
                className="field rounded-xl border-slate-200 bg-white shadow-sm transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                value={date}
                onChange={event => {
                  setDate(event.target.value);
                  setStudents([]);
                }}
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-5">
            <button
              className="btn-primary inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-6 shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg disabled:translate-y-0 disabled:opacity-60"
              onClick={loadStudents}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Loading Students...
                </>
              ) : (
                <>
                  <span>↓</span>
                  Load Arrival Register
                </>
              )}
            </button>

            {selectedTerm && (
              <span className="inline-flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-bold text-navy">
                <span className="text-blue-600">✓</span>
                {selectedTerm.term_name} — {materials.length} Requirements
              </span>
            )}
          </div>
        </div>
      </div>

      {message && (
        <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm font-medium text-navy shadow-sm">
          <span className="text-lg">ℹ</span>
          <p>{message}</p>
        </div>
      )}

      {selectedTerm && materials.some(material => material.key === 'enter_mines') && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-orange-200 bg-orange-50 p-4 shadow-sm">
          <div>
            <h3 className="font-extrabold text-navy">MINES report</h3>
            <p className="mt-1 text-sm text-slate-600">Download the MINES payment and status report for the selected term.</p>
          </div>
          <button
            type="button"
            onClick={() => downloadMaterialPDF('enter_mines', 'MINES')}
            disabled={students.length === 0}
            className="inline-flex items-center gap-2 rounded-xl bg-[#173b70] px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-800 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
          >
            <Download size={17} /> MINES PDF
          </button>
        </div>
      )}

      {students.length > 0 && (
        <div className="panel rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="w-full lg:max-w-xl">
              <label htmlFor="materials-student-search" className="mb-2 block text-sm font-extrabold text-navy">Search Students</label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-500" />
                <input
                  id="materials-student-search"
                  type="search"
                  value={searchTerm}
                  onChange={event => setSearchTerm(event.target.value)}
                  placeholder="Search by student name or admission number..."
                  className="w-full rounded-xl border border-blue-100 bg-slate-50 py-3 pl-12 pr-11 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
                {searchTerm && (
                  <button type="button" onClick={() => setSearchTerm('')} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-blue-50 hover:text-navy">
                    <X size={18} />
                  </button>
                )}
              </div>
              <p className="mt-2 text-xs text-slate-500">Showing {filteredStudents.length} of {students.length} loaded students. Search only filters the displayed list.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {materials.some(material => material.key === 'ram') && (
                <button type="button" onClick={() => downloadMaterialPDF('ram', 'RAM')} className="inline-flex items-center gap-2 rounded-xl bg-[#173b70] px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-800 hover:shadow-md">
                  <Download size={17} /> RAM PDF
                </button>
              )}
              {materials.some(material => material.key === 'trip') && (
                <button type="button" onClick={() => downloadMaterialPDF('trip', 'TRIP')} className="inline-flex items-center gap-2 rounded-xl bg-[#173b70] px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-800 hover:shadow-md">
                  <Download size={17} /> TRIP PDF
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {students.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="group relative overflow-hidden rounded-2xl border border-blue-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="absolute right-0 top-0 h-24 w-24 -translate-y-5 translate-x-5 rounded-full bg-blue-50 transition-transform duration-300 group-hover:scale-125" />
            <div className="relative">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-slate-500">Total Students</p>
                <span className="rounded-xl bg-blue-100 p-2 text-lg text-blue-700">♙</span>
              </div>
              <p className="mt-4 text-3xl font-extrabold text-navy">
                {students.length}
              </p>
              <p className="mt-1 text-xs font-medium text-slate-400">Loaded students</p>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-green-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="absolute right-0 top-0 h-24 w-24 -translate-y-5 translate-x-5 rounded-full bg-green-50 transition-transform duration-300 group-hover:scale-125" />
            <div className="relative">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-slate-500">Completed</p>
                <span className="rounded-xl bg-green-100 p-2 text-lg text-green-700">✓</span>
              </div>
              <p className="mt-4 text-3xl font-extrabold text-green-700">
                {completedStudents.length}
              </p>
              <p className="mt-1 text-xs font-medium text-slate-400">All requirements fulfilled</p>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-orange-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="absolute right-0 top-0 h-24 w-24 -translate-y-5 translate-x-5 rounded-full bg-orange-50 transition-transform duration-300 group-hover:scale-125" />
            <div className="relative">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-slate-500">Not Yet Completed</p>
                <span className="rounded-xl bg-orange-100 p-2 text-lg text-orange-700">◷</span>
              </div>
              <p className="mt-4 text-3xl font-extrabold text-orange-600">
                {notYetStudents.length}
              </p>
              <p className="mt-1 text-xs font-medium text-slate-400">Pending requirements</p>
            </div>
          </div>
        </div>
      )}

      {students.length > 0 && (
        <>
          <StudentTable
            title="Completed Students"
            students={completedStudents}
            materials={materials}
            onStatusChange={updateStudentStatus}
            onPaymentChange={updateStudentPayment}
            onTicketChange={updateStudentTicket}
            completed
            emptyMessage="No student has completed all requirements yet."
          />

          <StudentTable
            title="Not Yet Completed Students"
            students={notYetStudents}
            materials={materials}
            onStatusChange={updateStudentStatus}
            onPaymentChange={updateStudentPayment}
            onTicketChange={updateStudentTicket}
            emptyMessage="All students have completed the requirements."
          />

          <div className="flex flex-col gap-4 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-extrabold text-navy">
                Ready to save checking records?
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Remember to save your changes after checking students.
              </p>
            </div>

            <button
              className="btn-primary inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-6 shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg disabled:translate-y-0 disabled:opacity-60"
              onClick={saveChecks}
              disabled={saving || !students.some(student => student.isChecked)}
            >
              {saving ? 'Saving Records...' : '✓ Save Materials Checking'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
