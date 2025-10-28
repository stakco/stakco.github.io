# Migration Guide: CommonJS to ESM

## Overview

This guide helps you migrate from the CommonJS version (v1.x) to the new ESM version (v2.0) of the Kiwrious WebSerial library.

## Key Differences

| Feature | CommonJS (v1.x) | ESM (v2.0) |
|---------|-----------------|------------|
| **Module System** | CommonJS (`require`) | ES Modules (`import`) |
| **Target** | ES5 | ES2020 |
| **Browser Usage** | Requires bundler (Webpack) | Direct import, no bundler |
| **Files** | Multiple compiled files | Single bundle |
| **TypeScript** | Compiled separately | Compiled into bundle |
| **Size** | ~Multiple files | 48KB dev / 23KB prod |

## Migration Steps

### Step 1: Update Your HTML

#### Old Way (v1.x)
```html
<!-- Load all dependencies -->
<script src="js/libunicorn.out.js"></script>
<script src="js/libelf-integers.js"></script>
<script src="js/unicorn-wrapper.js"></script>
<script src="js/unicorn-constants.js"></script>
<script src="js/heartrate.js"></script>

<!-- Bundled app with Webpack/Rollup -->
<script src="bundle.js"></script>
```

#### New Way (v2.0)

**For non-heart rate sensors:**
```html
<!-- Just one import! -->
<script type="module">
    import serialService from './kiwrious-webserial.esm.js';
    // Ready to use!
</script>
```

**For heart rate sensors:**
```html
<!-- Load heart rate dependencies first -->
<script src="js/libunicorn.out.js"></script>
<script src="js/libelf-integers.js"></script>
<script src="js/unicorn-wrapper.js"></script>
<script src="js/unicorn-constants.js"></script>
<script src="js/heartrate.js"></script>

<!-- Then import the ESM module -->
<script type="module">
    import serialService from './kiwrious-webserial.esm.js';
</script>
```

### Step 2: Update Your Imports

#### Old Way (v1.x - with NPM)
```javascript
// In your Node.js/Webpack project
import serialService from 'kiwrious-webserial/lib/service/SerialService';
import {SensorReadResult} from "kiwrious-webserial/lib/data/SensorReadResult";
import {SensorDecodedValue} from "kiwrious-webserial/lib/data/SensorDecodedValue";
```

#### New Way (v2.0 - Browser ESM)
```javascript
// Direct browser import
import serialService, { 
    SensorReadResult, 
    SensorDecodedValue 
} from './kiwrious-webserial.esm.js';
```

### Step 3: Code Changes (Minimal!)

The API remains the same, so your existing code should work without changes:

```javascript
// ✅ Same API - No changes needed!

// Connect
await serialService.connectAndReadAsync();

// Listen for data
serialService.onSerialData = (data) => {
    console.log(data);
};

// Check connection
serialService.onSerialConnection = (connected) => {
    console.log(connected ? 'Connected' : 'Disconnected');
};

// Disconnect
await serialService.disconnectAsync();
```

### Step 4: Remove Build Tools (Optional)

If you were only using the library for browser applications, you can now remove:

- ❌ Webpack / Rollup / Parcel configuration
- ❌ `npm install` step
- ❌ Build scripts
- ❌ node_modules (if only used for this library)

The library now works directly in the browser!

## Comparison Examples

### Example 1: Simple UV Sensor

#### Old Way (v1.x)
```javascript
// In app.js (needs Webpack build)
const serialService = require('kiwrious-webserial/lib/service/SerialService').default;

serialService.onSerialData = (data) => {
    const values = data.decodedValues;
    console.log(`UV: ${values[0].value}`);
};

serialService.connectAndReadAsync();
```

```html
<!-- In HTML -->
<script src="dist/bundle.js"></script>
```

#### New Way (v2.0)
```html
<!-- Everything in one file! -->
<script type="module">
    import serialService from './kiwrious-webserial.esm.js';
    
    serialService.onSerialData = (data) => {
        const values = data.decodedValues;
        console.log(`UV: ${values[0].value}`);
    };
    
    await serialService.connectAndReadAsync();
</script>
```

