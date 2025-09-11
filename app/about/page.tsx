import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AboutHero } from "@/components/about/about-hero"
import { AboutContent } from "@/components/about/about-content"
import { ContactSection } from "@/components/home/contact-section"

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <AboutHero />
        <AboutContent />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
