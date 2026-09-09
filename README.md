# Samaya

Backend untuk platform manajemen dan pemesanan event. Samaya menyediakan autentikasi pengguna, manajemen event dan kategori, tiket, banner, upload media, payment gateway, serta pengiriman email aktivasi secara asynchronous.

Project ini menggunakan modular monolith architecture berbasis domain pada backend dan Azure Functions sebagai worker untuk proses email.

## Fitur Utama

- Registrasi, login, aktivasi akun, dan profile pengguna
- Autentikasi berbasis JWT
- Role-based access control untuk admin dan member
- Manajemen kategori event
- Manajemen event berdasarkan ID dan slug
- Pagination dan pencarian event serta kategori
- Manajemen tiket
- Manajemen banner
- Pencarian data wilayah
- Upload gambar ke Azure Blob Storage menggunakan SAS URL
- Payment gateway
- Pengiriman email aktivasi melalui Azure Storage Queue dan Azure Functions
- Dokumentasi API menggunakan OpenAPI dan Scalar
- Centralized error handling
- Validasi request menggunakan Zod v4

## Struktur Project

```text
samaya/
├── backend/
│   ├── src/
│   │   ├── modules/
│   │   │   ├── authentication/
│   │   │   ├── banner/
│   │   │   ├── category/
│   │   │   ├── event/
│   │   │   ├── region/
│   │   │   ├── ticket/
│   │   │   └── upload/
│   │   ├── config/
│   │   ├── docs/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   └── utils/
│   └── package.json
├── workers/
│   ├── src/
│   │   └── functions/
│   │       └── emailQueueTrigger.ts
│   ├── host.json
│   └── package.json
└── README.md
```

Setiap module backend umumnya memiliki route, controller, service, validation, dan model sendiri.

## Teknologi

- Node.js
- TypeScript
- Express
- MongoDB dan Mongoose
- Zod v4
- JWT
- Azure Blob Storage
- Azure Storage Queue
- Azure Functions
- Azure Communication Services Email
- OpenAPI
- Scalar

## Arsitektur Layanan

```text
Client
  ↓
Azure App Service
  └── Express Backend
        ├── MongoDB
        ├── Azure Blob Storage
        └── Azure Storage Queue
              ↓
        Azure Function Worker
              ↓
        Azure Communication Services Email
```

### Email activation

1. User melakukan register melalui backend.
2. Backend membuat user dan activation code.
3. Backend memasukkan job email ke queue `email-activation-queue`.
4. Azure Function membaca job dari queue.
5. Worker mengirim email melalui Azure Communication Services.

### Upload media

1. Client meminta SAS upload URL ke backend.
2. Backend membuat URL sementara untuk Blob Storage.
3. Client meng-upload file langsung ke Azure Blob Storage.
4. Client memanggil endpoint confirm.
5. Backend memeriksa keberadaan, ukuran, dan tipe file.
6. `blobName` dapat disimpan sebagai field media pada category, event, atau banner.

## Persyaratan

Pastikan sudah tersedia:

- Node.js 22 atau versi yang kompatibel
- npm
- MongoDB atau MongoDB Atlas
- Azure Storage Account
- Azure Blob Storage container
- Azure Storage Queue
- Azure Communication Services Email
- Azure Functions Core Tools, jika menjalankan worker secara lokal

## Instalasi

Clone repository dan masuk ke folder project:

```bash
git clone <repository-url>
cd samaya
```

Install dependency backend:

```bash
cd backend
npm install
```

Install dependency worker:

```bash
cd ../workers
npm install
```

## Environment Variables Backend

Buat file `backend/.env`:

```env
PORT=3000
NODE_ENV=development
DATABASE_URL=mongodb://localhost:27017/samaya
ACCESS_TOKEN_SECRET=replace-with-a-strong-secret
APP_BASE_URL=http://localhost:3000

ACS_CONNECTION_STRING=<azure-communication-services-connection-string>
ACS_SENDER_ADDRESS=<verified-sender-address>

AZURE_STORAGE_CONNECTION_STRING=<azure-storage-connection-string>
AZURE_STORAGE_ACCOUNT_NAME=<storage-account-name>
AZURE_STORAGE_ACCOUNT_KEY=<storage-account-key>
AZURE_EMAIL_ACTIVATION_QUEUE_NAME=email-activation-queue
AZURE_BLOB_CONTAINER_NAME=samaya-media-public

MIDTRANS_MERCHANT_ID=<merchant-id>
MIDTRANS_CLIENT_KEY=<client-key>
MIDTRANS_SERVER_KEY=<server-key>
MIDTRANS_TRANSACTION_URL=<transaction-url>
```

