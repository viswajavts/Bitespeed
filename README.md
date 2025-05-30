# 🧠 Bitespeed Identity Reconciliation API

A backend API for reconciling user identities across multiple sources using email and phone numbers. Built with **Node.js**, **Express**, **TypeScript**, **PostgreSQL**, and **Prisma**.

---

## 🔗 Hosted URL

> https://bitespeed-git-main-viswajas-projects-8c478dfa.vercel.app 


---

## 📦 Tech Stack

- 🔹 Node.js + Express
- 🔸 TypeScript
- 🐘 PostgreSQL
- 🌿 Prisma ORM

---

## 🔧 Setup Instructions

Clone the repository and set up the environment:

```bash
git clone https://github.com/YOUR_USERNAME/Bitespeed.git
cd Bitespeed
npm install
```

### 🛠️ Prisma Setup

Generate the Prisma client and run initial migration:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 🚀 Start the Server

```bash
npm run dev
```

> The server should now be running at `http://localhost:3000`

---

## 🧪 API Testing Checklist

Use **Postman**, **Hoppscotch**, or `curl` to test the API.

### `POST /identify`

Accepts either an `email`, `phoneNumber`, or both, and returns the linked contact record.

#### Request Body
```json
{
  "email": "john@example.com",
  "phoneNumber": "1234567890"
}
```

#### Response
```json
{
  "contact": {
    "primaryContactId": 1,
    "emails": ["john@example.com"],
    "phoneNumbers": ["1234567890"],
    "secondaryContactIds": [2]
  }
}
```

---

## 🧠 Contact Linking Logic

### 🔁 Reconciliation Rules:
1. **If no contact exists** → Create a new primary contact.  
2. **If one exists** → Link as secondary (if not already primary).  
3. **If both email and phone match different contacts** → Merge them, retaining the older as primary.  
4. **Prevent duplicates** → Link new identifiers to existing contacts.  

---

## 🏗️ Architecture Diagram

```
            +----------------------+
            |     POST /identify   |
            +----------------------+
                       |
        +--------------+--------------+
        |                             |
+---------------+          +----------------------+
|  Find matches |          |    No matches found  |
+---------------+          +----------------------+
        |                             |
+----------------------------+     Create new primary
|     Merge or link logic    |     contact entry
+----------------------------+
```

---

## ✅ Test Cases

### 🔹 New Contact
```bash
curl -X POST http://localhost:3000/identify \
-H "Content-Type: application/json" \
-d '{"email":"alice@example.com", "phoneNumber":"1111111111"}'
```

### 🔹 Existing Email, New Phone
```bash
curl -X POST http://localhost:3000/identify \
-d '{"email":"alice@example.com", "phoneNumber":"9999999999"}'
```

### 🔹 Conflicting Match (Different contacts with same email/phone)
This will trigger a merge and retain the oldest contact as primary.

---


### 💡 GET `/health`

Check server status.

#### Response

```json
{
  "status": "ok"
}
```

---

### 🌐 GET `/`

Returns API metadata (basic info or welcome message).

---

### ❌ GET `/invalid-route`

Any invalid route should return:

```json
{
  "success": false,
  "message": "Route not found"
}
```

---

## 📤 GitHub Push Commands

If you haven't already, push your project to GitHub:

```bash
git init
git add .
git commit -m "Final modularized Bitespeed backend"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/Bitespeed.git
git push -u origin main
```

---

## ☁️ Deploy to Render (Optional)

You can deploy this project to Render with the following:

1. Go to [https://render.com](https://render.com)
2. Create a new Web Service
3. Connect your GitHub repo
4. Use the following settings:
   - Build Command: `npm install && npx prisma generate && npx prisma migrate deploy`
   - Start Command: `npm run dev` or `node dist/index.js`
   - Environment Variables: set your `DATABASE_URL`

Need help? I can send you a 1-click setup or guide you step-by-step.

---

## ✅ Author

**Viswaja Vorugonda**  
_IIT Bhubaneswar | Backend Developer | AI Enthusiast_

---

## 📄 License

This project is for the Bitespeed Backend Engineering Task. Please do not use without attribution.
