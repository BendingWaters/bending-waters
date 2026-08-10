import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, LayoutGrid } from "lucide-react";
import { Container, SectionHeading } from "./ui";
import { urlFor } from "@/sanity/lib/image";
import type { PortfolioProject } from "../_lib/types";

export default function Portfolio({ projects }: { projects: PortfolioProject[] }) {
  return (
    <section id="work" className="border-b border-white/8 py-20 sm:py-28">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="Built to make an impression"
          title="Your website should feel like a business that means business."
          description="Explore selected websites and digital experiences we've designed and built."
        />

        {projects.length > 0 ? (
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Link
                key={project._id}
                href={`/work/${project.slug.current}`}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-[#111113] transition hover:border-white/25"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-white/5">
                  {project.mainImage ? (
                    <Image
                      src={urlFor(project.mainImage).width(640).height(480).url()}
                      alt={project.title}
                      fill
                      className="object-cover transition duration-300 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center text-white/20">
                      <LayoutGrid className="size-8" />
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                    {project.category}
                  </span>
                  <h3 className="mt-2 text-[15px] font-semibold text-white">{project.title}</h3>
                  {project.description && (
                    <p className="mt-1.5 line-clamp-2 text-sm text-white/50">{project.description}</p>
                  )}
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-white/70 transition group-hover:text-primary">
                    View project <ArrowUpRight className="size-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mx-auto mt-14 max-w-xl rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-8 py-14 text-center">
            <LayoutGrid className="mx-auto size-8 text-white/25" />
            <p className="mt-4 text-[15px] leading-relaxed text-white/50">
              Selected projects are being added here. Every project shown will be real, verified
              work — no placeholders, no fabricated results.
            </p>
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            href="/work"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/70 transition hover:text-primary"
          >
            See all our work <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
