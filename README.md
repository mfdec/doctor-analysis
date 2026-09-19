# MedScript Analytics - Desktop Application

A standalone desktop GUI application for researching doctor prescription patterns in Ontario, Canada. This app runs completely **offline** with no web dependencies or internet connection required.

![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-blue)
![Electron](https://img.shields.io/badge/Electron-28+-47848F?logo=electron)

## 🏥 Features

- **100% Offline** — Runs entirely on your local machine, no internet needed
- **Native Desktop GUI** — Built with Electron for a native desktop experience
- **Doctor Search** — Enter a doctor's name to find their profile
- **Medication Analysis** — Analyze prescription likelihood for any medication
- **Local Data Sources** — CPSO registry, patient reviews, prescribing patterns
- **Privacy First** — All data stays on your machine
- **Custom Menus** — Native menu bar with keyboard shortcuts

## 📋 Supported Medication Categories

| Category | Examples |
|----------|----------|
| Stimulants | Adderall, Ritalin, Vyvanse, Concerta |
| Opioids | Oxycodone, Tramadol, Morphine |
| Benzodiazepines | Xanax, Valium, Ativan |
| Antidepressants | Zoloft, Prozac, Lexapro |
| Medical Cannabis | Cannabis, THC, CBD |
| Hormones | Testosterone, Estrogen |
| Weight Loss | Ozempic, Wegovy, Saxenda |
| And many more... | |

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org))
- **npm** 9+

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Build the Desktop App

```bash
# Build for your current platform
node build-desktop.js

# Or specify a platform
node build-desktop.js windows   # Windows (.exe)
node build-desktop.js mac       # macOS (.dmg)
node build-desktop.js linux     # Linux (.AppImage/.deb)
```

The built executable will be in the `release/` directory.

### Step 3: Run in Development Mode (Optional)

```bash
# Start with dev tools open
node run-electron.js --dev

# Or start in production mode
node run-electron.js
```

## 🖥️ Desktop Features

### Application Menu

| Menu | Shortcut | Action |
|------|----------|--------|
| File → New Search | `Ctrl+N` / `Cmd+N` | Start a new search |
| File → Exit | `Ctrl+Q` / `Cmd+Q` | Quit application |
| View → Reload | `Ctrl+R` / `Cmd+R` | Reload the application |
| View → Toggle DevTools | `Ctrl+Shift+I` | Open developer tools |
| View → Fullscreen | `F11` | Toggle fullscreen |

### Window Controls

- Resizable window (minimum 900×600)
- Native title bar and controls
- Custom application icon

## 📁 Project Structure

```
medscript-analytics/
├── electron/
│   ├── main.js              # Electron main process
│   └── preload.js           # Security preload script
├── src/
│   ├── App.tsx              # Main React application
│   ├── components/
│   │   ├── SearchForm.tsx       # Doctor & medication input
│   │   ├── ScrapingAnimation.tsx # Analysis progress UI
│   │   └── Results.tsx          # Results display
│   └── utils/
│       └── doctorAnalysis.ts    # Analysis engine
├── build-desktop.js         # Desktop build script
├── run-electron.js          # Electron launcher
├── electron-builder.json    # Build configuration
├── index.html               # HTML entry point
└── package.json
```

## 🔧 Manual Build Steps

If you prefer to build manually:

```bash
# 1. Build the React frontend
npm run build

# 2. Package with Electron Builder
npx electron-builder --config electron-builder.json

# 3. Find your executable in ./release/
```

## ⚙️ Configuration

### Custom Icon

To add a custom application icon:

1. Create your icon files:
   - `build/icon.ico` (Windows, 256×256)
   - `build/icon.icns` (macOS)
   - `build/icon.png` (Linux, 512×512)

2. Rebuild the application

### Custom Data

The analysis engine in `src/utils/doctorAnalysis.ts` can be customized to include your own local data sources.

## ⚠️ Disclaimer

This tool is for **informational purposes only** and does not constitute medical advice. Results are generated from local data analysis and should not be relied upon for medical decisions. Always consult directly with healthcare professionals. This application does not access private medical records.

## 📄 License

MIT
