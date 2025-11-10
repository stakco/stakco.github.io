# iTiles Web Bluetooth - Setup & Deployment Guide

## 📦 Project Structure

```
itiles-web-bluetooth/
├── src/
│   ├── index.ts                  # Main export file
│   ├── constants.ts              # All enums and types
│   └── ITilesBLEManager.ts       # Main BLE manager class
├── demo/
│   └── index.html                # Demo web application
├── examples/
│   └── usage-examples.js         # 10 example use cases
├── dist/                         # Built files (generated)
├── package.json
├── tsconfig.json
├── rollup.config.js
└── README.md
```

## 🚀 Quick Setup

### 1. Install Dependencies

```bash
cd itiles-web-bluetooth
npm install
```

This will install:
- TypeScript
- Rollup (bundler)
- Rollup plugins for TypeScript and module resolution

### 2. Build the Library

```bash
npm run build
```

This creates:
- `dist/itiles.js` - UMD bundle for browsers
- `dist/itiles.esm.js` - ES Module bundle
- `dist/itiles.d.ts` - TypeScript type definitions

### 3. Test the Demo Application

```bash
# Install a simple HTTP server (if not already installed)
npm install -g http-server

# Serve the demo directory
cd demo
http-server
```

Open `http://localhost:8080` in Chrome or Edge.

**Important**: Web Bluetooth only works over HTTPS or localhost!

## 📱 Running the Demo

1. Open the demo in a Web Bluetooth-compatible browser
2. Click "Connect to iTiles"
3. Select your iTiles device from the picker
4. Use the various controls to interact with your tiles

### Demo Features:

- ✅ Connection management
- ✅ Light color control with RGB sliders
- ✅ Quick color buttons (Red, Green, Blue, Yellow)
- ✅ Sound and vibration triggers
- ✅ Combined effects
- ✅ Sensor enable/disable
- ✅ Battery status checking
- ✅ Real-time event log
- ✅ Query paired/online tiles

## 📤 Publishing to NPM

### Preparation

1. Update version in `package.json`
2. Ensure you have an NPM account
3. Login to NPM:

```bash
npm login
```

### Publish

```bash
# Dry run to check what will be published
npm publish --dry-run

# Publish to NPM
npm publish
```

Your package will be available at:
```
https://www.npmjs.com/package/itiles-web-bluetooth
```

## 🌐 Deploying the Demo

### Option 1: GitHub Pages

1. Push your code to GitHub
2. Go to Settings > Pages
3. Select branch and `/demo` folder
4. Your demo will be available at: `https://yourusername.github.io/itiles-web-bluetooth/`

### Option 2: Netlify

1. Sign up at netlify.com
2. Drag and drop the `demo` folder
3. Get instant deployment with HTTPS

### Option 3: Vercel

```bash
npm install -g vercel
cd demo
vercel
```

## 🔧 Development Workflow

### Watch Mode

For active development with auto-rebuild:

```bash
npm run dev
```

This watches for changes in `src/` and rebuilds automatically.

### Project Structure Best Practices

```typescript
// For a new application using the library:

// 1. Install the package
npm install itiles-web-bluetooth

// 2. Import in your project
import { ITilesBLEManager, TileColor } from 'itiles-web-bluetooth';

// 3. Use in your code
const manager = new ITilesBLEManager();
```

## 🧪 Testing Checklist

Before deploying, test these features:

- [ ] Connect to device
- [ ] Disconnect from device
- [ ] Trigger lights (single color)
- [ ] Trigger lights (side colors)
- [ ] Play sounds
- [ ] Trigger vibrations
- [ ] Combined effects
- [ ] Enable/disable touch sensor
- [ ] Enable/disable shake sensor
- [ ] Query paired tiles
- [ ] Query online tiles
- [ ] Get battery status
- [ ] Receive touch events
- [ ] Receive shake events
- [ ] Receive step events

