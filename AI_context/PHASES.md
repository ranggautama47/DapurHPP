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
    [x] Setup prisma/schema.prisma (11 tabel, termasuk detail_produksi — BARU)
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
    [x] BahanBakuTable, BahanBakuForm, BahanBakuDetail
    [x] Halaman Supplier — list + form tambah/edit

PHASE 3 — Resep & HPP

Backend & Frontend — SELESAI

    [x] ResepModule — GET/POST/PATCH/DELETE + soft delete, hppPerPcs live, upload foto, catatan
    [x] Tab Resep, Detail, Form, SimulasiHarga — semua terkoneksi

PHASE 4 — Belanja

Backend & Frontend — SELESAI

    [x] BelanjaModule — CRUD, ringkasan harian, auto-update hargaTerakhir & stok
    [x] Halaman Belanja, riwayat, detail — semua terkoneksi
    [x] Bug historis: total bayar vs harga satuan — sudah difix di FE (hargaSatuan = totalBayar/jumlah)

PHASE 5 — Produksi & Penjualan

Backend

    [x] ProduksiModule — CRUD + status DRAFT/SELESAI/BATAL
    [x] DetailProduksi — snapshot breakdown per bahan saat create (BARU, migration add_detail_produksi)
    [x] fotoUrl resep ikut di-include di findAll/findOne produksi (FIXED)
    [x] PenjualanModule — CRUD + laba dihitung di findAll/findOne (FIXED, sebelumnya field laba gak ada)

Frontend

    [x] Tab Produksi — list per tanggal, status badge, stats card
        (FIXED: total agregat exclude status BATAL, Number() cast Decimal string yg tadinya nyambung jadi "017100190007600")
    [x] Form tambah produksi, Detail produksi — breakdown HPP via detailProduksi, foto resep
        (FIXED: field `foto`→`fotoUrl` mismatch, Next.js 16 params sekarang di-`await` — sebelumnya bikin /produksi/NaN 500 error)
    [x] Tab Penjualan — list per tanggal, total pendapatan + laba
        (FIXED: timezone bug toISOString→formatLocalDate, string-concat Decimal bug di total pendapatan)
    [x] Form tambah penjualan
    [x] Halaman /penjualan/ringkasan — 4 stats card + tren dinamis + grafik + top produk
        (FIXED: dummy data gak pernah kepake, field mismatch hari/days, timezone)

PHASE 6 — Pengeluaran Lain

Backend

    [x] PengeluaranLainModule — GET/POST/PATCH/DELETE (filter by tanggal)

Frontend

    [ ] ⚠️ BELUM DIKERJAKAN — Form tambah pengeluaran lain (nama + jumlah)
    [ ] ⚠️ BELUM DIKERJAKAN — List pengeluaran lain per tanggal
    [ ] PRIORITAS BERIKUTNYA setelah Phase 7 dituntaskan

PHASE 7 — Laporan & Dashboard

Backend — SELESAI, sudah diaudit ulang beberapa kali

    [x] LaporanModule — ringkasan, grafik-laba, distribusi-hpp, aktivitas-terbaru, produk-terlaris
    [x] FIXED: bug off-by-time-of-day di getRingkasan & getGrafikLaba (query tanggal gak match krn ada komponen jam)
    [x] FIXED: semua endpoint sekarang pakai DTO seragam (LaporanQueryDto: days, 1-365, default 7) via @Query() query,
        bukan manual @Query('days') parse per endpoint
    [x] FIXED: getDistribusiHpp — SEBELUMNYA salah query tabel pengeluaranLain (hampir selalu kosong/gak related),
        SEKARANG query benar dari Penjualan→Produksi→Resep, breakdown HPP per resep
    [x] FIXED: totalPengeluaran sekarang di-return beneran (sebelumnya dihitung internal tapi dibuang, FE
        terpaksa duplikat totalHpp sebagai "Total Pengeluaran" — dua card kembar)
    [x] FIXED: tren.pengeluaran ditambahkan, terpisah dari tren.hpp
    [x] FIXED: custom date-range days sekarang diterima berapapun (dulu whitelist [7,30,90,180] doang, custom
        selalu fallback diam-diam ke 7 hari)
    [x] FIXED: getProdukTerlaris & getAktivitasTerbaru sekarang terima param days juga (dulu selalu all-time,
        gak ikut filter periode di FE)
    [x] FIXED: typo fatal `group.set` (harusnya `grouped.set`) yang bikin /produk-terlaris 500 error total

Frontend — Tab Laporan penuh SELESAI

    [x] LaporanFilter — preset Hari Ini/7/30/90/180 hari + Custom date-range
        (FIXED: tombol "Terapkan Filter" logic kebalik — isCustomApplied dulu jadi TRUE pas tanggal
        udah diisi lengkap, padahal dipakai buat DISABLE tombol. Sekarang logic-nya benar)
    [x] RingkasanCards — 5 stats card + tren asli dari backend
        (FIXED: card "Total Pengeluaran" dulu duplikat totalHpp, sekarang pakai totalPengeluaran asli;
        HPP & Pengeluaran naik sekarang ditandai MERAH bukan hijau — invert logic utk cost metric)
    [x] GrafikPerforma — chart 3 garis (Pendapatan/HPP/Laba)
        (FIXED: toggle Harian/Mingguan/Bulanan dulu cuma dekorasi/gak ngefek, sekarang beneran
        agregasi ulang data di FE per chunk 7/30 titik)
    [x] DistribusiHpp — donut chart breakdown HPP per resep
        (FIXED: endpoint distribusi-hpp di page-client.tsx dulu gak kirim ?days=, selalu balik data
        window 7 hari default meski filter di-ganti — root cause "Top 0 Produk"/donut kosong)
    [x] DetailPerforma — tabel per periode + total row
    [x] RingkasanOperasional — counts total produksi/penjualan/belanja/pengeluaran
        (FIXED: dulu selalu all-time gak filter periode, sekarang di-filter tanggal di FE sesuai periode aktif)
    [x] types/laporan.ts — ditambah totalPengeluaran & tren.pengeluaran ke interface RingkasanLaporan
    [x] Dashboard Beranda — stats-cards, profit-chart, expense-chart, recent-activity, top-products
        (FIXED: field mismatch total d.pendapatan vs d.totalPendapatan dkk — akar dari "Rp 0" semua;
        card Penjualan salah format Rp 45→45 pcs; panah tren dulu selalu ↑ apapun kondisinya)

