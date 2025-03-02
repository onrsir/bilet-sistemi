document.addEventListener('DOMContentLoaded', () => {
  const resultTitle = document.getElementById('result-title');
  const resultMessage = document.getElementById('result-message');
  const statusIcon = document.getElementById('status-icon');
  const ticketDetails = document.getElementById('ticket-details');
  const nameElement = document.getElementById('name');
  const emailElement = document.getElementById('email');
  const ticketIdElement = document.getElementById('ticketId');
  
  // URL'den bilet ID'sini al
  const urlParams = new URLSearchParams(window.location.search);
  const ticketId = urlParams.get('id');
  
  if (!ticketId) {
    // Bilet ID bulunamadı
    statusIcon.innerHTML = '❌';
    statusIcon.className = 'error';
    resultTitle.textContent = 'Geçersiz Bilet';
    resultMessage.textContent = 'Bilet ID bulunamadı. Lütfen geçerli bir bilet QR kodu tarayın.';
    return;
  }
  
  // Bileti doğrula
  validateTicket(ticketId);
  
  function validateTicket(id) {
    fetch('/api/tickets/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ticketId: id }),
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
        
        ticketDetails.classList.remove('hidden');
      } else {
        // Geçersiz bilet
        statusIcon.innerHTML = '❌';
        statusIcon.className = 'error';
        resultTitle.textContent = 'Bilet Geçersiz';
        resultMessage.textContent = data.message || 'Bu bilet geçerli değil.';
        ticketDetails.classList.add('hidden');
      }
    })
    .catch(error => {
      console.error('Hata:', error);
      statusIcon.innerHTML = '❌';
      statusIcon.className = 'error';
      resultTitle.textContent = 'Hata Oluştu';
      resultMessage.textContent = 'Bilet doğrulanırken bir hata oluştu. Lütfen tekrar deneyin.';
      ticketDetails.classList.add('hidden');
    });
  }
}); 