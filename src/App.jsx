import React, { useState, useEffect } from 'react';
import TicketDisplay from './components/TicketDisplay';

const App = () => {
  const [ticketData, setTicketData] = useState({
    eventName: 'Konser-Parti Davetiyesi',
    name: '',
    email: '',
    date: '',
    ticketId: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTicketData = async () => {
      try {
        // Get ticket ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        const ticketId = urlParams.get('id');

        if (!ticketId) {
          // If no ticket ID, use demo data
          setTicketData({
            eventName: 'Konser-Parti Davetiyesi',
            name: 'sdfdsf d',
            email: 'dsfsdf@gmail.com',
            date: '02.03.2025 12:55:57',
            ticketId: 'e48ee61c-6a82-42ad-9e00-1572289c0183'
          });
          setLoading(false);
          return;
        }

        // Fetch ticket data from API
        const response = await fetch(`/api/tickets/${ticketId}`);
        
        if (!response.ok) {
          throw new Error('Bilet verileri alınamadı');
        }
        
        const data = await response.json();
        setTicketData(data.ticket);
      } catch (err) {
        console.error('Error fetching ticket:', err);
        setError('Bilet bilgileri yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
      } finally {
        setLoading(false);
      }
    };

    fetchTicketData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <p className="text-blue-800 font-medium">Bilet bilgileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md">
          <h2 className="text-red-600 font-bold text-xl mb-4">Hata</h2>
          <p className="text-gray-700">{error}</p>
          <button 
            className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-xl hover:bg-blue-700"
            onClick={() => window.location.href = '/'}
          >
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    );
  }

  return <TicketDisplay ticketData={ticketData} />;
};

export default App; 