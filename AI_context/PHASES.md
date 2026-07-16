PHASES.md — DapurHPP Development Plan

    File ini adalah AI context untuk pengerjaan project DapurHPP.
    Update status setiap selesai satu task.

Stack

    Backend: NestJS + Prisma + MySQL (REST API, port 3001)
    Frontend: Next.js 16 App Router + TypeScript + Tailwind v4 + Shadcn
    Auth: JWT (access token, bcrypt password) — dual storage: Zustand+localStorage (client) & cookie "auth-token" (server/proxy.ts)
    Polyrepo: dapurhpp-api + dapurhpp-fe

Status Legend

    [ ] Belum dikerjakan
    [~] Sedang dikerjakan
    [x] Selesai

PHASE 0 — Project Setup

Polyrepo & Config

    [x] Init folder struktur polyrepo (dapurhpp-api/, dapurhpp-fe/)
    [x] Setup .env.example
    [x] Setup prisma/schema.prisma (sudah final — 10 tabel)
    [x] npx prisma migrate dev --name init
    [x] npx prisma db seed — verifikasi data masuk
    [ ] ⚠️ TODO: DATABASE_URL masih pakai root MySQL, seharusnya pakai user dapurhpp_user

Backend Init (NestJS)

    [x] nest new dapurhpp-api
    [x] Install semua dependency (prisma, jwt, passport, bcrypt, class-validator, dll)
    [x] Setup PrismaModule, ConfigModule (global), CORS, global ValidationPipe

Frontend Init (Next.js)

    [x] create-next-app TypeScript + Tailwind v4 + App Router
    [x] Install: shadcn-ui, react-hook-form, zod, axios, zustand, recharts
    [x] Setup folder struktur: app/, components/, lib/, hooks/, services/

PHASE 1 — Auth

Backend

    [x] AuthModule, UsersModule
    [x] POST /auth/register, POST /auth/login (return JWT), GET /auth/me
    [x] JwtAuthGuard + JwtStrategy