Jangan commit `.env`, connection string, access key, atau secret ke repository.

## Environment Variables Worker

Untuk menjalankan Azure Function secara lokal, isi `workers/local.settings.json`:

```json
{
  "IsEncrypted": false,
  "Values": {
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "AzureWebJobsStorage": "<azure-storage-connection-string>",
    "ACS_CONNECTION_STRING": "<azure-communication-services-connection-string>",
    "ACS_SENDER_ADDRESS": "<verified-sender-address>"
  }
}
```

## Menjalankan Backend

```bash
cd backend
npm run dev
```

Backend berjalan pada:

```text
http://localhost:3000
```

Health check:

```text
GET http://localhost:3000/health
```

## Menjalankan Worker

Build worker:

```bash
cd workers
npm run build
```

Jalankan Azure Functions:

```bash
npm start
```

Worker akan membaca queue:

```text
email-activation-queue
```

## Dokumentasi API

Scalar tersedia pada:

```text
http://localhost:3000/api-docs
```

OpenAPI JSON tersedia pada:

```text
http://localhost:3000/api-docs/openapi.json
```

Base URL API:

```text
http://localhost:3000/api
```

Endpoint utama:

| Domain | Endpoint |
|---|---|
| Authentication | `/auth/register`, `/auth/login`, `/auth/me`, `/auth/activation` |
| Category | `/categories` |
| Event | `/events` dan `/events/:slug/slug` |
| Ticket | `/tickets` |
| Banner | `/banners` |
| Upload | `/uploads/request-url`, `/uploads/confirm` |
| Region | `/regions` |

Endpoint yang membutuhkan login menggunakan header:

```http
Authorization: Bearer <access-token>
```

Endpoint administratif juga membutuhkan role admin.

## Alur Upload Gambar

Request URL upload:

```http
POST /api/uploads/request-url
Authorization: Bearer <access-token>
Content-Type: application/json
```

Contoh body:

```json
{
  "fileName": "category-icon.png",
  "contentType": "image/png",
  "folder": "categories"
}
```

Upload file ke Azure menggunakan URL yang dikembalikan:

```http
PUT <uploadUrl>
x-ms-blob-type: BlockBlob
Content-Type: image/png
```

Kemudian konfirmasi:

```http
POST /api/uploads/confirm
Authorization: Bearer <access-token>
Content-Type: application/json
```

```json
{
  "blobName": "categories/<generated-file-name>.png"
}
```

## Kontribusi

- Merancang modular monolith architecture berbasis domain.
- Memisahkan tanggung jawab route, controller, service, validation, dan model.
- Menerapkan validasi request menggunakan Zod v4.
- Menerapkan JWT authentication dan role-based access control.
- Membangun centralized error handling.
- Mengintegrasikan Azure Blob Storage untuk upload media menggunakan SAS URL.
- Mengimplementasikan asynchronous email delivery menggunakan Azure Storage Queue dan Azure Functions.
- Mengintegrasikan payment gateway untuk proses pembayaran.
- Membuat dokumentasi API menggunakan OpenAPI dan Scalar.

## Deployment

Komponen deployment yang digunakan:

```text
Azure App Service
  └── Backend Express

Azure Function App
  └── Email Queue Worker

Azure Storage Account
  ├── Blob Storage
  └── Queue Storage

Azure Communication Services
  └── Email
```

Sebelum deployment:

1. Siapkan MongoDB production.
2. Buat Storage Account, Blob container, dan queue.
3. Konfigurasikan Azure Communication Services dan verified sender.
4. Masukkan environment variables melalui App Service Configuration dan Function App Configuration.
5. Deploy folder `backend` ke Azure App Service.
6. Deploy folder `workers` ke Azure Function App.
7. Uji health check, autentikasi, email, upload, category, event, ticket, dan payment.

## Catatan Keamanan

- Jangan menyimpan secret di source code.
- Jangan commit `.env` atau `local.settings.json`.
- Gunakan secret yang berbeda antara development dan production.
- Rotate Azure access key jika pernah terekspos.
- Jangan mencatat full SAS URL ke log.
- Batasi CORS hanya ke origin frontend production.
- Gunakan verified sender untuk Azure Communication Services.
