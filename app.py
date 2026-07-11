import os
import uuid
import json
from flask import Flask, render_template, request, jsonify, Blueprint, redirect, url_for
from models import db, Enterprise, StaffUser, Customer, RoleEnum, GUID

# --- App Initialization ---
app = Flask(__name__)
# Use an absolute path for the database file
db_path = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'telarsync.db')
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

# --- Blueprints ---
dashboard_bp = Blueprint('dashboard', __name__)
measurements_bp = Blueprint('measurements', __name__)
tracker_bp = Blueprint('tracker', __name__)

# --- Helper Functions ---
def get_enterprise_id_from_request(req):
    """Simulates getting the active enterprise ID from the session or request."""
    enterprise_id = req.args.get('enterprise_id')
    if not enterprise_id:
        with app.app_context():
            first_enterprise = Enterprise.query.first()
            if first_enterprise:
                return str(first_enterprise.id)
    return enterprise_id

# --- Main Routes ---
@app.route('/')
def index():
    with app.app_context():
        enterprises = Enterprise.query.all()
    active_enterprise_id = get_enterprise_id_from_request(request)
    
    if active_enterprise_id is None and enterprises:
        active_enterprise_id = str(enterprises[0].id)
    
    if 'enterprise_id' not in request.args and active_enterprise_id:
         return redirect(url_for('index', enterprise_id=active_enterprise_id))

    return render_template('index.html', enterprises=enterprises, active_enterprise_id=active_enterprise_id)

# --- Dashboard Blueprint Routes ---
@dashboard_bp.route('/dashboard/data')
def dashboard_data():
    enterprise_id = get_enterprise_id_from_request(request)
    if not enterprise_id:
        return jsonify({"error": "Enterprise ID is required"}), 400

    try:
        enterprise_uuid = uuid.UUID(enterprise_id)
        staff_count = StaffUser.query.filter_by(enterprise_id=enterprise_id).count()
        customer_count = Customer.query.filter_by(enterprise_id=enterprise_id).count()
        enterprise = db.session.get(Enterprise, enterprise_id)
    except (ValueError, TypeError):
         return jsonify({"error": "Invalid Enterprise ID format"}), 400

    return jsonify({
        "enterprise_name": enterprise.business_name if enterprise else "Unknown",
        "staff_count": staff_count,
        "customer_count": customer_count
    })

# --- Measurements Blueprint Routes ---
@measurements_bp.route('/measurements')
def measurements_page():
    enterprises = Enterprise.query.all()
    active_enterprise_id = get_enterprise_id_from_request(request)
    
    if 'enterprise_id' not in request.args and active_enterprise_id:
         return redirect(url_for('measurements.measurements_page', enterprise_id=active_enterprise_id))
    
    return render_template('measurements.html', enterprises=enterprises, active_enterprise_id=active_enterprise_id)

@measurements_bp.route('/customers', methods=['GET'])
def get_customers():
    enterprise_id = get_enterprise_id_from_request(request)
    if not enterprise_id:
        return jsonify({"error": "Enterprise ID is required"}), 400
    
    try:
        enterprise_uuid = uuid.UUID(enterprise_id)
        customers = Customer.query.filter_by(enterprise_id=enterprise_id).all()
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid Enterprise ID format"}), 400

    return jsonify([c.to_dict() for c in customers])

@measurements_bp.route('/customers', methods=['POST'])
def add_customer():
    data = request.json
    enterprise_id = get_enterprise_id_from_request(request)
    if not enterprise_id:
        return jsonify({"error": "Enterprise ID is required"}), 400

    try:
        enterprise_uuid = uuid.UUID(enterprise_id)
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid Enterprise ID format"}), 400

    new_customer = Customer(
        enterprise_id=enterprise_id,
        client_name=data['client_name'],
        phone_number=data['phone_number'],
        secure_measurements=json.dumps(data.get('measurements', {}))
    )
    db.session.add(new_customer)
    db.session.commit()
    return jsonify(new_customer.to_dict()), 201

# --- Tracker Blueprint Routes ---
@tracker_bp.route('/tracker')
def tracker_page():
    enterprises = Enterprise.query.all()
    active_enterprise_id = get_enterprise_id_from_request(request)

    if 'enterprise_id' not in request.args and active_enterprise_id:
         return redirect(url_for('tracker.tracker_page', enterprise_id=active_enterprise_id))

    return render_template('tracker.html', enterprises=enterprises, active_enterprise_id=active_enterprise_id)

# --- Register Blueprints ---
app.register_blueprint(dashboard_bp)
app.register_blueprint(measurements_bp, url_prefix='/measurements')
app.register_blueprint(tracker_bp)


# --- Database Initialization and Dummy Data ---
def create_and_seed_database():
    with app.app_context():
        if os.path.exists(db_path):
            print("Database already exists. Skipping seeding.")
            return
            
        print("Creating and seeding database...")
        db.create_all()

        # Create two enterprises
        enterprise1_id = uuid.uuid4()
        enterprise1 = Enterprise(
            id=enterprise1_id,
            business_name="Apex Tailors",
            owner_phone="123-456-7890"
        )
        
        enterprise2_id = uuid.uuid4()
        enterprise2 = Enterprise(
            id=enterprise2_id,
            business_name="Node Stitching Co.",
            owner_phone="098-765-4321"
        )

        db.session.add_all([enterprise1, enterprise2])
        db.session.commit()

        # Create staff for Enterprise 1
        staff1_e1 = StaffUser(enterprise_id=enterprise1_id, full_name="Alice Owner", role=RoleEnum.OWNER)
        staff2_e1 = StaffUser(enterprise_id=enterprise1_id, full_name="Bob Master Tailor", role=RoleEnum.MASTER_TAILOR)
        staff3_e1 = StaffUser(enterprise_id=enterprise1_id, full_name="Charlie Apprentice", role=RoleEnum.APPRENTICE)

        # Create staff for Enterprise 2
        staff1_e2 = StaffUser(enterprise_id=enterprise2_id, full_name="Diana Boss", role=RoleEnum.OWNER)
        staff2_e2 = StaffUser(enterprise_id=enterprise2_id, full_name="Evan Master", role=RoleEnum.MASTER_TAILOR)
        
        db.session.add_all([staff1_e1, staff2_e1, staff3_e1, staff1_e2, staff2_e2])
        db.session.commit()

        # Create customers for Enterprise 1
        customer1_e1 = Customer(
            enterprise_id=enterprise1_id,
            client_name="Frank Smith",
            phone_number="555-0101",
            secure_measurements=json.dumps({"chest": 42, "waist": 34, "inseam": 32})
        )
        customer2_e1 = Customer(
            enterprise_id=enterprise1_id,
            client_name="Grace Jones",
            phone_number="555-0102",
            secure_measurements=json.dumps({"bust": 36, "waist": 28, "hips": 38})
        )

        # Create customers for Enterprise 2
        customer1_e2 = Customer(
            enterprise_id=enterprise2_id,
            client_name="Heidi Klum",
            phone_number="555-0201",
            secure_measurements=json.dumps({"bust": 34, "waist": 26, "hips": 36})
        )
        
        db.session.add_all([customer1_e1, customer2_e1, customer1_e2])
        db.session.commit()

        print("Database seeded with initial data.")

if __name__ == '__main__':
    create_and_seed_database()
    app.run(debug=True, host='0.0.0.0', port=5000)
