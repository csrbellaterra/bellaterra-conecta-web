import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import { getPage } from "@/lib/content";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlockRenderer from "@/components/sections/BlockRenderer";
import Container from "@/components/ui/Container";
import AnimatedIn from "@/components/ui/AnimatedIn";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("la-finca");
  if (!page) return {};
  return { title: page.seo.title, description: page.seo.description };
}

export default async function LaFincaPage() {
  const { isEnabled: preview } = draftMode();
  const page = await getPage("la-finca", preview);
  if (!page) notFound();

  return (
    <>
      <Header variant="solid" />
      <main className="pb-8 pt-32 sm:pt-40">
        <Container>
          <AnimatedIn>
            <h1 className="mb-10 font-serif text-4xl text-text sm:text-5xl">{page.title}</h1>
          </AnimatedIn>
        </Container>
        <BlockRenderer blocks={page.blocks} />
      </main>
      <Footer />
    </>
  );
}
