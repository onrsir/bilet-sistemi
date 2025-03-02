# Konser-Parti Bilet Sistemi - Modern Arayüz

Bu proje, Konser-Parti Bilet Sistemi için modern bir arayüz eklemek üzere güncellendi. Yeni arayüz React ve Tailwind CSS kullanılarak oluşturuldu.

> **ÖNEMLİ**: Bu bilet sistemi tamamen ücretsizdir ve açık kaynak kodludur. İstediğiniz gibi kullanabilir, değiştirebilir ve geliştirebilirsiniz. Herhangi bir ticari kısıtlama yoktur.

## Ekran Görüntüleri

### Ana Sayfa
<img width="891" alt="Ekran Resmi 2025-03-02 14 08 22" src="https://github.com/user-attachments/assets/abbed3ac-ffcf-42c8-b6a2-5d3069c741cc" />

### Bilet Görüntüleme
]<img width="232" alt="Ekran Resmi 2025-03-02 14 10 55" src="https://github.com/user-attachments/assets/a8c2ee7a-736b-4ee7-98d0-7e1e3300fcd3" />



### Admin Paneli
<img width="894" alt="Ekran Resmi 2025-03-02 14 09 46" src="https://github.com/user-attachments/assets/42ce9ca3-0c92-4bfe-9184-88d8d18a8445" />


### Bilet Oluşturma
<img width="1377" alt="Ekran Resmi 2025-03-02 14 11 48" src="https://github.com/user-attachments/assets/2a14ef49-ddee-4f55-bed0-7b9e228735fd" />

## Özellikler

- **Modern Ana Sayfa**: React ve Tailwind CSS ile oluşturulmuş güncel ve kullanıcı dostu arayüz
- **QR Kod Tarama Arayüzü**: Biletleri hızlıca doğrulamak için entegre edilmiş tarayıcı
- **Toplu Bilet Oluşturma**: Tek seferde birden fazla bilet oluşturabilme imkanı
- **Canlı İstatistikler**: Toplam, kullanılan ve aktif bilet sayılarını gerçek zamanlı görüntüleme
- **Modern Bilet Görüntüleme**: Geliştirilmiş bilet arayüzü ile daha iyi kullanıcı deneyimi
- **Admin Paneli**: Modern tasarımlı yönetim paneli ile tüm biletleri görüntüleme ve yönetme imkanı

## Kurulum

Mevcut projeye React ve Tailwind CSS entegrasyonu eklenmiştir. Kurulum için şu adımları izleyin:

1. Bağımlılıkları yükleyin:
   ```
   npm install
   ```

2. React uygulamasını derleyin:
   ```
   ./build.sh
   ```
   Bu komut, hem ana sayfa hem de bilet görüntüleme sayfası için gereken JavaScript dosyalarını oluşturacaktır.

3. MongoDB'yi çalıştırın:
   ```
   mongod
   ```

4. Uygulamayı başlatın:
   ```
   npm start
   ```

5. Tarayıcıda şu adresi ziyaret edin:
   ```
   http://localhost:3000
   ```

## Kullanım

### Ana Sayfa

Ana sayfa, sistem hakkında genel bilgiler ve istatistikler sunar. Bu sayfadan:

- Bilet oluşturabilirsiniz
- QR kod tarama arayüzüne erişebilirsiniz
- Sisteme ait güncel istatistikleri görebilirsiniz
- Admin paneline erişebilirsiniz

### Bilet Oluşturma

1. Ana sayfada "Bilet Oluştur" düğmesine tıklayın
2. Etkinlik adı, bilet sayısı ve (isteğe bağlı) etkinlik tarihini girin
3. "Oluştur" düğmesine tıklayın
4. Biletler veritabanında oluşturulacak ve istatistikler güncellenecektir

### Bilet Tarama

1. Ana sayfada "Taramaya Başla" düğmesine tıklayın
2. QR kod tarayıcı açılacaktır (not: gerçek kamera erişimi için ek yapılandırma gerekebilir)

### Bilet Görüntüleme

Bir biletin modern görünümü için şu URL'yi kullanın:
```
http://localhost:3000/ticket.html?id=BILET_ID
```

### Admin Paneli

Admin paneli, tüm biletlerin listesini görüntülemek ve yönetmek için kullanılır.

1. Ana sayfadaki "Admin Paneli" bağlantısına tıklayın veya direkt olarak `/admin.html` adresine gidin
2. Panel üzerinden:
   - Tüm biletleri görüntüleyin
   - Biletleri durumlarına göre filtreleyin (Tümü, Kullanılmış, Kullanılmamış)
   - Tek bir biletin detaylarını görüntüleyin
   - Sistem istatistiklerini takip edin

## Sorun Giderme

Eğer aşağıdaki hata mesajlarıyla karşılaşırsanız:

- `Refused to apply style from '/css/styles.css' because its MIME type ('text/html') is not a supported stylesheet MIME type`
- `Failed to load resource: the server responded with a status of 404 (Not Found)` (admin.bundle.js için)
- `Refused to execute script from '/js/admin.bundle.js' because its MIME type ('text/html') is not executable`

Bu hatalar genellikle şu sebeplerden kaynaklanmaktadır:
1. JavaScript ve CSS dosyalarının yolları doğru değil
2. Build işlemi tamamlanmamış

Çözüm:
1. `./build.sh` komutunu çalıştırarak tüm JavaScript dosyalarının oluşturulduğundan emin olun
2. HTML dosyalarında doğru JavaScript ve CSS yollarının kullanıldığından emin olun
3. Express sunucusunun statik dosyaları doğru şekilde servis ettiğinden emin olun

## Teknik Detaylar

Yeni arayüz şu teknolojileri kullanmaktadır:
- **React**: Modern, bileşen tabanlı kullanıcı arayüzü
- **Tailwind CSS**: Hızlı ve duyarlı arayüz tasarımı
- **Webpack**: JavaScript modüllerini derlemek için
- **Express API**: Yeni özellikleri desteklemek için eklenen API uç noktaları

Yapılan değişiklikler şunlardır:
1. React ve Tailwind CSS kurulumu
2. Modern ana sayfa ve bilet görüntüleme bileşenleri
3. API için yeni uç noktalar:
   - `/api/tickets/bulk`: Toplu bilet oluşturma
   - `/api/stats`: Sistem istatistiklerini getirme
   - Mevcut `/api/tickets/:ticketId` uç noktası bilet görüntüleme için kullanılmaya devam ediyor 

## Lisans

Bu proje MIT lisansı altında dağıtılmaktadır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## Katkıda Bulunma

Katkıda bulunmak istiyorsanız, lütfen bir pull request gönderin. Büyük değişiklikler için, önce bir issue açarak ne yapmak istediğinizi tartışmaya açın.

## GitHub Deposu

Bu projeyi GitHub'da inceleyebilir ve klonlayabilirsiniz:
[https://github.com/onrsir/bilet-sistemi](https://github.com/onrsir/bilet-sistemi) 
