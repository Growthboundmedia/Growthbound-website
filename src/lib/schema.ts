// JSON-LD. This site IS indexed, so the schema is doing real work rather than
// ticking a box: it is what lets Google, and an AI assistant answering "who
// builds websites for tradies in Newcastle", state the answer as fact.
//
// Nothing in here may assert something the site does not also say in plain
// English on the page. Schema that disagrees with the visible copy is the
// fastest way to earn a manual action.
import { site, pricing } from '../data/site';

const ABS = (p: string) => new URL(p, site.url).href;

export const ID = {
  org: `${site.url}/#organization`,
  website: `${site.url}/#website`,
};

/** The business itself. Emitted once, on every page, via Base.astro. */
export function businessSchema(description: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': ID.org,
    name: site.name,
    legalName: site.legalName,
    url: site.url,
    description,
    telephone: site.phoneHref,
    email: site.email,
    image: ABS('/assets/og-default.jpg'),
    logo: ABS('/assets/gbm-arrow.svg'),
    founder: { '@type': 'Person', name: `${site.owner}, ${site.legalName}` },
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Newcastle',
      addressRegion: 'NSW',
      addressCountry: 'AU',
    },
    geo: { '@type': 'GeoCoordinates', latitude: site.geo.lat, longitude: site.geo.lng },
    areaServed: site.serviceArea.map((a) => ({ '@type': 'Place', name: a })),
    knowsAbout: [
      'Website design for builders',
      'Website design for trades',
      'Local SEO for construction businesses',
      'Lead generation for builders',
    ],
    sameAs: [] as string[],   // no verified profiles yet. Empty beats invented.
  };
}

/** One offering. Mirrors what the pricing page says, to the dollar. */
export function serviceSchema(o: {
  name: string; description: string; price?: string; priceCurrency?: string; url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: o.name,
    description: o.description,
    serviceType: 'Website design and development',
    provider: { '@id': ID.org },
    areaServed: site.serviceArea.map((a) => ({ '@type': 'Place', name: a })),
    url: ABS(o.url),
    ...(o.price
      ? {
          offers: {
            '@type': 'Offer',
            price: o.price,
            priceCurrency: o.priceCurrency ?? 'AUD',
            availability: 'https://schema.org/InStock',
            url: ABS(o.url),
          },
        }
      : {}),
  };
}

/** FAQPage. Every FAQ block on the site gets one. */
export function faqSchema(faqs: readonly { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

/** Breadcrumbs on every page below the home page. */
export function breadcrumbSchema(trail: readonly { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.name,
      item: ABS(t.path),
    })),
  };
}

/** The build, as a priced offering. Used on / and /growth. */
export const buildService = () =>
  serviceSchema({
    name: 'Lead-generating website for builders and trades',
    description:
      `A custom multi-page website built for a building or trades business, including ` +
      `the gallery, service and area pages, quote form and local SEO setup. ` +
      pricing.build.terms,
    price: '4000',
    url: '/growth',
  });