### Example 2: React Application

#### Old Way (v1.x)
```jsx
// Needs NPM install
import React, { useEffect } from 'react';
import serialService from 'kiwrious-webserial/lib/service/SerialService';

function SensorComponent() {
    useEffect(() => {
        serialService.onSerialData = (data) => {
            // Handle data
        };
    }, []);
    
    return <button onClick={() => serialService.connectAndReadAsync()}>
        Connect
    </button>;
}
```

#### New Way (v2.0)

**Option A: Still use NPM (if you prefer)**
```jsx
// Install from npm with ESM support
import React, { useEffect } from 'react';
import serialService from 'kiwrious-webserial';

// Same code as before!
```

**Option B: Direct ESM import**
```jsx
import React, { useEffect } from 'react';
// Import from public folder
import serialService from '/kiwrious-webserial.esm.js';

// Same code as before!
```

## File Structure Changes

### Old Structure (v1.x)
```
node_modules/kiwrious-webserial/
├── lib/
│   ├── service/
│   │   ├── SerialService.js
│   │   ├── SerialReader.js
│   │   └── ...
│   ├── decoder/
│   │   └── ...
│   └── data/
│       └── ...
└── package.json

public/js/
├── libunicorn.out.js
├── unicorn-wrapper.js
└── ...
```

### New Structure (v2.0)
```
dist/
├── kiwrious-webserial.esm.js       # Single bundle!
├── kiwrious-webserial.esm.min.js
├── demo.html
├── README.md
└── js/                             # Optional (heart rate only)
    ├── libunicorn.out.js
    ├── unicorn-wrapper.js
    └── ...
```

## Troubleshooting Migration Issues

### Issue 1: "Cannot use import statement outside a module"

**Solution:** Add `type="module"` to your script tag:
```html
<script type="module">
    import serialService from './kiwrious-webserial.esm.js';
</script>
```

### Issue 2: "Failed to resolve module specifier"

**Solution:** Use a relative or absolute path:
```javascript
// ❌ Wrong
import serialService from 'kiwrious-webserial.esm.js';

// ✅ Correct
import serialService from './kiwrious-webserial.esm.js';
import serialService from '/dist/kiwrious-webserial.esm.js';
import serialService from 'https://cdn.example.com/kiwrious-webserial.esm.js';
```

### Issue 3: Heart rate sensor not working

**Solution:** Make sure external dependencies are loaded **before** the ESM module:
```html
<!-- Load these FIRST -->
<script src="js/libunicorn.out.js"></script>
<script src="js/libelf-integers.js"></script>
<script src="js/unicorn-wrapper.js"></script>
<script src="js/unicorn-constants.js"></script>
<script src="js/heartrate.js"></script>

<!-- Then load ESM module -->
<script type="module">
    import serialService from './kiwrious-webserial.esm.js';
</script>
```

### Issue 4: TypeScript errors

**Solution:** The bundle includes types. Make sure your `tsconfig.json` allows ES2020:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ES2020",
    "moduleResolution": "node"
  }
}
```

## Benefits of ESM Version

### ✅ Simpler Setup
- No build tools required for simple projects
- One file import vs multiple files
- No npm install needed (can use CDN)

### ✅ Better Performance
- Browser-native module loading
- Tree-shaking support (if using bundler)
- Smaller bundle size (23KB minified)

### ✅ Modern JavaScript
- ES2020 features
- Better async/await support
- More readable code

### ✅ Future-Proof
- ES Modules are the JavaScript standard
- Better browser support over time
- Compatible with Deno, modern Node.js

## When to Stay on CommonJS

Consider staying on v1.x CommonJS if:

- ❌ You need IE11 support (use Babel transpilation)
- ❌ You have complex Node.js backend integration
- ❌ Your build pipeline is already optimized for CommonJS

Otherwise, **upgrade to ESM for better developer experience!**

## Need Help?

- 📖 Read the [README.md](./README.md) for detailed API docs
- 🐛 Report issues on [GitHub](https://github.com/augmented-human-lab/kiwrious-webserial-library/issues)
- 💬 Check the demo.html for working examples

---

**Happy Coding! 🚀**
