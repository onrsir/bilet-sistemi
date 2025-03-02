const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: '*', // Geliştirme için, üretimde daha kısıtlayıcı yapın
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.static('public'));

// MongoDB bağlantısı
mongoose.connect('mongodb://localhost:27017/ticket-system')
.then(() => {
  console.log('MongoDB bağlantısı başarılı');
}).catch(err => {
  console.error('MongoDB bağlantı hatası:', err);
});

// Bilet şeması - zorunlu alanlar ve türlerini kontrol edin
const ticketSchema = new mongoose.Schema({
  ticketId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  used: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Ticket = mongoose.model('Ticket', ticketSchema);

// API endpoint'leri
// Yeni bilet oluşturma - hata ayıklama eklenmiş
app.post('/api/tickets', async (req, res) => {
  try {
    console.log('Bilet oluşturma isteği alındı:', req.body);
    
    const { name, email } = req.body;
    if (!name || !email) {
      console.log('Eksik alanlar:', { name, email });
      return res.status(400).json({ error: 'Ad ve e-posta gereklidir' });
    }
    
    const ticketId = uuidv4();
    const ticket = new Ticket({
      ticketId,
      name,
      email
    });
    
    console.log('Oluşturulan bilet:', ticket);
    await ticket.save();
    res.status(201).json({ ticket });
  } catch (error) {
    console.error('Bilet oluşturma hatası:', error);
    res.status(500).json({ error: error.message });
  }
});

// Toplu bilet oluşturma (yeni endpoint)
app.post('/api/tickets/bulk', async (req, res) => {
  try {
    const { eventName, ticketCount, eventDate } = req.body;
    
    if (!eventName || !ticketCount || ticketCount < 1) {
      return res.status(400).json({ error: 'Etkinlik adı ve bilet sayısı gereklidir' });
    }
    
    const tickets = [];
    
    for (let i = 0; i < ticketCount; i++) {
      const ticketId = uuidv4();
      tickets.push({
        ticketId,
        name: `${eventName} Bilet #${i+1}`,
        email: `bilet${i+1}@${eventName.toLowerCase().replace(/\s+/g, '')}.com`,
        used: false,
        createdAt: new Date()
      });
    }
    
    await Ticket.insertMany(tickets);
    
    res.status(201).json({ 
      message: `${ticketCount} bilet başarıyla oluşturuldu`,
      tickets: tickets.map(t => t.ticketId)
    });
  } catch (error) {
    console.error('Toplu bilet oluşturma hatası:', error);
    res.status(500).json({ error: error.message });
  }
});

// Bilet doğrulama ve kullanma
app.post('/api/tickets/validate', async (req, res) => {
  try {
    const { ticketId } = req.body;
    const ticket = await Ticket.findOne({ ticketId });
    
    if (!ticket) {
      return res.status(404).json({ valid: false, message: 'Bilet bulunamadı' });
    }
    
    if (ticket.used) {
      return res.status(400).json({ valid: false, message: 'Bilet zaten kullanılmış' });
    }
    
    ticket.used = true;
    await ticket.save();
    
    res.json({ valid: true, message: 'Bilet başarıyla doğrulandı ve kullanıldı', ticket });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Bilet ID'ye göre getirme (React komponenti için)
app.get('/api/tickets/:ticketId', async (req, res) => {
  try {
    const { ticketId } = req.params;
    const ticket = await Ticket.findOne({ ticketId });
    
    if (!ticket) {
      return res.status(404).json({ error: 'Bilet bulunamadı' });
    }
    
    res.json({ 
      ticket: {
        eventName: 'Parti Davetiyesi',
        ticketId: ticket.ticketId,
        name: ticket.name,
        email: ticket.email,
        date: new Date(ticket.createdAt).toLocaleString('tr-TR')
      } 
    });
  } catch (error) {
    console.error('Bilet getirme hatası:', error);
    res.status(500).json({ error: error.message });
  }
});

// Bilet istatistiklerini getirme
app.get('/api/stats', async (req, res) => {
  try {
    const totalTickets = await Ticket.countDocuments();
    const usedTickets = await Ticket.countDocuments({ used: true });
    const activeTickets = await Ticket.countDocuments({ used: false });
    
    res.json({
      stats: {
        totalTickets,
        usedTickets,
        activeTickets
      }
    });
  } catch (error) {
    console.error('İstatistik getirme hatası:', error);
    res.status(500).json({ error: error.message });
  }
});

// Tüm biletleri getirme (admin için)
app.get('/api/tickets', async (req, res) => {
  try {
    const tickets = await Ticket.find();
    res.json({ tickets });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ana sayfa
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server çalışıyor: http://localhost:${PORT}`);
}); 