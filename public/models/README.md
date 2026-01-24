# Porcupine Model Files

This directory contains the model files needed for voice command functionality.

## Required Files

### 1. Hey-Echo_en_wasm_v3_0_0.ppn

Your custom wake word model file trained with "Hey Echo". This should have been downloaded when you created the custom keyword in the Picovoice Console.

**How to get it:**

1. Go to [Picovoice Console](https://console.picovoice.ai/)
2. Navigate to "Wake Word" → "Porcupine"
3. Find your "Hey-Echo" keyword
4. Download the **Web (WASM)** version (.ppn file)
5. Place it in this directory

### 2. porcupine_params.pv

The Porcupine language model file for English.

**How to get it:**

1. Visit the [Porcupine GitHub Repository](https://github.com/Picovoice/porcupine/tree/master/lib/common)
2. Download `porcupine_params.pv` (English model)
3. Place it in this directory

**Alternative:** For other languages, download the corresponding `.pv` file from the same GitHub location.

## File Structure

After adding the files, this directory should look like:

```
public/models/
├── README.md (this file)
├── Hey-Echo_en_wasm_v3_0_0.ppn
└── porcupine_params.pv
```

## Verification

To verify the files are correctly placed, check the browser console when loading the VR view. You should see:

```
🎤 Initializing voice commands with Hey-Echo...
✅ Voice commands initialized - Say 'Hey Echo' to navigate
```

## Troubleshooting

**Error: "Failed to load keyword model"**

- Ensure the filename matches exactly: `Hey-Echo_en_wasm_v3_0_0.ppn`
- Check that the file is in `public/models/` (not `src/models/`)
- Rebuild the application after adding files

**Error: "Failed to load model"**

- Download the correct `.pv` file for your language
- Ensure filename is `porcupine_params.pv`
- Check file is not corrupted (should be several MB)

## Security Note

These model files are safe to commit to version control as they don't contain sensitive information. However, **never commit your Picovoice Access Key** - keep it in the `.env` file only.
