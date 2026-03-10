# MindMirror - Netflix Alternative Streaming Platform

MindMirror, modern bir Netflix alternatifi video streaming platformudur. Next.js, TypeScript, MongoDB ve VidSrc entegrasyonu kullanılarak geliştirilmiştir.

## 🎯 Özellikler

### Kullanıcı Özellikleri
- ✅ **Kullanıcı Kayıt ve Giriş Sistemi** - JWT tabanlı güvenli authentication
- ✅ **Film ve Dizi İzleme** - VidSrc entegrasyonu ile kesintisiz streaming
- ✅ **Arama Fonksiyonu** - Gelişmiş arama sistemi
- ✅ **Favoriler** - Beğendiğiniz içerikleri favorilere ekleyin
- ✅ **İzleme Listesi** - Daha sonra izlemek istediğiniz içerikleri kaydedin
- ✅ **Responsive Tasarım** - Tüm cihazlarda mükemmel görünüm
- ✅ **Netflix Benzeri UI** - Modern ve kullanıcı dostu arayüz

### Admin Paneli
- ✅ **Gelişmiş Dashboard** - İstatistikler, grafikler ve hızlı erişim
- ✅ **Film/Dizi Ekleme** - Detaylı içerik yükleme formu
- ✅ **Toplu İçerik İçe Aktarma** - JSON formatında bulk import
- ✅ **İçerik Düzenleme** - Mevcut filmleri ve dizileri düzenleyin
- ✅ **İçerik Silme** - Gereksiz içerikleri kaldırın
- ✅ **Kullanıcı Yönetimi** - Kullanıcı rolleri, silme, arama
- ✅ **Analytics** - Detaylı grafikler ve istatistikler
- ✅ **Activity Logs** - Tüm platform aktivitelerini takip
- ✅ **Ayarlar** - Video player ve site ayarları
- ✅ **İstatistikler** - Real-time kullanıcı ve içerik metrikleri

### Video Player Özellikleri
- ✅ **Videasy.net Entegrasyonu** - Birincil HD video kaynağı
- ✅ **VidSrc.pro Entegrasyonu** - Yedek video kaynağı
- ✅ **VidSrc.to Entegrasyonu** - Alternatif kaynak
- ✅ **Otomatik Episode Selector** - Player içinde sezon/bölüm seçimi
- ✅ **Auto-play Next Episode** - Sonraki bölüm otomatik oynatma
- ✅ **Netflix-style Overlay** - Netflix tarzı arayüz
- ✅ **Progress Tracking** - İzleme ilerlemesi takibi
- ✅ **Dizi Desteği** - Sezon ve bölüm seçimi
- ✅ **Tam Ekran Modu** - Sinema deneyimi
- ✅ **Özel Tema** - MindMirror kırmızı teması

## 🚀 Kurulum

### Gereksinimler
- Node.js 18+ 
- MongoDB (local veya cloud)
- npm veya yarn

