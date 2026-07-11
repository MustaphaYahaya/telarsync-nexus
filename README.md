# SartorGrid - Tailoring Intelligence Platform

A premium tailoring operations platform by **SavannahNode**, purpose-built for bespoke workshops and measurement management.

## Tech Stack

- **Backend**: Python 3, Flask, Flask-SQLAlchemy
- **Frontend**: Plain HTML5, CSS3, Vanilla JavaScript (No frameworks)
- **Database**: SQLite (for development)

## Features

- **Multi-tenancy**: Switch between different workshop enterprises
- **Dashboard**: View staff and customer counts per enterprise
- **Customer Measurements**: CRUD operations for customer body measurements (stored as JSON)
- **Order Tracker**: Placeholder for tracking tailoring progress

## Project Structure

```
.
├── app.py                 # Flask application with blueprints
├── models.py             # SQLAlchemy database models
├── templates/
│   ├── layout.html       # Base HTML template
│   ├── index.html        # Dashboard page
│   ├── measurements.html # Customer measurements page
│   └── tracker.html      # Order tracker page
├── static/
│   ├── style.css         # Application styles
│   └── script.js         # Vanilla JavaScript utilities
└── sartorgrid.db          # SQLite database (auto-generated)
```

## Database Models

### Enterprise
- `id` (UUID): Primary key
- `business_name` (String): Name of the tailoring business
- `owner_phone` (String): Owner's contact number
- `created_at` (DateTime): Creation timestamp

### StaffUser
- `id` (UUID): Primary key
- `enterprise_id` (UUID): Foreign key to Enterprise
- `full_name` (String): Staff member's name
- `role` (Enum): Owner, Master_Tailor, or Apprentice

### Customer
- `id` (UUID): Primary key
- `enterprise_id` (UUID): Foreign key to Enterprise
- `client_name` (String): Customer's name
- `phone_number` (String): Customer's phone
- `secure_measurements` (JSON): Dynamic body measurements

## Installation & Setup

### Prerequisites
- Python 3.8 or higher
- pip (Python package manager)

### Steps

1. **Install dependencies**:
   ```bash
   pip install Flask Flask-SQLAlchemy
   ```

2. **Run the application**:
   ```bash
   python app.py
   ```

3. **Access the application**:
   Open your browser and navigate to: `http://localhost:5000`

## Multi-Tenancy

The application simulates multi-tenancy by filtering all data based on an `enterprise_id` parameter passed in the URL. Users can switch between different workshops using the dropdown in the header.

## Sample Data

On first run, the application automatically seeds the database with:
- 2 Enterprises (Apex Tailors, Node Stitching Co.)
- 5 Staff members across both enterprises
- 3 Customers with sample measurements

## API Endpoints

- `GET /` - Dashboard (redirects with enterprise_id)
- `GET /dashboard/data?enterprise_id=<id>` - Dashboard statistics
- `GET /measurements?enterprise_id=<id>` - Measurements page
- `GET /measurements/customers?enterprise_id=<id>` - List customers
- `POST /measurements/customers?enterprise_id=<id>` - Add customer
- `GET /tracker?enterprise_id=<id>` - Tracker page

## Development Notes

- UUIDs are stored as CHAR(32) in SQLite for compatibility
- Measurements are stored as JSON text and parsed in the application layer
- The application uses Flask Blueprints for modular routing
- No frontend frameworks are used - pure Vanilla JS for interactivity

## License

(c) 2024 SavannahNode. All rights reserved.