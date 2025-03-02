document.addEventListener('DOMContentLoaded', () => {
  const ticketForm = document.getElementById('ticket-form');
  const ticketResult = document.getElementById('ticket-result');
  const qrcodeElement = document.getElementById('qrcode');
  const ticketInfo = document.getElementById('ticket-info');
  const createNewBtn = document.getElementById('create-new');
  const downloadTicketBtn = document.getElementById('download-ticket');
  const printTicketBtn = document.getElementById('print-ticket');
  const viewModernTicketBtn = document.getElementById('view-modern-ticket') || document.createElement('button');
  
  let currentTicket = null;
  
  // Bilet oluşturma formu gönderildiğinde
  ticketForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    
    if (!name || !email) {
      alert('Lütfen tüm alanları doldurun');
      return;
    }
    
    try {
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Bilet oluşturma hatası');
      }
      
      const data = await response.json();
      
      currentTicket = data.ticket;
      
      // QR kod alanını temizle
      qrcodeElement.innerHTML = '';
      
      // Daha kısa bir URL kullan
      const protocol = window.location.protocol.includes('http') ? window.location.protocol : 'http:';
      const hostname = window.location.host || window.location.hostname;
      const baseUrl = `${protocol}//${hostname}`;
      const validationUrl = `${baseUrl}/r.html?id=${currentTicket.ticketId}`;
      const qrCodeSVG = generateQRCodeSVG(validationUrl, 200);
      
      // QR Kod altına doğrudan URL de ekleyelim
      qrcodeElement.innerHTML = `
        <div style="text-align:center; margin-bottom:15px;">
          ${qrCodeSVG}
          <div style="margin-top:10px; font-family:monospace; font-size:14px; background:#f5f5f5; padding:10px; word-break:break-all; border:1px solid #ddd;">
            <strong>Bilet ID:</strong> ${currentTicket.ticketId}
          </div>
          <p style="font-size:12px; margin-top:5px; color:#666;">QR kodu taradığınızda doğrulama sayfası açılacaktır</p>
          <p style="font-size:12px; margin-top:5px;">
            <strong>Manuel doğrulama için:</strong><br>
            <a href="${validationUrl}" target="_blank">${validationUrl}</a>
          </p>
        </div>
      `;
      
      // Bilet bilgilerini göster
      ticketInfo.innerHTML = `
        <p><strong>Ad Soyad:</strong> ${currentTicket.name}</p>
        <p><strong>E-posta:</strong> ${currentTicket.email}</p>
        <p><strong>Oluşturma Tarihi:</strong> ${new Date(currentTicket.createdAt).toLocaleString()}</p>
      `;
      
      // Modern görünüm butonu ekle
      if (!viewModernTicketBtn.id) {
        viewModernTicketBtn.id = 'view-modern-ticket';
        viewModernTicketBtn.className = 'btn';
        viewModernTicketBtn.textContent = 'Modern Tasarımla Görüntüle';
        // Butonu download ve print butonları arasına ekle
        downloadTicketBtn.parentNode.insertBefore(viewModernTicketBtn, printTicketBtn);
      }
      
      // Sonucu göster, formu gizle
      ticketForm.classList.add('hidden');
      ticketResult.classList.remove('hidden');
    } catch (error) {
      console.error('Hata:', error);
      alert('Bilet oluşturulurken bir hata oluştu: ' + error.message);
    }
  });
  
  // Modern tasarımlı bilet görüntüleme butonu
  viewModernTicketBtn.addEventListener('click', () => {
    if (!currentTicket) {
      alert('Bilet bilgileri bulunamadı. Lütfen tekrar deneyin.');
      return;
    }
    
    // Bilet ID ile React sayfasına yönlendir
    window.open(`ticket.html?id=${currentTicket.ticketId}`, '_blank');
  });
  
  // Yeni bilet oluşturma düğmesi
  createNewBtn.addEventListener('click', () => {
    ticketForm.reset();
    ticketForm.classList.remove('hidden');
    ticketResult.classList.add('hidden');
    currentTicket = null;
  });
  
  // Bilet indirme düğmesi
  downloadTicketBtn.addEventListener('click', () => {
    if (!currentTicket) {
      alert('Bilet bilgileri bulunamadı. Lütfen tekrar deneyin.');
      return;
    }
    
    try {
      // Tam URL oluştur
      const protocol = window.location.protocol.includes('http') ? window.location.protocol : 'http:';
      const hostname = window.location.host || window.location.hostname;
      const baseUrl = `${protocol}//${hostname}`;
      const validationUrl = `${baseUrl}/validate.html?id=${currentTicket.ticketId}`;
      const qrCodeSVG = generateQRCodeSVG(validationUrl, 200);
      
      // HTML içeriği oluştur
      const ticketHtml = `
        <html>
          <head>
            <title>Bilet - ${currentTicket.name}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              .ticket { border: 2px solid #333; padding: 20px; max-width: 500px; margin: 0 auto; }
              .header { text-align: center; border-bottom: 1px solid #ddd; padding-bottom: 10px; margin-bottom: 20px; }
              .qr-code { text-align: center; margin: 20px 0; }
              .info { margin-bottom: 20px; }
              .ticket-id { font-family: monospace; background: #f5f5f5; padding: 10px; text-align: center; font-size: 16px; margin: 15px 0; word-break: break-all; }
              .note { font-style: italic; font-size: 0.9em; border-top: 1px solid #ddd; padding-top: 10px; }
            </style>
          </head>
          <body>
            <div class="ticket">
              <div class="header">
                <h1>Parti Davetiyesi</h1>
              </div>
              <div class="info">
                <p><strong>Ad Soyad:</strong> ${currentTicket.name}</p>
                <p><strong>E-posta:</strong> ${currentTicket.email}</p>
                <p><strong>Tarih:</strong> ${new Date(currentTicket.createdAt).toLocaleString()}</p>
              </div>
              <div class="qr-code">
                ${qrCodeSVG}
                <p style="font-size:12px; margin-top:5px;">QR kodu taratın veya aşağıdaki ID'yi kullanın</p>
              </div>
              <div class="ticket-id">
                <strong>Bilet ID:</strong> ${currentTicket.ticketId}
              </div>
              <div style="margin-top:10px; text-align:center; font-size:14px;">
                <p><strong>Bu URL'yi ziyaret ederek de bileti doğrulayabilirsiniz:</strong><br>
                <a href="${validationUrl}">${validationUrl}</a></p>
              </div>
            </div>
          </body>
        </html>
      `;
      
      // Blob oluştur ve indir
      const blob = new Blob([ticketHtml], {type: 'text/html'});
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `bilet-${currentTicket.name.replace(/\s+/g, '-')}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // Temizlik
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Bilet indirme hatası:', error);
      alert('Bilet indirilirken bir hata oluştu: ' + error.message);
    }
  });
  
  // Bilet yazdırma düğmesi
  printTicketBtn.addEventListener('click', () => {
    if (!currentTicket) {
      alert('Bilet bilgileri bulunamadı. Lütfen tekrar deneyin.');
      return;
    }
    
    try {
      // Tam URL oluştur
      const protocol = window.location.protocol.includes('http') ? window.location.protocol : 'http:';
      const hostname = window.location.host || window.location.hostname;
      const baseUrl = `${protocol}//${hostname}`;
      const validationUrl = `${baseUrl}/validate.html?id=${currentTicket.ticketId}`;
      const qrCodeSVG = generateQRCodeSVG(validationUrl, 200);
      
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>Bilet Yazdır - ${currentTicket.name}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              .ticket { border: 2px solid #333; padding: 20px; max-width: 500px; margin: 0 auto; }
              .header { text-align: center; border-bottom: 1px solid #ddd; padding-bottom: 10px; margin-bottom: 20px; }
              .qr-code { text-align: center; margin: 20px 0; }
              .info { margin-bottom: 20px; }
              .ticket-id { font-family: monospace; background: #f5f5f5; padding: 10px; text-align: center; font-size: 16px; margin: 15px 0; word-break: break-all; }
              .note { font-style: italic; font-size: 0.9em; border-top: 1px solid #ddd; padding-top: 10px; }
              @media print {
                button { display: none; }
              }
            </style>
          </head>
          <body>
            <button onclick="window.print()">Yazdır</button>
            <div class="ticket">
              <div class="header">
                <h1>Parti Davetiyesi</h1>
              </div>
              <div class="info">
                <p><strong>Ad Soyad:</strong> ${currentTicket.name}</p>
                <p><strong>E-posta:</strong> ${currentTicket.email}</p>
                <p><strong>Tarih:</strong> ${new Date(currentTicket.createdAt).toLocaleString()}</p>
              </div>
              <div class="qr-code">
                ${qrCodeSVG}
                <p style="font-size:12px; margin-top:5px;">QR kodu taratın veya aşağıdaki ID'yi kullanın</p>
              </div>
              <div class="ticket-id">
                <strong>Bilet ID:</strong> ${currentTicket.ticketId}
              </div>
              <div style="margin-top:10px; text-align:center; font-size:14px;">
                <p><strong>Bu URL'yi ziyaret ederek de bileti doğrulayabilirsiniz:</strong><br>
                <a href="${validationUrl}">${validationUrl}</a></p>
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
    } catch (error) {
      console.error('Bilet yazdırma hatası:', error);
      alert('Bilet yazdırılırken bir hata oluştu: ' + error.message);
    }
  });
});

// Hata yakalama iyileştirmesi
window.addEventListener('error', function(event) {
  console.error('JavaScript Hatası:', event.error);
  alert('Bir JavaScript hatası oluştu: ' + event.error.message);
});