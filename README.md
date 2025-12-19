# CargoFlow - Global Freight Tracking Platform

## 🎯 **System Overview**

CargoFlow is a production-grade, real-time logistics tracking platform built with the MERN stack. It features live GPS tracking, interactive maps, and comprehensive shipment management across 100+ global cargo shipments.

---

## 🚀 **Key Features Implemented**

### 1. **Live Interactive Map** 
- **100 Shipments Worldwide**: Distributed across 15 major cities (New York, London, Tokyo, Shanghai, Dubai, Mumbai, Sydney, etc.)
- **Real-Time Updates**: WebSocket-powered live location updates every 5 seconds
- **Route Visualization**: Curved polylines showing origin → destination paths
- **Hover Effects**: 
  - Markers enlarge on hover
  - Smooth zoom animation on click
  - Instant popup with key shipment info
- **Click for Details**: Opens comprehensive modal with full manifest

### 2. **Manual Location Override (Admin)**
- **Coordinate Editor**: Change latitude/longitude directly from the UI
- **Live Broadcast**: Updates instantly push to all connected clients via Socket.IO
- **Access Control**: Only Admin and Operations Executive roles can modify

### 3. **Detailed Shipment Information**
Each cargo shipment includes:
- **Vessel Details**: Name, Type (Sea/Air/Land), Carrier
- **Route Info**: Origin, Destination, Current Location
- **Crew Manifest**:
  - Captain name (e.g., "John Smith", "Sarah Connor")
  - 3 crew members with random realistic names
- **Cargo Manifest Table**:
  - Item descriptions (Electronics, Textiles, Auto Parts, etc.)
  - Quantity, Weight, Estimated Value
  - Multiple line items per shipment

### 4. **Smart Alert System**
- **Real-Time Notifications**: Toast alerts when shipments change status
- **Delay Alerts**: Red warning when status changes to "Delayed"
- **Stop Alerts**: Orange notification when cargo stops moving
- **Auto-Dismiss**: Alerts fade after 5 seconds

### 5. **Advanced Settings Panel**
- **Theme Toggle**: Switch between Dark/Light mode
- **Marker Size Control**: Small, Normal, Large options
- **High Contrast Mode**: Accessibility toggle
- **Profile Display**: Shows user role and account info

---

## 📊 **Database Structure**

### Shipment Schema (Enhanced)
```javascript
{
  shipmentId: "SHP-1001",
  carrier: "Maersk",
  vesselName: "MV Voyager 42",
  type: "Sea", // or "Air", "Land"
  origin: {
    coordinates: [-74.006, 40.7128],
    address: "New York"
  },
  destination: {
    coordinates: [-118.2437, 34.0522],
    address: "Los Angeles"
  },
  currentLocation: {
    coordinates: [-95.123, 38.456] // Updates in real-time
  },
  route: {
    coordinates: [[lng, lat], ...] // 100 waypoints
  },
  status: "In Transit", // or Delayed, Stopped, Delivered
  speed: 62.5, // km/h
  personnel: {
    captain: "James Bond",
    crew: ["Ellen Ripley", "Han Solo", "Jack Sparrow"]
  },
  manifest: [
    {
      item: "Electronics",
      quantity: 45,
      weight: "850kg",
      value: "$42,000"
    },
    {
      item: "Textiles",
      quantity: 22,
      weight: "320kg",
      value: "$8,500"
    }
  ]
}
```

---

## 🎮 **How to Use**

### **Initial Setup**
```bash
# Install dependencies
npm install

# Seed database with 100 shipments
npm run seed

# Start both frontend and backend
npm start

# (Optional) Start GPS simulation
npm run simulate
```

### **Access the Platform**
1. Open browser: `http://localhost:5173`
2. Login with: `admin@cargoflow.com` / `password123`
3. Navigate to **Dashboard** or **Live Map**

### **View Shipment Details**
1. **Hover** over any cargo marker → See quick info
2. **Click** marker → Map zooms in smoothly
3. **Click again** → Opens detailed modal with:
   - Full crew roster
   - Complete cargo manifest
   - Manual location editor (Admin only)

### **Update Location Manually**
1. Click any shipment marker
2. In the modal, click **"Edit Coordinates"**
3. Enter new Latitude and Longitude
4. Click **"Update"**
5. All connected users see the change instantly

### **Monitor Alerts**
- Alerts appear automatically in top-right corner
- Red alerts = Delays
- Orange alerts = Stopped cargo
- Click to dismiss or wait 5 seconds

---

## 🗺️ **Map Features**

### **Visual Elements**
- **Dark Theme Map**: Uses Stadia Maps dark tiles for professional look
- **Color-Coded Routes**: 
  - Blue = Normal transit
  - Red = Delayed shipments
- **Dynamic Markers**:
  - Ship icon for Sea cargo
  - Plane icon for Air cargo
  - Truck icon for Land cargo
- **Smooth Animations**: Zoom, pan, and marker transitions

### **Interaction**
- **Scroll to Zoom**: Mouse wheel
- **Drag to Pan**: Click and drag
- **Marker Clustering**: (Can be added if needed for performance)

---

## 🔐 **User Roles**

| Role | Permissions |
|------|------------|
| **Admin** | Full access, can edit locations, manage users |
| **Regional Manager** | View shipments in assigned region |
| **Operations Executive** | Track shipments, update status |

---

## 🛠️ **Technical Architecture**

### **Frontend**
- React 19 + Vite
- React Router for navigation
- React Leaflet for maps
- Socket.IO Client for real-time updates
- React Hot Toast for notifications
- TailwindCSS for styling

### **Backend**
- Node.js + Express
- MongoDB with GeoJSON support
- Socket.IO for WebSocket communication
- JWT authentication
- Bcrypt password hashing

### **Real-Time Flow**
```
GPS Simulator → Webhook → Backend → Socket.IO → Frontend → Map Update
```

---

## 📈 **Performance Optimizations**

1. **Efficient Rendering**: Only re-renders changed shipments
2. **Geospatial Indexing**: MongoDB 2dsphere index for fast queries
3. **WebSocket Rooms**: Users can join region-specific rooms
4. **Lazy Loading**: Details modal loads on-demand

---

## 🎨 **UI/UX Highlights**

- **Glassmorphism**: Frosted glass effect on stat cards
- **Micro-animations**: Smooth hover effects and transitions
- **Responsive Design**: Works on desktop and tablet
- **Dark Mode First**: Optimized for low-light environments
- **Accessibility**: High contrast mode, keyboard navigation

---

## 🔄 **Future Enhancements**

- [ ] Historical route playback
- [ ] Geofencing with custom zones
- [ ] ETA prediction with ML
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Export reports (PDF/CSV)

---

## 📞 **Support**

For issues or questions:
- Check MongoDB is running: `mongod --version`
- Verify port 8000 is free: `lsof -i :8000`
- Check logs in terminal

---

## 🏆 **Credits**

Built with modern web technologies and best practices for enterprise logistics management.
