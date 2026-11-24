
import { useEffect, useMemo, useState } from 'react';
import {
  Search,
  Users,
  GraduationCap,
  ArrowRight,
  BookOpen,
  CalendarDays,
  MapPin,
  Wallet,
  Languages,
  School,
  Megaphone,
  Phone,
  Mail,
  Globe,
  Package,
  RefreshCw,
  Instagram,
  MessageCircle,
  CheckCircle2,
  Info,
  ExternalLink
} from 'lucide-react';

import api, { getResponseData } from '../services/api';

const translations = {
  rw: {
    welcome: 'Murakaza neza ku ishuri ryacu',
    title: 'Sisitemu yo',
    titleHighlight: "Gucunga Amakuru y'Ishuri",
    description: "Menya amakuru y'ishuri, ibisabwa mu gihembwe, amatike n'amakuru y'abanyeshuri.",
    explore: "Reba urutonde rw'abanyeshuri",
    students: 'Abanyeshuri',
    levels: "Inzego z'amashuri",
    combinations: "Amahitamo y'amasomo",
    academic: "Amakuru y'amasomo",
    academicYear: "Umwaka w'amashuri",
    term: 'Igihembwe',
    materials: 'Ibikoresho bisabwa',
    materialsDescription: 'Ibikoresho bisabwa n’amafaranga yabyo muri iki gihembwe.',
    ticket: "Amatike y'ingendo",
    ticketDescription: "Amafaranga y'urugendo bitewe n'aho umunyeshuri agana.",
    location: 'Aho agana',
    amount: 'Amafaranga',
    free: 'Ubuntu',
    directory: "Urutonde rw'abanyeshuri",
    directoryDescription: 'Shakisha abanyeshuri ukoresheje amazina, nimero cyangwa urwego.',
    findStudent: 'Shaka umunyeshuri',
    searchPlaceholder: "Shakisha izina cyangwa nimero y'umunyeshuri",
    allLevels: 'Inzego zose',
    records: 'Abanyeshuri babonetse',
    admission: "Nimero y'umunyeshuri",
    name: 'Amazina',
    gender: 'Igitsina',
    level: 'Urwego',
    combination: "Icyiciro cy'amasomo",
    loading: 'Tegereza...',
    noStudents: 'Nta munyeshuri ubonetse',
    noStudentsDescription: 'Gerageza guhindura amagambo washakishije cyangwa urwego.',
    announcements: 'Amatangazo',
    announcementsDescription: 'Amakuru n’amatangazo atangwa n’ishuri.',
    noAnnouncements: 'Nta matangazo ahari ubu.',
    contact: 'Twandikire',
    contactDescription: "Ku bindi bisobanuro, hamagara ubuyobozi bw'ishuri.",
    schoolInfo: "Amakuru y'ishuri",
    footer: 'Sisitemu yo gucunga amakuru y’ishuri',
    error: 'Habaye ikibazo mu kubona amakuru. Ongera ugerageze.',
    active: 'Birakora',
    upcoming: 'Biraza',
    completed: 'Byarangiye',
    noMaterials: 'Nta bikoresho byashyizweho kuri iki gihembwe.',
    total: 'Igiteranyo',
    selectYear: 'Hitamo umwaka',
    selectTerm: 'Hitamo igihembwe',
    material: 'Igikoresho',
    price: 'Igiciro',
    included: 'Byashyizwe mu bindi',
    priceNote: 'Ibiciro n’ibisabwa bishyirwaho n’ubuyobozi bw’ishuri. Ababyeyi bashobora kubireba gusa.',
    separateTicket: 'Amatike yishyurwa ukwawo kandi ntabwo ari muri rusange y’ibikoresho.',
    termTotal: 'Igiteranyo cy’ibikoresho',
    contactWhatsApp: 'Twandikire kuri WhatsApp',
    website: 'Urubuga rw’ishuri',
    instagram: 'Instagram',
    email: 'Imeyili',
    noTerm: 'Banza uhitemo igihembwe.',
    retry: 'Ongera ugerageze',
    viewOnly: 'Amakuru yo kureba gusa',
    paymentInfo: 'Kwishyura',
    paymentDescription: 'Amakuru y’ibiciro arerekanwa hano. Kwishyura kuri interineti bizatangizwa nyuma yo gushyiraho uburyo bwizewe bwo kwishyura.',
    currency: 'FRW'
  },

  en: {
    welcome: 'Welcome to our school',
    title: 'School Information',
    titleHighlight: 'Management System',
    description: 'Discover school information, term requirements, transport tickets and student information.',
    explore: 'Explore Student Directory',
    students: 'Students',
    levels: 'Academic Levels',
    combinations: 'Combinations',
    academic: 'Academic Information',
    academicYear: 'Academic Year',
    term: 'Academic Term',
    materials: 'Required Materials',
    materialsDescription: 'Required materials and their prices for the selected academic term.',
    ticket: 'Transport Tickets',
    ticketDescription: 'Transport charges depending on the selected destination.',
    location: 'Destination',
    amount: 'Amount',
    free: 'Free',
    directory: 'Student Directory',
    directoryDescription: 'Search students by name, admission number or academic level.',
    findStudent: 'Find a Student',
    searchPlaceholder: 'Search by name or admission number',
    allLevels: 'All Academic Levels',
    records: 'Student Records',
    admission: 'Admission No.',
    name: 'Student Name',
    gender: 'Gender',
    level: 'Level',
    combination: 'Combination',
    loading: 'Loading...',
    noStudents: 'No students found',
    noStudentsDescription: 'Try changing your search term or selecting another level.',
    announcements: 'Announcements',
    announcementsDescription: 'Latest information and announcements from the school.',
    noAnnouncements: 'No announcements available at the moment.',
    contact: 'Contact Us',
    contactDescription: 'For more information, contact the school administration.',
    schoolInfo: 'School Information',
    footer: 'School Information Management System',
    error: 'Something went wrong while loading information. Please try again.',
    active: 'Active',
    upcoming: 'Upcoming',
    completed: 'Completed',
    noMaterials: 'No materials have been configured for this term.',
    total: 'Total',
    selectYear: 'Select year',
    selectTerm: 'Select term',
    material: 'Material',
    price: 'Price',
    included: 'Included',
    priceNote: 'Prices and requirements are configured by the school administration. Parents can only view them.',
    separateTicket: 'Transport tickets are charged separately and are not included in the material total.',
    termTotal: 'Total material cost',
    contactWhatsApp: 'Contact us on WhatsApp',
    website: 'School website',
    instagram: 'Instagram',
    email: 'Email',
    noTerm: 'Please select an academic term.',
    retry: 'Try again',
    viewOnly: 'View-only information',
    paymentInfo: 'Payments',
    paymentDescription: 'Prices are displayed here. Online payments will be introduced after a secure payment provider has been integrated.',
    currency: 'FRW'
  },

  fr: {
    welcome: 'Bienvenue dans notre école',
    title: 'Système de Gestion',
    titleHighlight: 'des Informations Scolaires',
    description: 'Découvrez les informations scolaires, les fournitures, les billets de transport et les informations des élèves.',
    explore: 'Consulter la liste des élèves',
    students: 'Élèves',
    levels: 'Niveaux scolaires',
    combinations: 'Options',
    academic: 'Informations académiques',
    academicYear: 'Année scolaire',
    term: 'Trimestre',
    materials: 'Fournitures requises',
    materialsDescription: 'Fournitures requises et leurs prix pour le trimestre sélectionné.',
    ticket: 'Billets de transport',
    ticketDescription: 'Frais de transport selon la destination.',
    location: 'Destination',
    amount: 'Montant',
    free: 'Gratuit',
    directory: 'Liste des élèves',
    directoryDescription: 'Recherchez les élèves par nom, numéro ou niveau scolaire.',
    findStudent: 'Rechercher un élève',
    searchPlaceholder: 'Rechercher par nom ou numéro',
    allLevels: 'Tous les niveaux',
    records: 'Élèves trouvés',
    admission: "Numéro d'admission",
    name: "Nom de l'élève",
    gender: 'Sexe',
    level: 'Niveau',
    combination: 'Option',
    loading: 'Chargement...',
    noStudents: 'Aucun élève trouvé',
    noStudentsDescription: 'Essayez de modifier votre recherche ou votre niveau.',
    announcements: 'Annonces',
    announcementsDescription: "Dernières informations et annonces de l'école.",
    noAnnouncements: 'Aucune annonce disponible pour le moment.',
    contact: 'Contactez-nous',
    contactDescription: "Pour plus d'informations, contactez l'administration.",
    schoolInfo: 'Informations scolaires',
    footer: 'Système de Gestion des Informations Scolaires',
    error: 'Une erreur est survenue lors du chargement des informations.',
    active: 'Actif',
    upcoming: 'À venir',
    completed: 'Terminé',
    noMaterials: 'Aucune fourniture configurée pour ce trimestre.',
    total: 'Total',
    selectYear: "Choisir l'année",
    selectTerm: 'Choisir le trimestre',
    material: 'Fourniture',
    price: 'Prix',
    included: 'Inclus',
    priceNote: "Les prix et les fournitures sont définis par l'administration. Les parents peuvent uniquement les consulter.",
    separateTicket: 'Les billets de transport sont facturés séparément et ne sont pas inclus dans le total des fournitures.',
    termTotal: 'Coût total des fournitures',
    contactWhatsApp: 'Contactez-nous sur WhatsApp',
    website: 'Site web de l’école',
    instagram: 'Instagram',
    email: 'E-mail',
    noTerm: 'Veuillez choisir un trimestre.',
    retry: 'Réessayer',
    viewOnly: 'Informations en lecture seule',
    paymentInfo: 'Paiements',
    paymentDescription: 'Les prix sont affichés ici. Le paiement en ligne sera ajouté après l’intégration d’un prestataire de paiement sécurisé.',
    currency: 'FRW'
  }
};

