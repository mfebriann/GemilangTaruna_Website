import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MenuGrid } from "@/components/menu/menu-grid"
import { MenuHero } from "@/components/menu/menu-hero"

export default function MenuPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <MenuHero />
        <MenuGrid />
      </main>
      <Footer />
    </div>
  )
}
