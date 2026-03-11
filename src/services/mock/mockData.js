export const SPORTS = ['cricket', 'soccer', 'tennis'];

export const mockMatches = [
  {
    id: 'm1',
    sport: 'cricket',
    startTime: '17 Jun 2025 10:00:00',
    name: 'Sri Lanka v Bangladesh',
    status: 'finished',
  },
  {
    id: 'm2',
    sport: 'cricket',
    startTime: '17 Jun 2025 15:00:00',
    name: 'Bundelkhand Bulls v Gwalior Cheetahs',
    status: 'inplay',
  },
  {
    id: 'm3',
    sport: 'cricket',
    startTime: '17 Jun 2025 19:15:00',
    name: 'Ruby Trichy Warriors v Lyca Kovai Kings',
    status: 'inplay',
  },
  {
    id: 'm4',
    sport: 'soccer',
    startTime: '17 Jun 2025 20:00:00',
    name: 'Barcelona v Sevilla',
    status: 'upcoming',
  },
  {
    id: 'm5',
    sport: 'tennis',
    startTime: '17 Jun 2025 21:30:00',
    name: 'Djokovic v Alcaraz',
    status: 'upcoming',
  },
];

export const mockMarkets = [
  {
    id: 'mk1',
    matchId: 'm1',
    type: 'matchOdds',
    status: 'suspended',
    updatedAt: Date.now() - 1000 * 60 * 11,
    runners: [
      { id: 'r1', name: 'Sri Lanka', back: 1.62, lay: 1.64 },
      { id: 'r2', name: 'Bangladesh', back: 2.32, lay: 2.36 },
    ],
  },
  {
    id: 'mk2',
    matchId: 'm2',
    type: 'matchOdds',
    status: 'active',
    updatedAt: Date.now() - 1000 * 60 * 2,
    runners: [
      { id: 'r3', name: 'Bundelkhand Bulls', back: 1.91, lay: 1.93 },
      { id: 'r4', name: 'Gwalior Cheetahs', back: 1.96, lay: 1.98 },
    ],
  },
  {
    id: 'mk3',
    matchId: 'm2',
    type: 'fancy',
    status: 'active',
    updatedAt: Date.now() - 1000 * 60 * 4,
    runners: [{ id: 'r5', name: 'Total 6s over 10.5', back: 1.85, lay: 1.9 }],
  },
  {
    id: 'mk4',
    matchId: 'm3',
    type: 'matchOdds',
    status: 'active',
    updatedAt: Date.now() - 1000 * 30,
    runners: [
      { id: 'r6', name: 'Ruby Trichy', back: 1.74, lay: 1.76 },
      { id: 'r7', name: 'Lyca Kovai', back: 2.16, lay: 2.2 },
    ],
  },
  {
    id: 'mk5',
    matchId: 'm3',
    type: 'toss',
    status: 'active',
    updatedAt: Date.now() - 1000 * 50,
    runners: [
      { id: 'r8', name: 'Team A', back: 1.95, lay: 1.98 },
      { id: 'r9', name: 'Team B', back: 1.95, lay: 1.98 },
    ],
  },
  {
    id: 'mk6',
    matchId: 'm3',
    type: 'backLay',
    status: 'active',
    updatedAt: Date.now() - 1000 * 45,
    ladder: [
      { price: 1.7, back: 1200, lay: 800 },
      { price: 1.71, back: 900, lay: 780 },
      { price: 1.72, back: 600, lay: 650 },
      { price: 1.73, back: 450, lay: 520 },
      { price: 1.74, back: 340, lay: 410 },
    ],
    selection: 'Team A',
  },
];

export const mockSettlements = [
  {
    matchId: 'm2',
    status: 'pending',
    result: null,
    finalized: false,
    pnl: { profit: 0, loss: 0 },
  },
  {
    matchId: 'm3',
    status: 'pending',
    result: null,
    finalized: false,
    pnl: { profit: 0, loss: 0 },
  },
];

