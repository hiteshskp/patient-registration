# Patient Registration App

A modern patient registration application built with React and PGlite, featuring real-time synchronization and offline-first capabilities.

## Features

- 📝 Patient Registration Form with enhanced validation
  - Name validation: letters, spaces, dots, and hyphens only
  - Age validation: 0-99 years, numeric only
  - Mobile number validation: exactly 10 digits
  - Real-time input sanitization
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

### Form Validation Rules

The application implements the following validation rules:

1. **Patient Name**
   - Allowed: letters, spaces, dots, and hyphens
   - Not allowed: numbers, special characters
   - Real-time sanitization of invalid characters

2. **Age**
   - Must be between 0-99
   - Numbers only
   - Maximum 2 digits

3. **Mobile Number**
   - Exactly 10 digits
   - Numbers only
   - Real-time formatting

### Important Notes

- The application uses WebAssembly for database operations
- IndexedDB is used for persistent storage
- BroadcastChannel API enables multi-tab synchronization

## Troubleshooting

If you encounter issues:
1. Verify input matches validation requirements
2. Clear browser cache and IndexedDB data
3. Ensure WebAssembly is supported in your browser
4. Check console for detailed error messages

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13.1+
- Edge 80+

Requirements:
- WebAssembly enabled
- IndexedDB available
- JavaScript modules supported
