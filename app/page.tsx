import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/home/hero-section"
import { MenuPreview } from "@/components/home/menu-preview"
import { ContactSection } from "@/components/home/contact-section"
import { FeedbackForm } from "@/components/home/feedback-form"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <MenuPreview />
        <ContactSection />
        <FeedbackForm />
      </main>
      <Footer />
    </div>
  )
}
