# VIMS Admin Portal - Architecture Documentation

## System Overview

The VIMS Admin Portal is a React-based web application for managing vehicle inspection operations, monitoring centers, detecting fraud, and generating comprehensive reports.

---

## Technology Stack

### Frontend
- **Framework**: React 18+
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Routing**: React Router
- **State Management**: React Context API
- **Icons**: Lucide React

### Key Libraries
- `recharts`: Chart visualization
- `react-router-dom`: Client-side routing
- `leaflet`: Map integration for geofencing

---

## Application Architecture

### Component Structure

```
admin-portal/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Header.jsx      # Top navigation bar with notifications
│   │   ├── Sidebar.jsx     # Collapsible navigation sidebar
│   │   └── MapPicker.jsx   # Interactive map for geofencing
│   │
│   ├── context/            # React Context providers
│   │   ├── AuthContext.jsx           # Authentication state
│   │   ├── CentersContext.jsx        # Center management state
│   │   └── NotificationContext.jsx    # Notification system state
│   │
│   ├── pages/              # Page components
│   │   ├── Dashboard.jsx              # Main dashboard
│   │   ├── reports/
│   │   │   └── ReportsAnalytics.jsx   # Reports & analytics
│   │   ├── security/
│   │   │   └── Security.jsx            # Security & audit logs
│   │   ├── inspections/
│   │   │   └── InspectionDetail.jsx    # Inspection detail view
│   │   ├── centers/
│   │   │   ├── CenterList.jsx          # Center listing
│   │   │   └── CenterDetail.jsx       # Center configuration
│   │   └── ...
│   │
│   ├── utils/              # Utility functions
│   │   ├── fraudDetection.js          # Fraud detection algorithms
│   │   └── fraudNotificationService.js  # Notification generation
│   │
│   ├── data/               # Mock data (temporary)
│   │   ├── mockInspections.js
│   │   ├── mockCenters.js
│   │   ├── mockUsers.js
│   │   ├── mockReports.js
│   │   └── mockSecurity.js
│   │
│   └── layouts/
│       └── MainLayout.jsx  # Main application layout
```

---

## Core Features Implemented

### 1. Dashboard
- **Real-time Metrics**: Total inspections, pass/fail counts, revenue
- **Time Range Filtering**: Today, This Week, This Month, This Year
- **Payment Filter**: Filter inspections by payment status
- **Recent Inspections Table**: Searchable, paginated inspection list
- **Charts**: Inspections over time, Revenue trends
- **System Monitoring**: Center status, alerts, geofencing status

### 2. Fraud Detection System
- **Geofence Violation Detection**: 
  - Calculates distance between inspection location and center
  - Triggers alert if outside defined radius
- **Vehicle Presence Violation Detection**:
  - Checks for missing photos
  - Checks for missing machine results
  - Checks for suspicious timing
- **Automatic Notification Generation**: Creates in-app notifications for violations

### 3. Notification System
- **Real-time Notifications**: In-app notification bell with unread count
- **Notification Types**: 
  - Geofence violations
  - Vehicle presence violations
  - System alerts
- **Notification Management**: Mark as read, dismiss, view history

### 4. Reports & Analytics
- **Overview Tab**: 
  - Key metrics cards
  - Fraud trend chart (7/30/90 days)
  - Regional performance table
- **Revenue Reports**: Daily revenue breakdown with export
- **Inspection Analytics**: Pass rates, statistics
- **Fraud Alerts**: List of fraud alerts with export
- **Scheduled Reports**: Create and manage automated report schedules

### 5. Security & Audit
- **Audit Logs**: Complete trail of user actions
- **Access Logs**: Session tracking and access history
- **Security Alerts**: Suspicious activity detection
- **Security Settings**: Password policy, session management, IP whitelist
- **Export Functionality**: CSV export for all logs

