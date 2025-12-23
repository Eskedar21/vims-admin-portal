# VIMS Admin Portal - Complete Demo Preparation Guide

**Comprehensive Feature Overview & Demo Script**  
**Version: 1.0**  
**Last Updated: 2025**

---

## Table of Contents

1. [Quick Start - Navigation Overview](#quick-start---navigation-overview)
2. [Core Modules & Features](#core-modules--features)
3. [Detailed Feature Walkthrough](#detailed-feature-walkthrough)
4. [Role-Based Access Control](#role-based-access-control)
5. [Demo Script & Talking Points](#demo-script--talking-points)
6. [Key Metrics & KPIs](#key-metrics--kpis)
7. [Common Demo Scenarios](#common-demo-scenarios)
8. [Troubleshooting Tips](#troubleshooting-tips)

---

## Quick Start - Navigation Overview

### Main Navigation Structure

The admin portal has **8 primary sections** accessible from the top navigation:

1. **Dashboard** (`/`) - Home page with real-time metrics
2. **Operations Command Center** (`/operations`) - Real-time monitoring
3. **Inspections** (`/inspection-operations`) - Inspection management
4. **Center Management** (`/center-management`) - Center registry & configuration
5. **Reports & Analytics** (`/reports/*`) - 5 report types
6. **Configuration** (`/configuration/*`) - System configuration
7. **Governance** (`/governance/*`) - Administrative structure
8. **Administration** (`/administration`) - User management
9. **Security** (`/security/*`) - Audit logs & security

### Access by Role

- **All Roles**: Dashboard, Inspections, Reports
- **Admin Roles Only**: Operations, Center Management, Configuration, Governance, Administration, Security
- **Operational Roles**: Operations, Center Management (limited scope)

---

## Core Modules & Features

### 1. Dashboard (`/`)

**Purpose**: Central command center with real-time KPIs and system overview

#### Key Features:
- **Real-time Metrics Cards**:
  - Total Inspections (with trend indicators)
  - Pass/Fail counts and percentages
  - Revenue (ETB)
  - Active Centers
  - Open Incidents
  - Centers Requiring Attention

- **Time Range Filters**:
  - Today
  - Yesterday
  - Last 7 days
  - Last 30 days
  - Custom date range

- **Payment Status Filter**:
  - All
  - Paid
  - Unpaid
  - Partial

- **Interactive Charts**:
  - Inspections over time (Line chart)
  - Revenue trends (Area chart)
  - Pass/Fail breakdown (Bar chart)
  - Regional performance comparison

- **Recent Inspections Table**:
  - Searchable by plate, VIN, inspector
  - Paginated (5 items per page)
  - Sortable columns
  - Quick actions (View, Print)

- **System Monitoring Section**:
  - Center status overview
  - Geofencing status
  - Machine connectivity
  - Alert summary

- **Centers Requiring Attention**:
  - Attention score calculation
  - Top reasons for attention
  - Quick navigation to center details

#### Demo Points:
- Show how metrics update with filters
- Demonstrate chart interactivity (hover tooltips)
- Explain attention score algorithm
- Show scope-based filtering (Regional/National)

---

### 2. Operations Command Center (`/operations`)

**Purpose**: Real-time operational monitoring and incident management

#### Key Features:
- **Dual View Modes**:
  - **Map View**: Geographic visualization of centers
  - **List View**: Tabular center listing

- **Center Status Indicators**:
  - Online (green) - Active within 2 minutes
  - Offline (red) - No activity for 10+ minutes
  - Warning (yellow) - Issues detected
  - Maintenance (gray) - Scheduled maintenance

- **Attention Score System**:
  - Calculated score (0-100) based on:
    - Open incidents count
    - Machine connectivity
    - Recent fraud alerts
    - Inspection throughput
    - Device health
  - Severity buckets: Critical (70+), High (50-69), Medium (30-49), Low (<30)

- **Filtering & Sorting**:
  - By jurisdiction (Region/Zone/Sub-city/Woreda)
  - By status (Online/Offline/Warning)
  - By incident type
  - By date window
  - Sort by: Attention score, Last seen, Incidents, Throughput

- **Center Summary Drawer**:
  - Quick center overview
  - Recent inspections
  - Active incidents
  - Machine status
  - Device health

- **Alert Inbox**:
  - Real-time incident notifications
  - Filter by severity/type
  - Quick actions

- **Auto-refresh**: Updates every 30 seconds

#### Demo Points:
- Switch between Map and List views
- Show attention score calculation
- Demonstrate filtering by jurisdiction
- Open center drawer to show details
- Explain real-time monitoring capabilities

---

### 3. Inspections (`/inspection-operations`)

**Purpose**: Search, view, and manage vehicle inspections

#### Key Features:
- **Inspection Search**:
  - Search by: Plate number, VIN, Chassis, Inspector name
  - Date range filtering
  - Result filter (Pass/Fail/All)
  - Payment status filter

- **Inspection List**:
  - Paginated results
  - Sortable columns
  - Quick view actions

- **Inspection Detail View** (`/inspections/:id`):
  - **Vehicle Information**:
    - Plate, VIN, Chassis, Engine numbers
    - Vehicle type, brand, model
    - Owner details
  
  - **Machine Test Results**:
    - Alignment & Suspension (read-only)
    - Brake tests (Service & Parking)
    - Emissions (Gas Analyzer/Smoke Meter)
    - Headlight tests
    - Overall machine result
  
  - **Visual Inspection**:
    - 30-point checklist results
    - Point scores
    - Pass/Fail status
  
  - **Evidence**:
    - Photo gallery
    - Video playback (if available)
    - Location verification on map
  
  - **Payment Information**:
    - Payment status
    - Transaction ID
    - Amount paid
  
  - **Actions**:
    - Print report
    - Export to PDF
    - Flag for review
    - View audit trail

#### Demo Points:
- Search for specific inspection
- Show machine test data (locked/read-only)
- Display visual evidence (photos/video)
- Demonstrate location verification
- Show print/export functionality

---

### 4. Center Management (`/center-management`)

**Purpose**: Comprehensive center registry and configuration

#### Main Features:

##### 4.1 Center List (`/center-management`)
- **Multi-tab Interface**:
  - Centers tab
  - Users tab (center-specific users)
  - Machines tab (center-specific machines)

- **Center Registry**:
  - Search by name, code, region
  - Filter by: Jurisdiction, Status, Incidents, Device health
  - Sort by: Attention score, Last seen, Throughput
  - Pagination (30 items per page)

- **Center Cards Display**:
  - Center name, code, location
  - Status indicators
  - Attention score with reasons
  - Quick stats (inspections today, open incidents)
  - Action buttons (View, Edit, Configure)

- **Create New Center**:
  - Multi-step form
  - Jurisdiction selection (Region → Zone → Sub-city → Woreda)
  - Contact information
  - Initial configuration

##### 4.2 Center Profile (`/center-management/:id`)
- **Overview Tab**:
  - Center details
  - Contact information
  - Jurisdiction path
  - Status summary

- **Devices Tab** (`/center-management/:id/devices`):
  - Machine registry
  - Device status monitoring
  - Serial number whitelisting
  - Last seen timestamps
  - Health indicators

- **Cameras Tab** (`/center-management/:id/cameras`):
  - Camera registry
  - Camera settings
  - Video recording configuration
  - Evidence linking

- **TeleBirr Setup** (`/center-management/:id/telebirr`):
  - Payment gateway configuration
  - Merchant ID setup
  - Transaction limits
  - Reconciliation settings

- **Geofence Configuration** (`/center-management/:id/geofence`):
  - Interactive map interface
  - Draw geofence boundaries
  - Set radius (meters)
  - Test geofence violations
  - View violation history

- **Device Location Compliance** (`/center-management/:id/device-location`):
  - Device location tracking
  - Compliance monitoring
  - Location history
  - Violation alerts

- **Camera Settings** (`/center-management/:id/camera-settings`):
  - Recording schedules
  - Quality settings
  - Storage configuration
  - Evidence retention policies

#### Demo Points:
- Show center list with filters
- Create a new center (multi-step form)
- Configure geofence on map
- View device registry
- Demonstrate attention score calculation
- Show jurisdiction hierarchy

---

### 5. Reports & Analytics (`/reports/*`)

**Purpose**: Comprehensive reporting and analytics suite

#### Report Types:

##### 5.1 Executive Scorecard (`/reports/scorecard`)
- **Key Metrics Dashboard**:
  - Total inspections
  - Pass rate
  - Revenue
  - Fraud alerts
  - Regional breakdown

- **Performance Indicators**:
  - Trend indicators (↑/↓)
  - Period-over-period comparison
  - Target vs actual

- **Visualizations**:
  - Regional performance heatmap
  - Top performing centers
  - Bottom performing centers

##### 5.2 Trend Analysis (`/reports/trends`)
- **Time Series Charts**:
  - Inspections over time
  - Pass rate trends
  - Revenue trends
  - Cycle time trends

- **Time Range Options**:
  - Last 7 days
  - Last 30 days
  - Last 90 days
  - Last year

- **Metric Selection**:
  - Inspections count
  - Pass rate percentage
  - Revenue (ETB)
  - Cycle time (minutes)

- **Key Insights Panel**:
  - Average trend
  - Peak day
  - Lowest day
  - Seasonal patterns

##### 5.3 Operational Reports (`/reports/operational`)
- **Inspector Performance**:
  - Inspections per inspector
  - Pass/fail rates by inspector
  - Average cycle time
  - Quality scores

- **Center Throughput**:
  - Inspections per center
  - Peak hours analysis
  - Capacity utilization
  - Queue times

- **Machine Performance**:
  - Machine utilization
  - Test accuracy
  - Downtime analysis
  - Maintenance schedules

- **Export Options**:
  - CSV export
  - PDF export
  - Scheduled reports

##### 5.4 Evidence Completeness (`/reports/evidence`)
- **Evidence Audit**:
  - Missing photos
  - Missing videos
  - Missing machine results
  - Incomplete inspections

- **Compliance Metrics**:
  - Evidence completeness rate
  - By center
  - By inspector
  - By inspection type

- **Evidence Quality**:
  - Photo quality scores
  - Video quality scores
  - Location accuracy

##### 5.5 Compliance & Integrity (`/reports/compliance`)
- **Fraud Detection Summary**:
  - Geofence violations
  - Vehicle presence violations
  - Machine tampering alerts
  - Duplicate inspection detection

- **Compliance Metrics**:
  - Inspection compliance rate
  - Standards adherence
  - Regulatory compliance

- **Integrity Checks**:
  - Data integrity violations
  - Audit trail completeness
  - Digital signature verification

#### Demo Points:
- Show executive scorecard overview
- Demonstrate trend analysis with different time ranges
- Export operational reports
- Show evidence completeness metrics
- Explain fraud detection algorithms

---

### 6. Configuration (`/configuration/*`)

**Purpose**: System-wide configuration and business rules

#### Configuration Tabs:

##### 6.1 Test Standards (`/configuration`)
- **Vehicle Class Configuration**:
  - Light vehicles
  - Heavy vehicles
  - Motorcycles
  - Custom classes

- **Test Thresholds**:
  - Alignment & Suspension limits
  - Brake test thresholds
  - Emissions limits (HC, CO, CO2, O2, Smoke opacity)
  - Headlight intensity requirements

- **Pass/Fail Rules**:
  - Minimum requirements
  - Tolerance levels
  - Re-test criteria

- **Version Control**:
  - Standard versions
  - Effective dates
  - Change history

##### 6.2 Visual Checklists (`/configuration/visual-checklists`)
- **Checklist Configuration**:
  - 30-point checklist items
  - Item descriptions
  - Point values
  - Pass/fail criteria

- **Vehicle-Specific Checklists**:
  - Light vehicle checklist
  - Heavy vehicle checklist (additional items)
  - Custom checklists

- **Checklist Templates**:
  - Regional variations
  - Language translations
  - Print templates

##### 6.3 Fee & Payment (`/configuration/fee-structure`)
- **Fee Structure**:
  - Base fees by vehicle class
  - VAT calculation
  - Regional overrides
  - Retest fees

- **Payment Configuration**:
  - Payment gateways
  - Transaction limits
  - Payment methods
  - Refund policies

- **Tax Configuration**:
  - VAT rates
  - Tax exemptions
  - Regional tax variations

#### Demo Points:
- Show test standards configuration
- Demonstrate checklist customization
- Explain fee structure setup
- Show version control for standards

---

### 7. Governance (`/governance/*`)

**Purpose**: Administrative structure and organizational hierarchy

#### Governance Tabs:

##### 7.1 Administration Units (`/governance/units`)
- **Hierarchical Structure**:
  - National level
  - Regional level
  - Zone level
  - Sub-city level
  - Woreda level
  - Center level

- **Unit Management**:
  - Create/edit units
  - Assign parent units
  - Set jurisdiction boundaries
  - Configure unit metadata

##### 7.2 Assignments (`/governance/assignments`)
- **Role Assignments**:
  - User-to-role assignments
  - Scope assignments
  - Approval workflows
  - Assignment history

##### 7.3 Institutions (`/governance/institutions`)
- **Institution Registry**:
  - Government institutions
  - Private institutions
  - Institution hierarchy
  - Contact information

##### 7.4 Relationships (`/governance/relationships`)
- **Organizational Relationships**:
  - Parent-child relationships
  - Reporting structures
  - Authority chains
  - Delegation rules

#### Demo Points:
- Show hierarchical structure
- Demonstrate unit creation
- Explain assignment workflows
- Show relationship mapping

---

### 8. Administration (`/administration`)

**Purpose**: User and role management

#### Key Features:
- **User Management**:
  - User list with filters
  - Search by name, username, email
  - Filter by status, role
  - Create/edit/delete users

- **User Creation Form**:
  - Personal details (name, username, phone, email)
  - Institution assignment
  - Job title
  - Account status

- **Role Assignment**:
  - Assign roles to users
  - Scope assignment (National/Regional/Center)
  - Approval workflows (for sensitive roles)
  - Multi-role support

- **User Status Management**:
  - Active
  - Suspended
  - Disabled
  - Pending Activation

- **Role Matrix**:
  - Available roles display
  - Permission overview
  - Role hierarchy

- **Bulk Operations**:
  - Bulk role assignment
  - Bulk status update
  - Bulk scope assignment

#### Demo Points:
- Create a new user
- Assign roles and scopes
- Show role-based access filtering
- Demonstrate approval workflows
- Explain scope-based data filtering

---

### 9. Security (`/security/*`)

**Purpose**: Security monitoring, audit logs, and compliance

#### Security Tabs:

##### 9.1 All Logs (`/security/all`)
- **Unified Audit Log**:
  - All system actions
  - User actions
  - System events
  - API calls

##### 9.2 Desktop App Actions (`/security/desktop-app`)
- **Client Application Logs**:
  - Inspection actions
  - Machine data capture
  - Payment transactions
  - Sync operations
  - Offline operations

##### 9.3 Admin Portal Actions (`/security/admin-portal`)
- **Admin Portal Logs**:
  - User management actions
  - Configuration changes
  - Report generation
  - Data exports
  - System configuration

#### Key Features:
- **Log Filtering**:
  - By date range
  - By user
  - By action type
  - By IP address
  - By severity

- **Log Details**:
  - Timestamp
  - User information
  - Action description
  - IP address
  - User agent
  - Request/response data
  - Outcome (success/failure)

- **Export Functionality**:
  - CSV export
  - Filtered export
  - Scheduled exports

- **Security Alerts**:
  - Failed login attempts
  - Unauthorized access attempts
  - Suspicious activity
  - Data export alerts

#### Demo Points:
- Show audit log filtering
- Demonstrate log detail view
- Export logs to CSV
- Explain security alert system
- Show IP tracking

---

### 10. Fees & Payments (`/fees-payments/*`)

**Purpose**: Financial management and payment reconciliation

#### Key Features:
- **Payment Dashboard**:
  - Total revenue
  - Payment methods breakdown
  - Pending payments
  - Failed transactions

- **Transaction Management**:
  - Transaction list
  - Search and filter
  - Transaction details
  - Refund processing

- **Reconciliation**:
  - Daily reconciliation
  - Center-wise reconciliation
  - Payment gateway reconciliation
  - Discrepancy detection

- **Fee Structure Management**:
  - Base fees
  - Regional overrides
  - Tax configuration
  - Retest fees

#### Demo Points:
- Show payment dashboard
- Demonstrate transaction search
- Explain reconciliation process
- Show fee structure configuration

---

## Role-Based Access Control

### Role Hierarchy

1. **Super Admin** - Full system access
2. **Security Admin** - Security and audit access
3. **Audit Admin** - Read-only audit access
4. **Regional Admin** - Regional scope access
5. **Zone Admin** - Zone scope access
6. **Center Manager** - Center scope access
7. **Inspector** - Inspection operations only
8. **Receptionist** - Limited inspection access
9. **Viewer** - Read-only access (PII protected)
10. **Enforcement Agent** - Casework access

### Scope-Based Data Filtering

- **National Scope**: Access to all data
- **Regional Scope**: Access to regional data only
- **Zone Scope**: Access to zone data only
- **Center Scope**: Access to center data only

### Permission Matrix

| Feature | Super Admin | Regional Admin | Center Manager | Inspector | Viewer |
|---------|-------------|----------------|----------------|-----------|--------|
| Dashboard | ✅ | ✅ | ✅ | ✅ | ✅ |
| Operations | ✅ | ✅ | ✅ | ❌ | ❌ |
| Inspections | ✅ | ✅ | ✅ | ✅ | ✅ |
| Center Management | ✅ | ✅ (Regional) | ✅ (Own Center) | ❌ | ❌ |
| Reports | ✅ | ✅ (Scoped) | ✅ (Scoped) | ✅ (Scoped) | ✅ (Scoped) |
| Configuration | ✅ | ❌ | ❌ | ❌ | ❌ |
| Governance | ✅ | ❌ | ❌ | ❌ | ❌ |
| Administration | ✅ | ❌ | ❌ | ❌ | ❌ |
| Security | ✅ | ❌ | ❌ | ❌ | ❌ |

---

## Demo Script & Talking Points

### Opening (2 minutes)

**Script**: "Welcome to the VIMS Admin Portal demonstration. This is a comprehensive web-based management system for monitoring and managing vehicle inspection operations across Ethiopia. Today, I'll walk you through the key features and capabilities."

**Key Points**:
- Centralized management for 120+ inspection centers
- Real-time monitoring and fraud detection
- Comprehensive reporting and analytics
- Role-based access control with scope filtering

---

### Section 1: Dashboard (5 minutes)

**Navigation**: Start at `/` (Dashboard)

**What to Show**:
1. Real-time metrics cards
2. Time range filtering (Today → Last 30 days)
3. Interactive charts (hover to show tooltips)
4. Recent inspections table with search
5. Centers requiring attention section

**Talking Points**:
- "The dashboard provides a real-time overview of all inspection operations"
- "Metrics are scope-filtered based on user role - regional admins see only their region"
- "Attention scores help prioritize centers that need immediate attention"
- "All data updates in real-time with auto-refresh every 30 seconds"

**Demo Actions**:
- Change time range filter
- Search for specific inspection
- Click on a center requiring attention
- Show chart interactivity

---

### Section 2: Operations Command Center (5 minutes)

**Navigation**: Go to `/operations`

**What to Show**:
1. Switch between Map and List views
2. Center status indicators
3. Attention score system
4. Filtering by jurisdiction
5. Center summary drawer
6. Alert inbox

**Talking Points**:
- "The Operations Command Center provides real-time monitoring of all centers"
- "Attention scores are calculated based on multiple factors: incidents, machine health, fraud alerts"
- "Map view shows geographic distribution of centers and their status"
- "Auto-refresh ensures you always see current operational status"

**Demo Actions**:
- Toggle between Map/List views
- Filter by region
- Sort by attention score
- Open center drawer
- Show alert inbox

---

### Section 3: Inspections (4 minutes)

**Navigation**: Go to `/inspection-operations`

**What to Show**:
1. Search functionality
2. Inspection list
3. Inspection detail view
4. Machine test results (read-only)
5. Visual evidence (photos/video)
6. Location verification
7. Print/export functionality

**Talking Points**:
- "All inspections are searchable by plate, VIN, or inspector name"
- "Machine test data is locked and cannot be edited - ensuring data integrity"
- "Visual evidence includes photos and video linked from VMS"
- "Location verification shows inspection location on map with geofence"

**Demo Actions**:
- Search for an inspection
- Open inspection detail
- Show machine test results (locked fields)
- Display photos/video
- Show location on map
- Demonstrate print functionality

---

### Section 4: Center Management (6 minutes)

**Navigation**: Go to `/center-management`

**What to Show**:
1. Center list with filters
2. Create new center (multi-step form)
3. Center profile tabs
4. Geofence configuration (map drawing)
5. Device registry
6. Camera settings

**Talking Points**:
- "Center management allows comprehensive configuration of each inspection center"
- "Geofencing ensures inspections only occur within authorized boundaries"
- "Device registry tracks all machines and their health status"
- "Multi-tab interface organizes center configuration logically"

**Demo Actions**:
- Filter centers by region
- Click "Create Center"
- Show geofence configuration on map
- View device registry
- Show camera settings

---

### Section 5: Reports & Analytics (6 minutes)

**Navigation**: Go to `/reports/scorecard`

**What to Show**:
1. Executive Scorecard
2. Trend Analysis (switch to `/reports/trends`)
3. Operational Reports (switch to `/reports/operational`)
4. Evidence Completeness (switch to `/reports/evidence`)
5. Compliance & Integrity (switch to `/reports/compliance`)
6. Export functionality

**Talking Points**:
- "Comprehensive reporting suite with 5 different report types"
- "Executive scorecard provides high-level KPIs for management"
- "Trend analysis helps identify seasonal patterns and shifts"
- "Evidence completeness ensures regulatory compliance"
- "All reports are exportable to CSV/PDF"

**Demo Actions**:
- Show executive scorecard
- Switch to trend analysis, change time range
- Show operational reports
- Demonstrate export functionality
- Explain fraud detection metrics

---

### Section 6: Configuration (4 minutes)

**Navigation**: Go to `/configuration`

**What to Show**:
1. Test Standards configuration
2. Visual Checklists configuration
3. Fee Structure configuration

**Talking Points**:
- "System configuration allows customization of business rules"
- "Test standards define pass/fail thresholds for each vehicle class"
- "Visual checklists can be customized per region or vehicle type"
- "Fee structure supports regional variations and tax configuration"

**Demo Actions**:
- Show test standards for different vehicle classes
- Display visual checklist configuration
- Show fee structure with VAT calculation

---

### Section 7: Governance (3 minutes)

**Navigation**: Go to `/governance/units`

**What to Show**:
1. Administration Units hierarchy
2. Assignments
3. Institutions
4. Relationships

**Talking Points**:
- "Governance module manages the administrative structure"
- "Hierarchical organization from national to center level"
- "Role assignments are managed here with approval workflows"

**Demo Actions**:
- Show unit hierarchy
- View assignments
- Explain relationship mapping

---

### Section 8: Administration (3 minutes)

**Navigation**: Go to `/administration`

**What to Show**:
1. User list with filters
2. Create new user
3. Role assignment
4. Scope assignment

**Talking Points**:
- "User management with role-based access control"
- "Scope assignment ensures users only see relevant data"
- "Approval workflows for sensitive role assignments"

**Demo Actions**:
- Filter users by role/status
- Create a new user
- Assign role and scope
- Show scope-based filtering

---

### Section 9: Security (3 minutes)

**Navigation**: Go to `/security/all`

**What to Show**:
1. Audit log filtering
2. Log details
3. Export functionality
4. Security alerts

**Talking Points**:
- "Complete audit trail of all system actions"
- "Separate logs for desktop app and admin portal"
- "IP tracking and user agent logging for security"
- "Exportable logs for compliance and investigation"

**Demo Actions**:
- Filter logs by date/user/action
- Show log details
- Export logs to CSV
- Explain security alerts

---

### Closing (2 minutes)

**Summary Points**:
1. "Comprehensive management system for 120+ centers"
2. "Real-time monitoring and fraud detection"
3. "Role-based access with scope filtering"
4. "Complete audit trail and security"
5. "Extensive reporting and analytics"

**Next Steps**:
- Q&A session
- Feature deep-dives if requested
- Customization discussions

---

## Key Metrics & KPIs

### Dashboard Metrics

1. **Total Inspections**: Count with trend (↑/↓)
2. **Pass Rate**: Percentage with comparison
3. **Revenue**: ETB amount with trend
4. **Active Centers**: Count of online centers
5. **Open Incidents**: Count by severity
6. **Centers Requiring Attention**: Count with top reasons

### Operations Metrics

1. **Attention Score**: 0-100 calculated score
2. **Center Status**: Online/Offline/Warning/Maintenance
3. **Incident Count**: By type and severity
4. **Throughput**: Inspections per center per day
5. **Machine Health**: Connectivity and status

### Reporting Metrics

1. **Executive KPIs**: High-level performance indicators
2. **Trend Metrics**: Inspections, pass rate, revenue, cycle time
3. **Operational Metrics**: Inspector performance, center throughput
4. **Compliance Metrics**: Evidence completeness, fraud detection
5. **Financial Metrics**: Revenue, payments, reconciliation

---

## Common Demo Scenarios

### Scenario 1: Monitoring Daily Operations

**Flow**:
1. Start at Dashboard
2. Check today's metrics
3. Review centers requiring attention
4. Navigate to Operations Command Center
5. Filter by region
6. Open center drawer for details
7. Check alert inbox

**Time**: 5 minutes

---

### Scenario 2: Investigating Fraud Alert

**Flow**:
1. Notification bell shows fraud alert
2. Click notification
3. Navigate to inspection detail
4. Review machine test results
5. Check visual evidence
6. Verify location on map
7. Check geofence compliance
8. Export report for investigation

**Time**: 4 minutes

---

### Scenario 3: Generating Executive Report

**Flow**:
1. Navigate to Reports & Analytics
2. Open Executive Scorecard
3. Review key metrics
4. Switch to Trend Analysis
5. Select time range (Last 30 days)
6. Export report to PDF
7. Schedule recurring report

**Time**: 3 minutes

---

### Scenario 4: Configuring New Center

**Flow**:
1. Navigate to Center Management
2. Click "Create Center"
3. Fill center details
4. Select jurisdiction
5. Configure geofence on map
6. Add devices
7. Configure cameras
8. Set up TeleBirr payment
9. Save and verify

**Time**: 6 minutes

---

### Scenario 5: User Management

**Flow**:
1. Navigate to Administration
2. Filter users by role
3. Create new user
4. Assign role
5. Set scope (Regional/Center)
6. Activate account
7. Verify scope-based access

**Time**: 4 minutes

---

## Troubleshooting Tips

### Common Issues During Demo

1. **Slow Loading**:
   - Use browser DevTools to check network
   - Refresh page if needed
   - Explain that production will be faster

2. **Missing Data**:
   - Explain mock data limitations
   - Show data structure
   - Emphasize real API integration

3. **Filter Not Working**:
   - Check browser console for errors
   - Refresh and try again
   - Explain scope-based filtering

4. **Map Not Loading**:
   - Check internet connection
   - Explain map API requirements
   - Show alternative list view

5. **Export Not Working**:
   - Check browser download settings
   - Try different export format
   - Explain production capabilities

### Backup Plans

- **If Internet Fails**: Use pre-saved screenshots
- **If Feature Broken**: Skip to next feature, mention it's in development
- **If Questions Unclear**: Ask for clarification, show related features

---

## Quick Reference Card

### Navigation Shortcuts

- Dashboard: `/`
- Operations: `/operations`
- Inspections: `/inspection-operations`
- Centers: `/center-management`
- Reports: `/reports/scorecard`
- Configuration: `/configuration`
- Governance: `/governance/units`
- Administration: `/administration`
- Security: `/security/all`

### Key Features by Section

| Section | Key Feature | Demo Time |
|---------|-------------|-----------|
| Dashboard | Real-time metrics | 5 min |
| Operations | Attention scores | 5 min |
| Inspections | Evidence viewing | 4 min |
| Centers | Geofence config | 6 min |
| Reports | Trend analysis | 6 min |
| Configuration | Test standards | 4 min |
| Governance | Unit hierarchy | 3 min |
| Administration | User creation | 3 min |
| Security | Audit logs | 3 min |

**Total Demo Time**: ~40 minutes (full walkthrough)

---

## Additional Resources

- **Architecture Documentation**: `ARCHITECTURE_DOCUMENTATION.md`
- **Database Schema**: `DATABASE_SCHEMA.md`
- **Client Flow**: `../CLIENT_TO_ADMIN_FLOW.md`
- **Integration Guide**: `../DATABASE_INTEGRATION_GUIDE.md`

---

**End of Demo Guide**

*Use this guide to prepare for client demonstrations. Customize the script based on client needs and time constraints.*




