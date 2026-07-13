PHASES.md — DapurHPP Development Plan

    File ini adalah AI context untuk pengerjaan project DapurHPP.
    Update status setiap selesai satu task.

Stack

    Backend: NestJS + Prisma + MySQL (REST API, port 3001)
    Frontend: Next.js 14 App Router + TypeScript + Tailwind + Shadcn + TanStack Query
    Auth: JWT (access token, bcrypt password)
    Polyrepo: dapurhpp-api + dapurhpp-fe

Status Legend

    [ ] Belum dikerjakan
    [~] Sedang dikerjakan
    [x] Selesai

PHASE 0 — Project Setup
Target: 1 hari
Polyrepo & Config

    [x] Init folder struktur polyrepo (dapurhpp-api/, dapurhpp-fe/)
    [ ] Setup .env.example
    [ ] Setup prisma/schema.prisma (sudah final — 10 tabel)
    [ ] npx prisma migrate dev --name init
    [ ] npx prisma db seed — verifikasi data masuk

Backend Init (NestJS)

    [x] nest new dapurhpp-api di dapurhpp-api/
    [ ] Install: @prisma/client, prisma, @nestjs/jwt, @nestjs/passport, passport-jwt, bcrypt, class-validator, class-transformer
    [ ] Setup PrismaModule (global)
    [ ] Setup ConfigModule (global, .env)
    [ ] Setup CORS untuk Next.js (localhost:3000)
    [ ] Setup global ValidationPipe

Frontend Init (Next.js)

    [x] npx create-next-app@latest dapurhpp-fe di dapurhpp-fe/ (TypeScript, Tailwind, App Router)
    [ ] Install: shadcn-ui, @tanstack/react-query, react-hook-form, zod, axios
    [ ] Setup QueryClientProvider di app/layout.tsx
    [ ] Setup Shadcn components: button, card, input, form, badge, tabs, dialog, sheet
    [ ] Setup folder struktur: app/, components/, lib/, hooks/, services/

PHASE 1 — Auth
Target: 1 hari
Backend

    [ ] AuthModule, UsersModule
    [ ] POST /auth/register — hash password bcrypt, return user
    [ ] POST /auth/login — validasi email+password, return JWT
    [ ] GET /auth/me — return current user dari token
    [ ] JwtAuthGuard — protect semua route kecuali register & login
    [ ] JwtStrategy — extract userId dari token payload

Frontend

    [ ] Halaman /login — form email + password (React Hook Form + Zod)
    [ ] Halaman /register
    [ ] AuthContext atau Zustand store untuk simpan token + user
    [ ] axios instance dengan interceptor — auto-attach Bearer token
    [ ] Redirect ke /dashboard setelah login
    [ ] Protected route — redirect ke /login kalau token tidak ada

PHASE 2 — Master Data (Bahan Baku + Supplier)
Target: 2 hari
Backend

    [ ] BahanBakuModule
        [ ] GET /bahan-baku — list semua milik user (exclude soft-deleted)
        [ ] POST /bahan-baku — create
        [ ] GET /bahan-baku/:id — detail + riwayat harga dari detail_belanja
        [ ] PATCH /bahan-baku/:id — update nama/satuan
        [ ] DELETE /bahan-baku/:id — soft delete (deletedAt = now())
    [ ] SupplierModule
        [ ] GET /supplier
        [ ] POST /supplier
        [ ] PATCH /supplier/:id
        [ ] DELETE /supplier/:id — soft delete

Frontend

    [ ] Halaman Master Bahan (list + search)
    [ ] Form tambah/edit bahan (bottom sheet atau dialog)
    [ ] Halaman Detail Bahan — riwayat harga dengan grafik garis (Recharts atau Chart.js)
    [ ] Halaman Supplier — list + form tambah/edit

PHASE 3 — Resep & HPP
Target: 2 hari
Backend

    [ ] ResepModule
        [ ] GET /resep — list + HPP terbaru per resep (kalkulasi dari harga_terakhir bahan)
        [ ] POST /resep — create resep + detail_resep sekaligus
        [ ] GET /resep/:id — detail + list bahan + kalkulasi HPP breakdown
        [ ] PATCH /resep/:id — update resep + upsert detail_resep
        [ ] DELETE /resep/:id — soft delete

HPP Service

    [ ] HppService.calculate(resepId, userId):
    plain

    total_bahan = Σ(detail_resep.jumlah × bahan_baku.harga_terakhir)
    hpp_per_pcs = total_bahan / resep.estimasi_hasil

    [ ] SimulasiService.calculate(hppPerPcs, targetMarginPersen):
    plain

    harga_jual_ideal = hpp_per_pcs / (1 - targetMargin/100)
    untung_per_pcs   = harga_jual_ideal - hpp_per_pcs
    untung_per_batch = untung_per_pcs × estimasi_hasil
    margin           = targetMargin

        Tidak disimpan ke DB — pure calculation, return langsung.

Frontend

    [ ] Tab Resep — list card (foto, nama, HPP/pcs, hasil/batch)
    [ ] Halaman Detail Resep — list bahan, total modal, HPP breakdown
    [ ] Form tambah/edit resep dengan dynamic bahan list
    [ ] Panel Simulasi Harga Jual — input target margin (10/20/30/40/custom), tampilkan hasil kalkulasi realtime

