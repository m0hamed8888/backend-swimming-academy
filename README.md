# 🏊 AquaElite Backend — دليل الإعداد الكامل

## المتطلبات
- Node.js v18+
- حساب MongoDB Atlas (مجاني)

---

## 1. إعداد MongoDB Atlas

1. اذهب إلى [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas) وسجّل حساب مجاني
2. أنشئ **Cluster** جديد (Free Tier M0)
3. من **Database Access** → أنشئ مستخدم بـ username وpassword
4. من **Network Access** → أضف `0.0.0.0/0` للسماح بكل IPs
5. من **Clusters** → اضغط **Connect** → **Drivers** → انسخ الـ connection string

---

## 2. إعداد الـ .env

افتح ملف `.env` وعدّل:
```env
MONGO_URI=mongodb+srv://YOUR_USER:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/aquaelite?retryWrites=true&w=majority
JWT_SECRET=any_long_random_string_here
FRONTEND_URL=http://127.0.0.1:5500
```

---

## 3. تثبيت وتشغيل الـ Backend

```bash
cd aquaelite-backend
npm install
npm run dev        # للتطوير (nodemon)
# أو
npm start          # للإنتاج
```

ستظهر:
```
✅  MongoDB connected
🚀  AquaElite API running on http://localhost:5000
```

---

## 4. إنشاء أول حساب كابتن

افتح **Postman** أو **Thunder Client** وأرسل:

```
POST http://localhost:5000/api/auth/register-trainer
Content-Type: application/json

{
  "name": "الكابتن محمود",
  "username": "mahmoud",
  "password": "123456"
}
```

---

## 5. تشغيل الفرونت اند

افتح **VS Code** → تثبيت **Live Server** extension → افتح `register.html` بـ Live Server

عنوان صفحة الكابتن: افتح `trainer.html` مباشرة في المتصفح

---

## API Endpoints المتاحة

| Method | Endpoint | الوصف | حماية |
|--------|----------|-------|-------|
| POST | `/api/auth/login` | تسجيل دخول الكابتن | — |
| POST | `/api/auth/register-trainer` | إنشاء حساب كابتن | — |
| GET  | `/api/auth/me` | بيانات الكابتن الحالي | ✅ |
| POST | `/api/swimmers/register` | تسجيل سباح جديد | — |
| GET  | `/api/swimmers/:subscriptionId` | بحث بالرقم | — |
| GET  | `/api/swimmers` | كل السباحين | ✅ |
| PUT  | `/api/swimmers/:id` | تحديث بيانات سباح | ✅ |
| POST | `/api/attendance` | تسجيل حضور/غياب | ✅ |
| GET  | `/api/attendance/:id/week` | حضور الأسبوع | — |
| GET  | `/api/attendance/:id/all` | كل سجل الحضور | ✅ |

---

## هيكل المشروع

```
aquaelite-backend/
├── server.js              ← Entry point
├── .env                   ← بياناتك السرية
├── models/
│   ├── Swimmer.js         ← نموذج السباح (كل حقول الفورم)
│   ├── Attendance.js      ← سجل الحضور والغياب
│   └── Trainer.js         ← حسابات الكابتن
├── routes/
│   ├── auth.js            ← تسجيل دخول الكابتن
│   ├── swimmers.js        ← تسجيل + بحث + قائمة
│   └── attendance.js      ← حضور وغياب
├── middleware/
│   └── auth.js            ← JWT protection
└── trainer.html           ← لوحة تحكم الكابتن
```

---

## Flow كامل

```
register.html               trainer.html
     │                           │
     │ POST /swimmers/register   │ POST /auth/login
     │                           │ GET  /swimmers
     │                           │ POST /swimmers/register
     │                           │ POST /attendance
     │                           │
     └──────── MongoDB Atlas ────┘
                    │
              GET /swimmers/:id
              GET /attendance/:id/week
                    │
              register.html (Search Modal)
```

---

## الترقية للإنتاج (Railway/Render)

1. ارفع المشروع على GitHub
2. على Railway: New Project → Deploy from GitHub
3. أضف الـ Environment Variables من الـ `.env`
4. عدّل `FRONTEND_URL` لعنوان الموقع الحقيقي
5. عدّل `API_BASE` في `script.js` و `trainer.html` لعنوان الـ API الجديد
