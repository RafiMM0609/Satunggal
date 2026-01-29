# Fitur Pembayaran dan Review - Dokumentasi

## Ringkasan

Fitur pembayaran dan review memungkinkan client untuk:
- Melihat daftar proyek yang telah selesai dikerjakan dan menunggu review
- Melakukan review terhadap pekerjaan freelancer
- Mengajukan permintaan revisi jika ada yang kurang
- Melakukan pembayaran melalui Solana Web3 network

Fitur ini hanya dapat diakses oleh user dengan role `client`.

---

## Komponen yang Diimplementasikan

### 1. **Review Component** (`components/Review.tsx`)

Halaman utama untuk review dan pembayaran proyek.

**Fitur:**
- Display statistik proyek (Menunggu Review, Siap Dibayar, Sudah Dibayar)
- List proyek yang diorganisir berdasarkan status
- Navigasi kembali ke dashboard

**Props:**
```typescript
interface ReviewProps {
  onNavigateBack: () => void;
}
```

**Status Proyek:**
- `pending_review`: Menunggu persetujuan client
- `ready_payment`: Proyek disetujui, siap untuk pembayaran
- `paid`: Pembayaran sudah selesai

---

### 2. **ProjectReviewCard Component** (`components/ProjectReviewCard.tsx`)

Kartu yang menampilkan detail proyek dengan action buttons.

**Fitur:**
- Detail proyek (judul, freelancer, deskripsi)
- List deliverables
- Status badge dinamis
- Tombol aksi (Revisi, Setujui, Bayar)
- Hanya menampilkan buttons sesuai status proyek

**Props:**
```typescript
interface ProjectReviewCardProps {
  project: Project;
  onRequestRevision: (projectId: number) => void;
  onPayment: (projectId: number) => void;
  onViewDetails: (projectId: number) => void;
}

interface Project {
  id: number;
  title: string;
  freelancer: string;
  status: 'pending_review' | 'ready_payment' | 'paid';
  completedDate: string;
  amount: number;
  description: string;
  deliverables: string[];
}
```

**Status Bagian:**
- **Pending Review**: Tampil tombol "Revisi" dan "Setujui"
- **Ready Payment**: Tampil tombol "Bayar Sekarang"
- **Paid**: Tombol disabled dengan status "Pembayaran Selesai"

---

### 3. **RevisionRequestModal Component** (`components/RevisionRequestModal.tsx`)

Modal untuk mengajukan permintaan revisi.

**Fitur:**
- Text area untuk catatan revisi
- Support lampiran file (UI placeholder)
- Validasi input tidak boleh kosong
- Button submit dan cancel

**Props:**
```typescript
interface RevisionRequestModalProps {
  isOpen: boolean;
  projectTitle: string;
  onClose: () => void;
  onSubmit: (notes: string) => void;
}
```

**Alur:**
1. User memasukkan catatan revisi
2. Pilih file lampiran (opsional)
3. Submit permintaan
4. Modal tertutup dan data dikirim

---

### 4. **PaymentModal Component** (`components/PaymentModal.tsx`)

Modal untuk proses pembayaran menggunakan Solana Web3.

**Fitur:**
- Multi-step form (Confirmation → Wallet Connection → Processing → Success)
- Review detail pembayaran
- Koneksi wallet Solana
- Simulasi proses pembayaran
- Konfirmasi sukses dengan detail transaksi

**Props:**
```typescript
interface PaymentModalProps {
  isOpen: boolean;
  projectTitle: string;
  amount: number;
  onClose: () => void;
  onPayment: (walletAddress: string) => void;
}
```

**Step-by-step:**

**Step 1: Confirmation**
- Review detail pembayaran
- Lihat jumlah yang akan dibayarkan
- Button "Lanjutkan"

**Step 2: Wallet Connection**
- Pilih wallet provider (Phantom/Sollet)
- Atau input alamat wallet Solana manual
- Validasi format alamat
- Warning tentang transaksi tidak dapat dibatalkan

**Step 3: Processing**
- Loading state dengan animasi
- Message "Memproses Pembayaran"

**Step 4: Success**
- Konfirmasi pembayaran berhasil
- Display alamat wallet yang digunakan
- Button "Selesai"

---

## Integrasi dengan Dashboard

### Navigasi di Sidebar

