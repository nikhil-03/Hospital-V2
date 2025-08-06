# Hospital Management System

A modern, comprehensive hospital management application built with React, TypeScript, Redux RTK, and Tailwind CSS.

## Features

### 🏥 Core Functionality

- **Dashboard**: Overview with statistics, recent appointments, and top performing doctors
- **Doctor Management**: Add, view, and manage doctors with their specializations and schedules
- **Patient Management**: Complete patient records with medical history and emergency contacts
- **Appointment Booking**: Schedule and manage patient appointments with doctors
- **Prescription Management**: Create and track prescriptions with medicines and tests
- **Billing System**: Comprehensive billing with payment tracking
- **Laboratory Tests**: Manage medical tests and results

### 🎨 Modern UI/UX

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Modern Interface**: Clean, professional design with smooth animations
- **Intuitive Navigation**: Easy-to-use sidebar navigation
- **Real-time Updates**: Live status updates and notifications
- **Search & Filter**: Advanced search and filtering capabilities

### 🔧 Technical Features

- **TypeScript**: Full type safety and better development experience
- **Redux RTK**: State management with async thunks and slices
- **React Router**: Client-side routing with protected routes
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **Lucide React**: Beautiful, customizable icons
- **Mock Data**: Comprehensive mock data for demonstration

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd hospital
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Demo Credentials

- **Email**: `admin@hospital.com`
- **Password**: `password`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.tsx      # Main layout with sidebar and header
│   ├── Header.tsx      # Top navigation bar
│   ├── Sidebar.tsx     # Sidebar navigation
│   └── ProtectedRoute.tsx # Authentication wrapper
├── pages/              # Page components
│   ├── Dashboard.tsx   # Main dashboard
│   ├── Doctors.tsx     # Doctor management
│   ├── Patients.tsx    # Patient management
│   ├── Appointments.tsx # Appointment booking
│   ├── Prescriptions.tsx # Prescription management
│   ├── Billing.tsx     # Billing system
│   ├── Tests.tsx       # Laboratory tests
│   └── Login.tsx       # Authentication page
├── store/              # Redux store configuration
│   ├── index.ts        # Store setup
│   └── slices/         # Redux slices
│       ├── authSlice.ts
│       ├── doctorSlice.ts
│       ├── patientSlice.ts
│       ├── appointmentSlice.ts
│       ├── prescriptionSlice.ts
│       └── billingSlice.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── hooks/              # Custom React hooks
│   └── redux.ts        # Redux hooks
└── App.tsx            # Main application component
```

## Key Features Explained

### 🏥 Dashboard

- **Statistics Overview**: Total doctors, patients, appointments, and revenue
- **Recent Activity**: Latest appointments and their status
- **Quick Stats**: Pending appointments, completed visits, and revenue metrics
- **Top Doctors**: Display of best-performing doctors with ratings

### 👨‍⚕️ Doctor Management

- **Doctor Profiles**: Complete information including specialization, experience, and availability
- **Search & Filter**: Find doctors by name, specialization, or availability
- **Booking System**: Direct appointment booking with time slot selection
- **Rating System**: Doctor ratings and patient feedback

### 👥 Patient Management

- **Patient Records**: Comprehensive patient information including medical history
- **Emergency Contacts**: Quick access to emergency contact information
- **Medical History**: Track of previous conditions and treatments
- **Allergies**: Important allergy information for safe treatment

### 📅 Appointment System

- **Booking Interface**: Easy appointment scheduling with available time slots
- **Status Tracking**: Real-time status updates (scheduled, confirmed, completed, cancelled)
- **Symptom Recording**: Patient symptoms and doctor notes
- **Diagnosis Tracking**: Medical diagnosis and treatment plans

### 💊 Prescription Management

- **Medicine Prescriptions**: Detailed medicine information with dosage and instructions
- **Test Orders**: Laboratory test requests with preparation instructions
- **Status Tracking**: Track medicine dispensation and test completion
- **Doctor Notes**: Comprehensive medical notes and recommendations

### 💰 Billing System

- **Itemized Bills**: Detailed breakdown of consultation, medicines, and tests
- **Payment Tracking**: Track payment status (pending, partial, paid)
- **Revenue Analytics**: Total revenue, paid amounts, and pending payments
- **Payment Actions**: Mark payments as complete or partial

### 🧪 Laboratory Tests

- **Test Management**: Track test requests and their status
- **Result Recording**: Record and display test results
- **Preparation Instructions**: Clear instructions for test preparation
- **Status Updates**: Real-time test status updates

## Technology Stack

- **Frontend**: React 19 with TypeScript
- **State Management**: Redux Toolkit (RTK)
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Package Manager**: npm/yarn

## Future Enhancements

### 🔮 Planned Features

- **Real-time Chat**: Doctor-patient communication
- **Video Consultations**: Telemedicine capabilities
- **Inventory Management**: Medicine and equipment tracking
- **Advanced Analytics**: Detailed reporting and analytics
- **Mobile App**: React Native mobile application
- **Backend Integration**: Connect to real backend APIs
- **Payment Gateway**: Online payment processing
- **Email Notifications**: Automated appointment reminders
- **File Upload**: Medical reports and documents
- **Multi-language Support**: Internationalization

### 🚀 Performance Optimizations

- **Code Splitting**: Lazy loading for better performance
- **Caching**: Redux persistence for offline support
- **Image Optimization**: Optimized images and lazy loading
- **Bundle Optimization**: Tree shaking and code splitting

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@hospital.com or create an issue in the repository.

---

**Built with ❤️ for modern healthcare management**