PHASE 8 — Polish & Testing

    [ ] Loading states semua halaman (Skeleton)
    [ ] Error handling — toast notification (Sonner)
    [ ] Empty states
    [ ] Responsive check — mobile first (target: 375px)
    [ ] Test alur lengkap: Login → Belanja → Resep → Produksi → Penjualan → Laporan
    [ ] Verifikasi kalkulasi HPP dengan angka nyata
    [ ] Screenshot + video demo untuk portofolio
    [ ] Ganti DATABASE_URL dari root ke dapurhpp_user

STATUS RINGKASAN (update terbaru — Phase 7 tuntas)

    Backend selesai: Phase 0-7 semua endpoint jalan + sudah lolos audit bug berkali-kali
        (timezone, field mismatch, string-concat, DTO seragam, custom range, typo fatal)
    Frontend selesai: Auth, Dashboard Beranda, Bahan Baku, Supplier, Resep, Belanja,
        Produksi, Penjualan+Ringkasan, Tab Laporan penuh
    Frontend BELUM: Pengeluaran Lain FE (Phase 6 — PRIORITAS SEKARANG), Polish (Phase 8)

Catatan Penting untuk AI Context

Aturan Kalkulasi

    HPP selalu dihitung dari harga_terakhir di tabel bahan_baku — bukan dari detail_belanja langsung
    Setelah belanja disimpan, harga_terakhir bahan yang dibeli wajib di-update
    HPP snapshot di tabel produksi tidak boleh diubah setelah status SELESAI
    Simulasi harga jual tidak disimpan ke DB — pure calculation
    BelanjaForm: user input TOTAL BAYAR bukan harga satuan. hargaSatuan = totalBayar / jumlah dihitung di FE
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
    Query param filter periode: SELALU pakai nama `days` (angka hari), bukan `hari`/`periode`/custom lain —
        konsistensi ini yang dulu berkali-kali bikin bug mismatch antara FE dan BE

Masalah Teknis yang Pernah Kejadian (JANGAN DIULANG)

    Next.js 16: middleware.ts → proxy.ts, export "proxy" bukan "middleware"
    Next.js 16: params di [id]/page.tsx adalah Promise, WAJIB `await params`
    globals.css: JANGAN redefine --font-playfair/--font-be-vietnam di @theme Tailwind v4
    Server Component butuh auth: baca token dari cookies(), bukan axios
    AI agent (OpenCode/Kimi/Gemini) kadang KLAIM selesai tapi field name gak match backend, atau
        nyaranin fix yang sebenarnya sudah ada di kode (gagal baca state sebenarnya) — SELALU minta
        curl/JSON mentah dan baca-ulang file utk verifikasi, jangan percaya screenshot/klaim doang
    BelanjaController: route GET 'ringkasan' HARUS di atas GET ':id'
    totalQty BelanjaRingkasan = "unit" bukan "kg"
    Prisma Decimal field SELALU balik sebagai STRING ke JSON — WAJIB Number() cast sebelum di-+ (reduce)
        atau ditampilkan, kalau nggak: string-concat bug ("025000150...") atau format salah (gak ada titik ribuan)
    Query range tanggal WAJIB pakai formatLocalDate() (bukan toISOString()) — toISOString convert ke UTC,
        geser tanggal krn WIB=UTC+7
    Query range tanggal dgn `new Date()` langsung (bukan set jam 00:00/23:59) kena bug off-by-time-of-day
        — data jam 00:00 ketolak krn dibanding sama timestamp yg ada jam-nya
    Field name HARUS dicek exact match antara backend response dan FE interface — banyak kasus
        (foto vs fotoUrl, hari vs days, detail vs detailProduksi, bahanId vs bahanBakuId) bikin data
        "kosong"/"Rp 0" padahal backend udah bener
    Kalau ubah nama field di FE, cek juga file types/*.ts — jangan cuma di komponen, TS gak akan warning
        kalau interface-nya juga salah (dua-duanya salah = "konsisten" secara TS tapi salah secara runtime)
    AI agent kalau disuruh benerin 1 bug, sering nyenggol banyak file di luar scope — WAJIB git commit
        checkpoint SEBELUM kasih task ke agent, dan kasih scope file eksplisit + larangan ubah file lain
    Dev server / Next.js build cache bisa nyimpen versi lama meski source code sudah benar — kalau curl/source
        udah sesuai tapi browser masih nunjukin behavior lama: rm -rf .next, restart total, hard refresh browser
    Props/variable dengan nama membingungkan (mis. "isCustomApplied" yg isinya kondisi kebalik) rawan
        bikin logic disabled/enabled kebalik — kalau nemu bug tombol gak bisa diklik, cek dulu logic
        boolean-nya sebelum curiga ke tempat lain