```typescript
// Untuk Freelancer:
- Overview
- Pekerjaan
- Keuangan
- Profil Saya

// Untuk Client:
- Overview
- Review        ← NEW
- Keuangan
- Profil Saya
```

Menu **Review** hanya muncul untuk user dengan `role === 'client'`.

### Kondisional Render

Dashboard meng-check `currentPage` state dan render komponen sesuai:
- `'overview'` → Dashboard overview
- `'pekerjaan'` → Pekerjaan component (untuk freelancer)
- `'review'` → Review component (untuk client) ← NEW
- `'keuangan'` → Keuangan page
- `'profil'` → Profil page

---

## Mock Data Struktur

Contoh data proyek yang digunakan:

```typescript
const mockProjects: Project[] = [
  {
    id: 1,
    title: 'Desain Landing Page Website',
    freelancer: 'Adi Pratama',
    status: 'pending_review',
    completedDate: '28 Januari 2026',
    amount: 5000000,
    description: 'Pembuatan design landing page untuk startup teknologi...',
    deliverables: [
      'Design mockup Figma (desktop & mobile)',
      'Design system lengkap',
      'Interactive prototype',
      'Design documentation',
    ],
  },
  // ... lebih banyak proyek
];
```

---

## Styling dan UI

### Tema Warna Berdasarkan Status

| Status | Warna | Icon |
|--------|-------|------|
| Pending Review | Blue | Clock |
| Ready Payment | Emerald | CheckCircle2 |
| Paid | Slate | CheckCircle2 |

### Komponen UI yang Digunakan

- **Cards**: Rounded corners 3xl (rounded-3xl)
- **Buttons**: Primary (blue), Secondary (amber), Success (emerald)
- **Modals**: Dengan backdrop blur dan shadow
- **Icons**: Dari library `lucide-react`
- **Colors**: Tailwind palette (blue, amber, emerald, slate)

---

## Integrasi Web3 (Future)

Saat ini modal payment hanya menampilkan UI. Untuk integrasi actual Solana Web3:

1. Install dependencies:
   ```bash
   npm install @solana/web3.js @solana/wallet-adapter-react
   ```

2. Update `PaymentModal.tsx` untuk:
   - Connect ke wallet menggunakan Phantom/Sollet adapter
   - Create dan sign transaction
   - Broadcast ke Solana mainnet/devnet
   - Handle transaction confirmation

3. Update `Review.tsx`:
   - Fetch actual project data dari API
   - Store payment history di database
   - Update project status setelah pembayaran sukses

---

## File Baru yang Ditambahkan

```
components/
├── Review.tsx                    (NEW)
├── ProjectReviewCard.tsx         (NEW)
├── RevisionRequestModal.tsx      (NEW)
├── PaymentModal.tsx              (NEW)
├── Dashboard.tsx                 (UPDATED)
├── Pekerjaan.tsx                 (existing)
└── AddEditJobModal.tsx           (existing)
```

---

## Testing Fitur

### Untuk Client User:

1. Login sebagai client
2. Klik menu "Review" di sidebar
3. Lihat list proyek dengan berbagai status
4. Test buttons:
   - **"Revisi"** → Buka RevisionRequestModal
   - **"Setujui"** → Update status ke "ready_payment"
   - **"Bayar Sekarang"** → Buka PaymentModal
5. Di PaymentModal:
   - Confirm payment
   - Input wallet address
   - Simulasi pembayaran
   - Lihat success message

### Mock Data Default

Sudah tersedia 3 proyek mock untuk testing:
1. Proyek dengan status `pending_review`
2. Proyek dengan status `ready_payment`
3. Proyek dengan status `paid`

---

## Notes

- User role checking dilakukan di component level untuk visibility menu
- Modal state management menggunakan local state di Review component
- Revisi dan pembayaran handlers saat ini hanya show alerts
- Untuk production, perlu integrate dengan API backend
- Web3 integration akan dilakukan di fase selanjutnya

---

## Roadmap Selanjutnya

- [ ] Integrate dengan backend API untuk fetch data proyek
- [ ] Implement Solana Web3 payment integration
- [ ] Add payment history & transaction tracking
- [ ] Email notifications untuk client & freelancer
- [ ] File upload support untuk revisi attachments
- [ ] Project timeline & activity history
- [ ] Payment analytics & reporting
