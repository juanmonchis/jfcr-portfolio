import SplineViewer from "@/components/SplineViewer";
import CvCta from "@/components/CvCta";
import AboutHeroTitle from "@/components/AboutHeroTitle";
import YouTubeFacade from "@/components/YouTubeFacade";
import RotatingStat, { type Stat } from "@/components/RotatingStat";

const CREAM = "#F2EBD9";
const MUTED = "rgba(242,235,217,0.55)";
const LINK_COLOR = "rgba(242,235,217,0.75)";
const BG = "#2D0055";

// Each column rotates through its own list. Add entries to make a column animate.
const statColumns: Stat[][] = [
  [
    { value: "8K+", label: "Minutes mentoring on ADPList" },
    { value: "200+", label: "Mentees supported" },
    { value: "19+", label: "B2B brands served" },
  ],
  [
    { value: "199h", label: "Learning Blender (so far)" },
    { value: "12", label: "Years in product design" },
    { value: "400K+", label: "Users reached in healthcare" },
    { value: "500+", label: "Engineers served by design systems" },
  ],
  [
    { value: "20+", label: "Gunplas built" },
    { value: "5", label: "Products taken from 0 to 1" },
    { value: "4", label: "Design systems built" },
    { value: "80M+", label: "Consumers on products built with the design system I helped build" },
  ],
  [
    { value: "80", label: "Warhammer miniatures in the backlog" },
    { value: "5", label: "Squads led" },
    { value: "2", label: "Design awards" },
    { value: "75+", label: "Designers served by design systems" },
  ],
];

const talks = [
  { id: "JT-6Zg_pJI8", title: "Make A Better Graphic Design Portfolio and Get More Clients" },
  { id: "gjRGMhzhkUY", title: "Build a Portfolio That Breaks the Mold and Why It Matters" },
];

const recognitions = [
  { label: "ADPList Top 100 Most Influential Mentors 2024", href: "https://blog.adplist.org/post/2024-adplist-wrapped-top-mentors-trends-and-topics" },
];

const featuredVideos: { id: string; title: string; start?: number }[] = [
  {
    id: "UxCYIkZePG8",
    title: "5 book recommendations for DESIGNERS and CREATIVES instead of The Creative Way",
  },
  {
    id: "5J3gomC1pVs",
    title: "The risks of AI as a young creative",
    start: 118,
  },
];

const thoughtsOnDesign = [
  { label: "Book recommendations for creatives", href: "https://www.instagram.com/reel/DN-CzpmjNEQ/" },
  { label: "On developing taste and self curation", href: "https://www.instagram.com/reel/DPthfJ9DGRY" },
  { label: "On taste and intent", href: "https://www.instagram.com/reel/DPtj5yHjF3q" },
  { label: "Hyper individualism and creative geniuses", href: "https://www.instagram.com/reel/DSVIEtpjLpi" },
  { label: "Thought leaders and use of AI", href: "https://www.instagram.com/reel/DGAK1Kcs9-v/" },
  { label: "Pentagram and face washing", href: "https://www.instagram.com/reel/DDPgpmeRG3B/" },
];

// The two Spline scenes frame their models at different sizes. Spline keeps model size
// fixed in pixels, so a bigger canvas doesn't help; `zoom` scales the rendered canvas
// with CSS around `anchor` (where the model sits in the 410×530 canvas) and moves that
// point to the box centre.
const BOX_W = 410;
const BOX_H = 530;
const PENCIL = { zoom: 1, anchor: [BOX_W / 2, BOX_H / 2] as const };
const SPRING = { zoom: 2.2, anchor: [80, 82] as const };

function AwardModel({
  url,
  zoom,
  anchor,
}: {
  url: string;
  zoom: number;
  anchor: readonly [number, number];
}) {
  return (
    <div className="relative w-[287px] h-[371px] md:w-[410px] md:h-[530px] overflow-hidden shrink-0">
      <div
        className="absolute left-0 top-0 origin-top-left scale-[0.7] md:scale-100"
        style={{ width: BOX_W, height: BOX_H }}
      >
        <SplineViewer
          url={url}
          style={{
            width: BOX_W,
            height: BOX_H,
            transformOrigin: `${anchor[0]}px ${anchor[1]}px`,
            transform: `translate(${BOX_W / 2 - anchor[0]}px, ${BOX_H / 2 - anchor[1]}px) scale(${zoom})`,
          }}
        />
      </div>
    </div>
  );
}

