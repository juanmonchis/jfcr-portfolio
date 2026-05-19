import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "dev.db");
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // Clean existing data
  await prisma.post.deleteMany();
  await prisma.project.deleteMany();
  await prisma.borderedItem.deleteMany();

  // Seed projects
  await prisma.project.createMany({
    data: [
      {
        title: "charles",
        subtitle: "Product Design — 2024",
        tags: JSON.stringify(["Product Design", "UX", "Mobile", "Branding"]),
        description:
          "A comprehensive redesign of Deliveroo's core ordering experience, improving conversion rates by 18% through simplified navigation and delightful micro-interactions.",
        ctaLabel: "View Case Study",
        ctaHref: "#",
        cardColor: "#cc6d00",
        size: "default",
        showThumbnailOnMobile: false,
        order: 0,
      },{
        title: "caracare",
        subtitle: "Product Design — 2024",
        tags: JSON.stringify(["Product Design", "UX", "Mobile", "Branding"]),
        description:
          "test with a new card",
        ctaLabel: "View Case Study",
        ctaHref: "#",
        cardColor: "#0000cc8c",
        size: "default",
        showThumbnailOnMobile: false,
        order: 1,
      },
      {
        title: "Frog Design System",
        subtitle: "Design Systems — 2023",
        tags: JSON.stringify(["Design Systems", "Components", "Figma"]),
        description:
          "Built a scalable design system from the ground up for a major consulting firm, covering 200+ components and 12 product teams.",
        ctaLabel: "Explore",
        ctaHref: "#",
        cardColor: "#B8C8FF",
        size: "small",
        showThumbnailOnMobile: true,
        order: 2,
      },
      {
        title: "Wave Music App",
        subtitle: "Mobile — 2023",
        tags: JSON.stringify(["iOS", "Mobile", "Motion"]),
        description:
          "Concept music streaming app with waveform-based navigation and real-time lyrics synchronization.",
        ctaLabel: "View",
        ctaHref: "#",
        cardColor: "#FFD6A5",
        size: "small",
        showThumbnailOnMobile: true,
        order: 3,
      },
      {
        title: "Nubank Brand",
        subtitle: "Branding — 2022",
        tags: JSON.stringify(["Branding", "Identity"]),
        description: "Brand identity exploration for a fintech startup.",
        ctaLabel: "See Work",
        ctaHref: "#",
        cardColor: "#E8D5F5",
        size: "xsmall",
        showThumbnailOnMobile: false,
        order: 4,
      },
      {
        title: "GreenPath",
        subtitle: "Sustainability — 2022",
        tags: JSON.stringify(["App Design", "Web"]),
        description: "Carbon footprint tracking app that makes sustainability engaging and actionable.",
        ctaLabel: "View",
        ctaHref: "#",
        cardColor: "#C8F5D5",
        size: "xsmall",
        showThumbnailOnMobile: false,
        order: 5,
      },
      {
        title: "Porto Sans",
        subtitle: "Typeface — 2021",
        tags: JSON.stringify(["Typography", "Type Design"]),
        description: "A geometric sans-serif typeface inspired by Portuguese tiles.",
        ctaLabel: "Download",
        ctaHref: "#",
        cardColor: "#F5E8C8",
        size: "xsmall",
        showThumbnailOnMobile: false,
        order: 6,
      },
    ],
  });

  // Seed bordered items
  await prisma.borderedItem.createMany({
    data: [
      {
        title: "Silly Animations Collection",
        tags: JSON.stringify(["Motion", "After Effects", "Fun"]),
        href: "#",
        bgColor: "#0C0D1F",
        textColor: "#DDED3C",
        tagColor: "#DDED3C",
        glowColor: "#DDED3C",
        order: 1,
      },
      {
        title: "Generative Art Gallery",
        tags: JSON.stringify(["p5.js", "Creative Coding", "NFT"]),
        href: "#",
        bgColor: "transparent",
        textColor: "#0C0D1F",
        tagColor: "#0C0D1F",
        glowColor: "#B8C8FF",
        order: 2,
      },
      {
        title: "Photography — Street & Architecture",
        tags: JSON.stringify(["Photography", "Film", "35mm"]),
        href: "#",
        bgColor: "transparent",
        textColor: "#0C0D1F",
        tagColor: "#0C0D1F",
        glowColor: "#FFD6A5",
        order: 3,
      },
    ],
  });

  // Seed a blog post
  await prisma.post.create({
    data: {
      title: "Why design systems are a designer's best friend",
      slug: "why-design-systems-are-designers-best-friend",
      excerpt:
        "Design systems aren't just about consistency — they're about freeing designers to focus on hard problems instead of reinventing buttons.",
      content: `<h2>The problem with designing without a system</h2>
<p>Every designer has been there. You open a Figma file from six months ago and find seventeen slightly different shades of the same button. Three padding values for cards. Two type scales that almost match.</p>
<p>It's chaos. And it's slow. Every new screen becomes a negotiation between "should I use the old button style or the new one?"</p>
<h2>What a design system actually gives you</h2>
<p>When a design system is done right, it's not a constraint — it's a superpower. You stop spending cognitive energy on solved problems and start focusing on the actual design challenge at hand.</p>
<p>The best design systems I've worked with share a few traits:</p>
<ul>
<li>They're <strong>opinionated but flexible</strong> — clear defaults, but escape hatches when needed</li>
<li>They're <strong>well-documented</strong> — not just what components do, but when and why to use them</li>
<li>They're <strong>maintained like code</strong> — versioned, reviewed, and evolved over time</li>
</ul>
<h2>The cultural side nobody talks about</h2>
<p>The hardest part of building a design system isn't the components. It's getting designers and engineers to actually use it. That requires trust, communication, and sometimes just accepting that your perfect button will be slightly compromised to work for ten product teams instead of one.</p>
<p>That's okay. The system exists to serve the product, not the other way around.</p>`,
      published: true,
    },
  });

  console.log("✅ Seeding complete!");
  console.log("   → 6 projects created");
  console.log("   → 3 bordered items created");
  console.log("   → 1 blog post created");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
