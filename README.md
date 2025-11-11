# TEC Asia Frontend

Frontend application built with React, TypeScript, and Vite.

## 📋 ความต้องการของระบบ

- Node.js (เวอร์ชัน 18 หรือสูงกว่า)
- npm หรือ yarn

## 🚀 การติดตั้ง

1. ติดตั้ง dependencies:

```bash
npm install
```

2. สร้างไฟล์ `.env` ในโฟลเดอร์ root ของโปรเจกต์:

```env
VITE_API_URL=http://localhost:1337
```

สำหรับ production ให้เปลี่ยนเป็น URL ของ production API:

```env
VITE_API_URL=https://api.yourdomain.com
```

## 🛠️ การรันโปรเจกต์

### Development Mode

```bash
npm run dev
```

แอปพลิเคชันจะรันที่ `http://localhost:5173`

### Build สำหรับ Production

```bash
npm run build
```

ไฟล์ที่ build จะอยู่ในโฟลเดอร์ `dist/`

### Preview Production Build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## 📁 โครงสร้างโปรเจกต์

```
frontend/
├── public/          # ไฟล์ static
├── src/
│   ├── components/  # React components
│   ├── pages/      # หน้า pages
│   ├── services/    # API services
│   ├── types/       # TypeScript types
│   ├── locales/     # ไฟล์ภาษา (i18n)
│   └── utils/       # Utility functions
├── package.json
└── vite.config.ts
```

## 🔧 Environment Variables

| Variable       | Description                | Required |
| -------------- | -------------------------- | -------- |
| `VITE_API_URL` | URL ของ Strapi API backend | ✅       |

## 📝 หมายเหตุ

- ไฟล์ `.env` จะไม่ถูก commit ไปยัง repository (อยู่ใน .gitignore)
- สำหรับ production ควรสร้างไฟล์ `.env.production` แยกต่างหาก