### Adım 1: Bağımlılıkları Yükleyin
\`\`\`bash
npm install
\`\`\`

### Adım 2: MongoDB'yi Başlatın
MongoDB'nin çalıştığından emin olun. Local MongoDB için:
\`\`\`bash
mongod
\`\`\`

### Adım 3: Ortam Değişkenlerini Ayarlayın
\`.env.local\` dosyası zaten hazır. Gerekirse düzenleyin:
\`\`\`env
MONGODB_URI=mongodb://localhost:27017/mindmirror
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NEXT_PUBLIC_API_URL=http://localhost:3000
ADMIN_EMAIL=admin@mindmirror.com
ADMIN_PASSWORD=admin123
\`\`\`

### Adım 4: Veritabanını Doldur (Seed)
İlk admin kullanıcısı ve örnek filmler için:
\`\`\`bash
node scripts/seed.js
\`\`\`

Bu komut:
- ✅ Admin hesabı oluşturur (admin@mindmirror.com / admin123)
- ✅ 8 adet örnek film/dizi ekler
- ✅ TMDB ve IMDB ID'leri ile gelir

### Adım 5: Uygulamayı Başlatın
\`\`\`bash
npm run dev
\`\`\`

Uygulama http://localhost:3000 adresinde çalışacaktır.

## 🔑 Varsayılan Admin Hesabı

Seed script çalıştırıldıktan sonra:
- **Email**: admin@mindmirror.com
- **Şifre**: admin123
- **Rol**: Admin

⚠️ **Önemli**: Production ortamında mutlaka şifreyi değiştirin!

## 🎯 Hızlı Başlangıç

1. **Ana Sayfa**: http://localhost:3000
   - Netflix benzeri arayüz
   - Film/dizi kartları
   - Kategoriler

2. **Kayıt/Giriş**: http://localhost:3000/login
   - Yeni hesap oluştur veya giriş yap

3. **Admin Panel**: http://localhost:3000/admin/dashboard
   - Admin hesabıyla giriş yapın
   - Dashboard, istatistikler ve yönetim araçları

4. **Film İzle**: Herhangi bir içeriğe tıklayın
   - Videasy.net player ile HD izleme
   - Sezon/bölüm seçimi (diziler için)
   - Otomatik episode geçişi
3. Kayıt formunu doldurun
4. MongoDB'de ilk kullanıcınızın rolünü manuel olarak 'admin' yapın:

\`\`\`bash
# MongoDB shell'e bağlanın
mongosh mindmirror

# İlk kullanıcıyı admin yapın
db.users.updateOne(
  { email: "admin@mindmirror.com" },
  { $set: { role: "admin" } }
)
\`\`\`

Veya basitçe login sayfasında şu bilgilerle kayıt olun:
- Email: admin@mindmirror.com
- Password: admin123
- Name: Admin

## 🎬 Film/Dizi Ekleme

Admin paneline girerek film ve dizi ekleyebilirsiniz:

### Tekli Ekleme
1. Admin hesabıyla giriş yapın (admin@mindmirror.com / admin123)
2. Dashboard'dan "Add Content" butonuna tıklayın
3. Film/dizi bilgilerini doldurun:
   - **TMDB ID**: Videasy.net için gerekli (örn: 27205)
   - **IMDB ID**: VidSrc fallback için (örn: tt1375666)
   - **Thumbnail**: Film poster URL'i
   - **Backdrop**: Arka plan resmi URL'i
   - **Genre**: Tür seçimi (çoklu)
   - **Category**: Kategori seçimi (çoklu)

### Toplu İçe Aktarma (Bulk Import)
1. Admin Dashboard'dan "Bulk Import" seçeneğine tıklayın
2. "Download Template" ile örnek JSON şablonunu indirin
3. Şablonu düzenleyip film bilgilerinizi ekleyin
4. JSON içeriğini yapıştırıp "Import Movies" butonuna tıklayın

### Örnek Film Verisi
\`\`\`json
{
  "title": "Inception",
  "description": "A thief who steals corporate secrets through dream-sharing technology...",
  "type": "movie",
  "imdbId": "tt1375666",
  "tmdbId": "27205",
  "year": 2010,
  "duration": "2h 28m",
  "genre": ["Action", "Sci-Fi", "Thriller"],
  "category": ["trending", "action"],
  "thumbnail": "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
  "backdrop": "https://image.tmdb.org/t/p/original/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
  "rating": 8.8,
  "featured": true
}
\`\`\`

## 📊 Admin Panel Özellikleri

### Dashboard
- **İstatistik Kartları**: Kullanıcılar, içerik, görüntüleme ve ortalama puan
- **Zaman Aralığı Filtreleme**: Today, Week, Month, All Time
- **En Çok İzlenenler**: Top 5 içerik listesi
- **Son Kullanıcılar**: Yeni kayıt olan kullanıcılar
- **İçerik Tablosu**: Tüm filmler/diziler liste görünümü

### User Management
- **Kullanıcı Listesi**: Tüm kayıtlı kullanıcılar
- **Rol Yönetimi**: Admin/User rol değiştirme
- **Kullanıcı Silme**: Hesap kaldırma
- **Arama**: Email veya isimle kullanıcı bulma

### Analytics
- **Görüntüleme Grafikleri**: LineChart ile zaman içinde görüntüleme
- **Tür Dağılımı**: PieChart ile popüler türler
- **Kullanıcı Büyümesi**: BarChart ile kullanıcı artışı
- **Peak Hours**: En yoğun izlenme saatleri
- **Metrikler**: Completion rate, return rate, uptime

### Activity Logs
- **Aktivite Takibi**: Login, watch, add/delete movie, user register
- **Filtreleme**: Aktivite türüne göre filtreleme
- **Zaman Damgası**: "X minutes/hours/days ago" formatında
- **Aktivite İstatistikleri**: Günlük aktivite özeti

### Settings
- **Genel Ayarlar**: Site adı, açıklama
- **Video Player**: Videasy.net renk teması, autoplay, episode selector
- **Veritabanı**: Cache temizleme
- **Kullanıcı**: Email doğrulama, video limitleri

## 🎨 Teknolojiler

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB, Mongoose
- **Authentication**: JWT, bcryptjs
- **Video Player**: Videasy.net (primary), VidSrc.pro (backup), VidSrc.to (fallback)
- **Charts**: Recharts (LineChart, BarChart, PieChart)
- **Icons**: React Icons
- **State Management**: React Context API
- **Cookies**: js-cookie

## 📂 Proje Yapısı

\`\`\`
mindmirror/
├── app/
│   ├── admin/              # Admin panel sayfaları
│   │   ├── dashboard/     # Ana dashboard
│   │   ├── users/         # Kullanıcı yönetimi
│   │   ├── movies/        # Film ekleme
│   │   ├── bulk/          # Toplu import
│   │   ├── analytics/     # Grafikler ve analizler
│   │   ├── logs/          # Aktivite logları
│   │   └── settings/      # Platform ayarları
│   ├── api/                # API endpoints
│   │   ├── auth/          # Authentication routes
│   │   ├── movies/        # Movie routes
│   │   ├── admin/         # Admin routes
│   │   │   ├── movies/   # Admin movie management
│   │   │   ├── users/    # Admin user management
│   │   │   └── stats/    # Statistics endpoint
│   │   └── user/          # User routes
│   │   └── admin/         # Admin routes
│   ├── login/             # Login sayfası
│   ├── movie/[id]/        # Film detay sayfası
│   ├── watch/[id]/        # Video player sayfası
│   ├── movies/            # Filmler listesi
│   ├── series/            # Diziler listesi
│   ├── search/            # Arama sayfası
│   ├── profile/           # Kullanıcı profili
│   └── page.tsx           # Ana sayfa
├── components/            # React componentleri
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   └── MovieRow.tsx
├── context/              # React context
│   └── AuthContext.tsx
├── lib/                  # Utility fonksiyonlar
│   ├── mongodb.ts
│   └── auth.ts
├── models/               # MongoDB modelleri
│   ├── User.ts
│   └── Movie.ts
└── public/              # Statik dosyalar
\`\`\`

## 🔐 Güvenlik

- JWT token ile güvenli authentication
- Bcrypt ile şifrelenmiş parolalar
- Admin route'ları için yetkilendirme kontrolü
- XSS ve CSRF koruması

## 🎯 Videasy.net Kullanımı

Platform şu video kaynaklarını kullanır (öncelik sırasına göre):

1. **Videasy.net** (Primary - TMDB ID gerekli)
   - Filmler: `https://player.videasy.net/movie/{tmdbId}`
   - Diziler: `https://player.videasy.net/tv/{tmdbId}/{season}/{episode}`
   - Özellikler: Episode selector, auto-play, Netflix overlay, progress tracking

