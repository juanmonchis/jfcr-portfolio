import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Inspiration",
  description: "A list of designers and artists that I admire.",
  openGraph: {
    title: "Inspiration — JFCR",
    description: "A list of designers and artists that I admire.",
    url: "https://www.jfcr.design/inspiration",
  },
};

const CREAM  = "#F2EBD9";
const MUTED  = "rgba(242,235,217,0.5)";
const BG     = "#0C0D1F";

const influences = [
  { name: "01_ndee.obj",      href: "https://www.instagram.com/01_ndee.obj/" },
  { name: "kaikundler",       href: "https://www.galacticgarrison.com/" },
  { name: "sahlooter",        href: "https://www.instagram.com/sahlooter/" },
  { name: "loopinglovers",    href: "https://www.instagram.com/loopinglovers/" },
  { name: "a_garbutt",        href: "https://www.instagram.com/a_garbutt/" },
  { name: "dylan_casano",     href: "https://www.instagram.com/dylancasano/" },
  { name: "darumacreative",   href: "https://www.instagram.com/darumacreative/" },
  { name: "elpatiodeleon",    href: "https://www.instagram.com/elpatiodeleon/" },
  { name: "luisfelipe.fv",    href: "https://www.instagram.com/luisfelipe.fv/" },
  { name: "pecha.spech",      href: "https://www.instagram.com/pecha.spech/" },
  { name: "bysitges",         href: "https://www.instagram.com/bysitges/" },
  { name: "raccoonnook",      href: "https://www.instagram.com/raccoonnook/" },
  { name: "lahija_dl_sapo",   href: "https://www.instagram.com/lahija_dl_sapo/" },
  { name: "tiger_bacon",      href: "https://www.instagram.com/tigerbacon/" },
  { name: "chris_walkman",    href: "https://www.instagram.com/chriswalkman/" },
  { name: "trashyperocool",   href: "https://www.instagram.com/trashyperocool/" },
  { name: "mateo.emeu",       href: "https://www.instagram.com/mateo.emeu/" },
  { name: "nojuan.tv",        href: "https://www.instagram.com/nojuan.tv/" },
  { name: "aozop",            href: "https://www.instagram.com/aozop/" },
  { name: "dresgonzalez13",   href: "https://www.instagram.com/dresgonzalez13/" },
  { name: "kae._._._",        href: "https://www.instagram.com/kae._._._/" },
  { name: "ticoyaki",         href: "https://www.instagram.com/ticoyaki/" },
  { name: "koruproject",      href: "https://www.instagram.com/koruproject/" },
  { name: "rossplaskow",      href: "https://www.instagram.com/rossplaskow/" },
  { name: "maxoubourgeois",   href: "https://www.instagram.com/maxoubourgeois/" },
  { name: "jkane.co",         href: "https://www.instagram.com/jkane.co/" },
  { name: "colincoviello",    href: "https://www.instagram.com/colincoviello/" },
  { name: "sailordanny",      href: "https://www.instagram.com/sailordanny/" },
  { name: "goodcopywriting",  href: "https://www.instagram.com/goodcopywriting/" },
  { name: "cuervo.andrea",    href: "https://www.instagram.com/cuervo.andrea/" },
];

export default function InspirationPage() {
  return (
    <main style={{ background: BG, minHeight: "100vh" }}>
      <SiteHeader logoSize={100} logoVariant="dark" color={CREAM} />

      <section className="px-6 md:px-12 lg:px-20 pt-40 pb-28">
        <div className="max-w-[1000px] mx-auto">

          <p className="type-tag mb-4" style={{ color: MUTED }}>ON THE SHOULDERS OF GIANTS</p>
          <h1 className="type-homepage-hero mb-10" style={{ color: CREAM }}>Inspiration</h1>

          <p className="type-paragraph max-w-xl mb-16" style={{ color: MUTED }}>
            A social media addiction and a set of short-lived recurring obsessions have led me to
            discover, cherish and learn from many different designers and artists, some of them
            I&apos;ve had the pleasure to meet and work with.
          </p>

          <p className="type-case-subtitle mb-10" style={{ color: CREAM, fontWeight: 400 }}>
            Love for the craft, love for the people —<br />
            here a list of influences and people who I&apos;ve learned from:
          </p>

          <ul className="flex flex-col">
            {influences.map((person, i) => (
              <li key={person.name}>
                <a
                  href={person.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between py-4 border-t transition-colors duration-200"
                  style={{ borderColor: "rgba(242,235,217,0.1)" }}
                >
                  <span
                    className="type-case-heading-sm transition-colors duration-200 group-hover:opacity-50"
                    style={{ color: CREAM }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className="type-case-heading-sm flex-1 ml-8 transition-colors duration-200 group-hover:opacity-50"
                    style={{ color: CREAM }}
                  >
                    {person.name}
                  </span>
                  <span className="type-tag transition-colors duration-200 group-hover:opacity-50" style={{ color: MUTED }}>
                    →
                  </span>
                </a>
              </li>
            ))}
            <li>
              <div className="border-t" style={{ borderColor: "rgba(242,235,217,0.1)" }} />
            </li>
          </ul>

          <p className="type-paragraph mt-20 max-w-xl" style={{ color: MUTED }}>
            What is designing without a community, or at least silently lurking through your
            Instagram and imitating those who you admire?
          </p>

        </div>
      </section>
    </main>
  );
}
