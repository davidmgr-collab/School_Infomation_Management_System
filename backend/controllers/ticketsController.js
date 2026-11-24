
const db = require('../config/db');

const {
  TICKET_PRICES
} = require('../config/materialConfig');

// GET: Retrieve saved student tickets.
exports.list = async (req, res, next) => {
  try {
    const {
      academic_year_id,
      term_id,
      location
    } = req.query;

    // Validate academic year.
    if (
      academic_year_id &&
      (!Number.isInteger(Number(academic_year_id)) ||
        Number(academic_year_id) <= 0)
    ) {
      return res.status(400).json({
        message: 'Invalid academic year selected.'
      });
    }

    // Validate term.
    if (
      term_id &&
      (!Number.isInteger(Number(term_id)) ||
        Number(term_id) <= 0)
    ) {
      return res.status(400).json({
        message: 'Invalid term selected.'
      });
    }

    // Validate location.
    if (
      location &&
      location !== 'all' &&
      !Object.prototype.hasOwnProperty.call(
        TICKET_PRICES,
        location
      )
    ) {
      return res.status(400).json({
        message: 'Invalid ticket location.'
      });
    }

    const conditions = [];
    const values = [];

    if (academic_year_id) {
      conditions.push('t.academic_year_id = ?');
      values.push(Number(academic_year_id));
    }

    if (term_id) {
      conditions.push('st.term_id = ?');
      values.push(Number(term_id));
    }

    if (location && location !== 'all') {
      conditions.push('st.location = ?');
      values.push(location);
    }

    const whereClause = conditions.length
      ? `WHERE ${conditions.join(' AND ')}`
      : '';

    const [tickets] = await db.execute(
      `SELECT
          st.id AS ticket_id,
          st.enrollment_id,
          st.term_id,

          s.id AS student_id,
          s.admission_number,
          s.first_name,
          s.last_name,

          st.location,
          st.amount,

          t.academic_year_id,
          t.term_number,

          st.created_at,
          st.updated_at

       FROM student_tickets st

       INNER JOIN student_enrollments e
          ON e.id = st.enrollment_id

       INNER JOIN students s
          ON s.id = e.student_id

       INNER JOIN terms t
          ON t.id = st.term_id

       ${whereClause}

       ORDER BY
          s.first_name ASC,
          s.last_name ASC`,
      values
    );

    const totalTickets = tickets.length;

    const totalAmount = tickets.reduce(
      (total, ticket) =>
        total + Number(ticket.amount || 0),
      0
    );

    const locationSummary = {};

    for (const ticket of tickets) {
      const ticketLocation = ticket.location;

      if (!locationSummary[ticketLocation]) {
        locationSummary[ticketLocation] = {
          location: ticketLocation,
          ticket_count: 0,
          total_amount: 0
        };
      }

      locationSummary[ticketLocation].ticket_count++;

      locationSummary[ticketLocation].total_amount +=
        Number(ticket.amount || 0);
    }

    return res.json({
      data: tickets.map((ticket) => ({
        ...ticket,
        amount: Number(ticket.amount || 0),
        ticket_location: ticket.location,
        ticket_amount: Number(ticket.amount || 0),
        full_name:
          `${ticket.first_name} ${ticket.last_name}`
      })),

      summary: {
        total_tickets: totalTickets,
        total_amount: totalAmount,
        locations: Object.values(locationSummary)
      },

      ticket_prices: TICKET_PRICES
    });

  } catch (error) {
    console.error('Tickets controller error:', error);
    next(error);
  }
};
