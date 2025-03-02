import React, { useState, useEffect } from "react";

const Homepage = () => {
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showCreateTicket, setShowCreateTicket] = useState(false);
  const [formData, setFormData] = useState({
    eventName: "",
    ticketCount: 1,
    eventDate: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [stats, setStats] = useState({
    totalTickets: 0,
    usedTickets: 0,
    activeTickets: 0
  });
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  const heroImageUrl =
    "https://public.readdy.ai/ai/img_res/0d9f206d3c2b323caa779db49e705b06.jpg";

  // Fetch statistics when component mounts
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoadingStats(true);
        const response = await fetch('/api/stats');
        
        if (!response.ok) {
          throw new Error('İstatistikler alınamadı');
        }
        
        const data = await response.json();
        setStats(data.stats);
      } catch (err) {
        console.error('Error fetching stats:', err);
        // Use default stats on error
      } finally {
        setIsLoadingStats(false);
      }
    };

    fetchStats();
  }, []);

  const handleCreateTickets = async (e) => {
    e.preventDefault();
    setFormError("");
    
    // Validate form
    if (!formData.eventName) {
      setFormError("Lütfen etkinlik adını girin.");
      return;
    }
    
    if (formData.ticketCount < 1) {
      setFormError("Bilet sayısı en az 1 olmalıdır.");
      return;
    }
    
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/tickets/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          eventName: formData.eventName,
          ticketCount: parseInt(formData.ticketCount),
          eventDate: formData.eventDate
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Bilet oluşturma hatası');
      }
      
      const data = await response.json();
      alert(data.message);
      
      // Refresh stats after creating tickets
      const statsResponse = await fetch('/api/stats');
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData.stats);
      }
      
      setShowCreateTicket(false);
      setFormData({
        eventName: "",
        ticketCount: 1,
        eventDate: ""
      });
    } catch (err) {
      setFormError("Bilet oluşturulurken bir hata oluştu: " + err.message);
      console.error("Error creating tickets:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Hero Section with Gradient Overlay */}
      <div 
        className="relative h-96 bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${heroImageUrl})` }}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-purple-900/90"></div>
        
        {/* Navigation */}
        <div className="absolute top-0 w-full p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-white font-bold text-2xl">Konser-Parti Bilet Sistemi</h1>
            <div className="space-x-4">
              <a href="/admin.html" className="text-white hover:text-blue-200 transition">
                <i className="fas fa-user-shield mr-1"></i> Admin Paneli
              </a>
            </div>
          </div>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl font-bold text-white mb-6">
            Konser-Parti Bilet Sistemi
          </h1>
          <p className="text-xl text-blue-100 mb-8">
            Konser ve parti etkinlikleriniz için bilet oluşturun, dağıtın ve
            yönetin. Modern, güvenli ve kullanımı kolay bilet sistemi.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setShowCreateTicket(true)}
              className="rounded-button bg-blue-600 text-white px-6 py-3 hover:bg-blue-700 transition-colors"
            >
              <i className="fas fa-ticket-alt mr-2"></i> Bilet Oluştur
            </button>
            <button
              onClick={() => setShowQRScanner(true)}
              className="rounded-button bg-white text-gray-800 px-6 py-3 hover:bg-gray-100 transition-colors"
            >
              <i className="fas fa-qrcode mr-2"></i> QR Kod Okut
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Ana Sayfa Card */}
          <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              <i className="fas fa-home text-3xl text-purple-600"></i>
              <h2 className="text-2xl font-bold ml-4">Ana Sayfa</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Bilet sisteminin genel durumunu görüntüleyin ve yönetin.
            </p>
            <a href="index.html" className="rounded-button bg-purple-600 text-white px-6 py-3 hover:bg-purple-700 transition-colors whitespace-nowrap inline-block">
              Panele Git
            </a>
          </div>

          {/* Bilet Oluştur Card */}
          <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              <i className="fas fa-ticket-alt text-3xl text-blue-600"></i>
              <h2 className="text-2xl font-bold ml-4">Bilet Oluştur</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Benzersiz QR kodlu yeni biletler oluşturun.
            </p>
            <button
              onClick={() => setShowCreateTicket(true)}
              className="rounded-button bg-blue-600 text-white px-6 py-3 hover:bg-blue-700 transition-colors whitespace-nowrap"
            >
              Bilet Oluştur
            </button>
          </div>

          {/* Bilet Tara Card */}
          <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              <i className="fas fa-qrcode text-3xl text-green-600"></i>
              <h2 className="text-2xl font-bold ml-4">Bilet Tara</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Giriş kapısında biletleri tarayarak doğrulayın.
            </p>
            <button
              onClick={() => setShowQRScanner(true)}
              className="rounded-button bg-green-600 text-white px-6 py-3 hover:bg-green-700 transition-colors whitespace-nowrap"
            >
              Taramaya Başla
            </button>
          </div>

          {/* Admin Paneli Card */}
          <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              <i className="fas fa-cog text-3xl text-gray-600"></i>
              <h2 className="text-2xl font-bold ml-4">Admin Paneli</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Tüm biletleri görüntüleyin ve sistem ayarlarını yönetin.
            </p>
            <a href="admin.html" className="rounded-button bg-gray-600 text-white px-6 py-3 hover:bg-gray-700 transition-colors whitespace-nowrap inline-block">
              Panele Git
            </a>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6">Sistem İstatistikleri</h2>
          {isLoadingStats ? (
            <div className="text-center py-8">
              <p className="text-gray-600">İstatistikler yükleniyor...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600">{stats.totalTickets.toLocaleString()}</div>
                <div className="text-gray-600 mt-2">Toplam Bilet</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600">{stats.usedTickets.toLocaleString()}</div>
                <div className="text-gray-600 mt-2">Kullanılan Bilet</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600">{stats.activeTickets.toLocaleString()}</div>
                <div className="text-gray-600 mt-2">Aktif Bilet</div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="text-center text-gray-600 py-8 border-t">
          <p>© 2025 Konser-Parti Bilet Sistemi. Tüm hakları saklıdır.</p>
          <div className="mt-4">
            <a href="#" className="text-purple-600 hover:text-purple-800 mx-2">
              Yardım
            </a>
            <a href="#" className="text-purple-600 hover:text-purple-800 mx-2">
              İletişim
            </a>
            <a href="#" className="text-purple-600 hover:text-purple-800 mx-2">
              Gizlilik Politikası
            </a>
          </div>
        </footer>
      </div>

      {/* QR Scanner Modal */}
      {showQRScanner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-lg w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">QR Kod Tarayıcı</h3>
              <button
                onClick={() => setShowQRScanner(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center mb-6">
              <i className="fas fa-camera text-6xl text-gray-400"></i>
            </div>
            <p className="text-gray-600 text-center mb-6">
              Lütfen bilet QR kodunu kamera görüş alanına getirin.
            </p>
            <button
              onClick={() => setShowQRScanner(false)}
              className="rounded-button w-full bg-red-600 text-white py-3 hover:bg-red-700 transition-colors whitespace-nowrap"
            >
              Taramayı Kapat
            </button>
          </div>
        </div>
      )}

      {/* Create Ticket Modal */}
      {showCreateTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-lg w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Yeni Bilet Oluştur</h3>
              <button
                onClick={() => setShowCreateTicket(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <form onSubmit={handleCreateTickets}>
              {formError && (
                <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
                  {formError}
                </div>
              )}
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Etkinlik Adı</label>
                  <input
                    type="text"
                    name="eventName"
                    value={formData.eventName}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    placeholder="Etkinlik adını girin"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Bilet Sayısı</label>
                  <input
                    type="number"
                    name="ticketCount"
                    value={formData.ticketCount}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    placeholder="Oluşturulacak bilet sayısı"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">
                    Etkinlik Tarihi
                  </label>
                  <input
                    type="date"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  />
                </div>
              </div>
              <div className="flex space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateTicket(false)}
                  className="rounded-button flex-1 bg-gray-200 text-gray-800 py-3 hover:bg-gray-300 transition-colors whitespace-nowrap"
                >
                  İptal
                </button>
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="rounded-button flex-1 bg-blue-600 text-white py-3 hover:bg-blue-700 transition-colors whitespace-nowrap"
                >
                  {isLoading ? 'Oluşturuluyor...' : 'Oluştur'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Homepage; 