PHASE 4 — Belanja
Target: 2 hari
Backend

    [ ] BelanjaModule
        [ ] GET /belanja — list per user, filter by tanggal
        [ ] POST /belanja — create header + detail sekaligus:
            Hitung subtotal per item
            Hitung total_belanja (sum subtotal)
            Update bahan_baku.harga_terakhir untuk setiap bahan yang dibeli
        [ ] GET /belanja/:id — detail + semua item
        [ ] PATCH /belanja/:id — update (recalculate total)
        [ ] DELETE /belanja/:id — hard delete (belanja tidak soft-delete)

Frontend

    [ ] Tab Belanja — list per tanggal, total belanja harian
    [ ] Form tambah belanja — dynamic list item (bahan + supplier + jumlah + harga)
    [ ] Auto-sum total belanja saat input
    [ ] Riwayat Belanja — filter by tanggal

PHASE 5 — Produksi & Penjualan
Target: 2 hari
Backend

    [ ] ProduksiModule
        [ ] GET /produksi — list per user + filter tanggal
        [ ] POST /produksi:
            Ambil resep + detail_resep
            Panggil HppService.calculate() — simpan hpp_per_pcs sebagai snapshot
            Simpan harga_jual_saat_produksi dari resep.harga_jual saat itu
            Default status: DRAFT
        [ ] PATCH /produksi/:id — update hasil_nyata, ubah status ke SELESAI
        [ ] DELETE /produksi/:id — set status BATAL
    [ ] PenjualanModule
        [ ] GET /penjualan — list per user + filter tanggal
        [ ] POST /penjualan:
            Hitung total_pendapatan = terjual × harga_jual
            Hitung sisa = produksi.hasil_nyata - terjual
            Default status: OPEN
        [ ] PATCH /penjualan/:id — update terjual atau close (status = CLOSED)

Frontend

    [ ] Tab Penjualan — list per tanggal, total pendapatan + laba
    [ ] Form tambah penjualan — pilih produksi, input terjual + harga jual
    [ ] Summary: total pendapatan, total HPP, laba

PHASE 6 — Pengeluaran Lain
Target: 0.5 hari
Backend

    [ ] PengeluaranLainModule
        [ ] GET /pengeluaran-lain — filter by tanggal
        [ ] POST /pengeluaran-lain
        [ ] PATCH /pengeluaran-lain/:id
        [ ] DELETE /pengeluaran-lain/:id

Frontend

    [ ] Form tambah pengeluaran lain (nama + jumlah)
    [ ] List pengeluaran lain per tanggal

PHASE 7 — Laporan & Dashboard
Target: 2 hari
Backend

    [ ] LaporanModule
        [ ] GET /laporan/ringkasan?periode=hari|minggu|bulan|tahun&tanggal=
        plain

        total_pendapatan = SUM(penjualan.total_pendapatan)
        total_modal      = SUM(produksi.total_modal) + SUM(pengeluaran_lain.jumlah)
        total_laba       = total_pendapatan - total_modal
        margin           = (total_laba / total_pendapatan) × 100

        [ ] GET /laporan/grafik-laba?periode=minggu — data per minggu untuk chart
        [ ] GET /laporan/riwayat-harga/:bahanBakuId — harga per tanggal dari detail_belanja

Frontend

    [ ] Tab Laporan — ringkasan dengan filter periode
    [ ] Grafik laba (line chart) + grafik modal vs pendapatan (bar chart)
    [ ] Dashboard (Beranda):
        Card: Pendapatan, Modal (HPP), Laba, Margin hari ini
        Ringkasan Cepat: total produk terjual, HPP rata-rata, harga jual rata-rata
        Grafik laba 4 minggu terakhir
        Shortcut: Tambah Belanja, Tambah Penjualan

PHASE 8 — Polish & Testing
Target: 1 hari

    [ ] Loading states semua halaman (Skeleton Shadcn)
    [ ] Error handling — toast notification (Sonner)
    [ ] Empty states — illustrasi kalau data kosong
    [ ] Responsive check — mobile first (target: lebar 375px)
    [ ] Test alur lengkap: Login → Belanja → Resep → Produksi → Penjualan → Laporan
    [ ] Verifikasi kalkulasi HPP dengan angka nyata dari mama
    [ ] Screenshot tiap halaman untuk dokumentasi portofolio
    [ ] Rekam video demo (~2 menit)

Timeline Estimasi
Table
Phase	Fokus	Hari
0	Setup	1
1	Auth	1
2	Master Data	2
3	Resep & HPP	2
4	Belanja	2
5	Produksi & Penjualan	2
6	Pengeluaran Lain	0.5
7	Laporan & Dashboard	2
8	Polish & Testing	1
Total		13.5 hari
Catatan Penting untuk AI Context
Aturan Kalkulasi

    HPP selalu dihitung dari harga_terakhir di tabel bahan_baku — bukan dari detail_belanja langsung
    Setelah belanja disimpan, harga_terakhir bahan yang dibeli wajib di-update
    HPP snapshot di tabel produksi tidak boleh diubah setelah status SELESAI
    Riwayat harga bahan = query detail_belanja JOIN belanja ORDER BY tanggal — tidak ada tabel terpisah
    Simulasi harga jual tidak disimpan ke DB — pure calculation

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