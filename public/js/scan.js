document.addEventListener('DOMContentLoaded', () => {
  const reader = document.getElementById('reader');
  const resultContainer = document.getElementById('result');
  const resultTitle = document.getElementById('result-title');
  const resultMessage = document.getElementById('result-message');
  const statusIcon = document.getElementById('status-icon');
  const ticketDetails = document.getElementById('ticket-details');
  const nameElement = document.getElementById('name');
  const emailElement = document.getElementById('email');
  const ticketIdElement = document.getElementById('ticketId');
  const scanAnotherBtn = document.getElementById('scan-another');
  
  let html5QrCode;
  let isProcessing = false; // Tarama işleminin devam edip etmediğini takip etmek için
  
  // QR kod tarayıcısını başlat
  const startScanner = () => {
    html5QrCode = new Html5Qrcode("reader");
    const config = { fps: 10, qrbox: { width: 250, height: 250 } };
    
    // Tarama başladığında bildir
    reader.insertAdjacentHTML('beforeend', '<div class="scanner-overlay">Kamera taranıyor...</div>');
    
    html5QrCode.start(
      { facingMode: "environment" },
      config,
      onScanSuccess,
      onScanFailure
    ).catch(err => {
      console.error("Kamera başlatılırken hata oluştu:", err);
      reader.innerHTML = `
        <div class="error-message">
          <p>Kamera başlatılamadı. Lütfen kamera izinlerini kontrol edin.</p>
          <button id="retry-camera" class="btn">Tekrar Dene</button>
        </div>
      `;
      document.getElementById('retry-camera').addEventListener('click', startScanner);
    });
  };
  
  // Başarılı tarama işleyicisi
  const onScanSuccess = async (decodedText) => {
    // Eğer işleme devam ediyorsa, yeni taramayı engelle
    if (isProcessing) return;
    isProcessing = true;
    
    // Taramayı durdur
    if (html5QrCode) {
      await html5QrCode.stop();
    }
    
    // Tarama sonrası yükleniyor göster
    resultContainer.classList.remove('hidden');
    reader.classList.add('hidden');
    statusIcon.innerHTML = '⏳';
    statusIcon.className = 'processing';
    resultTitle.textContent = 'Bilet Doğrulanıyor...';
    resultMessage.textContent = 'Lütfen bekleyin, bilet kontrol ediliyor.';
    ticketDetails.classList.add('hidden');
    
    // Basit bir doğrulama - UUID formatı kontrolü
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(decodedText)) {
      statusIcon.innerHTML = '❌';
      statusIcon.className = 'error';
      resultTitle.textContent = 'Geçersiz QR Kod';
      resultMessage.textContent = 'Taranan QR kod geçerli bir bilet ID\'si içermiyor.';
      isProcessing = false;
      return;
    }
    
    const ticketId = decodedText;
    
    // Bileti doğrula
    try {
      const response = await fetch('/api/tickets/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ticketId }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.valid) {
        // Geçerli bilet
        statusIcon.innerHTML = '✅';
        statusIcon.className = 'success';
        resultTitle.textContent = 'Bilet Geçerli';
        resultMessage.textContent = data.message;
        
        // Bilet detaylarını göster
        nameElement.textContent = data.ticket.name;
        emailElement.textContent = data.ticket.email;
        ticketIdElement.textContent = data.ticket.ticketId;
        
        // Tarih ve saat bilgisi ekle
        const validationTime = document.createElement('p');
        validationTime.innerHTML = `<strong>Doğrulama Zamanı:</strong> <span>${new Date().toLocaleString()}</span>`;
        ticketDetails.appendChild(validationTime);
        
        ticketDetails.classList.remove('hidden');
        
        // Onay sesi çal
        playSound('success');
      } else {
        // Geçersiz bilet
        statusIcon.innerHTML = '❌';
        statusIcon.className = 'error';
        resultTitle.textContent = 'Bilet Geçersiz';
        resultMessage.textContent = data.message || 'Bu bilet geçerli değil.';
        ticketDetails.classList.add('hidden');
        
        // Hata sesi çal
        playSound('error');
      }
    } catch (error) {
      console.error('Hata:', error);
      statusIcon.innerHTML = '❌';
      statusIcon.className = 'error';
      resultTitle.textContent = 'Hata Oluştu';
      resultMessage.textContent = 'Bilet doğrulanırken bir hata oluştu. Lütfen tekrar deneyin.';
      ticketDetails.classList.add('hidden');
      
      // Hata sesi çal
      playSound('error');
    } finally {
      isProcessing = false;
    }
  };
  
  // Ses çalma fonksiyonu
  const playSound = (type) => {
    let sound;
    if (type === 'success') {
      sound = new Audio('data:audio/mp3;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGFTb25vdGhlcXVlLm9yZwBURU5DAAAAHQAAA1N3aXRjaCBQbHVzIMKpIE5DSCBTb2Z0d2FyZQBUSVQyAAAABgAAAzIyMzUAVFNTRQAAAA8AAANMYXZmNTcuODMuMTAwAAAAAAAAAAAAAAD/80DEAAAAA0gAAAAATEFNRTMuMTAwVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQsRbAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQMSkAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV');
    } else {
      sound = new Audio('data:audio/mp3;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGFTb25vdGhlcXVlLm9yZwBURU5DAAAAHQAAA1N3aXRjaCBQbHVzIMKpIE5DSCBTb2Z0d2FyZQBUSVQyAAAABgAAAzIyMzUAVFNTRQAAAA8AAANMYXZmNTcuODMuMTAwAAAAAAAAAAAAAAD/80DEAAAAA0gAAAAATEFNRTMuMTAwVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQsRbAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQMSkAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV');
    }
    sound.play().catch(e => console.log('Ses çalınamadı:', e));
  };
  
  // Tarama hatası işleyicisi
  const onScanFailure = (error) => {
    // Hata mesajı konsola yazdırılır, kullanıcıya gösterilmez
    // console.log('QR kod bulunamadı.');
  };
  
  // Başka bir bilet tarama düğmesi
  scanAnotherBtn.addEventListener('click', () => {
    // Mevcut sonucu temizle
    resultContainer.classList.add('hidden');
    reader.classList.remove('hidden');
    reader.innerHTML = ''; // Önceki içeriği temizle
    
    // Tarih bilgisini temizle (eğer varsa)
    const validationTime = ticketDetails.querySelector('p:last-child');
    if (validationTime && validationTime.querySelector('strong').textContent.includes('Doğrulama Zamanı')) {
      validationTime.remove();
    }
    
    // Tarayıcıyı yeniden başlat
    startScanner();
  });
  
  // Manuel bilet doğrulama fonksiyonu
  function validateTicket(ticketId) {
    if (!ticketId) {
      alert('Lütfen bir bilet ID\'si girin.');
      return;
    }
    
    // Sonucu göster
    resultContainer.classList.remove('hidden');
    reader.classList.add('hidden');
    statusIcon.innerHTML = '⏳';
    statusIcon.className = 'processing';
    resultTitle.textContent = 'Bilet Doğrulanıyor...';
    resultMessage.textContent = 'Lütfen bekleyin, bilet kontrol ediliyor.';
    ticketDetails.classList.add('hidden');
    
    // API'ye istek
    fetch('/api/tickets/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ticketId }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.valid) {
        // Geçerli bilet
        statusIcon.innerHTML = '✅';
        statusIcon.className = 'success';
        resultTitle.textContent = 'Bilet Geçerli';
        resultMessage.textContent = data.message;
        
        // Bilet detaylarını göster
        nameElement.textContent = data.ticket.name;
        emailElement.textContent = data.ticket.email;
        ticketIdElement.textContent = data.ticket.ticketId;
        
        // Tarih ve saat bilgisi ekle
        const validationTime = document.createElement('p');
        validationTime.innerHTML = `<strong>Doğrulama Zamanı:</strong> <span>${new Date().toLocaleString()}</span>`;
        ticketDetails.appendChild(validationTime);
        
        ticketDetails.classList.remove('hidden');
        
        // Onay sesi çal
        playSound('success');
      } else {
        // Geçersiz bilet
        statusIcon.innerHTML = '❌';
        statusIcon.className = 'error';
        resultTitle.textContent = 'Bilet Geçersiz';
        resultMessage.textContent = data.message || 'Bu bilet geçerli değil.';
        ticketDetails.classList.add('hidden');
        
        // Hata sesi çal
        playSound('error');
      }
    })
    .catch(error => {
      console.error('Hata:', error);
      statusIcon.innerHTML = '❌';
      statusIcon.className = 'error';
      resultTitle.textContent = 'Hata Oluştu';
      resultMessage.textContent = 'Bilet doğrulanırken bir hata oluştu. Lütfen tekrar deneyin.';
      ticketDetails.classList.add('hidden');
      
      // Hata sesi çal
      playSound('error');
    });
  }
  
  // Manuel bilet formu ekleme
  const manualForm = document.createElement('div');
  manualForm.innerHTML = `
    <div style="margin-top: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
      <h4 style="margin-top: 0;">Manuel Bilet Doğrulama</h4>
      <p style="margin-bottom: 10px; font-size: 14px; color: #666;">QR kod taranmıyorsa, bilet ID'sini manuel olarak girin:</p>
      <input type="text" id="manualTicketId" placeholder="Bilet ID'sini buraya yapıştırın" style="width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 4px;">
      <button id="validateManual" class="btn" style="background-color: #007bff; color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer;">Doğrula</button>
    </div>
  `;
  document.querySelector('.scanner-container').appendChild(manualForm);
  
  // Manuel doğrulama butonu
  document.getElementById('validateManual').addEventListener('click', () => {
    const ticketId = document.getElementById('manualTicketId').value.trim();
    validateTicket(ticketId);
  });
  
  // Sayfayı yükledikten sonra tarayıcıyı başlat
  startScanner();
}); 