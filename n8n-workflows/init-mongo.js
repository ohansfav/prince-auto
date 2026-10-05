// MongoDB initialization script
// Creates the healthcare database and collections

db = db.getSiblingDB('healthcare_db');

// Create patients collection
db.createCollection("patients");
db.patients.createIndex({ patientId: 1 }, { unique: true });
db.patients.createIndex({ email: 1 });
db.patients.createIndex({ phone: 1 });

// Create appointments collection
db.createCollection("appointments");
db.appointments.createIndex({ appointmentId: 1 }, { unique: true });
db.appointments.createIndex({ patientId: 1 });
db.appointments.createIndex({ appointmentDate: 1 });

// Create reminders collection
db.createCollection("reminders");
db.reminders.createIndex({ reminderId: 1 }, { unique: true });
db.reminders.createIndex({ appointmentId: 1 });
db.reminders.createIndex({ patientId: 1 });

// Create communications collection
db.createCollection("communications");
db.communications.createIndex({ communicationId: 1 }, { unique: true });
db.communications.createIndex({ patientId: 1 });
db.communications.createIndex({ sentAt: 1 });

print("Healthcare database initialized successfully!");
print("Collections created: patients, appointments, reminders, communications");
