import React, { useState, useEffect } from 'react';

const TicketDisplay = ({ ticketData }) => {
  const [isInfoVisible, setIsInfoVisible] = useState(false);
  const [qrCodeSvg, setQrCodeSvg] = useState('');

  useEffect(() => {
    // Generate QR code when ticketData changes
    if (ticketData && ticketData.ticketId) {
      try {
        const protocol = window.location.protocol;
        const hostname = window.location.host;
        const baseUrl = `${protocol}//${hostname}`;
        const validationUrl = `${baseUrl}/validate.html?id=${ticketData.ticketId}`;
        
        // Use the global generateQRCodeSVG function from the HTML file
        if (typeof window.generateQRCodeSVG === 'function') {
          const qrSvg = window.generateQRCodeSVG(validationUrl, 200);
          setQrCodeSvg(qrSvg);
        }
      } catch (err) {
        console.error('Error generating QR code:', err);
      }
    }
  }, [ticketData]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="relative max-w-md mx-auto p-6 pt-20">
        {/* Event Logo */}
        <div className="w-full flex justify-center mb-8">
          <img
            src="https://public.readdy.ai/ai/img_res/45c98f19bc8ad874b35faf0af8e3403b.jpg"
            alt="Event Logo"
            className="w-24 h-24 object-contain"
          />
        </div>
        {/* Ticket Container */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute top-0 left-0 w-full h-full opacity-5">
            <img
              src="https://public.readdy.ai/ai/img_res/90a7a45ed25fee8c99abd44e7c6c2a0d.jpg"
              alt="Background Pattern"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Title */}
          <h1 className="text-2xl font-bold text-center text-blue-800 mb-8">
            {ticketData.eventName}
          </h1>
          {/* QR Code */}
          <div className="flex justify-center mb-8">
            <div className="bg-white p-4 rounded-2xl shadow-lg">
              {qrCodeSvg ? (
                <div dangerouslySetInnerHTML={{ __html: qrCodeSvg }} />
              ) : (
                <div className="w-48 h-48 flex items-center justify-center bg-gray-100">
                  <span className="text-gray-400">QR kod yükleniyor...</span>
                </div>
              )}
            </div>
          </div>
          {/* Ticket Information */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center border-b border-gray-100 pb-3">
              <span className="w-1/3 text-gray-500">Ad Soyad:</span>
              <span className="w-2/3 font-medium text-blue-900">{ticketData.name}</span>
            </div>
            <div className="flex items-center border-b border-gray-100 pb-3">
              <span className="w-1/3 text-gray-500">E-posta:</span>
              <span className="w-2/3 font-medium text-blue-900">{ticketData.email}</span>
            </div>
            <div className="flex items-center border-b border-gray-100 pb-3">
              <span className="w-1/3 text-gray-500">Tarih:</span>
              <span className="w-2/3 font-medium text-blue-900">{ticketData.date}</span>
            </div>
            <div className="flex items-center">
              <span className="w-1/3 text-gray-500">Bilet ID:</span>
              <span className="w-2/3 font-medium text-blue-900 break-all">{ticketData.ticketId}</span>
            </div>
          </div>
          {/* Info Button */}
          <button
            onClick={() => setIsInfoVisible(!isInfoVisible)}
            className="rounded-button w-full bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors"
          >
            <i className="fas fa-info-circle mr-2"></i>
            Bilet Bilgisi
          </button>
          {/* Info Modal */}
          {isInfoVisible && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-6 max-w-sm mx-4">
                <h3 className="text-xl font-semibold text-blue-800 mb-4">Önemli Bilgi</h3>
                <p className="text-gray-600 mb-6">
                  Bu bilet tek kullanımlıktır. Girişte bilet ID'nizi gösterin.
                </p>
                <button
                  onClick={() => setIsInfoVisible(false)}
                  className="rounded-button w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Anladım
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketDisplay; 