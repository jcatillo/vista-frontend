# Voice Commands Setup for VR Mode - Chrome Web Speech ("Hey Echo")

## Overview

Voice commands use the built-in Chrome Web Speech API to detect the phrase "Hey Echo". Say "Hey Echo" while in VR mode to navigate to the next panoramic view hands-free.

## Setup Instructions

1. No external keys or model files needed.
2. Serve the app over HTTPS or `http://localhost` (required for microphone access).
3. Open the VR view, tap "Enable Voice" to grant mic access, then say "Hey Echo".

### User Flow (Mobile):

1. Open property VR view on mobile
2. Grant motion sensor permission
3. Phone switches to landscape mode
4. Tap "Enable Voice" to grant microphone access
5. Say "Hey Echo" to navigate
6. Microphone indicator shows listening status

### User Flow (Desktop):

1. Open property VR view in a desktop browser
2. Tap/click "Enable Voice" to grant microphone access
3. Say "Hey Echo" to navigate
4. Microphone indicator shows listening status

### Chrome Web Speech

- Uses the browser’s SpeechRecognition (webkitSpeechRecognition in Chrome).
- You must tap "Enable Voice" to start listening.
- Requires a secure context (HTTPS or localhost).
- Works best in Chrome (desktop or Android Chrome).
- Detections show under "Last" in the debug box.

## Voice Command Features

✅ **Hands-Free**: Perfect for VR boxes where you can't touch the screen  
✅ **Auto-Activation**: Starts when motion controls are enabled  
✅ **Visual Feedback**: Microphone icon shows listening status  
✅ **Activity Animation**: Pulses when command detected  
✅ **Motion-Only**: Disabled in touch/drag mode (only VR mode)

## Customizing

- You can change the trigger phrase check in `VRViewerPage.tsx` (Web Speech section). Default is `transcript.includes('hey echo')`.

### Use Base64 Instead of Public Path

If you prefer to embed the model files, convert them to base64:

```bash
npx pvbase64 -i Hey-Echo_en_wasm_v3_0_0.ppn -o keyword-base64.js -n KEYWORD_BASE64
```

Then in your code:

```typescript
import { KEYWORD_BASE64 } from "./keyword-base64";

const porcupineKeyword = {
  base64: KEYWORD_BASE64, // Instead of publicPath
  label: "hey-echo",
};
```

## Troubleshooting

### Voice Commands Not Working

1. ✅ Check console logs for initialization messages
2. ✅ Verify access key is correct in `.env`
3. ✅ Confirm model files are in `public/models/`
4. ✅ Ensure microphone permission is granted
5. ✅ Test in quiet environment

### Model File Not Found

```
Error: Failed to load keyword model
```

- Verify file path matches exactly: `/models/Hey-Echo_en_wasm_v3_0_0.ppn`
- Check file exists in `public/models/` directory
- Rebuild after adding files

### Sensitivity Issues

- **Too sensitive** (false positives): Lower sensitivity to 0.5 or 0.4
- **Not sensitive enough** (misses commands): Raise sensitivity to 0.7 or 0.8
- **Optimal range**: 0.6 - 0.7 for most environments

### Browser Console Errors

- `AccessKey invalid`: Get a new key from Picovoice Console
- `WebAssembly not supported`: Use a modern browser (Chrome, Edge, Safari)
- `Microphone blocked`: Grant microphone permissions in browser settings

### Microphone Permissions & HTTPS

- Browsers require a secure context for microphone access.
- Works on `https://...` and `http://localhost` (localhost is treated as secure).
- If you access via LAN IP (e.g., `http://192.168.x.x:5173`), mic will be blocked.
- Use one of:
  - `npm run dev` on the device with `localhost` via a reverse proxy (e.g., `ngrok`), or
  - Start Vite with HTTPS certificates, or
  - Deploy to an HTTPS domain.
- On iOS Safari, microphone often requires a user gesture. Tap "Enable Voice" when prompted.
- If denied, go to iOS Settings → Safari → Microphone and allow for your site.

## Notes

- Requires HTTPS or localhost for mic access.
- On iOS Safari, the Web Speech API is limited; use Chrome on Android or desktop Chrome for best results.

## Testing Checklist

- [ ] Access key added to `.env`
- [ ] Model files in `public/models/`
- [ ] App builds without errors
- [ ] Motion controls granted on mobile
- [ ] Microphone indicator visible
- [ ] "Hey Echo" triggers navigation
- [ ] Works in landscape mode
- [ ] VR stereoscopic rendering active

## Free Tier Limits

Picovoice free tier:

- ✅ Unlimited on-device wake word detection
- ✅ No API calls or cloud processing
- ✅ Perfect for production use
- ✅ All models work locally in browser

See [Picovoice Pricing](https://picovoice.ai/pricing/) for enterprise features.

## Additional Resources

- [Porcupine Documentation](https://picovoice.ai/docs/quick-start/porcupine-react/)
- [Create Custom Wake Words](https://console.picovoice.ai/)
- [Porcupine GitHub](https://github.com/Picovoice/porcupine)
- [React Demo](https://github.com/Picovoice/porcupine/tree/master/demo/react)