### 6. Center Management
- **Center Registry**: List all inspection centers
- **Geo-fencing Configuration**: Interactive map to set center boundaries
- **Machine Status Monitoring**: Real-time machine connectivity status
- **Center Details**: Full center profile and configuration

### 7. Inspection Operations
- **Inspection Detail View**: 
  - Vehicle and owner information
  - Machine test results
  - Visual inspection evidence with photos
  - Video evidence playback
  - Location verification on map
  - Print functionality
- **Search & Filter**: Search by plate, VIN, inspector name

---

## Data Flow Architecture

### Fraud Detection Flow

```
Inspection Created/Updated
    ↓
Fraud Detection Service
    ├─→ Check Geofence (calculate distance)
    ├─→ Check Vehicle Presence (photos, results, timing)
    └─→ Generate Alerts
            ↓
    Notification Context
            ↓
    In-App Notification Display
```

### Notification Flow

```
Event Triggered (Fraud, System Alert, etc.)
    ↓
Notification Service
    ↓
Notification Context (State Management)
    ↓
Header Component (Display Bell Icon)
    ↓
Notification Dropdown (Show List)
```

### Report Generation Flow

```
User Requests Export
    ↓
Data Transformation (CSV Format)
    ↓
Blob Creation
    ↓
Download Trigger
```

---

## State Management

### Context Providers

1. **AuthContext**: 
   - Current user information
   - Authentication status
   - Role-based permissions

2. **CentersContext**:
   - List of all centers
   - Center CRUD operations
   - LocalStorage persistence

3. **NotificationContext**:
   - Notification list
   - Unread count
   - Notification actions (add, mark read, remove)
   - LocalStorage persistence

---

## Security Features

### Authentication & Authorization
- Role-based access control (RBAC)
- Scope-based data filtering (National, Regional, Center)
- PII (Personally Identifiable Information) protection for Viewer role

### Audit & Compliance
- Complete audit trail of all actions
- IP address tracking
- Session monitoring
- Access log history

### Fraud Prevention
- Geofence validation
- Vehicle presence verification
- Machine serial number whitelisting
- Duplicate inspection detection

---

## API Integration Points (Future)

The current implementation uses mock data. Future API integration points:

1. **Inspection API**: `/api/inspections`
2. **Center API**: `/api/centers`
3. **User API**: `/api/users`
4. **Report API**: `/api/reports`
5. **Security API**: `/api/security`
6. **Notification API**: `/api/notifications`

---

## Performance Considerations

1. **Memoization**: Heavy use of `useMemo` for filtered data and calculations
2. **Pagination**: Large datasets paginated (5 items per page default)
3. **Lazy Loading**: Components loaded on demand
4. **LocalStorage**: State persistence for centers and notifications

---

## Deployment

### Build Process
```bash
npm run build
```

### Output
- Production build in `dist/` directory
- Optimized assets
- Code splitting enabled

---

## Environment Variables (Future)

```env
VITE_API_BASE_URL=https://api.vims.gov.et
VITE_MAP_API_KEY=your_map_api_key
VITE_NOTIFICATION_SERVICE_URL=wss://notifications.vims.gov.et
```

---

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

## Known Limitations

1. **Mock Data**: Currently uses mock data files instead of real API
2. **No Backend**: All data stored in localStorage (temporary)
3. **No Real-time Updates**: Data updates require page refresh
4. **No Authentication**: User authentication not fully implemented
5. **No Video Storage**: Video evidence uses placeholder URLs

---

## Future Enhancements

1. **Backend Integration**: Connect to REST API
2. **Real-time Updates**: WebSocket integration for live data
3. **Advanced Filtering**: More filter options and saved filters
4. **Bulk Operations**: Bulk actions on inspections
5. **Advanced Analytics**: More chart types and insights
6. **Export Formats**: PDF, Excel export options
7. **Email Integration**: Send scheduled reports via email
8. **Mobile Responsiveness**: Enhanced mobile experience

