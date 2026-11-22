import Image from "next/image";
import Link from "next/link";
import { ArchiveGrid } from "@/components/ArchiveGrid";
import { ContactForm } from "@/components/ContactForm";
import { HeroSlides } from "@/components/HeroSlides";
import { JsonLd } from "@/components/JsonLd";
import { ProjectTile } from "@/components/ProjectTile";
import { featuredProjects, projects } from "@/content/projects";
import { absoluteUrl, site } from "@/content/site";

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "@id": absoluteUrl("/#webpage"),
          url: site.url,
          name: `${site.name} — ${site.tagline}`,
          description: site.description,
          isPartOf: { "@id": absoluteUrl("/#website") },
          about: { "@id": absoluteUrl("/#organization") },
          mainEntity: {
            "@type": "ItemList",
            itemListElement: projects.map((project, index) => ({
              "@type": "ListItem",
              position: index + 1,
              url: absoluteUrl(`/work/${project.slug}`),
              name: project.name,
            })),
          },
        }}
      />

      <section className="hero" aria-label="Metalhed featured work">
        <HeroSlides />
        <div className="hero-shade" />
        <div className="hero-copy">
          <div className="eyebrow">
            <span aria-hidden="true">{"//"}</span> Independent figure artist — UK{" "}
            <span aria-hidden="true">{"//"}</span> Est. in the shed
          </div>
          <h1>
            Resin.
            <br />
            Paint.
            <br />
            <span className="pink">Obsession.</span>
          </h1>
          <p>
            Characters pulled from the screen and dragged into the real world. Big statues. Dirty
            brushes. Late nights. No assembly-line bullshit.
          </p>
          <a className="cta" href="#archive">
            Enter the archive ↗
          </a>
        </div>
      </section>

      <section id="selected" className="section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <div className="eyebrow">01 / First impact</div>
              <h2>
                Selected <span className="pink">work</span>
              </h2>
            </div>
            <a className="small-link" href="#archive">
              Explore full archive ↗
            </a>
          </div>
          <div className="grid" aria-label="Featured projects">
            {featuredProjects.map((project) => (
              <ProjectTile key={project.slug} project={project} />
            ))}
          </div>
        </div>
      </section>

      <section id="archive" className="section archive">
        <div className="wrap">
          <div className="section-head">
            <div>
              <div className="eyebrow">02 / The whole story</div>
              <h2>
                The <span className="pink">archive</span>
              </h2>
            </div>
          </div>
          <p className="intro">
            The heavy hitters up front. The rest of the journey right here — including earlier
            pieces that show how the work has evolved.
          </p>
          <ArchiveGrid
            items={projects.map((project) => ({
              slug: project.slug,
              era: project.era,
              tile: <ProjectTile project={project} />,
            }))}
          />
        </div>
      </section>

      <section id="workshop" className="section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <div className="eyebrow">03 / Behind the paint</div>
              <h2>
                The <span className="pink">workshop</span>
              </h2>
            </div>
          </div>
          <div className="split">
            <div>
              <p>
                Resin prints. Assembly. Priming. Airbrush passes. Brushwork. Mistakes, fixes, and
                the occasional happy accident.
              </p>
              <p>
                Open a featured project to see its process photography where available.
                Work-in-progress shots are kept separate from the finished gallery.
              </p>
              <Link href="/#selected" className="cta">
                See the projects ↗
              </Link>
            </div>
            <Image
              src="/images/work-in-progress.webp"
              width={845}
              height={1500}
              sizes="(max-width: 900px) 100vw, 50vw"
              alt="Work in progress on a biomechanical Xenomorph"
            />
          </div>
        </div>
      </section>

      <section id="about" className="section about">
        <div className="wrap split">
          <Image
            src="/images/artist-portrait.webp"
            width={829}
            height={1200}
            sizes="(max-width: 900px) 100vw, 50vw"
            alt="Metalhed artist portrait"
          />
          <div>
            <div className="section-head">
              <div>
                <div className="eyebrow">04 / The person behind the paint</div>
                <h2>
                  Meet <span className="pink">Metalhed</span>
                </h2>
              </div>
            </div>
            <p>
              I&apos;m a UK-based collectible figure and statue painter with a weakness for
              monsters, sci-fi, wrestling icons, fantasy and all things heavy.
            </p>
            <p>
              My work spans resin printing, preparation and painting — taking character sculpts
              and turning them into physical pieces with personality. The archive is part of the
              story too: no pretending the early work never happened.
            </p>
            <p>
              Not a factory. Not a corporate studio. Just a lifelong love of making cool things
              real.
            </p>
          </div>
        </div>
      </section>

      <section id="commissions" className="section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <div className="eyebrow">05 / Something custom?</div>
              <h2>
                Let&apos;s make <span className="pink">something.</span>
              </h2>
            </div>
          </div>
          <p className="intro">
            Interested in custom pet statues or collectible painting? This site is a portfolio
            first, but commissions are part of the picture. Attach reference photos of the
            character or pet and I&apos;ll take a look.
          </p>
          <div className="contact">
            <ContactForm />
            <aside className="contact-direct" aria-labelledby="direct-title">
              <h3 id="direct-title" className="direct-title">
                Or reach out direct
              </h3>
              <a className="direct-link" href={`mailto:${site.email}`}>
                <span className="direct-kind">Email</span>
                <span className="direct-value">
                  metalhed@
                  <wbr />
                  metalhed.co.uk
                </span>
              </a>
              <a className="direct-link" href={site.linktree} target="_blank" rel="noopener">
                <span className="direct-kind">Linktree</span>
                <span className="direct-value">
                  linktr.ee/
                  <wbr />
                  Metalhed ↗
                </span>
                <span className="visually-hidden">(opens in a new tab)</span>
              </a>
              <p>Socials and everything else Metalhed lives on the Linktree.</p>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