## 📱 Browser Requirements

### Minimum Requirements:
- Chrome 56+ / Edge 79+
- HTTPS or localhost connection
- User gesture required for initial connection

### Check Compatibility:

```javascript
if (!navigator.bluetooth) {
  alert('Web Bluetooth is not supported in this browser');
}
```

## 🔒 HTTPS Requirement

Web Bluetooth requires HTTPS. For development:

### Local Development:
- Use `localhost` - works without HTTPS
- Or use tools like `ngrok` for HTTPS tunnel

### Production:
- Must use HTTPS
- Most hosting platforms provide free SSL (Netlify, Vercel, GitHub Pages)

## 🐛 Troubleshooting

### "Web Bluetooth is not supported"
- Use Chrome, Edge, or Opera
- Ensure HTTPS connection (except localhost)
- Check if browser flag is enabled: `chrome://flags/#enable-web-bluetooth`

### "No devices found"
- Ensure iTiles device is powered on
- Check Bluetooth is enabled on your computer
- Ensure device name is exactly "iTILES"
- Try moving closer to the device

### "GATT Server disconnected"
- Check battery level of tiles
- Ensure stable Bluetooth connection
- Try reconnecting

### Build Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install

# Clear dist and rebuild
rm -rf dist
npm run build
```

## 📊 Performance Tips

1. **Batch Commands**: Instead of sending many commands rapidly, add small delays:
   ```javascript
   await manager.triggerLight(color, duration, ...);
   await new Promise(r => setTimeout(r, 100)); // Small delay
   await manager.triggerSound(sound, ...);
   ```

2. **Event Throttling**: For rapid events (like shake), throttle your handlers:
   ```javascript
   let lastShake = 0;
   manager.onShake((response) => {
     const now = Date.now();
     if (now - lastShake > 500) { // 500ms throttle
       // Handle shake
       lastShake = now;
     }
   });
   ```

3. **Connection State**: Always check connection before sending commands:
   ```javascript
   if (manager.isConnected()) {
     await manager.triggerLight(...);
   }
   ```

## 🔄 Updating the Library

When you make changes:

1. Update version in `package.json` (follow semver)
2. Rebuild: `npm run build`
3. Test thoroughly
4. Commit changes
5. Publish: `npm publish`

## 📚 Additional Resources

- [Web Bluetooth API Specification](https://webbluetoothcg.github.io/web-bluetooth/)
- [Chrome Web Bluetooth Guide](https://developers.google.com/web/updates/2015/07/interact-with-ble-devices-on-the-web)
- [MDN Web Bluetooth](https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API)

## 💡 Example Integration

### React Integration:
```jsx
import { ITilesBLEManager } from 'itiles-web-bluetooth';
import { useState, useEffect } from 'react';

function App() {
  const [manager] = useState(() => new ITilesBLEManager());
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    manager.onConnectionStateChanged((state) => {
      setConnected(state === 2); // CONNECTED = 2
    });
  }, [manager]);

  const connect = async () => {
    await manager.requestDevice();
    await manager.connect();
  };

  return (
    <div>
      <button onClick={connect} disabled={connected}>
        Connect
      </button>
    </div>
  );
}
```

### Vue Integration:
```vue
<script setup>
import { ITilesBLEManager } from 'itiles-web-bluetooth';
import { ref, onMounted } from 'vue';

const manager = new ITilesBLEManager();
const connected = ref(false);

onMounted(() => {
  manager.onConnectionStateChanged((state) => {
    connected.value = (state === 2);
  });
});

const connect = async () => {
  await manager.requestDevice();
  await manager.connect();
};
</script>

<template>
  <button @click="connect" :disabled="connected">
    Connect
  </button>
</template>
```

## 🎉 You're Ready!

Your iTiles Web Bluetooth library is now ready to use. Start building amazing interactive experiences!

For questions or issues, please refer to the main README.md or create an issue on GitHub.
