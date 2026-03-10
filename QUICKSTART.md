# MindMirror - Quick Start Guide

## Hızlı Başlangıç

### 1. Bağımlılıkları Yükle
```bash
npm install
```

### 2. MongoDB'yi Başlat
Windows için MongoDB'yi başlatın (local kurulumunuz varsa):
```bash
mongod
```

Veya MongoDB Atlas (cloud) kullanabilirsiniz:
- https://www.mongodb.com/cloud/atlas
- Ücretsiz cluster oluşturun
- Connection string'i `.env.local` dosyasına ekleyin

### 3. Veritabanını Hazırlayın (Önerilen)
Örnek filmler ve admin kullanıcısı eklemek için:
```bash
node scripts/seed.js
```

Bu komut:
- 8 örnek film/dizi ekler
- Admin kullanıcısı oluşturur (email: admin@mindmirror.com, şifre: admin123)

### 4. Uygulamayı Başlatın
```bash
npm run dev
```

### 5. Tarayıcıda Açın
http://localhost:3000

## Giriş Bilgileri

**Admin Hesabı:**
- Email: admin@mindmirror.com
- Password: admin123

## Önemli Sayfalar

- Ana Sayfa: http://localhost:3000
- Login: http://localhost:3000/login
- Admin Panel: http://localhost:3000/admin
- Filmler: http://localhost:3000/movies
- Diziler: http://localhost:3000/series
- Profil: http://localhost:3000/profile

## Film/Dizi Ekleme

1. Admin hesabıyla giriş yapın
2. Admin Panel'e gidin
3. "Add New" butonuna tıklayın
4. Film bilgilerini doldurun

### Önemli Alanlar:
- **IMDB ID**: Yedek kaynak için (örn: tt1375666)
- **TMDB ID**: Videasy.net için GEREKLİ! (örn: 27205)
- **Thumbnail**: Poster resmi URL'i
- **Backdrop**: Arka plan resmi URL'i

**Not:** Videasy.net birincil kaynak olduğu için TMDB ID mutlaka eklenmelidir!

### Örnek IMDB/TMDB ID'ler:
- Inception: tt1375666 / 27205
- The Dark Knight: tt0468569 / 155
- Breaking Bad: tt0903747 / 1396
- Stranger Things: tt4574334 / 66732

## Resim URL'leri Bulma

TMDB'den ücretsiz resim alabilirsiniz:
1. https://www.themoviedb.org adresine gidin
2. Film/dizi arayın
3. Poster ve backdrop resimlerini kopyalayın

Format: `https://image.tmdb.org/t/p/w500/POSTER_PATH.jpg`

## Sorun Giderme

### MongoDB Bağlantı Hatası
- MongoDB servisinin çalıştığından emin olun
- Connection string'i kontrol edin

### Port Zaten Kullanımda
```bash
# Windows için port'u temizle
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Video Oynatılmıyor
- TMDB ID'nin doğru olduğundan emin olun (Videasy.net için gerekli!)
- IMDB ID yedek kaynak için ekleyin (tt ile başlamalı: tt1234567)
- TMDB ID format: Sadece rakamlar (örn: 27205)

## Geliştirme İpuçları

### Hot Reload
Next.js otomatik olarak değişiklikleri algılar ve sayfayı yeniler.

### Console Logları
Tarayıcı console'unda ve terminal'de hata mesajlarını kontrol edin.

### Database Sıfırlama
```bash
node scripts/seed.js
```
Bu komut veritabanını temizler ve örnek verilerle doldurur.

## Production Build

```bash
npm run build
npm run start
```

## Teknoloji Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB, Mongoose
- **Auth**: JWT, bcryptjs
- **Video**: Videasy.net (primary), VidSrc.pro, VidSrc.to

## Özellikler

✅ Kullanıcı kayıt/giriş sistemi
✅ Admin panel
✅ Film/dizi ekleme, düzenleme, silme
✅ Video player (Videasy.net entegrasyonu)
✅ Auto-play next episode
✅ Built-in episode selector
✅ Netflix-style overlay
✅ Progress tracking
✅ Arama özelliği
✅ Favoriler ve izleme listesi
✅ Responsive tasarım
✅ Netflix benzeri UI
✅ Dizi için sezon/bölüm seçimi

---

Herhangi bir sorun yaşarsanız README.md dosyasına bakın veya issue açın!
