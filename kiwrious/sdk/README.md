# Kiwrious WebSerial SDK - Source Project

Complete source code with TypeScript files and build system for the Kiwrious WebSerial ESM library.

## 📁 Project Structure

```
kiwrious-webserial/
├── src/                          # Source TypeScript files
│   ├── index.ts                  # Main entry point
│   ├── data/                     # Data models
│   │   ├── SensorDecodedValue.ts
│   │   └── SensorReadResult.ts
│   ├── service/                  # Core services
│   │   ├── SerialService.ts      # Main service (singleton)
│   │   ├── SerialReader.ts
│   │   ├── SerialRawValue.ts
│   │   ├── SerialUtil.ts
│   │   ├── SerialDecoder.ts
│   │   ├── SerialDecoderFactory.ts
│   │   ├── SerialHexValue.ts
│   │   └── ValueReader.ts
│   ├── decoder/                  # Sensor decoders
│   │   ├── SerialUVDecoder.ts
│   │   ├── SerialHumidityDecoder.ts
│   │   ├── SerialConductivityDecoder.ts
│   │   ├── SerialHeartRateDecoder.ts
│   │   ├── SerialHeartRate2Decoder.ts
│   │   ├── SerialTemperatureDecoder.ts
│   │   ├── SerialTemperature2Decoder.ts
│   │   └── SerialVOCDecoder.ts
│   ├── processing/               # Data processing
│   │   ├── HeartRateProcessor.ts
│   │   └── MinValueThreshold.ts
│   ├── lib/                      # External dependencies
│   │   ├── libunicorn_out.js
│   │   ├── libunicorn_out.wasm
│   │   ├── unicorn-wrapper.js
│   │   ├── unicorn-constants.js
│   │   ├── heartrate.js
│   │   ├── libelf-integers.js
│   │   └── prog.bin
│   └── jsfft.d.ts               # Type definitions
├── dist/                         # Build output (generated)
│   ├── kiwrious-webserial.esm.js
│   ├── kiwrious-webserial.esm.min.js
│   └── js/                       # Copied from src/lib
├── build.mjs                     # Build script
├── build-watch.mjs              # Watch mode script
├── tsconfig.json                # TypeScript config
├── package.json                 # NPM config
└── README.md                    # This file
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Build the Library
```bash
npm run build
```

This will:
- Clean the `dist/` folder
- Compile TypeScript to ESM JavaScript
- Bundle into single file
- Create minified version
- Copy external dependencies
- Copy documentation

### 3. Test Locally
```bash
npm run dev
```

This will build and start a local server at `http://localhost:8080`

## 📝 NPM Scripts

### Building

```bash
# Full production build
npm run build

# Development build (faster, not minified)
npm run build:dev

# Watch mode (auto-rebuild on file changes)
npm run build:watch
```

### Development

```bash
# Build and serve locally
npm run dev

# Just serve dist folder
npm run serve

# Type checking (no build)
npm run lint
```

### Maintenance

```bash
# Clean build artifacts
npm run clean

# Prepare for publishing
npm run prepublishOnly
```

## 🔨 Development Workflow

### Edit Source Files
```bash
# 1. Edit TypeScript files in src/
code src/service/SerialService.ts

# 2. Build (or use watch mode)
npm run build

# 3. Test in browser
npm run serve
```

### Watch Mode (Recommended for Development)
```bash
# Terminal 1: Auto-rebuild on changes
npm run build:watch

# Terminal 2: Serve the built files
npm run serve
```

Now edit any `.ts` file and it will auto-rebuild!

## 📦 Build Output

After running `npm run build`, you'll have:

```
dist/
├── kiwrious-webserial.esm.js        # Development build (48KB)
├── kiwrious-webserial.esm.min.js    # Production build (23KB)
├── kiwrious-webserial.esm.js.map    # Source map
├── kiwrious-webserial.esm.min.js.map
├── js/                               # External dependencies
│   ├── libunicorn_out.js
│   ├── libunicorn_out.wasm
│   └── ...
└── *.md                              # Documentation
```