Frontend

    [x] Halaman /login dan /register (dark card #2A1711 + cream form style)
    [x] Landing page
    [x] Zustand store dual storage (localStorage + cookie auth-token)
    [x] axios instance dengan Bearer token interceptor
    [x] Protected route via proxy.ts (BUKAN middleware.ts — export namanya "proxy")

PHASE 2 — Master Data (Bahan Baku + Supplier)

Backend

    [x] BahanBakuModule — GET/POST/PATCH/DELETE + soft delete
    [x] GET /bahan-baku/:id/riwayat-harga — dari detail_belanja JOIN belanja
    [x] POST /bahan-baku/:id/upload-foto — multer, simpan ke uploads/bahan-baku/
    [x] SupplierModule — GET/POST/PATCH/DELETE + soft delete

Frontend

    [x] Halaman Master Bahan Baku — list + search + pagination (7 per halaman)
    [x] BahanBakuTable — kolom: foto/emoji kategori, nama, kategori badge, satuan, harga terakhir, STOK (merah/hijau), terakhir update, aksi
    [x] BahanBakuForm — tambah/edit, upload foto, field stok READ-ONLY saat edit (stok dikontrol otomatis oleh belanja)
    [x] BahanBakuDetail — info lengkap, PriceHistoryChart (Recharts LineChart + tabel riwayat), stok progress bar
    [x] Halaman Supplier — list + form tambah/edit
    [x] kategoriBadge helper (emoji per kategori: TEPUNG/MINYAK/SAYURAN/BUMBU/DAGING/LAINNYA)

PHASE 3 — Resep & HPP

Backend

    [x] ResepModule — GET/POST/PATCH/DELETE + soft delete
    [x] GET /resep — list + kalkulasi hppPerPcs live dari hargaTerakhir
    [x] GET /resep/:id — detail + breakdown per bahan + marginPersen
    [x] POST /resep/:id/upload-foto — multer, simpan ke uploads/resep/
    [x] Field catatan (TEXT nullable) sudah di-migrate ke tabel resep
    [x] HppService — hpp_per_pcs = Σ(jumlah × hargaTerakhir) / estimasiHasil
    [x] SimulasiService — pure calculation, tidak disimpan ke DB

Frontend

    [x] Tab Resep — list card (foto/fallback ChefHat, nama, HPP/pcs, hasil/batch), search, pagination client-side
    [x] Halaman Detail Resep — tabel bahan, Ringkasan HPP card, Catatan card
    [x] ResepForm — dynamic bahan list, preview HPP realtime, field catatan opsional
    [x] SimulasiHarga modal — preset margin 10/20/30/40/custom, rumus visual
    [x] ResepDetail — edit modal, delete confirm modal, breadcrumb

PHASE 4 — Belanja

Backend

    [x] BelanjaModule — GET/POST/PATCH/DELETE (hard delete)
    [x] GET /belanja/ringkasan?tanggal=YYYY-MM-DD — stats harian (totalBelanja, jumlahItem, totalQty, jumlahSupplier, list)
    [x] POST /belanja — atomic transaction: create + update hargaTerakhir (cek belanja lebih baru) + INCREMENT stok
    [x] PATCH /belanja/:id — rollback stok lama → hapus detail lama → buat baru → tambah stok baru
    [x] DELETE /belanja/:id — rollback stok → hard delete
    [x] ⚠️ STOK OPTION B AKTIF: stok auto-update dari belanja. Tidak pernah negatif (Math.max(0, ...))

Frontend

    [x] Halaman Belanja — navigasi tanggal (prev/next/today/date picker), 4 stats cards selalu tampil
    [x] BelanjaTable — kolom: tanggal, supplier, jumlah item, total belanja, aksi tombol "Detail"
    [x] BelanjaForm — ⚠️ INPUT DIUBAH: kolom TOTAL BAYAR (bukan harga satuan). hargaSatuan = totalBayar / jumlah dihitung otomatis. Dropdown bahan tampilkan sisa stok.
    [x] Halaman /belanja/riwayat — filter tanggalMulai/tanggalAkhir/supplier
    [x] Halaman /belanja/:id — detail + hapus
    [x] Tombol "Riwayat" di header, totalQty label = "unit" (bukan "kg")

PHASE 5 — Produksi & Penjualan

Backend

    [x] ProduksiModule
        [x] GET /produksi — list per user + filter tanggal
        [x] POST /produksi — snapshot HPP (hppPerPcs + totalModal), status DRAFT
        [x] PATCH /produksi/:id — update hasilNyata, recalculate totalModal, status → SELESAI (hanya dari DRAFT)
        [x] DELETE /produksi/:id — set status BATAL (hanya dari DRAFT)
    [x] PenjualanModule
        [x] GET /penjualan — list per user + filter tanggal
        [x] POST /penjualan — hitung totalPendapatan + sisa, status OPEN
        [x] PATCH /penjualan/:id — update terjual atau close (CLOSED)

Frontend

    [ ] Tab Produksi — list per tanggal, status badge (DRAFT/SELESAI/BATAL)
    [ ] Form tambah produksi — pilih resep, input hasilNyata, preview HPP snapshot
    [ ] Detail produksi — breakdown HPP, tombol selesaikan/batalkan
    [ ] Tab Penjualan — list per tanggal, total pendapatan + laba
    [ ] Form tambah penjualan — pilih produksi (status SELESAI), input terjual + harga jual
    [ ] Summary: total pendapatan, total HPP, laba

PHASE 6 — Pengeluaran Lain

Backend

    [x] PengeluaranLainModule — GET/POST/PATCH/DELETE (filter by tanggal)

Frontend

    [ ] Form tambah pengeluaran lain (nama + jumlah)
    [ ] List pengeluaran lain per tanggal

PHASE 7 — Laporan & Dashboard

Backend

    [x] LaporanModule
        [x] GET /laporan/ringkasan
        [x] GET /laporan/grafik-laba?days=7|30|90|180
        [x] GET /laporan/distribusi-hpp
        [x] GET /laporan/aktivitas-terbaru
        [x] GET /laporan/produk-terlaris
        (semua pakai JwtAuthGuard)

Frontend

    [ ] Tab Laporan — ringkasan dengan filter periode
    [x] Dashboard (Beranda) — stats-cards, profit-chart AreaChart dinamis, expense-chart donut, recent-activity, top-products — connect API real

PHASE 8 — Polish & Testing

    [ ] Loading states semua halaman (Skeleton)
    [ ] Error handling — toast notification (Sonner)
    [ ] Empty states — ilustrasi kalau data kosong
    [ ] Responsive check — mobile first (target: 375px)
    [ ] Test alur lengkap: Login → Belanja → Resep → Produksi → Penjualan → Laporan
    [ ] Verifikasi kalkulasi HPP dengan angka nyata
    [ ] Screenshot + video demo untuk portofolio
    [ ] Ganti DATABASE_URL dari root ke dapurhpp_user

STATUS RINGKASAN (update: Juli 2026)

    Backend selesai: Phase 0-6 semua endpoint jalan
    Frontend selesai: Auth, Dashboard Beranda, Bahan Baku, Supplier, Resep & HPP, Belanja (Phase 1-4)
    Frontend belum dikerjakan: Produksi & Penjualan (Phase 5 FE), Pengeluaran Lain (Phase 6 FE), Tab Laporan (Phase 7 FE), Polish & Testing (Phase 8)

Catatan Penting untuk AI Context

Aturan Kalkulasi

    HPP selalu dihitung dari harga_terakhir di tabel bahan_baku — bukan dari detail_belanja langsung
    Setelah belanja disimpan, harga_terakhir bahan yang dibeli wajib di-update
    HPP snapshot di tabel produksi tidak boleh diubah setelah status SELESAI
    Riwayat harga bahan = query detail_belanja JOIN belanja ORDER BY tanggal — tidak ada tabel terpisah
    Simulasi harga jual tidak disimpan ke DB — pure calculation
    BelanjaForm: user input TOTAL BAYAR bukan harga satuan. hargaSatuan = totalBayar / jumlah dihitung di FE sebelum kirim API
    Stok Option B aktif: stok auto-update dari belanja. Increment create, decrement delete. Tidak pernah negatif.

Aturan Ownership

    Semua query wajib filter user_id dari JWT payload
    Tidak ada data yang bisa diakses lintas user
    Gunakan JwtAuthGuard di semua controller kecuali AuthController

Soft Delete

    bahan_baku, supplier, resep — soft delete dengan deleted_at
    Query list selalu tambahkan WHERE deleted_at IS NULL
    belanja, produksi, penjualan — tidak soft delete, gunakan status

Naming Convention

    Backend: camelCase (NestJS/TypeScript)
    Database: snake_case (Prisma @map)
    API response: camelCase
    URL: kebab-case (/bahan-baku, /pengeluaran-lain)

Masalah Teknis yang Pernah Kejadian (jangan keulang)

    Next.js 16: middleware.ts harus di-rename proxy.ts, export function namanya "proxy" bukan "middleware"
    globals.css: JANGAN redefine --font-playfair/--font-be-vietnam di @theme Tailwind v4 — circular reference, bikin Turbopack panic "reading file nul" di Windows
    Server Component butuh auth: baca token dari cookies(), bukan axios — SSR tidak bisa akses localStorage
    OpenCode kadang KLAIM sudah edit file tapi ternyata tidak — selalu minta read-back file setelah edit
    BelanjaController: route GET 'ringkasan' HARUS di atas GET ':id' agar tidak diinterpretasi sebagai param ID
    totalQty di BelanjaRingkasan adalah jumlah lintas satuan berbeda — tampilkan sebagai "unit" bukan "kg"
    BahanBakuForm: field stok READ-ONLY saat mode edit
    Prisma model mapping: model BahanBaku → prisma.bahanBaku (camelCase)
