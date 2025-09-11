import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ContactHero } from "@/components/contact/contact-hero"
import { ContactInfo } from "@/components/contact/contact-info"
import { FeedbackForm } from "@/components/home/feedback-form"

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <ContactHero />
        <ContactInfo />
        <FeedbackForm />
      </main>
      <Footer />
    </div>
  )
}
