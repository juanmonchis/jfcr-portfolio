import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Stop Using Inter",
  description: "A curated list of type foundries and designers offering beautiful fonts — free or affordable. Being original is not expensive.",
  openGraph: {
    title: "Stop Using Inter — JFCR",
    description: "A curated list of type foundries and designers offering beautiful fonts — free or affordable.",
    url: "https://www.jfcr.design/projects/stopusinginter",
  },
};

const BG   = "#F2EBD9";
const INK  = "#0C0D1F";
const MUTED = "rgba(12,13,31,0.45)";

const foundries = [
  { name: "Bastarda Type",      href: "https://bastardatype.com/" },
  { name: "Kulture",            href: "https://kulture.gumroad.com/" },
  { name: "Volclair Studio",    href: "https://volclair.studio/Shop-Typefaces" },
  { name: "Velvetyne",          href: "https://velvetyne.fr/" },
  { name: "Pangram Pangram",    href: "https://pangrampangram.com/" },
  { name: "J Vill",             href: "https://jvill.gumroad.com/" },
  { name: "Rajput Rajesh",      href: "https://rajputrajesh-448.gumroad.com/" },
  { name: "Hey Font Shop",      href: "https://heyfontshop.com/homepage/" },
  { name: "M. Borowczyk",       href: "https://mborowczyk.gumroad.com/" },
  { name: "Emyself Design",     href: "https://emyselfdesign.xyz/work" },
  { name: "iFrame Fonts",       href: "https://iframefonts.com/" },
  { name: "Future Fonts",       href: "https://www.futurefonts.xyz/" },
  { name: "Brumale",            href: "https://www.brumale.xyz/" },
  { name: "Uncarving",          href: "https://uncarving.gumroad.com/" },
  { name: "Silver Stag",        href: "https://www.silverstag.design/" },
  { name: "Zelow Type",         href: "https://zelowtype.com/" },
  { name: "Sick Again",         href: "https://sickagain.gumroad.com/" },
  { name: "Misha Human",        href: "https://mishahuman.gumroad.com/" },
  { name: "Blaze Type",         href: "https://blazetype.eu/typecatalogue/" },
  { name: "ECAL Typefaces",     href: "https://ecal-typefaces.ch/" },
  { name: "Collletttivo",       href: "https://www.collletttivo.it/" },
  { name: "ABC Dinamo",         href: "https://abcdinamo.com/typefaces" },
  { name: "Good Type Foundry",  href: "https://goodtypefoundry.com/" },
  { name: "205TF",              href: "https://www.205.tf/" },
  { name: "TMP State",          href: "https://type.tmpstate.net/preview/" },
  { name: "Metis Foundry",      href: "https://metis-foundry.com/" },
  { name: "Herzberg Design",    href: "https://www.herzbergdesign.com/fonts" },
  { name: "LAIC",               href: "https://laic.pl/" },
  { name: "Kometa",             href: "https://www.kometa.xyz/typefaces/" },
  { name: "Typelab",            href: "https://typelab.fr/" },
  { name: "Use Modify",         href: "https://usemodify.com/" },
  { name: "Tomorrow",           href: "https://tomorrow.type.today/en" },
];

export default function StopUsingInterPage() {
  return (
    <main className="flex-grow" style={{ background: BG, minHeight: "100vh" }}>
      <SiteHeader logoSize={100} logoVariant="dark" color={INK} />

      <section className="px-6 md:px-12 lg:px-20 pt-40 pb-28 overflow-hidden">
        <div className="max-w-[1000px] mx-auto">

          <p className="type-tag mb-4" style={{ color: MUTED }}>PLEASE, BEING ORIGINAL IS NOT EXPENSIVE</p>
          <h1 className="type-homepage-hero-left mb-10" style={{ color: INK }}>Stop Using Inter</h1>

          <p className="type-paragraph max-w-xl mb-16" style={{ color: MUTED }}>
            Are you also in the intersection of art and technology? Along
            with the other 99.9% of designers?
          </p>

          <div className="border-t mb-10" style={{ borderColor: `${INK}22` }} />

          <p className="type-tag mb-6" style={{ color: MUTED }}>COLLECTION</p>

          <p className="type-paragraph max-w-xl mb-4" style={{ color: INK }}>
            You have zero excuses.
          </p>
          <p className="type-paragraph max-w-xl mb-16" style={{ color: MUTED }}>
            I&apos;ve gathered a list of designers and foundries that offer an extensive
            range of fonts — designed either for free or for a steal. Start using
            something else. Start branding your voice and your projects differently.
            When you use Inter, a pixel on my screen dies.
          </p>

          <ul className="flex flex-col">
            {foundries.map((foundry, i) => (
              <li key={foundry.name}>
                <a
                  href={foundry.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between py-4 border-t transition-colors duration-200"
                  style={{ borderColor: `${INK}18` }}
                >
                  <span
                    className="type-case-heading-sm transition-colors duration-200"
                    style={{ color: MUTED }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className="type-case-heading-sm flex-1 ml-8 transition-colors duration-200 sui-item-text"
                  >
                    {foundry.name}
                  </span>
                  <span className="type-tag transition-colors duration-200 sui-item-text">
                    →
                  </span>
                </a>
              </li>
            ))}
            <li>
              <div className="border-t" style={{ borderColor: `${INK}18` }} />
            </li>
          </ul>

          <p className="type-paragraph mt-20 max-w-xl" style={{ color: MUTED }}>
            Get your fonts that are not Inter from here. Go check them out.
          </p>

        </div>
      </section>
    </main>
  );
}
