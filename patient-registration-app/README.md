# Patient Registration App

A modern patient registration application built with React and PGlite, featuring real-time synchronization and offline-first capabilities.

## Features

- 📝 Patient Registration Form with validation
- 💾 Local database using PGlite/IndexedDB
- 🔄 Real-time multi-tab synchronization
- 📊 SQL Console for direct database access
- 📥 CSV export functionality
- 🌓 Dark/Light theme support
- ⚡ Fast and responsive UI

## Development

### Prerequisites

- Node.js 16+
- npm or yarn

### Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

### Important Notes

- The application uses WebAssembly for database operations
- IndexedDB is used for persistent storage
- BroadcastChannel API enables multi-tab synchronization

## Troubleshooting

If you encounter a blank page:
1. Clear browser cache and IndexedDB data
2. Ensure WebAssembly is supported in your browser
3. Check console for detailed error messages

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13.1+
- Edge 80+

For older browsers, please ensure:
- WebAssembly is enabled
- IndexedDB is available
- JavaScript modules are supported
