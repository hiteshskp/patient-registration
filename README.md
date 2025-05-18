# Patient Registration Application

A modern, frontend-only patient registration system built with React and PGlite for data storage.

🌐 **Live Demo**: [Visit Application](https://patient-registration-mu.vercel.app)

## Features

- 🏥 Patient Registration Form
  - Input validation
  - Real-time feedback
  - Automatic data persistence
  - Loading and error states

- 📊 SQL Query Console
  - Raw SQL query execution
  - Results table with sorting
  - Query history
  - CSV export functionality

- 💾 Data Persistence
  - IndexedDB storage using PGlite
  - WebAssembly-powered database
  - Data survives page refreshes
  - Proper database schema
  - Robust error handling

- 🔄 Multi-tab Synchronization
  - Real-time updates across tabs
  - Synchronized database operations
  - Consistent data state
  - BroadcastChannel API

- 🎨 Modern UI/UX
  - Dark/Light theme support
  - Responsive design
  - Toast notifications
  - Loading states
  - Error boundaries

## Tech Stack

- React + Vite
- PGlite (WebAssembly-based SQLite)
- IndexedDB for persistence
- BroadcastChannel API for tab synchronization
- Modern CSS-in-JS styling

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/patient-registration.git
   cd patient-registration
   ```

2. Install dependencies:
   ```bash
   cd patient-registration-app
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open http://localhost:5173 in your browser

## Usage Guide

### Patient Registration

1. Navigate to "Register Patient Form"
2. Fill in the required fields:
   - Patient Name
   - Age
   - Gender
   - Contact Details (optional)
3. Click Submit
4. Look for the success notification

### SQL Console

1. Navigate to "SQL Console"
2. Enter your SQL query (e.g., `SELECT * FROM patients;`)
3. Click Execute
4. View results in the table below
5. Export results to CSV if needed

### Multi-tab Usage

1. Open the application in multiple tabs
2. Make changes in one tab
3. See real-time updates in other tabs
4. Use different views simultaneously

## Development Challenges & Solutions

1. **Database Initialization**
   - Challenge: Reliable WebAssembly database setup
   - Solution: Implemented robust initialization with proper error handling

2. **Multi-tab Synchronization**
   - Challenge: Keeping data consistent across tabs
   - Solution: BroadcastChannel API with error handling and state management

3. **Loading States**
   - Challenge: Smooth user experience during async operations
   - Solution: Added loading indicators and error boundaries

4. **Browser Compatibility**
   - Challenge: WebAssembly and IndexedDB support
   - Solution: Added browser checks and fallback mechanisms

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

Requirements:
- WebAssembly support
- IndexedDB availability
- JavaScript modules support

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details

## Deployment

This application is deployed on Vercel. To deploy your own instance:

1. Fork this repository
2. Sign up for a [Vercel account](https://vercel.com)
3. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```
4. Login to Vercel:
   ```bash
   vercel login
   ```
5. Deploy:
   ```bash
   vercel --prod
   ```

The application will be deployed and you'll receive a unique URL for your instance.
