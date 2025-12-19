const express = require('express');
const http = require('http');
const dotenv = require('dotenv');
const cors = require('cors');
const { Server } = require('socket.io');
const connectDB = require('./src/config/db');

dotenv.config();

connectDB();

const app = express();
const server = http.createServer(app);

// Socket.io Setup
const io = new Server(server, {
    cors: {
        origin: ["https://cargoflow-8n57.vercel.app", "http://localhost:5173", "http://localhost:5174"],
        methods: ["GET", "POST"],
        credentials: true
    }
});

app.use(cors({
    origin: ["https://cargoflow-8n57.vercel.app", "http://localhost:5173", "http://localhost:5174"],
    credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/shipments', require('./src/routes/shipmentRoutes'));
app.use('/api/alerts', require('./src/routes/alertRoutes'));

app.get('/', (req, res) => {
    res.send('CargoFlow API is running...');
});

// Socket Logic (Basic connection)
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });

    // Join room logic can go here (e.g., join room by shipmentId or region)
    socket.on('join_room', (room) => {
        socket.join(room);
        console.log(`User joined room: ${room}`);
    });
});

// Make io accessible to routes
app.set('socketio', io);

// Global Error Handler
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

const PORT = process.env.PORT || 5000;

// Render/Heroku require binding to 0.0.0.0
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Accepting connections on 0.0.0.0');
});
