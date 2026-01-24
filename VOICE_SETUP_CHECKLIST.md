# Voice Command Setup - Quick Checklist

Complete these steps to enable "Hey Echo" voice commands in VR mode:

## ☐ Step 1: Get Picovoice Access Key

- [ ] Go to https://console.picovoice.ai/
- [ ] Sign up or log in
- [ ] Copy your Access Key

## ☐ Step 2: Configure Environment

- [ ] Open `.env` file
- [ ] Replace `YOUR_ACCESS_KEY_HERE` with your actual access key
- [ ] Save the file

## ☐ Step 3: Add Model Files

- [ ] Download your Hey-Echo model file (.ppn) from Picovoice Console
- [ ] Download `porcupine_params.pv` from [Porcupine GitHub](https://github.com/Picovoice/porcupine/tree/master/lib/common)
- [ ] Place both files in `public/models/` directory:
  - `public/models/Hey-Echo_en_wasm_v3_0_0.ppn`
  - `public/models/porcupine_params.pv`

## ☐ Step 4: Update File Path (if needed)

If your .ppn file has a different name:

- [ ] Open `src/pages/VRViewerPage.tsx`
- [ ] Find line ~63: `publicPath: "/models/Hey-Echo_en_wasm_v3_0_0.ppn"`
- [ ] Update filename to match your actual file

## ☐ Step 5: Build and Test

```bash
npm run build
npm run preview
```

- [ ] Open on mobile device
- [ ] Navigate to a property's VR view
- [ ] Grant motion sensor permission
- [ ] Check browser console for: "✅ Voice commands initialized"
- [ ] Say "Hey Echo" clearly
- [ ] Verify it advances to next panoramic image

## Verification

### Console should show:

```
🎤 Initializing voice commands with Hey-Echo...
✅ Voice commands initialized - Say 'Hey Echo' to navigate
```

### When you say "Hey Echo":

```
🎤 Voice command detected: hey-echo
```

## Troubleshooting

**No console messages:**

- Check that motion controls are enabled (not touch mode)
- Verify you're in landscape mode on mobile
- Check access key is correct

**"Failed to load keyword model":**

- Verify file path and filename match exactly
- Ensure files are in `public/models/` not `src/models/`
- Rebuild after adding files

**Voice not detecting:**

- Increase sensitivity in VRViewerPage.tsx (line ~65): `sensitivity: 0.75`
- Test in quiet environment
- Speak clearly and at normal volume

## What's Next?

Once working, you can:

- Add more wake words for different actions (previous, back, etc.)
- Adjust sensitivity for your environment
- Create custom wake words for your brand

See `VOICE_COMMANDS_SETUP.md` for detailed instructions and customization options.
