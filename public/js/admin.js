document.addEventListener('DOMContentLoaded', () => {
  const totalTicketsElement = document.getElementById('total-tickets');
  const usedTicketsElement = document.getElementById('used-tickets');
  const unusedTicketsElement = document.getElementById('unused-tickets');
  const ticketsTable = document.getElementById('tickets-table');
  const ticketsBody = document.getElementById('tickets-body');
  const filterButtons = document.querySelectorAll('.filter-btn');
  
  let allTickets = [];
  let currentFilter = 'all';
  
  // Biletleri getir
  const loadTickets = async () => {
    try {
      const response = await fetch('/api/tickets');
      if (!response.ok) {
        throw new Error('Biletler getirilemedi');
      }
      
      const data = await response.json();
      allTickets = data.tickets;
      
      // İstatistikleri güncelle
      updateStats();
      
      // Tabloyu güncelle
      renderTickets();
    } catch (error) {
      console.error('Hata:', error);
      alert('Biletler yüklenirken bir hata oluştu: ' + error.message);
    }
  };
  
  // İstatistikleri güncelle
  const updateStats = () => {
    const total = allTickets.length;
    const used = allTickets.filter(ticket => ticket.used).length;
    const unused = total - used;
    
    totalTicketsElement.textContent = total;
    usedTicketsElement.textContent = used;
    unusedTicketsElement.textContent = unused;
  };
  
  // Biletleri tabloda göster
  const renderTickets = () => {
    ticketsBody.innerHTML = '';
    
    let filteredTickets = allTickets;
    
    // Filtreleme
    if (currentFilter === 'used') {
      filteredTickets = allTickets.filter(ticket => ticket.used);
    } else if (currentFilter === 'unused') {
      filteredTickets = allTickets.filter(ticket => !ticket.used);
    }
    
    if (filteredTickets.length === 0) {
      ticketsBody.innerHTML = `
        <tr>
          <td colspan="5" class="text-center">Bilet bulunamadı</td>
        </tr>
      `;
      return;
    }
    
    // Biletleri tabloya ekle
    filteredTickets.forEach(ticket => {
      const row = document.createElement('tr');
      row.className = ticket.used ? 'used-ticket' : '';
      
      row.innerHTML = `
        <td>${ticket.name}</td>
        <td>${ticket.email}</td>
        <td>${ticket.ticketId}</td>
        <td>${new Date(ticket.createdAt).toLocaleString()}</td>
        <td>
          <span class="status-badge ${ticket.used ? 'used' : 'unused'}">
            ${ticket.used ? 'Kullanılmış' : 'Kullanılmamış'}
          </span>
        </td>
      `;
      
      ticketsBody.appendChild(row);
    });
  };
  
  // Filtre düğmelerini ayarla
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Aktif düğmeyi güncelle
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // Filtreyi uygula
      currentFilter = button.getAttribute('data-filter');
      renderTickets();
    });
  });
  
  // Sayfayı yükledikten sonra biletleri getir
  loadTickets();
}); 