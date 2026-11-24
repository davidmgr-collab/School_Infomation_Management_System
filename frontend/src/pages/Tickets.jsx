
import { useEffect, useMemo, useState } from 'react';
import api, { getResponseData } from '../services/api';
import {
  Search,
  Download,
  Ticket,
  Users,
  Wallet,
  MapPin
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const LOCATIONS = [
  { value: 'Gicumbi', amount: 0 },
  { value: 'Byumba', amount: 4500 },
  { value: 'Kigali', amount: 5500 },
  { value: 'Musanze', amount: 9000 },
  { value: 'Nyagatare', amount: 5000 }
];

const formatMoney = amount =>
  `${Number(amount || 0).toLocaleString('en-RW')} FRW`;

export default function Tickets() {
  const [years, setYears] = useState([]);
  const [terms, setTerms] = useState([]);

  const [yearId, setYearId] = useState('');
  const [termId, setTermId] = useState('');
  const [location, setLocation] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get('/academic/years')
      .then(response => {
        setYears(getResponseData(response) || []);
      })
      .catch(error => {
        console.error(error);
        setMessage('Could not load academic years.');
      });
  }, []);

  useEffect(() => {
    if (!yearId) {
      setTerms([]);
      setTermId('');
      setTickets([]);
      return;
    }

    api.get('/academic/terms', {
      params: { academic_year_id: yearId }
    })
      .then(response => {
        setTerms(getResponseData(response) || []);
      })
      .catch(error => {
        console.error(error);
        setMessage('Could not load academic terms.');
      });
  }, [yearId]);

  const selectedYear = useMemo(
    () => years.find(year => String(year.id) === String(yearId)),
    [years, yearId]
  );

  const selectedTerm = useMemo(
    () => terms.find(term => String(term.id) === String(termId)),
    [terms, termId]
  );

  const loadTickets = async () => {
    if (!yearId || !termId) {
      setMessage('Please select an academic year and term.');
      return;
    }

    setLoading(true);
    setMessage('');
    setTickets([]);

    try {
      const response = await api.get('/tickets', {
        params: {
          academic_year_id: yearId,
          term_id: termId,
          location: location || undefined
        }
      });

      const rows = getResponseData(response) || [];
      setTickets(Array.isArray(rows) ? rows : []);

      if (!rows.length) {
        setMessage('No tickets were found for the selected filters.');
      }
    } catch (error) {
      console.error(error);
      setMessage(
        error.response?.data?.message || 'Could not load tickets.'
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredTickets = tickets.filter(student => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) return true;

    const fullName =
      `${student.first_name || ''} ${student.last_name || ''}`
        .toLowerCase();

    return (
      fullName.includes(query) ||
      String(student.admission_number || '').toLowerCase().includes(query)
    );
  });

  const totalAmount = filteredTickets.reduce(
    (total, student) =>
      total + Number(student.amount ?? student.ticket_amount ?? 0),
    0
  );

  // Download all filtered students in ONE PDF report.
  const downloadAllTickets = () => {
    if (!filteredTickets.length || downloading) return;

    setDownloading(true);

    try {
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      const yearName = selectedYear?.year_name || '';
      const termName = selectedTerm?.term_name || '';

      doc.setFillColor(23, 59, 112);
      doc.rect(0, 0, 297, 42, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(17);

      doc.text(
        'SCHOOL INFORMATION MANAGEMENT SYSTEM',
        148.5,
        15,
        { align: 'center' }
      );

      doc.setFontSize(14);
      doc.text(
        'STUDENT TRANSPORT TICKETS REPORT',
        148.5,
        27,
        { align: 'center' }
      );

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);

      doc.text(
        `Academic Year: ${yearName}    |    Term: ${termName}`,
        148.5,
        35,
        { align: 'center' }
      );

      // Report summary.
      doc.setTextColor(35, 48, 68);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);

      doc.text(
        `Total Students: ${filteredTickets.length}`,
        14,
        53
      );

      doc.text(
        `Total Transport Fees: ${formatMoney(totalAmount)}`,
        283,
        53,
        { align: 'right' }
      );

      // All students appear together in one table.
      const tableRows = filteredTickets.map((student, index) => {
        const studentName =
          `${student.first_name || ''} ${student.last_name || ''}`.trim();

        const studentLocation =
          student.location || student.ticket_location || '-';

        const amount = Number(
          student.amount ?? student.ticket_amount ?? 0
        );

        return [
          index + 1,
          student.admission_number || '-',
          studentName || '-',
          studentLocation,
          formatMoney(amount)
        ];
      });

      autoTable(doc, {
        startY: 61,
        head: [[
          'No.',
          'Admission Number',
          'Student Name',
          'Location',
          'Amount'
        ]],
        body: tableRows,
        theme: 'grid',
        margin: {
          left: 14,
          right: 14
        },
        headStyles: {
          fillColor: [23, 59, 112],
          textColor: 255,
          fontStyle: 'bold',
          halign: 'center'
        },
        alternateRowStyles: {
          fillColor: [241, 245, 249]
        },
        styles: {
          fontSize: 9,
          cellPadding: 4,
          textColor: [35, 48, 68]
        },
        columnStyles: {
          0: { halign: 'center', cellWidth: 15 },
          1: { cellWidth: 40 },
          2: { cellWidth: 75 },
          3: { cellWidth: 55 },
          4: { halign: 'right', cellWidth: 55 }
        },
        didDrawPage: () => {
          const pageHeight = doc.internal.pageSize.height;

          doc.setFontSize(8);
          doc.setTextColor(120, 120, 120);

          doc.text(
            'Student Transport Tickets Report',
            14,
            pageHeight - 8
          );

          doc.text(
            `Page ${doc.internal.getNumberOfPages()}`,
            283,
            pageHeight - 8,
            { align: 'right' }
          );
        }
      });

      const filename =
        `Transport_Tickets_${yearName}_${termName}`
          .replace(/[^a-z0-9_-]/gi, '_');

      doc.save(`${filename}.pdf`);

    } catch (error) {
      console.error('PDF download error:', error);
      setMessage('Could not generate the tickets PDF.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-7 pb-8">

      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#10294f] via-[#173b70] to-[#2563eb] p-6 text-white shadow-xl sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full border-[35px] border-white/5" />

        <div className="relative z-10">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
            <Ticket size={30} />
          </div>

          <h1 className="text-2xl font-extrabold sm:text-3xl">
            Student Transport Tickets
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-blue-100">
            View student transport destinations, ticket fees and download
            one complete transport tickets report.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="panel rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
        <h2 className="mb-5 text-lg font-extrabold text-navy">
          Filter Tickets
        </h2>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-600">
              Academic Year
            </label>

            <select
              value={yearId}
              onChange={event => {
                setYearId(event.target.value);
                setTickets([]);
                setMessage('');
              }}
              className="field w-full rounded-xl"
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
            <label className="mb-2 block text-sm font-bold text-slate-600">
              Term
            </label>

            <select
              value={termId}
              onChange={event => {
                setTermId(event.target.value);
                setTickets([]);
                setMessage('');
              }}
              disabled={!yearId}
              className="field w-full rounded-xl"
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
            <label className="mb-2 block text-sm font-bold text-slate-600">
              Location
            </label>

            <select
              value={location}
              onChange={event => setLocation(event.target.value)}
              className="field w-full rounded-xl"
            >
              <option value="">All locations</option>

              {LOCATIONS.map(item => (
                <option key={item.value} value={item.value}>
                  {item.value} - {formatMoney(item.amount)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={loadTickets}
              disabled={loading}
              className="w-full rounded-xl bg-[#173b70] px-5 py-3 font-bold text-white shadow-sm transition hover:bg-blue-800 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'View Tickets'}
            </button>
          </div>

        </div>
      </div>

      {/* Messages */}
      {message && (
        <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm font-semibold text-blue-800">
          {message}
        </div>
      )}

      {/* Results */}
      {tickets.length > 0 && (
        <>
          {/* Summary cards */}
          <div className="grid gap-4 sm:grid-cols-3">

            <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-slate-500">
                  Total Tickets
                </p>
                <Users className="text-blue-600" />
              </div>

              <p className="mt-3 text-2xl font-extrabold text-navy">
                {filteredTickets.length}
              </p>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-slate-500">
                  Total Transport Fees
                </p>
                <Wallet className="text-green-600" />
              </div>

              <p className="mt-3 text-2xl font-extrabold text-green-700">
                {formatMoney(totalAmount)}
              </p>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-slate-500">
                  Selected Location
                </p>
                <MapPin className="text-orange-600" />
              </div>

              <p className="mt-3 text-xl font-extrabold text-navy">
                {location || 'All Locations'}
              </p>
            </div>

          </div>

          {/* Student records */}
          <div className="panel overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">

            <div className="flex flex-col gap-4 border-b border-blue-100 p-5 lg:flex-row lg:items-center lg:justify-between">

              <div>
                <h2 className="text-lg font-extrabold text-navy">
                  Student Ticket Records
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {selectedYear?.year_name} - {selectedTerm?.term_name}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">

                <div className="relative min-w-64 flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-500" />

                  <input
                    type="search"
                    value={searchTerm}
                    onChange={event => setSearchTerm(event.target.value)}
                    placeholder="Search student..."
                    className="w-full rounded-xl border border-blue-100 py-3 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <button
                  type="button"
                  onClick={downloadAllTickets}
                  disabled={!filteredTickets.length || downloading}
                  className="inline-flex items-center gap-2 rounded-xl bg-green-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Download size={17} />
                  {downloading ? 'Generating PDF...' : 'Download All'}
                </button>

              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[750px] border-collapse text-sm">

                <thead className="bg-[#173b70] text-white">
                  <tr>
                    <th className="p-4 text-left">No.</th>
                    <th className="p-4 text-left">Admission No.</th>
                    <th className="p-4 text-left">Student Name</th>
                    <th className="p-4 text-left">Location</th>
                    <th className="p-4 text-right">Amount</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredTickets.map((student, index) => (
                    <tr
                      key={student.ticket_id || student.enrollment_id || index}
                      className="border-b border-slate-100 odd:bg-white even:bg-blue-50/40 hover:bg-blue-50"
                    >
                      <td className="p-4 font-semibold text-slate-500">
                        {index + 1}
                      </td>

                      <td className="p-4 font-bold text-slate-600">
                        {student.admission_number || '-'}
                      </td>

                      <td className="p-4 font-bold text-navy">
                        {student.first_name} {student.last_name}
                      </td>

                      <td className="p-4">
                        <span className="rounded-full bg-blue-50 px-3 py-2 text-xs font-bold text-blue-800">
                          {student.location || student.ticket_location || '-'}
                        </span>
                      </td>

                      <td className="p-4 text-right font-extrabold text-green-700">
                        {formatMoney(
                          student.amount ?? student.ticket_amount
                        )}
                      </td>
                    </tr>
                  ))}

                  {filteredTickets.length === 0 && (
                    <tr>
                      <td
                        colSpan="5"
                        className="p-8 text-center font-semibold text-slate-500"
                      >
                        No matching students found.
                      </td>
                    </tr>
                  )}
                </tbody>

              </table>
            </div>

          </div>
        </>
      )}

    </div>
  );
}
