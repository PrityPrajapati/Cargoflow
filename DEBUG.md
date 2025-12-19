# 🔧 Debugging Steps

## The Issue
The map is showing "ACTIVE FLEET: 0" with no cargo markers visible.

## What We Know
✅ **Backend is working** - 100 shipments in database
✅ **API is working** - Tested with curl, returns data correctly
✅ **Login is working** - Returns valid JWT token
❓ **Frontend** - Need to check browser console

## Steps to Debug

### 1. Open Browser Console
1. Open `http://localhost:5173` in your browser
2. Press `F12` or `Cmd+Option+I` (Mac) to open Developer Tools
3. Click on the **Console** tab

### 2. Login
1. Enter email: `admin@cargoflow.com`
2. Enter password: `password123`
3. Click "Sign In"

### 3. Check Console Messages
You should see messages like:
```
AuthContext: Logging in...
AuthContext: Login successful, user: {name: "System Admin", ...}
AuthContext: User set in state and localStorage
ShipmentContext: User changed: {name: "System Admin", ...}
Fetching shipments...
Shipments fetched: 100
Socket Connected
```

### 4. What to Look For

**If you see:**
- ❌ "Failed to fetch shipments" → Check the error details
- ❌ "ShipmentContext: No user, skipping fetch" → Login didn't work
- ❌ Network errors → Check if backend is running on port 8000
- ❌ CORS errors → Need to add CORS headers

**If you DON'T see:**
- "Shipments fetched: 100" → Data isn't loading
- "Socket Connected" → WebSocket connection failed

### 5. Check Network Tab
1. In Developer Tools, click **Network** tab
2. Look for request to `http://localhost:8000/api/shipments`
3. Click on it to see:
   - **Status**: Should be `200 OK`
   - **Response**: Should show array of shipments
   - **Headers**: Check if Authorization header is present

### 6. Check Application Tab
1. In Developer Tools, click **Application** tab
2. Expand **Local Storage** → `http://localhost:5173`
3. Look for key named `user`
4. Value should be JSON with `token`, `name`, `email`, `role`

## Quick Fixes

### If Login Fails
```bash
# Restart the server
cd /Users/ayusharyan/Desktop/PITI
kill -9 $(lsof -t -i:8000)
npm start
```

### If Data Doesn't Load
```bash
# Check database
mongosh projectv --eval "db.shipments.countDocuments()"
# Should show: 100
```

### If CORS Error
The server already has CORS enabled, but if you see CORS errors, let me know.

## Expected Behavior

After login, you should:
1. See console log: "Shipments fetched: 100"
2. See 100 cargo markers on the map
3. Be able to hover over markers
4. Be able to click markers to see details

## Send Me

Please copy and paste:
1. **All console messages** after you login
2. **Any error messages** in red
3. **Network tab** - status of `/api/shipments` request

This will help me identify exactly what's wrong!
