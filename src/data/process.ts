// The four steps. Numbered because the order is the actual promise: he sees
// something real before he pays anything.
export const process = [
  {
    n: '01',
    title: 'A quick chat',
    dim: 'Day 0',
    body: 'Fifteen minutes. You tell me what the business does and which jobs you want more of. No deck, no pitch, no obligation.',
  },
  {
    n: '02',
    title: 'I build you a demo, free',
    dim: '48 hours',
    body: 'Not a mockup, a working site with your name on it that you can click through on your phone. You have not paid me anything at this point and you are not committed to anything.',
  },
  {
    n: '03',
    title: 'You send photos, I build it properly',
    dim: '2 to 3 weeks',
    body: 'A handful of good shots off your phone and the basics. That is your whole job. I write the wording, build every page, and you review it and tell me what to change.',
  },
  {
    n: '04',
    title: 'It goes live and I keep it running',
    dim: 'Ongoing',
    body: 'I host it, keep it secure and patched, and it starts getting found. Hosting and security is $90 a month from the day it goes live.',
  },
] as const;

// The problem, rewritten from the old site's 01/02/03. Same argument, less
// agency in the voice.
export const ceiling = [
  {
    n: '01',
    title: 'They check you before they call',
    body: 'Nobody rings a builder cold any more. They look you up first. No site, or one that looks like 2013, and you have lost the job before you ever knew it existed.',
  },
  {
    n: '02',
    title: 'Tidy beats good',
    body: 'The builder who looks more professional online wins work off better builders every single day. It is not fair and it does not care how good your work is.',
  },
  {
    n: '03',
    title: 'Referrals leak',
    body: "Someone recommends you. They go searching, they cannot find you, they ring whoever turns up first. That is your reputation paying someone else's mortgage.",
  },
] as const;
