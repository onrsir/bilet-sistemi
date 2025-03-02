import React, { useState, useEffect } from "react";

const AdminPanel = () => {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // "all", "used", "unused"
  const [stats, setStats] = useState({
    totalTickets: 0,
    usedTickets: 0,
    activeTickets: 0
  });

  // Fetch tickets and stats when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch tickets
        const ticketsResponse = await fetch('/api/tickets');
        
        if (!ticketsResponse.ok) {
          throw new Error('Biletler alınamadı');
        }
        
        const ticketsData = await ticketsResponse.json();
        setTickets(ticketsData.tickets);
        
        // Fetch stats
        const statsResponse = await fetch('/api/stats');
        
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData.stats);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Veriler alınırken bir hata oluştu. Lütfen sayfayı yenileyin.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter tickets based on selected filter
  const filteredTickets = tickets.filter(ticket => {
    if (filter === "all") return true;
    if (filter === "used") return ticket.used;
    if (filter === "unused") return !ticket.used;
    return true;
  });

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('tr-TR');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-800 to-purple-800 text-white p-6">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-2">Admin Paneli</h1>
          <p className="text-blue-100">Konser-Parti Bilet Sistemini yönetin ve istatistikleri görüntüleyin</p>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center">
              <div className="rounded-full bg-purple-100 p-3 mr-4">
                <i className="fas fa-ticket-alt text-purple-500 text-xl"></i>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Toplam Bilet</h3>
                <p className="text-3xl font-bold text-purple-600">{stats.totalTickets}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center">
              <div className="rounded-full bg-green-100 p-3 mr-4">
                <i className="fas fa-check-circle text-green-500 text-xl"></i>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Kullanılan Bilet</h3>
                <p className="text-3xl font-bold text-green-600">{stats.usedTickets}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center">
              <div className="rounded-full bg-blue-100 p-3 mr-4">
                <i className="fas fa-hourglass-half text-blue-500 text-xl"></i>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Kullanılmayan Bilet</h3>
                <p className="text-3xl font-bold text-blue-600">{stats.activeTickets}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Ticket List Section */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold">Bilet Listesi</h2>
          </div>
          
          {/* Filter Buttons */}
          <div className="px-6 py-4 bg-gray-50 border-b flex flex-wrap gap-2">
            <button 
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg ${filter === "all" ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-800"}`}
            >
              Tümü
            </button>
            <button 
              onClick={() => setFilter("used")}
              className={`px-4 py-2 rounded-lg ${filter === "used" ? "bg-green-600 text-white" : "bg-gray-200 text-gray-800"}`}
            >
              Kullanılmış
            </button>
            <button 
              onClick={() => setFilter("unused")}
              className={`px-4 py-2 rounded-lg ${filter === "unused" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"}`}
            >
              Kullanılmamış
            </button>
          </div>
          
          {/* Tickets Table */}
          {isLoading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Biletler yükleniyor...</p>
            </div>
          ) : error ? (
            <div className="p-12 text-center">
              <div className="text-red-500 mb-2"><i className="fas fa-exclamation-circle text-xl"></i></div>
              <p className="text-red-500">{error}</p>
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-500">Bu kriterlere uygun bilet bulunamadı.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ad Soyad
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      E-posta
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bilet ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Oluşturma Tarihi
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Durum
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTickets.map((ticket) => (
                    <tr key={ticket.ticketId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {ticket.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {ticket.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                        {ticket.ticketId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(ticket.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {ticket.used ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Kullanılmış
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            Kullanılmamış
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <a 
                          href={`/ticket.html?id=${ticket.ticketId}`} 
                          target="_blank" 
                          className="text-indigo-600 hover:text-indigo-900 mr-2"
                        >
                          <i className="fas fa-eye"></i> Görüntüle
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Back to Homepage Button */}
        <div className="text-center mb-8">
          <a href="/" className="rounded-button bg-blue-600 text-white px-6 py-3 hover:bg-blue-700 transition-colors inline-block">
            <i className="fas fa-arrow-left mr-2"></i> Ana Sayfaya Dön
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <p>© 2025 Konser-Parti Bilet Sistemi. Tüm hakları saklıdır.</p>
          <div className="mt-4 flex justify-center space-x-4">
            <a href="#" className="text-gray-300 hover:text-white">
              <i className="fas fa-question-circle"></i> Yardım
            </a>
            <a href="#" className="text-gray-300 hover:text-white">
              <i className="fas fa-envelope"></i> İletişim
            </a>
            <a href="#" className="text-gray-300 hover:text-white">
              <i className="fas fa-shield-alt"></i> Gizlilik
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AdminPanel; 