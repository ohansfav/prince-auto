# Quick Start Guide

## 5-Minute Setup

### 1. Start n8n with MongoDB
```powershell
# Save docker-compose.yml in your project folder, then run:
docker-compose up -d
```

Wait 30 seconds, then open: `http://localhost:5678`

### 2. Import Workflows
In n8n:
1. Click **Menu → Workflows → Create New**
2. Click **Menu → Import from Clipboard**
3. Open each JSON file and paste content
4. Save each workflow

**Import in this order:**
1. `01-patient-db-setup.json`
2. `02-appointment-db-setup.json`
3. `03-reminder-db-setup.json`
4. `04-appointment-agent.json`
5. `05-reminder-agent.json`
6. `06-communication-agent.json`
7. `07-orchestration-workflow.json`
8. `08-input-form-workflow.json`

### 3. Setup Credentials
- Go to **Credentials → New → MongoDB**
- Enter: `mongodb://admin:password@localhost:27017`
- Select credential in each MongoDB node

### 4. Run Database Setup
- Open workflow `01-patient-db-setup.json`
- Click **Execute Workflow**
- Repeat for workflows 02 and 03

### 5. Activate Agents
Click **Activate** on workflows:
- `04-appointment-agent.json`
- `05-reminder-agent.json`
- `06-communication-agent.json`
- `07-orchestration-workflow.json`

### 6. Test
Open form: `http://localhost:5678/form/[workflow-id]`

---

## Common Commands

```powershell
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs n8n

# Restart
docker-compose restart n8n
```

## Need Help?
See `INSTALLATION_GUIDE.md` for detailed setup
