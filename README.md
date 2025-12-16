# 🎓 TÜBİTAK 2209-A Proje Yönetim Paneli

Üniversite öğrencileri için yapay zeka destekli araştırma projesi hazırlama, ekip kurma ve süreç takip platformu.

View your app in AI Studio: https://ai.studio/apps/drive/1mZt3gLZQR8yMfF2ZgWnopTSRyeS45muT
---

## 🚀 Proje Hakkında

Bu proje, **TÜBİTAK 2209-A Üniversite Öğrencileri Araştırma Projeleri Destekleme Programı**'na başvuracak öğrenciler için geliştirilmiş kapsamlı bir yönetim sistemidir.  
Öğrencilerin en çok zorlandığı **akademik dil kullanımı**, **proje kurgusu** ve **ekip bulma** gibi konulara modern ve yapay zeka destekli çözümler sunar.

Google'ın en yeni **Gemini 2.5 Flash** modelleri kullanılarak, öğrencilere **sanal bir akademik danışmanlık** deneyimi sağlanır.

---

## ✨ Temel Özellikler

### 🤖 Yapay Zeka Asistanı (Gemini Powered)

- **Akıllı Taslak Oluşturucu**  
  Sadece proje konusu girilerek; başlık, özet, amaç ve yöntem bölümleri otomatik olarak oluşturulur.

- **Akademik Dil İyileştirici**  
  Yazılan metinleri akademik literatüre uygun hale getirir.

- **AI Hakem Değerlendirmesi**  
  Proje taslağını analiz eder, **0–100** arası puanlama yapar ve güçlü / zayıf yönleri raporlar.

- **Görsel Üretimi**  
  Proje konusuna uygun kapak görsellerini `gemini-2.5-flash-image` modeli ile üretir.

---

### 👥 Ekip ve İşbirliği

- **Ekip Eşleştirme**  
  İlgi alanları ve bölümlere göre takım arkadaşı bulma arayüzü.

- **Dinamik Ekip Yönetimi**  
  Üye ekleme / çıkarma ve rol atama işlemleri.

- **Görev Takvimi**  
  Proje iş paketlerinin aylık bazda planlanması.

---

### 📊 Yönetim Paneli

- **Başvuru Takibi**  
  Projelerin *Onaylandı*, *Reddedildi*, *İncelemede* gibi durumlarının takibi.

- **Dosya Çıktısı**  
  Hazırlanan proje taslaklarının **Word** veya **PDF** formatında dışa aktarılması.

- **Duyuru Sistemi**  
  Güncel başvuru tarihleri ve bilgilendirmeler.

---

## 🛠 Teknoloji Yığını

- **Frontend:** React 19, TypeScript  
- **Stil & UI:** Tailwind CSS, Material Symbols  
- **Yapay Zeka:** Google GenAI SDK (`@google/genai`)  
- **Routing:** React Router DOM  
- **Veri Yönetimi:** LocalStorage (demo amaçlı kalıcılık)  
- **Fontlar:** Inter, Spline Sans  

---

## 📂 Proje Yapısı

```text
/
├── components/      # Yeniden kullanılabilir UI bileşenleri (Layout, Toast vb.)
├── pages/           # Uygulama sayfaları (Dashboard, Draft, Login vb.)
├── services/        # Google Gemini API entegrasyon servisleri
├── types/           # TypeScript tip tanımlamaları
├── index.html       # Giriş noktası ve Tailwind konfigürasyonu
└── App.tsx          # Ana uygulama ve yönlendirme yapısı
