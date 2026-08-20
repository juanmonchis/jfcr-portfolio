import SplineViewer from "@/components/SplineViewer";
import CvCta from "@/components/CvCta";
import AboutHeroTitle from "@/components/AboutHeroTitle";

const CREAM = "#F2EBD9";
const MUTED = "rgba(242,235,217,0.55)";
const LINK_COLOR = "rgba(242,235,217,0.75)";
const BG = "#2D0055";

const stats = [
  { value: "7K+", label: "Minutes mentoring on ADPList" },
  { value: "199h", label: "Learning Blender (so far)" },
  { value: "20+", label: "Gunplas built" },
  { value: "80", label: "Warhammer miniatures in the backlog" },
];

const talks = [
  { label: "Make A Better Graphic Design Portfolio and Get More Clients", href: "https://www.youtube.com/watch?v=JT-6Zg_pJI8" },
  { label: "Build a Portfolio That Breaks the Mold and Why It Matters", href: "https://www.youtube.com/watch?v=gjRGMhzhkUY" },
];

const recognitions = [
  { label: "ADPList Top 100 Most Influential Mentors 2024", href: "https://blog.adplist.org/post/2024-adplist-wrapped-top-mentors-trends-and-topics" },
];

const thoughtsOnDesign = [
  { label: "Book recommendations for creatives", href: "https://www.instagram.com/reel/DN-CzpmjNEQ/" },
  { label: "On developing taste and self curation", href: "https://www.instagram.com/reel/DPthfJ9DGRY" },
  { label: "On taste and intent", href: "https://www.instagram.com/reel/DPtj5yHjF3q" },
  { label: "Hyper individualism and creative geniuses", href: "https://www.instagram.com/reel/DSVIEtpjLpi" },
];

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
          {stats.map((s) => (
            <div key={s.value} className="flex flex-col items-center gap-1">
              <span className="type-case-title" style={{ color: CREAM }}>{s.value}</span>
              <span className="type-caption-sm" style={{ color: MUTED }}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Awards — Spline left · text · Spline right */}
        <div
          className="w-full flex flex-col items-center gap-6 rounded-3xl px-8 pt-12 pb-6"
          style={{ background: CREAM }}
        >
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
            <div className="w-[287px] h-[371px] md:w-[410px] md:h-[530px] overflow-hidden shrink-0">
              <SplineViewer
                url="https://prod.spline.design/zuOtTMciGG7aBGgV/scene.splinecode"
                className="origin-top-left scale-[0.7] md:scale-100"
                style={{ width: 410, height: 530 }}
              />
            </div>

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

            <div className="w-[287px] h-[371px] md:w-[410px] md:h-[530px] overflow-hidden shrink-0">
              <SplineViewer
                url="https://prod.spline.design/yOORwiAE8AgognUf/scene.splinecode"
                className="origin-top-left scale-[0.7] md:scale-100"
                style={{ width: 410, height: 530 }}
              />
            </div>
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
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="flex flex-col items-center gap-4">
            <h3 className="type-case-subtitle" style={{ color: CREAM }}>Talks</h3>
            <ul className="flex flex-col gap-2 items-center">
              {talks.map((t) => (
                <li key={t.label}>
                  <a
                    href={t.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="type-caption-sm underline underline-offset-2 hover:opacity-100 transition-opacity"
                    style={{ color: LINK_COLOR }}
                  >
                    {t.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col items-center gap-4">
            <h3 className="type-case-subtitle" style={{ color: CREAM }}>Recognitions</h3>
            <ul className="flex flex-col gap-2 items-center">
              {recognitions.map((r) => (
                <li key={r.label}>
                  <a
                    href={r.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="type-caption-sm underline underline-offset-2 hover:opacity-100 transition-opacity"
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
        <div className="flex flex-col items-center gap-4">
          <h3 className="type-case-subtitle" style={{ color: CREAM }}>Thoughts on design</h3>
          <ul className="flex flex-col gap-2 items-center">
            {thoughtsOnDesign.map((t) => (
              <li key={t.label}>
                <a
                  href={t.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="type-caption-sm underline underline-offset-2 hover:opacity-100 transition-opacity"
                  style={{ color: LINK_COLOR }}
                >
                  {t.label}
                </a>
              </li>
            ))}
          </ul>
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
