# TEC Asia Frontend

React, TypeScript, and Vite web application for the TEC Asia marketing site and knowledge hub.

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [System Requirements](#system-requirements)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Styling Guidelines](#styling-guidelines)
- [Localization (i18n)](#localization-i18n)
- [API and Data](#api-and-data)
- [Build and Deployment](#build-and-deployment)
- [Troubleshooting](#troubleshooting)
- [Useful Links](#useful-links)

## Overview

- เว็บไซต์นำเสนอ Solutions, Community, และ Meeting Services ของ TEC Asia
- Single Page Application ที่ปรับแต่งด้วย React Router และ component-based design
- รองรับภาษาไทยและอังกฤษผ่านระบบ i18n
- เชื่อมต่อข้อมูลแบบ headless ผ่าน Strapi backend

## Key Features

- Service & Solution landing pages พร้อมเอฟเฟ็กต์แบบ gradient และ animation
- Community knowledge base พร้อมบทความ detail page
- Meeting room booking flow ครบถ้วนตั้งแต่สร้างถึงยืนยัน
- Global theming ผ่าน CSS custom properties (colors, typography, shadows)
- Reusable navigation, cards, และ particle background components

## Tech Stack

- React 18 + TypeScript
- Vite build tool และ dev server
- React Router DOM (ผ่านไฟล์ `src/main.tsx`)
- i18next สำหรับการจัดการภาษา (`src/i18n.ts`)
- Axios-like fetch wrapper ใน `src/services/strapi.ts`
- CSS Modules + global stylesheet (`src/index.css`) สำหรับธีมกลาง

## System Requirements

- Node.js 18 LTS หรือสูงกว่า (แนะนำเวอร์ชันเดียวกับ backend)
- npm 9+ หรือใช้ pnpm/yarn ตามที่ถนัด (ตัวอย่างใน README ใช้ npm)
- Access ถึง Strapi backend (ภายใน repo มีโฟลเดอร์ `../backend`)

ตรวจสอบเวอร์ชันปัจจุบัน:

```bash
node -v
npm -v
```

## Getting Started

1. Clone repository และ checkout branch ที่ต้องการ
2. ติดตั้ง dependencies:

   ```bash
   npm install
   ```

3. สร้างไฟล์ environment:

   ```env
   # .env (สำหรับ development)
   VITE_API_URL=http://localhost:1337
   ```

   สำหรับ production เปลี่ยนเป็น URL ของ API จริง เช่น:

   ```env
   VITE_API_URL=https://api.yourdomain.com
   ```

4. รันโหมดพัฒนา:

   ```bash
   npm run dev
   ```

   เปิดเบราว์เซอร์ที่ `http://localhost:5173`

5. เปิด Strapi backend (หากต้องการข้อมูลจาก CMS):

   ```bash
   npm run develop --prefix ../backend
   ```

## Available Scripts

| Command             | Description                                                          |
| ------------------- | -------------------------------------------------------------------- |
| `npm run dev`       | รัน Vite dev server พร้อม hot module replacement                     |
| `npm run build`     | สร้าง production bundle ไว้ในโฟลเดอร์ `dist/`                        |
| `npm run preview`   | เสิร์ฟไฟล์ที่ build แล้วด้วย Vite preview server                     |
| `npm run lint`      | ตรวจสอบคุณภาพโค้ดด้วย ESLint (ใช้ configs จาก `eslint.config.js`)    |
| `npm run typecheck` | ตรวจสอบ TypeScript types (ถ้าต้องการ เพิ่ม script ใน `package.json`) |

> หมายเหตุ: หากใช้ package manager อื่น เช่น pnpm หรือ yarn ให้แทนคำสั่ง npm ตามนั้น

## Project Structure

โฟลเดอร์สำคัญใน `frontend/`:

- `public/` : asset แบบ static (ไม่ผ่าน bundler)
- `src/main.tsx` : application entry และ router setup
- `src/index.css` : global reset + CSS custom properties สำหรับธีม
- `src/components/` : shared React components (Navbar, Contact, ServicesNav, เป็นต้น)
- `src/pages/` : page-level components แยกตาม feature (AboutUs, Community, Meeting, ServicesAndSolutions)
- `src/features/services/navItems.ts` : ข้อมูลเมนูสำหรับ Services navigation
- `src/locales/en.json`, `src/locales/th.json` : ไฟล์ภาษาไทย/อังกฤษ
- `src/services/strapi.ts` : ฟังก์ชันเรียก Strapi API และ helper สำหรับ query parameters
- `src/types/` : TypeScript interface และ type definitions สำหรับ data models
- `src/utils/` : utility functions เช่น text formatter

## Styling Guidelines

- ใช้ CSS Modules สำหรับ component/page เฉพาะเพื่อลด scope collision
- ตัวแปรสีและตัวอักษรกำหนดไว้ใน `src/index.css` (เช่น `--color-brand-sky`, `--font-heading`)
- Layout ขนาดใหญ่ใช้ clamp/responsive units เพื่อรองรับหน้าจอหลายขนาด
- หลีกเลี่ยงการเพิ่มสีใหม่โดยตรง ให้ reuse custom properties ที่ประกาศแล้ว
- ขจัด comment ที่ไม่จำเป็นในไฟล์ CSS ตามมาตรฐานทีม (clean stylesheets)

## Localization (i18n)

- ระบบแปลภาษาถูกตั้งค่าใน `src/i18n.ts`
- ไฟล์ json ภาษาอยู่ใน `src/locales/`
- ใช้ hook `useTranslation()` จาก `react-i18next` ภายใน component
- เมื่อเพิ่ม key ใหม่ ตรวจสอบให้ทั้ง `en.json` และ `th.json` มีค่าเหมือนกันเพื่อป้องกัน missing translation

## API and Data

- Backend หลักคือ Strapi CMS (`../backend`)
- ค่า `VITE_API_URL` ควรชี้ไปยัง Strapi instance ที่พร้อมใช้งาน
- ฟังก์ชัน helper สำหรับเรียก API อยู่ใน `src/services/strapi.ts`
- Typescript types ของแต่ละโมดูลเช่น `src/types/dataCenter.ts`, `src/types/multimedia.ts`
- หาก schema ใน Strapi เปลี่ยน ให้ปรับ type/mapper ให้ตรงกัน

## Build and Deployment

1. สั่ง build:

   ```bash
   npm run build
   ```

2. ตรวจสอบ output ผ่าน preview server:

   ```bash
   npm run preview
   ```

3. Deploy ไฟล์ใน `dist/` ไปยัง static host ที่รองรับ (เช่น Netlify, Vercel, S3 + CloudFront)

4. กำหนด environment variables บน hosting ให้ตรงกับ production API

### CI/CD (แนะนำ)

- ติดตั้ง dependency ด้วย `npm ci`
- รัน `npm run lint` ก่อน build เพื่อป้องกันปัญหาโค้ด
- รัน `npm run build`
- เก็บ artifact จากโฟลเดอร์ `dist/`

## Troubleshooting

- **ปัญหา 404 เมื่อตั้งค่า API URL**: ตรวจสอบว่า `VITE_API_URL` ไม่มี slash เกิน เช่น `https://api.example.com` ไม่ต้องลงท้ายด้วย `/`
- **CORS error**: กำหนด allowed origins ในฝั่ง Strapi (`config/middlewares.js` ใน backend)
- **Fonts/Colors ไม่ตรงดีไซน์**: ตรวจสอบว่าไม่ได้ override custom properties ใน CSS module โดยตรง
- **Build ล้มเหลวบน Node รุ่นเก่า**: อัปเกรด Node อย่างน้อย version 18 LTS

## Useful Links

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [i18next Guide](https://www.i18next.com/)
- [Strapi Documentation](https://docs.strapi.io/)

> ติดต่อทีม Frontend: โปรดเปิด issue หรือพูดคุยในช่องทาง internal communication ของทีม (เช่น Slack/Teams)
