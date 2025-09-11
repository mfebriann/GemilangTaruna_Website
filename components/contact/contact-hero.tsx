import { MessageCircle, MapPin, Clock } from "lucide-react"

export function ContactHero() {
  return (
    <section className="relative bg-gradient-to-br from-primary/5 via-white to-secondary/5 py-16 lg:py-20">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <MessageCircle className="h-8 w-8 text-primary" />
            </div>
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold text-balance">
            Hubungi <span className="text-primary">Kami</span>
          </h1>

          <p className="text-lg text-muted-foreground text-pretty">
            Kami siap melayani Anda dengan sepenuh hati. Jangan ragu untuk menghubungi kami kapan saja untuk pertanyaan,
            pesanan, atau saran yang membangun.
          </p>

          {/* Quick Contact Info */}
          <div className="flex flex-wrap justify-center gap-8 pt-4">
            <div className="flex items-center space-x-2 text-sm">
              <MessageCircle className="h-4 w-4 text-green-500" />
              <span className="font-medium">WhatsApp Ready</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="font-medium">Lokasi Strategis</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Clock className="h-4 w-4 text-secondary" />
              <span className="font-medium">Buka Setiap Hari</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
