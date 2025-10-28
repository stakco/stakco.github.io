# 🔬 Sensor-Specific Behaviors & Data Formats

## VOC (Air Quality) Sensor Behavior

### Warm-Up Period
The VOC sensor requires a **20-second warm-up period** after connection.

### Data Values During Warm-Up
During warm-up, `value.value` returns **strings** (not numbers):
- `"PROCESSING"` - Sensor is warming up
- `"TOO_LOW"` - Reading too low, still warming up
- `"TOO_HIGH"` - Reading too high, still warming up

### Ready State
When ready, `value.value` returns a **number** (VOC level in ppb)

### Example Data Flow
```javascript
// First 20 seconds:
{
  label: "VOC",
  value: "PROCESSING",  // ← String!
  unit: "ppb"
}

// After warm-up:
{
  label: "VOC",
  value: 450.25,  // ← Number!
  unit: "ppb"
}
```

---

## All Sensor Data Formats

### UV (Light) Sensor
```javascript
[
  { label: "UV", value: 2.5, unit: "index" },      // Number
  { label: "Lux", value: 1234.56, unit: "lux" }   // Number
]
```

### Climate (Humidity) Sensor
```javascript
[
  { label: "Temp", value: 23.45, unit: "°C" },    // Number
  { label: "Humidity", value: 65.2, unit: "%" }   // Number
]
```

### Conductivity Sensor
```javascript
[
  { label: "Conductivity", value: 1250.5, unit: "µS/cm" }  // Number
]
```

### Temperature (IR) Sensor
```javascript
[
  { label: "Ambient", value: 22.5, unit: "°C" },       // Number
  { label: "IR Temp", value: 36.8, unit: "°C" }       // Number
]
```

### VOC (Air Quality) Sensor
```javascript
// During warm-up (first ~20 seconds):
[
  { label: "VOC", value: "PROCESSING", unit: "ppb" }  // String!
]

// When ready:
[
  { label: "VOC", value: 450.25, unit: "ppb" }        // Number
]
```

### Heart Rate Sensor
```javascript
[
  { label: "Pulse", value: 72, unit: "BPM" }          // Number
]
```

---

## Handling Mixed Data Types

### ✅ Correct Way (Handle Both)
```javascript
serialService.onSerialData = (result) => {
    result.decodedValues.forEach(sensor => {
        let displayValue;
        
        if (typeof sensor.value === 'number') {
            // Format numbers with decimals
            displayValue = sensor.value.toFixed(2);
        } else {
            // Display strings as-is
            displayValue = sensor.value;
        }
        
        console.log(`${sensor.label}: ${displayValue} ${sensor.unit}`);
    });
};
```

### ❌ Wrong Way (Assumes Always Number)
```javascript
serialService.onSerialData = (result) => {
    result.decodedValues.forEach(sensor => {
        // This will crash with VOC during warm-up!
        console.log(`${sensor.label}: ${sensor.value.toFixed(2)} ${sensor.unit}`);
    });
};
```

---

## VOC Sensor Status Values

| Status | Meaning | Duration |
|--------|---------|----------|
| `"PROCESSING"` | Sensor initializing | First few seconds |
| `"TOO_LOW"` | Reading below threshold | Warm-up period |
| `"TOO_HIGH"` | Reading above threshold | Warm-up period |
| `number` | Valid VOC reading | After ~20 seconds |

---

## Best Practices

### 1. Always Check Data Type
```javascript
if (typeof value.value === 'number') {
    // Safe to use .toFixed()
} else {
    // Handle string or other types
}
```

### 2. Handle VOC Warm-Up Gracefully
```javascript
serialService.onSerialData = (result) => {
    const vocSensor = result.decodedValues.find(v => v.label === 'VOC');
    
    if (vocSensor) {
        if (typeof vocSensor.value === 'string') {
            console.log(`VOC Status: ${vocSensor.value} (warming up...)`);
        } else {
            console.log(`VOC Level: ${vocSensor.value.toFixed(2)} ppb`);
        }
    }
};
```

### 3. Show Status to Users
```javascript
let isWarmingUp = result.decodedValues.some(v => 
    typeof v.value === 'string' && 
    ['PROCESSING', 'TOO_LOW', 'TOO_HIGH'].includes(v.value)
);

if (isWarmingUp) {
    statusDiv.textContent = 'Sensor warming up... please wait';
}
```

---

## Error Prevention

### The Fixed Demo Code
The new `index.html` includes proper handling:

```javascript
values.forEach((value, index) => {
    let displayValue;
    if (typeof value.value === 'number') {
        displayValue = value.value.toFixed(2);
    } else {
        displayValue = value.value; // String or other
    }
    console.log(`${value.label}: ${displayValue} ${value.unit}`);
});
```

This prevents the error:
```
TypeError: value.value.toFixed is not a function
```

---

## Testing Each Sensor

### UV Sensor
- ✅ Always returns numbers
- ✅ No warm-up needed
- ✅ Safe to use `.toFixed()`

### Climate Sensor
- ✅ Always returns numbers
- ✅ No warm-up needed
- ✅ Safe to use `.toFixed()`

### Conductivity Sensor
- ✅ Always returns numbers
- ✅ No warm-up needed
- ✅ Safe to use `.toFixed()`

### Temperature Sensor
- ✅ Always returns numbers
- ✅ No warm-up needed
- ✅ Safe to use `.toFixed()`

### VOC Sensor
- ⚠️ Returns strings during warm-up
- ⚠️ Needs 20-second warm-up
- ⚠️ Must check data type before `.toFixed()`

### Heart Rate Sensor
- ✅ Returns numbers
- ⚠️ Needs external JS dependencies
- ✅ Safe to use `.toFixed()`

---

## Summary

**Only the VOC sensor** returns non-numeric values during its warm-up period. All other sensors always return numbers and are safe to format with `.toFixed()`.

**Solution:** Always check the data type before calling `.toFixed()` on any sensor value.

The updated `index.html` handles this correctly! 🎉
