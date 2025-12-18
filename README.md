# VIMS Admin Portal

Vehicle Inspection Management System - Admin Portal

## Overview

The VIMS Admin Portal is a comprehensive web application for managing vehicle inspection operations, monitoring inspection centers, detecting fraud, and generating detailed reports and analytics.

## Features

### ✅ Implemented Features

- **Dashboard**
  - Real-time metrics and KPIs
  - Time range filtering
  - Payment status filtering
  - Interactive charts and visualizations
  - System monitoring dashboard

- **Fraud Detection**
  - Geofence violation detection
  - Vehicle presence violation detection
  - Automatic notification generation
  - Fraud trend analysis

- **Notifications**
  - In-app notification system
  - Real-time fraud alerts
  - Notification management (read/unread)
  - Center-specific alert details

- **Reports & Analytics**
  - Overview dashboard with key metrics
  - Fraud trend charts (7/30/90 days)
  - Revenue reports with export
  - Inspection analytics
  - Fraud alerts listing
  - Scheduled report management

- **Security & Audit**
  - Complete audit log trail
  - Access log tracking
  - Security alerts
  - Security settings management
  - CSV export functionality

- **Center Management**
  - Center registry
  - Geo-fencing configuration
  - Machine status monitoring
  - Center detail management

- **Inspection Operations**
  - Detailed inspection view
  - Machine test results
  - Visual evidence with photos
  - Video evidence playback
  - Location verification
  - Print functionality

- **User Management**
  - Role-based access control
  - Regional scoping
  - User administration

## Technology Stack

- **React 18+** - UI Framework
- **Vite** - Build Tool
- **Tailwind CSS** - Styling
- **Recharts** - Data Visualization
- **React Router** - Routing
- **Lucide React** - Icons

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
cd admin-portal
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
admin-portal/
├── src/
│   ├── components/      # Reusable components
│   ├── context/         # React Context providers
│   ├── data/            # Mock data
│   ├── layouts/         # Layout components
│   ├── pages/           # Page components
│   ├── utils/            # Utility functions
│   └── main.jsx         # Entry point
├── public/              # Static assets
└── package.json
```

## Key Modules

### Dashboard
Main dashboard with metrics, charts, and recent inspections.

### Reports & Analytics
Comprehensive reporting with fraud trends, revenue analysis, and scheduled reports.

### Security
Audit logs, access tracking, and security settings.

### Center Management
Manage inspection centers, configure geofencing, and monitor machine status.

### Inspection Operations
View and manage vehicle inspections with detailed evidence.

## Documentation

- [Database Schema & ER Diagram](./DATABASE_SCHEMA.md)
- [Architecture Documentation](./ARCHITECTURE_DOCUMENTATION.md)

## License

Proprietary - Vehicle Inspection Management System