const ticketFallback = [
  { location: 'Gicumbi', amount: 0 },
  { location: 'Byumba', amount: 4500 },
  { location: 'Kigali', amount: 5500 },
  { location: 'Musanze', amount: 9000 },
  { location: 'Nyagatare', amount: 5000 }
];

const materialNames = {
  ram: 'RAM',
  buckets: 'Buckets',
  ikiyiko: 'Icyiyiko',
  ifoke: 'Ifoke',
  isahane: 'Isahane',
  igikombe: 'Igikombe',
  ph: 'PH',
  net: 'Net',
  enter_mines: 'MINES',
  decision: 'Decision',
  trip: 'Trip'
};

const schoolContacts = [
  {
    key: 'whatsapp',
    label: 'WhatsApp',
    value: '0737788686',
    href: 'https://wa.me/250737788686',
    icon: MessageCircle,
    color: 'bg-green-500'
  },
  {
    key: 'email',
    label: 'Email',
    value: 'collegiosamztss@gmail.com',
    href: 'https://mail.google.com/mail/?view=cm&fs=1&to=collegiosamztss@gmail.com',
    icon: Mail,
    color: 'bg-blue-600'
  },
  {
    key: 'website',
    label: 'Website',
    value: 'www.csmz.com',
    href: 'https://www.csmz.com',
    icon: Globe,
    color: 'bg-orange-500'
  },
  {
    key: 'instagram',
    label: 'Instagram',
    value: '@csamzupdates__1',
    href: 'https://www.instagram.com/csamzupdates__1/',
    icon: Instagram,
    color: 'bg-pink-600'
  }
];