## 🎯 Adding New Features

### Add a New Sensor Decoder

1. **Create decoder file:**
```typescript
// src/decoder/SerialNewSensorDecoder.ts
import { SerialDecoder } from "../service/SerialDecoder";
import { SerialRawValue } from "../service/SerialRawValue";
import { SensorReadResult } from "../data/SensorReadResult";
import { SensorDecodedValue } from "../data/SensorDecodedValue";

export class NewSensorDecoder extends SerialDecoder {
    async decode(rawValues: SerialRawValue[]): Promise<SensorReadResult | null> {
        // Your decoding logic here
        const decodedValue: SensorDecodedValue = {
            label: "NewSensor",
            value: rawValues[0].value,
            unit: "units"
        };

        return {
            sensorType: "New Sensor",
            decodedValues: [decodedValue]
        };
    }
}
```

2. **Register in factory:**
```typescript
// src/service/SerialDecoderFactory.ts
import { NewSensorDecoder } from "../decoder/SerialNewSensorDecoder";

// Add to factory methods
static createDecoder(type: SENSOR_TYPE): SerialDecoder {
    switch (type) {
        // ... existing cases
        case SENSOR_TYPE.NEW_SENSOR:
            return new NewSensorDecoder();
    }
}
```

3. **Build:**
```bash
npm run build
```

### Modify Existing Functionality

1. **Edit the TypeScript file:**
```typescript
// src/service/SerialService.ts
// Make your changes
```

2. **Type check:**
```bash
npm run lint
```

3. **Build:**
```bash
npm run build
```

4. **Test:**
```bash
npm run serve
```

## 🔧 Configuration

### TypeScript (tsconfig.json)
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ES2020",
    "lib": ["ES2020", "DOM"]
  }
}
```

### Build (build.mjs)
Customize the esbuild configuration:
- Change bundle size
- Add/remove features
- Modify output format
- Add plugins

## 📤 Publishing

### To NPM
```bash
# 1. Update version
npm version patch  # or minor, or major

# 2. Build (happens automatically)
npm publish
```

### To GitHub
```bash
git add .
git commit -m "Update library"
git push origin main

# Create release
git tag v2.0.0
git push origin v2.0.0
```

## 🐛 Troubleshooting

### Build Errors

**"Cannot find module"**
```bash
npm install
```

**TypeScript errors**
```bash
npm run lint
# Fix errors in source files
```

**Build fails**
```bash
npm run clean
npm install
npm run build
```

### Development Issues

**Changes not reflected**
- Make sure you're editing files in `src/` not `dist/`
- Run `npm run build` after changes
- Or use `npm run build:watch` for auto-rebuild

**Server not starting**
```bash
npm install http-server -g
npm run serve
```

## 📚 Documentation

- **API Reference:** See `dist/README.md` after building
- **Migration Guide:** See `dist/MIGRATION.md`
- **Sensor Behaviors:** See `dist/SENSOR_BEHAVIORS.md`
- **Quick Start:** See `dist/QUICKSTART.md`

## 🔍 Code Quality

### Type Checking
```bash
npm run lint
```

### Manual Testing
```bash
npm run dev
# Open http://localhost:8080
# Test with actual sensors
```

## 💡 Tips

1. **Use watch mode** during development: `npm run build:watch`
2. **Commit source files**, not `dist/` (add to `.gitignore`)
3. **Test in real browsers** (Chrome, Edge) - Web Serial API required
4. **Update version** in `package.json` before publishing
5. **Document changes** in comments and README

## 🆘 Need Help?

- Check `dist/README.md` for API documentation
- Read `SENSOR_BEHAVIORS.md` for sensor-specific info
- Check TypeScript errors with `npm run lint`
- Test locally with `npm run dev`

## 📄 License

ISC License

---

**Happy coding! 🚀**

Edit the TypeScript source, build, and publish!
