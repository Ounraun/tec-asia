# Text Formatter Utility

ฟังก์ชั่น utility สำหรับจัดการข้อความที่มีการขึ้นบรรทัดใหม่ (line breaks) ให้แสดงผลถูกต้องใน React components

## ตำแหน่งไฟล์
```
src/utils/textFormatter.tsx
```

## ฟังก์ชั่นที่มีให้ใช้งาน

### 1. `formatTextWithLineBreaks(text: string)`
แปลงข้อความที่มี `\n` ให้เป็น JSX elements พร้อม `<br />` tags

### 2. `formatTextWithAllLineBreaks(text: string)`
รองรับหลายรูปแบบการขึ้นบรรทัดใหม่:
- `\n` (Unix/Linux)
- `\r\n` (Windows)  
- `\r` (Mac เก่า)

### 3. `preserveTextFormatting(text: string)`
รักษาการจัดรูปแบบข้อความและการขึ้นบรรทัดใหม่

## วิธีการใช้งาน

### Import ฟังก์ชั่น
```tsx
import { formatTextWithLineBreaks } from "@/utils/textFormatter";
```

### ใช้งานใน Component
```tsx
// ใน Digital Transformation
<div className={styles.description}>
  {formatTextWithLineBreaks(transformationItem?.subTitle || "")}
</div>

// ใน Data Management
<div className={styles.descriptionBox}>
  {formatTextWithLineBreaks(services?.subTitle1 || "")}
</div>

// ใน Multimedia
<p>
  {formatTextWithLineBreaks(item.content || "")}
</p>
```

## ตัวอย่างการทำงาน

### Input (จาก backend/CMS):
```
"บริการ Data Management\nขั้นสูง\nสำหรับองค์กร"
```

### Output (HTML):
```html
<span>บริการ Data Management</span>
<br />
<span>ขั้นสูง</span>
<br />
<span>สำหรับองค์กร</span>
```

## CSS ที่ต้องมี

เพื่อให้ text แสดงผลถูกต้อง ควรเพิ่ม CSS properties:

```css
.description {
  text-align: left;          /* ชิดซ้าย */
  white-space: pre-wrap;     /* รักษา whitespace */
  line-height: 1.6;          /* ระยะห่างบรรทัดที่เหมาะสม */
}
```

## หน้าที่ใช้งานแล้ว

✅ **Digital Transformation** - `.description`
- ใช้ `formatTextWithLineBreaks` สำหรับ `subTitle`
- CSS: `text-align: left`, `white-space: pre-wrap`

## หน้าที่ควรปรับปรุง

📝 **Data Management** - `.descriptionBox`
- ใช้สำหรับ `subTitle1` และ `subTitle2`

📝 **Multimedia** - `.serviceCard p`
- ใช้สำหรับ `item.content`

📝 **Network Solution** - text content
📝 **Centralize Management** - text content  
📝 **Data Center** - text content

## ข้อดีของการใช้ฟังก์ชั่นนี้

1. **ใช้งานซ้ำได้** - ใช้ได้กับทุกหน้าที่ต้องการ
2. **จัดการครบ** - รองรับ line breaks หลายรูปแบบ
3. **ปลอดภัย** - มีการตรวจสอบ null/undefined
4. **SEO Friendly** - ข้อความยังคงเป็น text ปกติ ไม่ใช่ dangerouslySetInnerHTML