function unwrap(response) {
  return getResponseData(response);
}

function money(value) {
  return `${Number(value || 0).toLocaleString()} FRW`;
}

function getStatus(status, t) {
  const value = String(status || '').toLowerCase();

  if (value === 'active') return t.active;
  if (value === 'upcoming') return t.upcoming;
  if (value === 'completed') return t.completed;

  return status || '—';
}

function getMaterialList(data) {
  if (Array.isArray(data)) return data;

  if (Array.isArray(data?.materials)) return data.materials;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.required_materials)) return data.required_materials;

  return [];
}

function getTicketList(data) {
  const prices = data?.ticket_prices || data?.prices || data;

  if (Array.isArray(prices)) {
    return prices.map(item => ({
      location: item.location || item.name,
      amount: Number(item.amount ?? item.price ?? 0)
    }));
  }

  if (prices && typeof prices === 'object') {
    return Object.entries(prices).map(([location, amount]) => ({
      location,
      amount: Number(amount?.amount ?? amount?.price ?? amount ?? 0)
    }));
  }

  return ticketFallback;
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-center gap-4">
        <div className="rounded-xl bg-blue-50 p-3 text-blue-700">
          <Icon size={23} />
        </div>
        <div>
          <p className="text-2xl font-black text-[#142B59]">
            {Number(value || 0).toLocaleString()}
          </p>
          <p className="text-sm font-medium text-slate-500">{label}</p>
        </div>
      </div>
    </div>
  );
}