export default function AboutSection() {
  return (
    <section id="about" style={{ background: BG }} className="pt-52 md:pt-40 pb-20 px-6 md:px-12 lg:px-20">
      <div className="max-w-[1000px] mx-auto flex flex-col items-center gap-16 text-center">

        {/* Title */}
        <AboutHeroTitle />

        {/* Stats */}
        <div
          className="w-full grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-b py-10"
          style={{ borderColor: "rgba(242,235,217,0.15)" }}
        >
          {statColumns.map((items, i) => (
            <RotatingStat
              key={items[0].value}
              items={items}
              valueColor={CREAM}
              labelColor={MUTED}
              delay={i * 900}
            />
          ))}
        </div>

        {/* Awards — Spline left · text · Spline right */}
        <div
          className="w-full flex flex-col items-center gap-6 rounded-3xl px-8 pt-12 pb-6"
          style={{ background: CREAM }}
        >
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
            <AwardModel url="https://prod.spline.design/zuOtTMciGG7aBGgV/scene.splinecode" {...PENCIL} />

            <div className="flex flex-col items-center gap-3 shrink-0">
              <h3 className="type-case-subtitle" style={{ color: BG }}>Awards</h3>
              <p className="type-caption" style={{ color: BG }}>
                <a
                  href="https://www.dandad.org/work/d-ad-awards-archive/tree-of-hope-a-whatsapp-adventure"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer"
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  D&amp;AD 2024 – Wood Pencil
                </a>
                {" "}&nbsp;/&nbsp;{" "}
                <a
                  href="https://winners.webbyawards.com/2024/games/general-games/public-service-social-impact/287638/tree-of-hope--a-whatsapp-adventure"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer"
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  Webby Winner 2024
                </a>
              </p>
            </div>

            <AwardModel url="https://prod.spline.design/yOORwiAE8AgognUf/scene.splinecode" {...SPRING} />
          </div>

          <p className="type-caption-sm" style={{ color: BG, opacity: 0.45 }}>
            3d models made by{" "}
            <a
              href="https://www.ndeeobj.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:opacity-75 transition-opacity"
            >
              Andrei Frolov
            </a>
          </p>
        </div>

        {/* Talks + Recognitions */}
        <div className="w-full flex flex-col gap-6">
          <div className="flex flex-col items-center gap-4 rounded-2xl px-8 py-8" style={{ border: `1px solid ${CREAM}33` }}>
            <h3 className="type-case-subtitle" style={{ color: CREAM }}>Recognitions</h3>
            <ul className="flex flex-col gap-2 items-center">
              {recognitions.map((r) => (
                <li key={r.label}>
                  <a
                    href={r.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="type-caption underline underline-offset-2 hover:opacity-100 transition-opacity"
                    style={{ color: LINK_COLOR }}
                  >
                    {r.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Thoughts on design */}
        <div className="w-full flex flex-col items-center gap-4 rounded-2xl px-8 py-8" style={{ border: `1px solid ${CREAM}33` }}>
          <h3 className="type-case-subtitle" style={{ color: CREAM }}>Thoughts on design</h3>
          {/* Featured video — click-to-play facade */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
            {featuredVideos.map((v) => (
              <div key={v.id} className="flex flex-col gap-3">
                <YouTubeFacade id={v.id} title={v.title} start={v.start} />
                <p className="type-caption-sm" style={{ color: MUTED }}>
                  {v.title}
                </p>
              </div>
            ))}
          </div>

          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(
                featuredVideos.map((v) => ({
                  "@context": "https://schema.org",
                  "@type": "VideoObject",
                  name: v.title,
                  thumbnailUrl: `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`,
                  embedUrl: `https://www.youtube.com/embed/${v.id}`,
                  contentUrl: `https://www.youtube.com/watch?v=${v.id}`,
                }))
              ),
            }}
          />

          <h4 className="type-case-heading-sm mt-4" style={{ color: CREAM }}>
            See it on Instagram
          </h4>

          <ul className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
            {thoughtsOnDesign.map((t, i) => (
              <li key={t.label}>
                <a
                  href={t.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 rounded-2xl p-4 text-left h-full transition-colors hover:bg-[rgba(242,235,217,0.08)]"
                  style={{ border: `1px solid ${CREAM}33` }}
                >
                  <span
                    className="shrink-0 flex items-center justify-center rounded-xl transition-transform group-hover:scale-105"
                    style={{ width: 56, height: 72, background: CREAM, color: BG }}
                    aria-hidden="true"
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                  <span className="flex flex-col gap-1 min-w-0">
                    <span className="type-caption-sm" style={{ color: MUTED }}>
                      Reel {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="type-caption" style={{ color: CREAM }}>
                      {t.label}
                    </span>
                    <span className="type-caption-sm" style={{ color: LINK_COLOR }}>
                      Watch on Instagram ↗
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Talks */}
        <div className="w-full flex flex-col items-center gap-4 rounded-2xl px-8 py-8" style={{ border: `1px solid ${CREAM}33` }}>
          <h3 className="type-case-subtitle" style={{ color: CREAM }}>Talks</h3>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
            {talks.map((t) => (
              <div key={t.id} className="flex flex-col gap-3">
                <YouTubeFacade id={t.id} title={t.title} />
                <p className="type-caption-sm" style={{ color: MUTED }}>
                  {t.title}
                </p>
              </div>
            ))}
          </div>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(
                talks.map((t) => ({
                  "@context": "https://schema.org",
                  "@type": "VideoObject",
                  name: t.title,
                  thumbnailUrl: `https://i.ytimg.com/vi/${t.id}/hqdefault.jpg`,
                  embedUrl: `https://www.youtube.com/embed/${t.id}`,
                  contentUrl: `https://www.youtube.com/watch?v=${t.id}`,
                }))
              ),
            }}
          />
        </div>

        {/* Body */}
        <div className="flex flex-col gap-6 max-w-[720px] text-left">
          <p className="type-paragraph" style={{ color: MUTED }}>
            When you need someone to take care of every moving piece of your product and
            your brand, from workshops to ideation to release with craft but also urgency (when
            needed), you got me. If you need a team of creatives aligned on an idea, a schedule, a
            brief and expectations then <em style={{ color: CREAM }}>you are in luck</em>, cause I&apos;m also into channeling
            perspectives and guiding other creatives.
          </p>
          <p className="type-paragraph" style={{ color: MUTED }}>
            In the realm of creation, I craft products, forge brands, construct design systems,
            shape user experiences, and tinker in miniature painting and animation.
          </p>
          <p className="type-paragraph" style={{ color: MUTED }}>
            Call me a generalist with strong opinions, a product designer with a made up art
            degree, a brand strategist who knew how to code, or an illustrator passing as a
            graphic designer. It&apos;s all the same to me. But I do care about building products that
            work in favor of the user, that speak clearly and spark joy, and on building teams that
            rely on each other, have efficient design methods, feedback sessions and clean,{" "}
            <s style={{ color: LINK_COLOR }}>properly labeled layers</s> structured components on their libraries.
          </p>
        </div>

        {/* CV CTA */}
        <CvCta />

         {/* Mentoring note */}
        <p className="type-paragraph" style={{ color: MUTED }}>
          Or if you&apos;re interested in knowing more about my mentoring:
        </p>

        {/* ADPList embed */}
        <div
          style={{
            height: 560,
            boxShadow: "rgba(142, 151, 158, 0.15) 0px 4px 19px 0px",
            borderRadius: 16,
            overflow: "hidden",
            width: "100%",
            maxWidth: 650,
          }}
        >
          <iframe
            src="https://adplist.org/widgets/reviews?src=juan-felipe-cadavid-r"
            title="All Reviews"
            width="100%"
            height="100%"
            loading="lazy"
            style={{ border: 0 }}
          />
        </div>

       

        {/* Contact box */}
        <div
          className="p-8 rounded-2xl w-full max-w-[560px]"
          style={{ border: "1px solid rgba(242,235,217,0.2)" }}
        >
          <p className="type-paragraph mb-6 text-left" style={{ color: MUTED }}>
            If you&apos;re not into buzzwords or your goals are not only about
            creating value for shareholders and more into building human
            oriented, no cutting corners, and ethically built type of design,
            please contact me over here:
          </p>
          <a
            href="https://www.linkedin.com/in/jfcrco/"
            target="_blank"
            rel="noopener noreferrer"
            className="type-case-heading-sm hover:opacity-70 transition-opacity"
            style={{ color: CREAM }}
          >
            LinkedIn
          </a>
        </div>

      </div>
    </section>
  );
}
