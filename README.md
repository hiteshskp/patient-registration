# Patient Registration Application

A modern, frontend-only patient registration system built with React and PGlite for data storage.

🌐 **Live Demo**: [Visit Application](https://patient-registration-mu.vercel.app)

## Features

- 🏥 Patient Registration Form
  - **Enhanced Input Validation**
    - Name: Only allows letters, spaces, dots, and hyphens
    - Age: Numeric only, limited to 2 digits (0-99)
    - Mobile Number: Exactly 10 digits, numeric only
    - Real-time validation with immediate feedback
  - Automatic data persistence
  - Loading and error states
  - Form field sanitization

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
   - Patient Name (letters, spaces, dots, and hyphens only)
   - Age (0-99)
   - Gender (Male/Female)
   - Contact Details (10-digit mobile number)
3. Click Submit
4. Look for the success notification

### SQL Console

1. Navigate to "SQL Console"
2. Enter your SQL query (e.g., `SELECT * FROM patients;`)
3. Click Execute
4. View results in the table below
5. Export results to CSV if needed

### Multi-tab Usage

The application supports real-time synchronization across multiple tabs:
1. Open the application in multiple tabs
2. Make changes in one tab
3. See the changes reflect automatically in other tabs
4. Last sync time is displayed for reference

## Recent Updates

### Version 1.1.0
- Added enhanced input validation for patient registration
- Fixed mobile number validation (10 digits only)
- Fixed name field validation (no special characters)
- Fixed age input validation (2 digits max)
- Improved real-time validation feedback
- Updated documentation

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13.1+
- Edge 80+

## Troubleshooting

If you encounter issues:
1. Clear browser cache and IndexedDB data
2. Ensure WebAssembly is supported in your browser
3. Check console for detailed error messages
4. Verify input format matches validation requirements

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

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
