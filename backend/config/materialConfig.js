
const TICKET_PRICES = {
  Gicumbi: 0,
  Byumba: 4500,
  Kigali: 5500,
  Musanze: 9000,
  Nyagatare: 5000
};

// Material requirements for each term.
const TERM_MATERIALS = {
  1: [
    'ram',
    'buckets',
    'ikiyiko',
    'ifoke',
    'isahane',
    'igikombe',
    'ph',
    'net',
    'enter_mines',
    'decision'
  ],

  2: [
    'ph',
    'enter_mines',
    'decision',
    'trip'
  ],

  3: [
    'ph',
    'enter_mines',
    'decision'
  ]
};

// Prices are in Rwandan Francs (FRW).
// NET and DECISION are currently included at no additional charge.
const MATERIAL_PRICES = {
  1: {
    ram: 7000,
    buckets: 2500,
    ikiyiko: 250,
    ifoke: 250,
    isahane: 1000,
    igikombe: 1000,
    ph: 3500,
    net: 0,
    enter_mines: 110000,
    decision: 0
  },

  2: {
    ph: 3500,
    enter_mines: 110000,
    decision: 0,
    trip: 20000
  },

  3: {
    ph: 3500,
    enter_mines: 110000,
    decision: 0
  }
};

const MINES_REQUIRED_AMOUNT = 110000;

const TERM_TOTALS = {
  1: 125500,
  2: 133500,
  3: 113500
};

module.exports = {
  TICKET_PRICES,
  TERM_MATERIALS,
  MATERIAL_PRICES,
  MINES_REQUIRED_AMOUNT,
  TERM_TOTALS
};
