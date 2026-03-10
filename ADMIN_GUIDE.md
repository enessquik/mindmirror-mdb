# Admin Panel Documentation

## 📖 İçindekiler
1. [Giriş](#giriş)
2. [Dashboard](#dashboard)
3. [İçerik Yönetimi](#içerik-yönetimi)
4. [Kullanıcı Yönetimi](#kullanıcı-yönetimi)
5. [Analytics](#analytics)
6. [Activity Logs](#activity-logs)
7. [Ayarlar](#ayarlar)

---

## Giriş

MindMirror Admin Paneli, streaming platformunuzu yönetmek için kapsamlı bir kontrol merkezi sağlar.

### Admin Hesabı
- **Email**: admin@mindmirror.com
- **Şifre**: admin123

### Erişim
Admin paneline erişmek için:
1. Admin hesabıyla giriş yapın
2. Navbar'dan "Admin Panel" butonuna tıklayın
3. Otomatik olarak `/admin/dashboard` sayfasına yönlendirileceksiniz

---

## Dashboard

### Genel Bakış
Dashboard, platformunuzun önemli metriklerini ve hızlı erişim araçlarını sunar.

### Hızlı Erişim Butonları
- **Add Content**: Yeni film/dizi ekleme
- **Users**: Kullanıcı yönetimi
- **Bulk Import**: Toplu içerik içe aktarma
- **Analytics**: Detaylı istatistikler ve grafikler
- **Activity Logs**: Platform aktivitelerini izleme
- **Settings**: Sistem ayarları

### İstatistik Kartları

#### Total Users
- **Renk**: Mavi gradient
- **İkon**: FiUsers
- **Gösterir**: Toplam kayıtlı kullanıcı sayısı
- **Alt Bilgi**: "Active Members"

#### Total Content
- **Renk**: Mor gradient
- **İkon**: FiFilm
- **Gösterir**: Toplam içerik sayısı
- **Alt Bilgi**: Film ve dizi sayıları ayrıntılı

#### Total Views
- **Renk**: Yeşil gradient
- **İkon**: FiEye
- **Gösterir**: Toplam görüntüleme sayısı
- **Alt Bilgi**: "All Time"

#### Average Rating
- **Renk**: Sarı-Turuncu gradient
- **İkon**: FiStar
- **Gösterir**: Ortalama içerik puanı
- **Alt Bilgi**: "⭐ Out of 10"

### Zaman Aralığı Filtreleme
Dashboard sayfasında 4 farklı zaman aralığı filtresi bulunur:
- **Today**: Bugünün verileri
- **This Week**: Bu haftanın verileri
- **This Month**: Bu ayın verileri
- **All Time**: Tüm zamanların verileri

### Top 5 Most Viewed
En çok izlenen 5 içeriği gösterir:
- Başlık
- Tür (Movie/Series)
- Görüntüleme sayısı
- Puan

### Recent Users
Son kayıt olan kullanıcıları gösterir:
- Avatar (email'in ilk harfi)
- İsim
- Email
- Kayıt tarihi

### İçerik Tablosu
Tüm filmleri ve dizileri liste halinde gösterir:
- **Sütunlar**: Başlık, Tür, Yıl, Görüntüleme, Puan
- **İşlemler**: Edit, Delete
- **Özellikler**: Arama, filtreleme, sıralama (UI hazır, backend entegrasyonu bekliyor)

---

## İçerik Yönetimi

### Tekli İçerik Ekleme

#### Erişim
Dashboard → "Add Content" butonu → `/admin/movies/add`

#### Formlar ve Alanlar

**Basic Information**
- **Title** (Zorunlu): İçeriğin başlığı
- **Description** (Zorunlu): Detaylı açıklama
- **Type**: Movie veya Series seçimi
- **Year**: Yayın yılı
- **Duration**: Süre (örn: "2h 16m")
- **Rating**: 0-10 arası puan

**Series Information** (Sadece Series seçiliyse)
- **Total Seasons**: Toplam sezon sayısı
- **Total Episodes**: Toplam bölüm sayısı

**External IDs**
- **TMDB ID** (Zorunlu): Videasy.net için gerekli
  - The Movie Database'den alınır
  - Örnek: "27205" (Inception için)
- **IMDB ID**: Fallback kaynaklar için
  - IMDb'den alınır
  - Örnek: "tt1375666" (Inception için)
  - Format: tt + 7 rakam

**Images**
- **Thumbnail URL**: Poster görseli (TMDB önerilir)
  - Format: `https://image.tmdb.org/t/p/w500/...`
- **Backdrop URL**: Arka plan görseli
  - Format: `https://image.tmdb.org/t/p/original/...`

**Genres** (Çoklu seçim)
Mevcut türler:
- Action, Adventure, Animation, Comedy, Crime, Documentary
- Drama, Fantasy, Horror, Mystery, Romance, Sci-Fi
- Thriller, Western, War, Family, History, Music, Sport

**Categories** (Çoklu seçim)
Mevcut kategoriler:
- trending, popular, new-releases, top-rated
- action, comedy, drama, horror, sci-fi, documentary

**Featured**
- Checkbox: Ana sayfada hero bölümünde gösterilsin mi?

### Toplu İçe Aktarma (Bulk Import)

#### Erişim
Dashboard → "Bulk Import" → `/admin/bulk`

#### Kullanım Adımları
1. "Download Template" ile örnek JSON dosyasını indirin
2. JSON dosyasını düzenleyin ve içeriklerinizi ekleyin
3. Düzenlenen JSON'u text area'ya yapıştırın
4. "Import Movies" butonuna tıklayın
5. İşlem sonuçlarını kontrol edin

#### JSON Formatı
```json
[
  {
    "title": "The Matrix",
    "description": "A computer hacker learns about the true nature of reality...",
    "type": "movie",
    "imdbId": "tt0133093",
    "tmdbId": "603",
    "year": 1999,
    "duration": "2h 16m",
    "genre": ["Action", "Sci-Fi"],
    "category": ["trending", "action"],
    "thumbnail": "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    "backdrop": "https://image.tmdb.org/t/p/original/fNG7i7RqMErkcqhohV2a6cV1Ehy.jpg",
    "rating": 8.7,
    "featured": true
  }
]
```

#### İmport Sonuçları
İşlem tamamlandığında:
- **Successful**: Başarıyla eklenen içerik sayısı (yeşil)
- **Failed**: Başarısız olan içerik sayısı (kırmızı)
- **Errors**: Hata detayları listesi

---

## Kullanıcı Yönetimi

### Erişim
Dashboard → "Users" → `/admin/users`

### Özellikler

#### Kullanıcı İstatistikleri
- **Total Users**: Toplam kullanıcı sayısı
- **Admins**: Admin sayısı
- **Regular Users**: Normal kullanıcı sayısı

#### Kullanıcı Tablosu
**Sütunlar**:
- **Name**: Kullanıcı adı
- **Email**: Email adresi
- **Role**: Admin veya User rozeti
- **Joined**: Kayıt tarihi
- **Actions**: Toggle Role, Delete

#### İşlemler

**Toggle Role**
- Admin → User veya User → Admin
- Otomatik yenileme
- Buton rengi role göre değişir:
  - Admin: Kırmızı (Make User)
  - User: Yeşil (Make Admin)

**Delete User**
- Onay dialogu ile kullanıcı silme
- Silinen kullanıcı listeden otomatik kaldırılır
- Admin kullanıcılarını silmek önerilmez

**Search**
- Email veya isme göre gerçek zamanlı arama
- Büyük/küçük harf duyarsız
- Anında filtreleme

---

## Analytics

### Erişim
Dashboard → "Analytics" → `/admin/analytics`

### Zaman Aralığı Filtreleme
- Last 7 Days
- Last 30 Days
- Last Year

### Ana Metrikler

#### Total Views
- **Renk**: Mavi gradient
- **Grafik Etkisi**: +12.5% artış
- **İkon**: FiEye

#### Average Rating
- **Renk**: Mor gradient
- **Grafik Etkisi**: +0.3 artış
- **İkon**: FiStar

#### Active Users
- **Renk**: Yeşil gradient
- **Grafik Etkisi**: +8.2% artış
- **İkon**: FiUsers

#### Average Watch Time
- **Renk**: Turuncu gradient
- **Grafik Etkisi**: +5.1% artış
- **İkon**: FiClock

### Grafikler (Recharts)

#### Views Over Time (LineChart)
- X Axis: Tarih (günlük)
- Y Axis: Görüntüleme sayısı
- Renk: Kırmızı (#E50914)
- Animasyonlu çizgi grafik

#### Popular Genres (PieChart)
- Tür dağılımı
- Yüzdelik dilimler
- 5 farklı renk
- İnteraktif tooltip

#### User Growth (BarChart)
- Haftalık kullanıcı artışı
- Yeşil bar grafik
- Grid çizgileri

#### Peak Viewing Hours (BarChart)
- Saatlik izlenme dağılımı
- Turuncu bar grafik
- 24 saatlik veri

### Ek İstatistikler

**Content Performance**
- Completion Rate: %68
- Progress bar gösterimi

**User Engagement**
- Return Rate: %72
- Progress bar gösterimi

**Platform Health**
- Uptime: %99.8
- Progress bar gösterimi

---

## Activity Logs

### Erişim
Dashboard → "Activity Logs" → `/admin/logs`

### Özellikler

#### Aktivite Türleri
1. **Login** (Mavi)
   - Kullanıcı giriş yaptı
   - İkon: FiUser

2. **Watch** (Mor)
   - İçerik izlemeye başladı
   - İkon: FiFilm

3. **Add Movie** (Yeşil)
   - Yeni içerik eklendi
   - İkon: FiActivity

4. **Delete Movie** (Kırmızı)
   - İçerik silindi
   - İkon: FiActivity

5. **User Register** (Sarı)
   - Yeni kullanıcı kaydı
   - İkon: FiUser

#### Filtreleme
- All Activities: Tüm aktiviteler
- Logins: Sadece girişler
- Watch Events: Sadece izleme aktiviteleri
- Content Added: Sadece ekleme işlemleri
- New Users: Sadece yeni kayıtlar

#### Aktivite Kartları
Her aktivite için:
- **İkon**: Aktivite türüne göre renkli ikon
- **Açıklama**: Ne yapıldığı
- **Kullanıcı**: Kim yaptı
- **Zaman**: "X minutes/hours/days ago" formatında

#### Özet İstatistikler
- Total Activities: Toplam aktivite sayısı
- Logins Today: Bugünkü giriş sayısı
- Watch Events: İzleme aktivitesi sayısı
- New Users: Yeni kullanıcı sayısı

---

## Ayarlar

### Erişim
Dashboard → "Settings" → `/admin/settings`

### Ayar Kategorileri

#### General Settings (Genel Ayarlar)
- **Site Name**: Platform adı
  - Varsayılan: "MindMirror"
- **Site Description**: Platform açıklaması
  - Varsayılan: "Watch your favorite movies and series online"

#### Video Player Settings
**Videasy Color Theme**
- Hex renk kodu (# olmadan)
- Varsayılan: "E50914" (Netflix kırmızısı)
- Önizleme kutusu

**Enable Auto-play Next Episode**
- Checkbox
- Dizilerde sonraki bölümü otomatik oynat
- Varsayılan: Açık

**Enable Episode Selector**
- Checkbox
- Player içinde bölüm seçici göster
- Varsayılan: Açık

**Enable Netflix-style Overlay**
- Checkbox
- Durdurulduğunda overlay göster
- Varsayılan: Açık

#### Database & Cache
**Clear Cache**
- Turuncu buton
- Önbelleği temizleme
- Onay dialogu ile

#### User Settings
**Require Email Verification**
- Checkbox
- İzlemeden önce email doğrulaması zorunlu olsun mu?
- Varsayılan: Kapalı

**Max Videos Per User**
- Number input
- Kullanıcı başına maksimum video limiti
- Varsayılan: 100

### Kaydetme
- "Save Settings" butonu (kırmızı)
- Tüm ayarlar tek seferde kaydedilir
- Başarılı kayıt bildirimi

---

## API Endpoints

### Admin Routes

#### Movies
- `GET /api/admin/movies` - Tüm filmler
- `POST /api/admin/movies` - Yeni film ekle
- `PUT /api/admin/movies/[id]` - Film düzenle
- `DELETE /api/admin/movies/[id]` - Film sil

#### Users
- `GET /api/admin/users` - Tüm kullanıcılar
- `PUT /api/admin/users/[id]` - Kullanıcı rol değiştir
- `DELETE /api/admin/users/[id]` - Kullanıcı sil

#### Stats
- `GET /api/admin/stats` - Platform istatistikleri

### Authentication
Tüm admin endpoints JWT Bearer token gerektirir:
```
Authorization: Bearer <token>
```

Token cookie'de saklanır: `Cookies.get('token')`

---

## En İyi Pratikler

### İçerik Ekleme
1. **TMDB ID önceliklidir**: Videasy.net birincil kaynak olduğu için mutlaka doldurun
2. **Yüksek kalite görseller kullanın**: TMDB'den alınan görseller optimize edilmiştir
3. **Genre ve Category seçin**: Kullanıcıların içeriği bulmasını kolaylaştırır
4. **Featured dikkatli kullanın**: Hero'da tek bir içerik gösterilir

### Kullanıcı Yönetimi
1. **Admin sayısını minimum tutun**: Güvenlik için
2. **Düzenli olarak aktif olmayan kullanıcıları kontrol edin**
3. **Spam hesapları zamanında silin**

### Analytics
1. **Düzenli olarak kontrol edin**: Haftalık trendleri takip edin
2. **Peak hours'u optimize edin**: Sunucu kapasitesi planlayın
3. **Düşük completion rate'lere dikkat edin**: İçerik kalitesi problemi olabilir

### Activity Logs
1. **Şüpheli aktiviteleri takip edin**: Güvenlik için
2. **Watch events'e bakın**: Popüler içerikleri belirleyin
3. **Login pattern'leri analiz edin**: Kullanıcı davranışlarını anlayın

---

## Troubleshooting

### Admin panele erişemiyorum
- Admin hesabıyla giriş yaptığınızdan emin olun
- JWT token'ın geçerli olduğunu kontrol edin
- Cookie'lerde token olup olmadığına bakın

### Film ekleyemiyorum
- TMDB ID'nin doğru olduğundan emin olun
- Tüm zorunlu alanları doldurun
- Network tab'ından API yanıtını kontrol edin

### Grafikler görünmüyor
- recharts paketinin yüklü olduğundan emin olun
- `npm install recharts`
- Sayfa yenilendiğinde grafikler render edilecektir

### Kullanıcı silemiyorum
- Admin kullanıcıları silmeden önce role'ü User yapın
- Kendi hesabınızı silemezsiniz (güvenlik)

---

## Gelecek Geliştirmeler

- [ ] Export to CSV/Excel
- [ ] Email notifications
- [ ] Advanced search filters
- [ ] Content scheduling
- [ ] User ban/suspend
- [ ] Comment moderation
- [ ] Revenue analytics
- [ ] API rate limiting dashboard
- [ ] Custom user roles
- [ ] Bulk edit operations

---

**MindMirror Admin Panel v1.0**  
Developed with ❤️ using Next.js 14