2. **VidSrc.pro** (Backup - IMDB ID gerekli)
   - Format: `https://vidsrc.pro/embed/movie/{imdbId}`
   - Format: `https://vidsrc.pro/embed/tv/{imdbId}/{season}/{episode}`

3. **VidSrc.to** (Fallback - TMDB ID gerekli)
   - Format: `https://vidsrc.to/embed/movie/{tmdbId}`
   - Format: `https://vidsrc.to/embed/tv/{tmdbId}/{season}/{episode}`

### Videasy.net Özellikleri
- ✅ **Auto-play Next Episode** - Bölüm bitince otomatik devam eder
- ✅ **Built-in Episode Selector** - Player içinde sezon/bölüm seçimi
- ✅ **Netflix-style Overlay** - Duraklatıldığında Netflix benzeri overlay
- ✅ **Progress Tracking** - İzleme ilerlemesi kaydedilir
- ✅ **Custom Color Theme** - MindMirror kırmızı teması (#E50914)
- ✅ **HD Quality** - Yüksek kalite streaming

## 📱 Responsive Tasarım

- Mobile: 375px+
- Tablet: 768px+
- Desktop: 1024px+
- Large Desktop: 1280px+

## 🚧 Geliştirme Notları

### TODO
- [ ] Rating sistemi
- [ ] Yorum sistemi
- [ ] Sosyal medya entegrasyonu
- [ ] Email verification
- [ ] Şifre sıfırlama
- [ ] Video quality seçimi
- [ ] Subtitle desteği
- [ ] Çoklu dil desteği

## 📄 Lisans

Bu proje eğitim amaçlıdır. Ticari kullanım için telif haklarına dikkat edilmelidir.

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (\`git checkout -b feature/AmazingFeature\`)
3. Değişikliklerinizi commit edin (\`git commit -m 'Add some AmazingFeature'\`)
4. Branch'inizi push edin (\`git push origin feature/AmazingFeature\`)
5. Pull Request açın

## 📞 İletişim

Sorularınız için issue açabilirsiniz.

---

⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!
