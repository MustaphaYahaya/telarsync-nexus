import uuid
import enum
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.types import TypeDecorator, CHAR
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
import json

db = SQLAlchemy()

# Custom UUID type for SQLite compatibility
class GUID(TypeDecorator):
    """Platform-independent GUID type.
    Uses PostgreSQL's UUID type, otherwise uses
    CHAR(32), storing as string.
    """
    impl = CHAR
    cache_ok = True

    def load_dialect_impl(self, dialect):
        if dialect.name == 'postgresql':
            return dialect.type_descriptor(PG_UUID())
        else:
            return dialect.type_descriptor(CHAR(32))

    def process_bind_param(self, value, dialect):
        if value is None:
            return value
        elif dialect.name == 'postgresql':
            return str(value)
        else:
            if not isinstance(value, uuid.UUID):
                return "%.32x" % uuid.UUID(value).int
            else:
                return "%.32x" % value.int

    def process_result_value(self, value, dialect):
        if value is None:
            return value
        else:
            if not isinstance(value, uuid.UUID):
                value = uuid.UUID(value)
            return value

class RoleEnum(enum.Enum):
    OWNER = "Owner"
    MASTER_TAILOR = "Master_Tailor"
    APPRENTICE = "Apprentice"

class Enterprise(db.Model):
    __tablename__ = 'enterprise'
    id = db.Column(GUID(), primary_key=True, default=uuid.uuid4)
    business_name = db.Column(db.String(100), nullable=False)
    owner_phone = db.Column(db.String(20), nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

class StaffUser(db.Model):
    __tablename__ = 'staff_user'
    id = db.Column(GUID(), primary_key=True, default=uuid.uuid4)
    enterprise_id = db.Column(GUID(), db.ForeignKey('enterprise.id'), nullable=False)
    full_name = db.Column(db.String(100), nullable=False)
    role = db.Column(db.Enum(RoleEnum), nullable=False)
    enterprise = db.relationship('Enterprise', backref=db.backref('staff_users', lazy=True))

class Customer(db.Model):
    __tablename__ = 'customer'
    id = db.Column(GUID(), primary_key=True, default=uuid.uuid4)
    enterprise_id = db.Column(GUID(), db.ForeignKey('enterprise.id'), nullable=False)
    client_name = db.Column(db.String(100), nullable=False)
    phone_number = db.Column(db.String(20), nullable=False)
    secure_measurements = db.Column(db.Text, nullable=True)  # Storing as text and handling JSON in app

    def to_dict(self):
        return {
            'id': str(self.id),
            'enterprise_id': str(self.enterprise_id),
            'client_name': self.client_name,
            'phone_number': self.phone_number,
            'secure_measurements': json.loads(self.secure_measurements) if self.secure_measurements else {}
        }
