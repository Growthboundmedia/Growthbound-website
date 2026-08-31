// Every FAQ on the site. Each block is paired with faqSchema() on its page, so
// an answer written here is also the answer an AI assistant reads.
//
// Nothing here may promise a ranking. GROWTHBOUND-PLAYBOOK.md: the build ships
// optimised on day one, anything ongoing is the retainer, and the promise is
// the setup, never the position.

export const generalFaqs = [
  {
    q: 'How long does it take?',
    a: 'Two to three weeks from the day I have your photos and the basics. You see a free demo before that, usually within 48 hours, so you know what you are getting before you commit to anything.',
  },
  {
    q: 'What do I actually have to do?',
    a: 'Send me a handful of good photos of your work, tell me your services and the areas you cover, and look over the draft. That is the whole job. I write the wording, build it, set it up and host it.',
  },
  {
    q: 'What does it cost?',
    a: 'The standard build is $4,000. Half to start, half when you are happy with it. If a lump sum does not suit, you can pay it off instead: $1,500 to start and $250 a month for ten months. After it goes live, hosting and security is $90 a month. Bigger scope, more pages, migrations and custom work get quoted properly after a look.',
  },
  {
    q: 'Can I pay it off monthly instead?',
    a: 'Yes. $1,500 to start and $250 a month for ten months. That is the same $4,000, not a finance deal with interest on it, and hosting is $90 a month on top the same as it is for anyone else. While it is being paid off the site is licensed to you rather than owned by you, the same way a ute on finance is yours to drive but not yours to sell. When the last payment lands it is yours outright. Your domain is yours the whole time either way.',
  },
  {
    q: 'Will people actually find it on Google?',
    a: 'The site is built to rank from day one: your services and areas each get their own page, the technical setup is done properly, and the schema tells Google exactly what you do and where. Nobody honest can promise you a position, because Google decides that. What I can promise is that the groundwork is done right, and on the Growth plan I keep working on it every month.',
  },
  {
    q: 'Who owns the website?',
    a: 'You do. Your domain, your content, your site. No lock-in, and if you ever want to take it somewhere else you can.',
  },
  {
    q: 'What if I need something changed later?',
    a: 'On the Growth plan every edit you need is handled, no hourly billing and no waiting. On hosting only, small text fixes are included and anything bigger gets quoted before I start.',
  },
  {
    q: 'Why should I trust you with this?',
    a: 'I laid pipe, worked a coal port and did marketing for a real estate company before this. I know what a quote costs you to write and what a dead lead feels like. And you do not have to trust me up front: I build you a free demo of your own site first, and you decide from there.',
  },
] as const;

export const builderFaqs = [
  {
    q: 'I already get all my work through word of mouth. Why do I need a site?',
    a: 'Word of mouth still sends people to Google. Someone recommends you at a barbecue, the bloke looks you up on the drive home, finds nothing, and rings whoever does turn up. The site is not there to replace your referrals, it is there to stop them leaking.',
  },
  {
    q: 'I have a Facebook page. Is that enough?',
    a: 'It is something, but it is not yours and it does not show up when someone searches for a builder in your suburb. A Facebook page also cannot list your services, your areas, your licence and your jobs in a way Google can read and rank.',
  },
  {
    q: 'What sort of builder is this for?',
    a: 'New homes, renovations, extensions, custom builds, decks and pergolas, granny flats. If you quote jobs and you want more of the good ones, it works. It is aimed at builders doing solid work who are invisible online.',
  },
  {
    q: 'Do you show my licence number and insurance?',
    a: 'Yes, if you give them to me. I never invent a licence number, an ABN, an insurance status or a review. If I do not have it, the site does not claim it.',
  },
  {
    q: 'What if I do not have good photos?',
    a: 'Most builders have more than they think, sitting on their phone. Job photos taken on site are usually better than staged ones anyway, because they look real. We work with what you have and I will tell you straight if a job needs a couple more shots.',
  },
  {
    q: 'Do you work outside Newcastle?',
    a: 'Yes. I am based in Newcastle and most of my work is around the Hunter, but the build is done remotely, so where you are does not change the price or the timeline.',
  },
] as const;