function ContactCard({ contact, t }) {
  const Icon = contact.icon;

  return (
    <a
      href={contact.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-4 rounded-2xl border border-white/15 bg-white/10 p-4 transition hover:-translate-y-1 hover:bg-white/15"
    >
      <div className={`rounded-xl p-3 text-white ${contact.color}`}>
        <Icon size={22} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-blue-100">
          {contact.key === 'email' ? t.email :
            contact.key === 'website' ? t.website :
              contact.key === 'instagram' ? t.instagram :
                'WhatsApp'}
        </p>
        <p className="truncate font-semibold text-white">
          {contact.value}
        </p>
      </div>

      <ExternalLink
        size={16}
        className="text-blue-200 transition group-hover:translate-x-1"
      />
    </a>
  );
}

export default function PublicHome() {
  const [language, setLanguage] = useState('rw');

  const [academic, setAcademic] = useState({
    years: [],
    terms: [],
    levels: []
  });

  const [students, setStudents] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [materials, setMaterials] = useState([]);
  const [materialPrices, setMaterialPrices] = useState({});
  const [totalMaterialAmount, setTotalMaterialAmount] = useState(0);
  const [ticketPrices, setTicketPrices] = useState(ticketFallback);

  const [yearId, setYearId] = useState('');
  const [termId, setTermId] = useState('');
  const [levelId, setLevelId] = useState('');
  const [search, setSearch] = useState('');

  const [loadingAcademic, setLoadingAcademic] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [loadingMaterials, setLoadingMaterials] = useState(false);
  const [error, setError] = useState('');

  const t = translations[language];

  const selectedYear = academic.years.find(
    year => String(year.id) === String(yearId)
  );

  const filteredTerms = useMemo(() => {
    return academic.terms.filter(term =>
      !yearId || String(term.academic_year_id) === String(yearId)
    );
  }, [academic.terms, yearId]);

  const selectedTerm = academic.terms.find(
    term => String(term.id) === String(termId)
  );

  useEffect(() => {
    let mounted = true;

    async function loadAcademic() {
      try {
        setLoadingAcademic(true);

        const response = await api.get('/public/academic');
        const data = unwrap(response);

        if (!mounted) return;

        const years = data?.years || [];
        const terms = data?.terms || [];
        const levels = data?.levels || [];

        setAcademic({ years, terms, levels });

        const activeYear = years.find(
          year => year.status === 'active'
        ) || years[0];

        const activeTerm = terms.find(
          term =>
            term.status === 'active' &&
            (!activeYear ||
              String(term.academic_year_id) === String(activeYear.id))
        ) || terms.find(
          term => !activeYear ||
            String(term.academic_year_id) === String(activeYear.id)
        );

        setYearId(activeYear ? String(activeYear.id) : '');
        setTermId(activeTerm ? String(activeTerm.id) : '');
      } catch (err) {
        if (mounted) setError(translations[language].error);
      } finally {
        if (mounted) setLoadingAcademic(false);
      }
    }

    loadAcademic();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    async function loadStudents() {
      try {
        setLoadingStudents(true);

        const response = await api.get('/public/students', {
          params: {
            search: search || undefined,
            level_id: levelId || undefined,
            academic_year_id: yearId || undefined
          }
        });

        const data = unwrap(response);

        if (mounted) {
          setStudents(
            Array.isArray(data) ? data : data?.students || []
          );
        }
      } catch (err) {
        if (mounted) setError(translations[language].error);
      } finally {
        if (mounted) setLoadingStudents(false);
      }
    }

    if (!loadingAcademic) loadStudents();

    return () => {
      mounted = false;
    };
  }, [search, levelId, yearId, loadingAcademic]);

  useEffect(() => {
    let mounted = true;

    async function loadStatistics() {
      try {
        const response = await api.get('/public/statistics');
        const data = unwrap(response);

        if (mounted) setStatistics(data || {});
      } catch (err) {
        // Statistics are optional.
      }
    }

    loadStatistics();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    async function loadMaterials() {
      if (!termId) {
        setMaterials([]);
        setMaterialPrices({});
        setTotalMaterialAmount(0);
        return;
      }

      try {
        setLoadingMaterials(true);

        const response = await api.get(`/public/materials/${termId}`);
        const data = unwrap(response);

        if (mounted) {
          setMaterials(getMaterialList(data));
          setMaterialPrices(data?.material_prices || {});

          setTotalMaterialAmount(
            Number(data?.total_material_amount || 0)
          );
        }
      } catch (err) {
        if (mounted) {
          setMaterials([]);
          setMaterialPrices({});
          setTotalMaterialAmount(0);
        }
      } finally {
        if (mounted) setLoadingMaterials(false);
      }
    }

    loadMaterials();

    return () => {
      mounted = false;
    };
  }, [termId]);

  useEffect(() => {
    let mounted = true;

    async function loadTickets() {
      try {
        const response = await api.get('/public/tickets');
        const data = unwrap(response);

        if (mounted) {
          setTicketPrices(getTicketList(data));
        }
      } catch (err) {
        if (mounted) setTicketPrices(ticketFallback);
      }
    }

    loadTickets();

    return () => {
      mounted = false;
    };
  }, []);

  const studentCount =
    statistics.total_students ??
    statistics.students ??
    statistics.student_count ??
    students.length;

  const levelCount =
    statistics.total_levels ??
    statistics.levels ??
    academic.levels.length;

  const combinationCount =
    statistics.total_combinations ??
    statistics.combinations ??
    0;

  const displayedStudents = Array.isArray(students) ? students : [];

  const materialTotal = useMemo(() => {
    return materials.reduce((sum, material) => {
      const key = typeof material === 'string'
        ? material
        : material.material_key || material.name || material.item_name;

      return sum + Number(
        materialPrices[key] ??
        material.amount ??
        material.price ??
        0
      );
    }, 0);
  }, [materials, materialPrices]);

  const displayedTotal = totalMaterialAmount || materialTotal;

  return (
    <div className="min-h-screen bg-slate-50">

      <header className="sticky top-0 z-40 border-b border-blue-100 bg-white/95 shadow-sm backdrop-blur">
        <div className="container-page flex flex-wrap items-center justify-between gap-4 py-4">

          <a href="#" className="flex items-center gap-3">
            <div className="rounded-xl bg-[#142B59] p-2.5 text-white">
              <School size={25} />
            </div>
            <div>
              <h2 className="font-black text-[#142B59]">SIMS</h2>
              <p className="text-xs text-slate-500">{t.schoolInfo}</p>
            </div>
          </a>

          <div className="flex items-center gap-2">
            <Languages size={19} className="text-blue-700" />

            <select
              value={language}
              onChange={e => setLanguage(e.target.value)}
              className="field h-10 w-36 rounded-xl border-blue-100 bg-white text-sm font-semibold text-[#142B59]"
              aria-label="Select language"
            >
              <option value="rw">Kinyarwanda</option>
              <option value="en">English</option>
              <option value="fr">Français</option>
            </select>
          </div>

        </div>
      </header>

      <section className="hero-grid relative overflow-hidden bg-gradient-to-br from-[#142B59] via-[#173b70] to-blue-900 text-white">

        <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full bg-blue-400/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-orange-400/10 blur-3xl" />

        <div className="container-page relative py-16 md:py-24">

          <div className="max-w-4xl">

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm">
              <GraduationCap size={17} className="text-orange-400" />
              <span className="text-xs font-bold uppercase tracking-[.2em] text-blue-100">
                {t.welcome}
              </span>
            </div>

            <h1 className="max-w-4xl text-4xl font-black leading-tight tracking-tight md:text-6xl lg:text-7xl">
              {t.title}
              <span className="block text-orange-400">
                {t.titleHighlight}
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-8 text-blue-100 md:text-lg">
              {t.description}
            </p>

            <a
              href="#students"
              className="group mt-9 inline-flex items-center gap-3 rounded-xl bg-orange-500 px-7 py-4 font-bold text-white shadow-lg transition duration-300 hover:-translate-y-1 hover:bg-orange-600"
            >
              {t.explore}
              <ArrowRight size={19} className="transition-transform group-hover:translate-x-1" />
            </a>

          </div>
        </div>
      </section>

      <main className="container-page space-y-14 py-12 md:py-16">

        <section>
          <div className="mb-6">
            <p className="text-xs font-extrabold uppercase tracking-[.2em] text-orange-600">
              {t.schoolInfo}
            </p>
            <h2 className="mt-2 text-2xl font-black text-[#142B59] md:text-3xl">
              {t.academic}
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard icon={Users} label={t.students} value={studentCount} />
            <StatCard icon={BookOpen} label={t.levels} value={levelCount} />
            <StatCard icon={GraduationCap} label={t.combinations} value={combinationCount} />
          </div>
        </section>

        <section className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm md:p-7">

          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-blue-50 p-3 text-blue-700">
              <CalendarDays size={24} />
            </div>

            <div>
              <h2 className="text-xl font-black text-[#142B59]">
                {t.academic}
              </h2>
              <p className="text-sm text-slate-500">
                {t.academicYear} / {t.term}
              </p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">

            <label>
              <span className="mb-2 block text-sm font-bold text-slate-700">
                {t.academicYear}
              </span>

              <select
                value={yearId}
                onChange={e => {
                  const newYearId = e.target.value;
                  setYearId(newYearId);

                  const nextTerm = academic.terms.find(
                    term =>
                      String(term.academic_year_id) === newYearId &&
                      term.status === 'active'
                  ) || academic.terms.find(
                    term => String(term.academic_year_id) === newYearId
                  );

                  setTermId(nextTerm ? String(nextTerm.id) : '');
                }}
                className="field h-12 rounded-xl border-slate-200"
                disabled={loadingAcademic}
              >
                <option value="">{t.selectYear}</option>

                {academic.years.map(year => (
                  <option key={year.id} value={year.id}>
                    {year.year_name} ({getStatus(year.status, t)})
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span className="mb-2 block text-sm font-bold text-slate-700">
                {t.term}
              </span>

              <select
                value={termId}
                onChange={e => setTermId(e.target.value)}
                className="field h-12 rounded-xl border-slate-200"
                disabled={!yearId || loadingAcademic}
              >
                <option value="">{t.selectTerm}</option>

                {filteredTerms.map(term => (
                  <option key={term.id} value={term.id}>
                    {term.term_name} ({getStatus(term.status, t)})
                  </option>
                ))}
              </select>
            </label>

          </div>

          {selectedYear && selectedTerm && (
            <div className="mt-5 flex flex-wrap items-center gap-2 rounded-xl bg-blue-50 p-4 text-sm text-blue-900">
              <span className="font-bold">{selectedYear.year_name}</span>
              <span>•</span>
              <span className="font-bold">{selectedTerm.term_name}</span>
              <span>•</span>
              {getStatus(selectedTerm.status, t)}
            </div>
          )}

        </section>

        <section>

          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-orange-50 p-3 text-orange-600">
                <Package size={24} />
              </div>

              <div>
                <h2 className="text-2xl font-black text-[#142B59]">
                  {t.materials}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {t.materialsDescription}
                </p>
              </div>
            </div>

            <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-xs font-bold text-blue-700">
              <Info size={15} />
              {t.viewOnly}
            </span>
          </div>

          <div className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">

            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-blue-100 bg-slate-50 p-5 md:px-7">
              <div>
                <h3 className="font-black text-[#142B59]">
                  {selectedTerm?.term_name || t.term}
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  {t.priceNote}
                </p>
              </div>

              <span className="rounded-lg bg-white px-3 py-2 text-xs font-bold text-blue-700 shadow-sm">
                {materials.length} {t.material}
              </span>
            </div>

            {loadingMaterials ? (
              <div className="flex items-center justify-center gap-3 py-12 text-slate-500">
                <div className="h-6 w-6 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
                {t.loading}
              </div>
            ) : materials.length ? (

              <>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[450px] text-left text-sm">
                    <thead className="bg-[#142B59] text-white">
                      <tr>
                        <th className="px-5 py-4">{t.material}</th>
                        <th className="px-5 py-4 text-right">{t.price}</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-blue-50">
                      {materials.map((material, index) => {
                        const key = typeof material === 'string'
                          ? material
                          : material.material_key ||
                            material.name ||
                            material.item_name ||
                            material.material_name;

                        const price = Number(
                          materialPrices[key] ??
                          material.amount ??
                          material.price ??
                          0
                        );

                        return (
                          <tr
                            key={material.id || key || index}
                            className="transition hover:bg-blue-50/60"
                          >
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <div className="rounded-lg bg-blue-50 p-2 text-blue-700">
                                  <BookOpen size={17} />
                                </div>
                                <span className="font-semibold capitalize text-[#142B59]">
                                  {materialNames[key] || String(key).replaceAll('_', ' ')}
                                </span>
                              </div>
                            </td>

                            <td className="px-5 py-4 text-right">
                              <span className="font-bold text-[#142B59]">
                                {price === 0 ? t.included : money(price)}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-col gap-3 bg-blue-50 p-5 sm:flex-row sm:items-center sm:justify-between md:px-7">
                  <div>
                    <p className="text-sm font-semibold text-blue-800">
                      {t.termTotal}
                    </p>
                    <p className="mt-1 text-xs text-blue-600">
                      {selectedTerm?.term_name || ''}
                    </p>
                  </div>

                  <p className="text-2xl font-black text-[#142B59]">
                    {money(displayedTotal)}
                  </p>
                </div>
              </>

            ) : (
              <div className="py-12 text-center text-sm text-slate-500">
                {termId ? t.noMaterials : t.noTerm}
              </div>
            )}

          </div>
        </section>

        <section>

          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-orange-50 p-3 text-orange-600">
              <MapPin size={24} />
            </div>

            <div>
              <h2 className="text-2xl font-black text-[#142B59]">
                {t.ticket}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {t.ticketDescription}
              </p>
            </div>
          </div>

          <div className="mb-4 rounded-xl border border-orange-100 bg-orange-50 p-4 text-sm text-orange-800">
            <Info size={17} className="mr-2 inline" />
            {t.separateTicket}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ticketPrices.map((ticket, index) => (
              <div
                key={ticket.location || index}
                className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="rounded-xl bg-blue-50 p-3 text-blue-700">
                    <MapPin size={22} />
                  </div>

                  <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
                    {Number(ticket.amount) === 0 ? t.free : t.amount}
                  </span>
                </div>

                <h3 className="mt-5 text-lg font-black text-[#142B59]">
                  {ticket.location}
                </h3>

                <div className="mt-2 flex items-center gap-2 text-orange-600">
                  <Wallet size={18} />
                  <span className="text-xl font-black">
                    {money(ticket.amount)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm md:p-8">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-green-50 p-3 text-green-700">
              <Wallet size={24} />
            </div>

            <div>
              <h2 className="text-xl font-black text-[#142B59]">
                {t.paymentInfo}
              </h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                {t.paymentDescription}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm md:p-8">

          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-xl bg-orange-50 p-3 text-orange-600">
              <Megaphone size={24} />
            </div>

            <div>
              <h2 className="text-2xl font-black text-[#142B59]">
                {t.announcements}
              </h2>
              <p className="text-sm text-slate-500">
                {t.announcementsDescription}
              </p>
            </div>
          </div>

          <p className="rounded-xl bg-slate-50 p-5 text-sm text-slate-500">
            {t.noAnnouncements}
          </p>

        </section>

        <section id="students">

          <div className="mb-8">
            <div className="mb-3 flex items-center gap-2">
              <span className="h-1 w-9 rounded-full bg-orange-500" />
              <p className="text-xs font-extrabold uppercase tracking-[.2em] text-orange-600">
                {t.directory}
              </p>
            </div>

            <h2 className="text-3xl font-black tracking-tight text-[#142B59] md:text-4xl">
              {t.directory}
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500 md:text-base">
              {t.directoryDescription}
            </p>
          </div>

          <div className="mb-6 rounded-2xl border border-blue-100 bg-white p-5 shadow-sm md:p-6">

            <div className="mb-4 flex items-center gap-2">
              <Search size={18} className="text-blue-600" />
              <h3 className="font-bold text-[#142B59]">
                {t.findStudent}
              </h3>
            </div>

            <div className="grid gap-4 md:grid-cols-2">

              <label className="relative block">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={19}
                />

                <input
                  className="field h-12 rounded-xl border-slate-200 pl-12"
                  placeholder={t.searchPlaceholder}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </label>

              <select
                className="field h-12 rounded-xl border-slate-200"
                value={levelId}
                onChange={e => setLevelId(e.target.value)}
              >
                <option value="">{t.allLevels}</option>

                {academic.levels.map(level => (
                  <option key={level.id} value={level.id}>
                    {level.level_name}
                  </option>
                ))}
              </select>

            </div>
          </div>

          {error && (
            <div className="mb-5 flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
              <span>{error}</span>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 font-bold"
              >
                <RefreshCw size={15} />
                {t.retry}
              </button>
            </div>
          )}

          <div className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">

            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-blue-100 px-5 py-5 md:px-7">

              <div>
                <h3 className="text-lg font-extrabold text-[#142B59]">
                  {t.directory}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  {t.records}: {displayedStudents.length}
                </p>
              </div>

              <span className="rounded-full bg-blue-50 px-4 py-2 text-xs font-bold text-blue-700">
                {displayedStudents.length}
              </span>

            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[750px] text-left text-sm">

                <thead className="bg-[#142B59] text-white">
                  <tr>
                    <th className="px-5 py-4">No.</th>
                    <th className="px-5 py-4">{t.admission}</th>
                    <th className="px-5 py-4">{t.name}</th>
                    <th className="px-5 py-4">{t.gender}</th>
                    <th className="px-5 py-4">{t.level}</th>
                    <th className="px-5 py-4">{t.combination}</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-blue-50">

                  {loadingStudents ? (
                    <tr>
                      <td colSpan="6" className="px-5 py-16 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="h-9 w-9 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
                          <span className="font-medium text-slate-500">
                            {t.loading}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : displayedStudents.length ? (
                    displayedStudents.map((student, index) => (
                      <tr
                        className="transition duration-200 hover:bg-blue-50/70"
                        key={student.id}
                      >
                        <td className="px-5 py-4 font-semibold text-slate-500">
                          {index + 1}
                        </td>

                        <td className="px-5 py-4">
                          <span className="rounded-lg bg-blue-50 px-3 py-1.5 font-bold text-blue-700">
                            {student.admission_number}
                          </span>
                        </td>

                        <td className="px-5 py-4 font-bold text-[#142B59]">
                          {student.first_name} {student.last_name}
                        </td>

                        <td className="px-5 py-4 text-slate-600">
                          {student.gender || '—'}
                        </td>

                        <td className="px-5 py-4 text-slate-600">
                          {student.level_name || '—'}
                        </td>

                        <td className="px-5 py-4">
                          <span className="rounded-lg bg-orange-50 px-3 py-1.5 font-semibold text-orange-700">
                            {student.combination_name || '—'}
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
                            {t.noStudents}
                          </p>

                          <p className="mt-1 text-sm text-slate-500">
                            {t.noStudentsDescription}
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
                {t.footer}
              </p>
            </div>

          </div>
        </section>

        <section className="relative overflow-hidden rounded-2xl bg-[#142B59] p-7 text-white shadow-xl md:p-10">

          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-400/10 blur-3xl" />

          <div className="relative">

            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">

              <div>
                <p className="text-xs font-bold uppercase tracking-[.2em] text-orange-400">
                  {t.schoolInfo}
                </p>

                <h2 className="mt-3 text-3xl font-black">
                  {t.contact}
                </h2>

                <p className="mt-3 max-w-xl leading-7 text-blue-100">
                  {t.contactDescription}
                </p>
              </div>

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-orange-400">
                <School size={34} />
              </div>

            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">

              {schoolContacts.map(contact => (
                <ContactCard
                  key={contact.key}
                  contact={contact}
                  t={t}
                />
              ))}

            </div>

          </div>
        </section>

      </main>

      <footer className="border-t border-blue-100 bg-white">
        <div className="container-page flex flex-col justify-between gap-3 py-6 text-sm text-slate-500 md:flex-row">
          <p className="font-semibold text-[#142B59]">
            SIMS - {t.footer}
          </p>
          <p>© {new Date().getFullYear()} SIMS. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}
