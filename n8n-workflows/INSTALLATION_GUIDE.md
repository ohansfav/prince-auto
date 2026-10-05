# n8n Healthcare Automation - Installation & Setup Guide

## Overview
This complete healthcare automation system includes:
- 3 Specialized Agents (Appointment, Reminder, Communication)
- 3 Database Collections (Patient, Appointment, Reminder)
- 1 Orchestration Workflow
- 1 Doctor Input Form

## Prerequisites

### Option 1: Cloud-Hosted (Recommended for Testing)
1. Go to [n8n.cloud](https://n8n.cloud)
2. Create a free account
3. Skip Docker installation

### Option 2: Self-Hosted with Docker

#### Windows Setup
```powershell
# Install Docker Desktop from https://www.docker.com/products/docker-deskto..........................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................

# Pull and run n8n
docker run -it --rm --name n8n -p 5678:5678 n8nio/n8n

# n8n will be available at http://localhost:5678
```

#### Alternative: Using Docker Compose
Create a `docker-compose.yml` file:
```yaml
version: '3.8'
services:
  n8n:
    image: n8nio/n8n
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=password
    volumes:
      - n8n_storage:/home/node/.n8n

  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=password
    volumes:
      - mongodb_storage:/data/db

volumes:
  n8n_storage:
  mongodb_storage:
```

Run with:
```powershell
docker-compose up -d
```

## Installation Steps

### 1. Access n8n
- Open browser to `http://localhost:5678` (self-hosted) or your n8n.cloud workspace
- Complete initial setup

### 2. Configure MongoDB Connection

1. Go to **Credentials** in n8n
2. Click **Create New → MongoDB**
3. Enter connection details:
   ```
   Host: localhost (or your MongoDB host)
   Port: 27017
   Database: healthcare_db
   Username: admin
   Password: password
   ```

### 3. Import Workflows

#### In n8n UI:
1. Click **Menu → Workflows**
2. Click **Create New**
3. Click **Menu → Import from File/Clipboard**
4. Copy-paste content from JSON files in order:

**Import Order:**
1. `01-patient-db-setup.json` - Creates patient collection
2. `02-appointment-db-setup.json` - Creates appointment collection
3. `03-reminder-db-setup.json` - Creates reminder collection
4. `04-appointment-agent.json` - Appointment processing agent
5. `05-reminder-agent.json` - Reminder sending agent
6. `06-communication-agent.json` - Communication agent
7. `07-orchestration-workflow.json` - Main orchestration
8. `08-input-form-workflow.json` - Doctor input form

### 4. Configure Credentials for Agents

For **Reminder Agent** (Email):
1. Go to Credentials
2. Create **Gmail**, **Outlook**, or **SMTP** credential
3. Add to `Send Email Reminder` node

For **Communication Agent** (SMS):
1. Go to Credentials
2. Create **Twilio** credential
3. Add to `Send SMS` node

### 5. Run Database Setup Workflows

1. Click on each database setup workflow
2. Click **Execute Workflow**
3. This creates the MongoDB collections

### 6. Activate Workflows

1. Open each agent workflow
2. Click **Activate** button (top right)
3. Workflows are now listening for webhooks

### 7. Test the System

#### Test Patient Creation:
```bash
curl -X POST http://localhost:5678/webhook/patient-update \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "notes": "Regular patient"
  }'
```

#### Test Appointment Scheduling:
```bash
curl -X POST http://localhost:5678/webhook/schedule-appointment \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "PATIENT_ID_FROM_RESPONSE",
    "doctorName": "Dr. Smith",
    "appointmentDate": "2025-12-20",
    "appointmentTime": "14:30",
    "notes": "Regular checkup"
  }'
```

#### Test Reminder:
```bash
curl -X POST http://localhost:5678/webhook/send-reminder \
  -H "Content-Type: application/json" \
  -d '{
    "appointmentId": "APPOINTMENT_ID_FROM_RESPONSE"
  }'
```

### 8. Access Doctor Input Form

1. Go to **Doctor Input Form** workflow
2. Get the form URL from the trigger node
3. Share with doctors: `http://localhost:5678/form/FORM_ID`

## Workflow Architecture

```
┌─────────────────────┐
│  Doctor Input Form  │
└──────────┬──────────┘
           │
           ├─→ Store Patient Data
           ├─→ Schedule Appointment
           └─→ Send Communication
                   │
                   ├─→ Appointment Agent → MongoDB
                   ├─→ Reminder Agent → Send Email/SMS → Log
                   └─→ Communication Agent → Send via Channel → Log
```

## API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/webhook/patient-update` | POST | Add/update patient |
| `/webhook/schedule-appointment` | POST | Schedule appointment |
| `/webhook/send-reminder` | POST | Send reminder |
| `/webhook/send-communication` | POST | Send communication |
| `/webhook/doctor-form` | GET/POST | Doctor input form |

## MongoDB Collections Schema

### patients
```json
{
  "patientId": "uuid",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phone": "string",
  "notes": "string",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### appointments
```json
{
  "appointmentId": "uuid",
  "patientId": "string",
  "doctorName": "string",
  "appointmentDate": "datetime",
  "appointmentTime": "string",
  "status": "string",
  "notes": "string",
  "createdAt": "datetime"
}
```

### reminders
```json
{
  "reminderId": "uuid",
  "appointmentId": "string",
  "patientId": "string",
  "message": "string",
  "sentAt": "datetime",
  "deliveryStatus": "string",
  "followUpStatus": "string",
  "channel": "string"
}
```

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `docker ps | findstr mongodb`
- Check credentials in n8n MongoDB node
- Verify connection string

### Webhook Not Responding
- Ensure workflow is **Activated**
- Check n8n logs: `docker logs n8n`
- Verify webhook URL in HTTP request nodes

### Email/SMS Not Sending
- Configure credentials properly
- Check email/SMS service account settings
- Verify API keys are valid

## Next Steps

1. **Customize the form** - Add more fields specific to your clinic
2. **Add notifications** - Integrate Slack, Teams for doctor notifications
3. **Schedule reminders** - Use Cron triggers to auto-send reminders
4. **Build dashboards** - Create BI dashboards to track appointment metrics
5. **Integration** - Connect to existing clinic management systems

## Support & Resources

- [n8n Documentation](https://docs.n8n.io)
- [MongoDB Guide](https://docs.mongodb.com)
- [n8n Community Forum](https://community.n8n.io)

---
Created: November 2025
