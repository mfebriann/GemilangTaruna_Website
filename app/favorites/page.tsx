import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FavoritesContent } from "@/components/favorites/favorites-content"

export default function FavoritesPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <FavoritesContent />
      </main>
      <Footer />
    </div>
  )
}
