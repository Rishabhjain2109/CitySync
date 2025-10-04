# MongoDB Atlas Setup Guide

## Quick Setup Steps:

### 1. Create MongoDB Atlas Account
- Go to https://www.mongodb.com/atlas
- Sign up for free account
- Create a new cluster (free tier is fine)

### 2. Get Connection String
- Click "Connect" on your cluster
- Choose "Connect your application"
- Copy the connection string
- Replace `<password>` with your database user password

### 3. Update config.env
Replace the MONGODB_URI in `backend/config.env`:
```env
MONGODB_URI=mongodb+srv://yourusername:yourpassword@cluster0.xxxxx.mongodb.net/citysync?retryWrites=true&w=majority
```

### 4. Seed Database
```bash
npm run seed
```

### 5. Test Connection
```bash
npm run test-setup
```

## Enrollment Numbers Created:
- **Department Heads**: SEW001-SEW005, GAR001-GAR005, ROD001-ROD005, WAT001-WAT005, ELE001-ELE005
- **Workers**: SEW101-SEW115, GAR101-GAR115, ROD101-ROD115, WAT101-WAT115, ELE101-ELE115

## Test Users (password: password123):
- **Heads**: SEW001, GAR001, ROD001, WAT001, ELE001
- **Workers**: SEW101, GAR101, ROD101, WAT101, ELE101
