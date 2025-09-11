import { Utensils, Star, TrendingDown } from "lucide-react"

export function MenuHero() {
  return (
    <section className="relative bg-gradient-to-br from-primary/5 via-white to-secondary/5 py-16 lg:py-20">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <Utensils className="h-8 w-8 text-primary" />
            </div>
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold text-balance">
            Menu <span className="text-primary">Lengkap</span> Kami
          </h1>

          <p className="text-lg text-muted-foreground text-pretty">
            Jelajahi koleksi lengkap makanan dan minuman Indonesia autentik yang kami sajikan dengan cinta dan resep
            turun temurun. Temukan favorit baru Anda hari ini!
          </p>

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-8 pt-4">
            <div className="flex items-center space-x-2 text-sm">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="font-medium">5+ Best Sellers</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <TrendingDown className="h-4 w-4 text-green-500" />
              <span className="font-medium">Harga Terjangkau</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Utensils className="h-4 w-4 text-primary" />
              <span className="font-medium">Fresh Daily</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
