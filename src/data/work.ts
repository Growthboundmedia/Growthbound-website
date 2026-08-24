// The work shown publicly. Three items and no more.
//
// EXCLUDED ON PURPOSE, do not add them back:
//   Walkom Constructions, C&G Concreting, Mezcal Fabrication
//     -> real prospects with live conversations. Showing a prospect's demo
//        without asking is how you lose the deal and the referral.
//   Cedar & Stone
//     -> only ever existed at a raw netlify.app URL. Never show one of those.
//
// `kind` decides the badge, and the badge is not optional. A concept build
// presented as a client is a lie a builder will eventually check.

export type WorkKind = 'client' | 'demo';

export interface WorkItem {
  slug: string;
  shot: string;           // browser-framed screenshot of the real site
  shotUrl: string;        // what shows in the frame's address bar
  name: string;
  trade: string;
  place: string;
  kind: WorkKind;
  href: string;
  live: boolean;          // false = built but not yet reachable. Renders unlinked.
  blurb: string;
  points: readonly string[];
  result?: string;
}

export const work: readonly WorkItem[] = [
  {
    slug: 'satori',
    shot: '/assets/shot-satori.png',
    shotUrl: 'smtgym.com',
    name: 'Satori Muay Thai',
    trade: 'Muay Thai gym',
    place: 'Newcastle CBD',
    kind: 'client',
    href: 'https://www.smtgym.com',
    live: true,
    blurb:
      'Built the site, ran the ads and organised the opening. It now ranks second on Google for muay thai Newcastle and books people in without anyone answering a phone.',
    points: [
      'Second on Google for the main search term',
      '768 visitors a month, just under half straight off search',
      '260 people a month check the prices on their own',
    ],
    result: '#2 on Google for "muay thai Newcastle"',
  },
  {
    slug: 'hammond',
    shot: '/assets/shot-hammond.png',
    shotUrl: 'hammondcobuilding.com.au',
    name: 'Hammond & Co Building',
    trade: 'Renovations and extensions',
    place: 'Newcastle',
    kind: 'demo',
    href: 'https://demo.growthbound.media/hammond/',
    live: true,
    blurb:
      'The full build, start to finish. Every service on its own page, a page for each suburb, the job gallery, the quote form. This is what $4,000 buys, and you can click every part of it.',
    points: [
      'A page for every service and every suburb',
      'Job gallery built from the photos on your phone',
      'Quote form that asks job type, suburb and timeline',
    ],
  },
  {
    slug: 'bracken',
    shot: '/assets/shot-bracken.png',
    shotUrl: 'brackenplastering.com.au',
    name: 'Bracken Plastering',
    trade: 'Plastering',
    place: 'Adamstown',
    kind: 'demo',
    href: 'https://demo.growthbound.media/bracken-plastering/',
    live: true,
    blurb:
      'A smaller trade, same machine. Proof the approach is not just for big builders: a plasterer gets the same job pages, the same one-tap calling and the same form.',
    points: [
      'Built for a one-man operation, not an office',
      'Straight to the phone on a mobile',
      'Same structure, scaled to the trade',
    ],
  },
];

export const clientWork = work.filter((w) => w.kind === 'client');
export const demoWork = work.filter((w) => w.kind === 'demo');
