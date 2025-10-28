# 🚀 Quick Start Guide - Kiwrious ESM

## Get Started in 60 Seconds!

### 1. Copy the File
Copy `kiwrious-webserial.esm.min.js` to your project folder.

### 2. Create HTML File
```html
<!DOCTYPE html>
<html>
<head>
    <title>My Kiwrious App</title>
</head>
<body>
    <button id="connect">Connect Sensor</button>
    <div id="output">Waiting for data...</div>

    <script type="module">
        import serialService from 'https://stakcos.com/kiwrious/sdk/kiwrious-webserial.esm.min.js';
        
        // Display sensor data
        serialService.onSerialData = (data) => {
            const values = data.decodedValues;

            const output = values.map(v => 
                `label: ${v.label}: ${v.value.value.toFixed(2)}`
            ).join('<br>');
            
            document.getElementById('output').innerHTML = output;
        };
        
        // Connect button
        document.getElementById('connect').onclick = async () => {
            await serialService.connectAndReadAsync();
        };
    </script>
</body>
</html>
```

### 3. Run a Local Server
```bash
# Python 3
python -m http.server 8000

# Or Node.js
npx http-server

# Or PHP
php -S localhost:8000
```

### 4. Open in Browser
Open `http://localhost:8000` in Chrome or Edge.

### 5. Connect Your Sensor
Click "Connect Sensor" and select your Kiwrious device!

---

## That's It! 🎉

You're now reading sensor data with just one JavaScript file!

## What Works Without Extra Setup

✅ UV sensors (Light + Lux)
✅ Climate sensors (Temperature + Humidity)  
✅ Conductivity sensors
✅ Temperature sensors (IR)
✅ VOC sensors (Air quality)

## Heart Rate Sensors Need Extra Files

If using heart rate sensors, add these before the module script:

```html
<script src="js/libunicorn.out.js"></script>
<script src="js/libelf-integers.js"></script>
<script src="js/unicorn-wrapper.js"></script>
<script src="js/unicorn-constants.js"></script>
<script src="js/heartrate.js"></script>

<script type="module">
    import serialService from './kiwrious-webserial.esm.min.js';
    // Now heart rate works!
</script>
```

## Common Issues

**"Module not found"** → Use `./` prefix: `'./kiwrious-webserial.esm.min.js'`

**"Cannot use import"** → Add `type="module"` to script tag

**"CORS error"** → Use a local server, not file:// protocol

---

## More Info

- 📖 [README.md](./README.md) - Full API documentation
- 🔄 [MIGRATION.md](./MIGRATION.md) - Upgrade from v1.x
- 🌐 [demo.html](./demo.html) - Complete working example

**Enjoy building with Kiwrious! 🎉**
