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

Backend — SELESAI

    [x] PengeluaranLainModule — GET/POST/PATCH/DELETE (filter by tanggal)
    [x] Migration add_kategori_pengeluaran_lain — kolom kategori KategoriPengeluaran
        (enum: UTILITAS/KEMASAN/TRANSPORTASI/KEBERSIHAN/LAINNYA) @default(LAINNYA)
    [x] CreatePengeluaranLainDto + service create/update — kategori sekarang persisted
        ke DB (SEBELUMNYA: field kategori cuma ada di FE, dibuang sebelum submit,
        ditebak ulang via detectKategori(nama) regex tiap render — desain gak konsisten,
        SEKARANG: kategori tersimpan asli, single source of truth dari DB)

Frontend — SELESAI (diverifikasi manual: data tersimpan di DB, konsisten setelah refresh,
filter tanggal-range & kategori jalan, total format benar)

    [x] Form tambah pengeluaran lain (nama + jumlah + kategori)
        types/pengeluaran.ts, lib/pengeluaran-lain.ts, kategori-badge.tsx,
        filter-bar.tsx, pengeluaran-form.tsx, pengeluaran-table.tsx — semua sinkron
        ke enum uppercase (UTILITAS/KEMASAN/dst), label display tetap capitalized di UI
    [x] List pengeluaran lain per tanggal — filter tanggal-range & kategori jalan,
        total format benar (titik ribuan)
    [x] FIXED: Enum case mismatch — backend UTILITAS/KEMASAN/dst (uppercase), FE awalnya
        capitalized (Utilitas/Kemasan) → 400 Bad Request. Fix: FE value uppercase,
        label display tetap capitalized (opsi A dipilih atas opsi B/mapping runtime)
    [x] FIXED: Duplicate function filterByKategori di lib/pengeluaran-lain.ts (agent
        nambah kode baru tanpa hapus versi lama — TS2323/2393 Cannot redeclare)
    [x] FIXED: filterByDateRange sempat hilang/ke-hapus gak sengaja saat fix
        sebelumnya — "is not a function" error saat klik Terapkan Filter
    [x] FIXED: "Invalid Date" di kolom tanggal — parsing pakai string concat
        item.tanggal + "T00:00:00" padahal item.tanggal dari backend sudah
        ISO string penuh, bukan "YYYY-MM-DD" saja. Fix: new Date(item.tanggal) langsung
    [x] FIXED: Total "Rp 017000" — Prisma Decimal balik sebagai STRING, reduce tanpa
        Number() cast jadi string-concat. Fix: Number() cast di reduce + formatRupiah
        (bug sama persis seperti Phase 5, terulang di modul baru — jadi default-check wajib)
    [x] pengeluaran-lain.service.ts findAll() — filter by tanggal exact-match diganti
        jadi date-range (00:00:00 s/d 23:59:59) biar gak kena timezone/off-by-time bug
        yang sama seperti modul lain

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

PHASE 7.5 — Dashboard Global Filter & Distribusi HPP Gabungan — SELESAI

Keputusan Bisnis (untuk konteks AI berikutnya, JANGAN diubah tanpa alasan kuat)

    [x] "Laba" = Pendapatan - HPP - Pengeluaran Lain (bukan cuma Pendapatan - HPP).
        Kalau ada pengeluaran tapi gak ada pendapatan di periode itu, laba MEMANG minus
        — itu akurat secara akuntansi, BUKAN bug, jangan direvert berdasarkan kesan visual
        grafik yang "harusnya selalu naik"
    [x] "Distribusi Pengeluaran (HPP)" di dashboard SENGAJA menggabungkan 2 sumber:
        breakdown HPP per resep (dari Penjualan→Produksi→Resep) DAN pengeluaran lain
        di-group by kategori (Gas & Utilitas, Kemasan, dst). Secara akuntansi ketat ini
        agak salah kaprah (HPP harusnya cuma cost of goods sold, bukan operational expense),
        tapi ini keputusan UX yang disengaja mengikuti blueprint desain — nama endpoint
        tetap getDistribusiHpp untuk kompatibilitas, isinya sekarang gabungan

Backend

    [x] laporan-query.dto.ts — tambah startDate & endDate (opsional, string), selain
        days & date yang sudah ada. Prioritas resolusi: startDate+endDate > date > days
    [x] laporan.service.ts batasiTanggal() — refactor terima startDate/endDate custom
        range, fallback ke date lalu days kalau gak ada
    [x] laporan.service.ts getDistribusiHpp() — sekarang query 2 sumber paralel
        (Penjualan→Produksi→Resep DAN pengeluaranLain.groupBy kategori), digabung
        jadi 1 array, slice(0, 8) bukan slice(0, 5) karena sumbernya lebih banyak

Frontend

    [x] lib/laporan-query.ts (BARU) — helper buildLaporanQuery(params) generate query
        string konsisten dari LaporanDateParams, dipakai semua 5 komponen dashboard
    [x] dashboard/page.tsx — datepicker sekarang punya toggle mode "Tanggal Tunggal"
        vs "Rentang Tanggal" (pakai react-day-picker mode="single"/"range"), state
        di-lift ke page.tsx sebagai dateParams, di-pass ke 5 komponen sebagai prop
    [x] FIXED: ProfitChart SEBELUMNYA punya activeDays state internal sendiri +
        dropdown RANGES lokal, TIDAK sinkron sama datepicker global di atas — root
        cause kenapa pilih tanggal di atas gak ngefek ke Grafik Laba. Sekarang RANGES
        lokal dihapus total, full delegate ke prop dateParams dari parent
    [x] stats-cards.tsx, expense-chart.tsx, recent-activity.tsx, top-products.tsx —
        semua ganti dari prop selectedDate?: string jadi dateParams?: LaporanDateParams,
        query string dibangun via buildLaporanQuery() bukan manual string interpolation
    [x] FIXED error TS2322 "Property 'dateParams' does not exist" — root cause:
        komponen (ProfitChart dkk) belum diupdate signature-nya pas page.tsx sudah
        dipass prop baru. Semua komponen HARUS diupdate bersamaan/1 batch, gak bisa
        page.tsx duluan lalu komponen menyusul satu-satu

PHASE 8 — Polish & Testing

[✓] Ganti DATABASE_URL dari root ke dapurhpp_user
[✓] Bug HPP salah (hargaTerakhir stale)
[✓] Bug P2002 unique constraint recreate bahan soft-deleted
[✓] Fix badge BATAL di Activity Log
[✓] SweetAlert Fase 1+2
[✓] Stok bahan baku: validasi + potong saat create + restore saat BATAL (transactional)
[✓] FE tombol Selesai — endpoint baru terpisah, verified
[✓] Empty states — 3 komponen chart (GrafikPerforma, ExpenseChart, DistribusiHpp)
[✓] Loading states — pengeluaran/loading.tsx baru + 3 komponen upgrade skeleton
[✓] Error handling toast — 5 titik initial-fetch + retry button 6 widget
[✓] Responsive — sidebar mobile overlay, footer stack, tabel scroll horizontal
[ ] Test alur lengkap: Login → Belanja → Resep → Produksi → Penjualan → Laporan
[ ] Verifikasi kalkulasi HPP dengan angka nyata (baru Cabai rawit, bahan lain belum)
[ ] Screenshot + video demo untuk portofolio
[ ] Race condition test $transaction produksi

STATUS RINGKASAN (update terbaru — Phase 7.5 tuntas)

    Backend selesai: Phase 0-7.5 semua endpoint jalan + sudah lolos audit bug berkali-kali
        (timezone, field mismatch, string-concat, DTO seragam, custom range, typo fatal,
        enum case mismatch, distribusi-hpp gabungan sumber)
    Frontend selesai: Auth, Dashboard Beranda (+ global filter range), Bahan Baku,
        Supplier, Resep, Belanja, Produksi, Penjualan+Ringkasan, Tab Laporan penuh,
        Pengeluaran Lain (kategori persisted, filter jalan)
    Frontend BELUM: Polish (Phase 8) — PRIORITAS SEKARANG

Catatan Penting untuk AI Context

Aturan Kalkulasi

    HPP selalu dihitung dari harga_terakhir di tabel bahan_baku — bukan dari detail_belanja langsung
    Setelah belanja disimpan, harga_terakhir bahan yang dibeli wajib di-update
    HPP snapshot di tabel produksi tidak boleh diubah setelah status SELESAI
    Simulasi harga jual tidak disimpan ke DB — pure calculation
    BelanjaForm: user input TOTAL BAYAR bukan harga satuan. hargaSatuan = totalBayar / jumlah dihitung di FE
    Stok Option B aktif: stok auto-update dari belanja. Increment create, decrement delete. Tidak pernah negatif.
    "Laba" = Pendapatan - HPP - Pengeluaran Lain (lihat Phase 7.5 untuk detail keputusan ini)
    "Distribusi Pengeluaran (HPP)" di dashboard = gabungan breakdown HPP per resep +
        pengeluaran lain per kategori (lihat Phase 7.5) — INI KEPUTUSAN UX SENGAJA,
        bukan bug, jangan "diperbaiki" balik ke cuma-HPP-murni tanpa konfirmasi user

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
    Query param date-range custom: `startDate` & `endDate` (bukan `dari`/`sampai` atau nama lain)
    Enum values: SELALU uppercase (UTILITAS, KEMASAN, dll) — kalau FE butuh label lebih
        enak dibaca, buat mapping Record<Enum, string> terpisah utk display, JANGAN ubah
        value enum itu sendiri jadi capitalized (bikin 400 Bad Request krn gak match backend)
    Komponen dashboard yang butuh filter tanggal SELALU terima prop dateParams?: LaporanDateParams
        (dari lib/laporan-query.ts), JANGAN bikin state tanggal sendiri-sendiri per komponen
        — itu penyebab utama komponen gak sinkron satu sama lain (lihat kasus ProfitChart Phase 7.5)

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
        — SUDAH KEJADIAN 2X di modul berbeda (Produksi/Penjualan di Phase 5, Pengeluaran Lain di Phase 6),
        JADIKAN default-check WAJIB tiap kali nambah field Decimal baru di modul manapun
    Query range tanggal WAJIB pakai formatLocalDate() (bukan toISOString()) — toISOString convert ke UTC,
        geser tanggal krn WIB=UTC+7
    Query range tanggal dgn `new Date()` langsung (bukan set jam 00:00/23:59) kena bug off-by-time-of-day
        — data jam 00:00 ketolak krn dibanding sama timestamp yg ada jam-nya
    Parsing tanggal dari backend response: JANGAN string-concat "T00:00:00" ke item.tanggal
        kalau backend sudah balikin ISO string penuh — cek dulu format aslinya (curl response),
        baru putuskan perlu concat atau langsung new Date(item.tanggal) saja
    Field name HARUS dicek exact match antara backend response dan FE interface — banyak kasus
        (foto vs fotoUrl, hari vs days, detail vs detailProduksi, bahanId vs bahanBakuId) bikin data
        "kosong"/"Rp 0" padahal backend udah bener
    Enum/string value HARUS dicek exact match case-sensitivity antara backend dan FE — backend
        Prisma enum biasanya UPPERCASE, kalau FE pakai Capitalized tanpa sadar → 400 Bad Request
        (bukan 500, jadi kelihatan kayak masalah validasi, padahal cuma beda huruf besar-kecil)
    Kalau ubah nama field di FE, cek juga file types/*.ts — jangan cuma di komponen, TS gak akan warning
        kalau interface-nya juga salah (dua-duanya salah = "konsisten" secara TS tapi salah secara runtime)
    Kalau ubah SIGNATURE PROP komponen (misal selectedDate?: string → dateParams?: LaporanDateParams),
        semua caller (parent component) dan komponen itu sendiri HARUS diupdate DALAM SATU BATCH —
        kalau parent duluan lalu child menyusul, muncul TS2322 "Property does not exist on type"
    AI agent kalau disuruh benerin 1 bug, sering nyenggol banyak file di luar scope — WAJIB git commit
        checkpoint SEBELUM kasih task ke agent, dan kasih scope file eksplisit + larangan ubah file lain
    AI agent kalau disuruh ganti isi function, kadang nambah kode BARU di bawah tanpa hapus yang LAMA —
        hasilnya duplicate declaration/export (TS2323/2393 Cannot redeclare / Duplicate function
        implementation). Selalu instruksikan eksplisit "REPLACE isi function, bukan tambah di bawah",
        dan grep nama function setelah edit utk pastikan muncul cuma 1 kali
    Dev server / Next.js build cache bisa nyimpen versi lama meski source code sudah benar — kalau curl/source
        udah sesuai tapi browser masih nunjukin behavior lama: rm -rf .next, restart total, hard refresh browser
    Props/variable dengan nama membingungkan (mis. "isCustomApplied" yg isinya kondisi kebalik) rawan
        bikin logic disabled/enabled kebalik — kalau nemu bug tombol gak bisa diklik, cek dulu logic
        boolean-nya sebelum curiga ke tempat lain
    Sebelum "fix" data yang kelihatan aneh (grafik turun, angka minus, dst), cek dulu apakah itu
        BUG TEKNIS atau KEPUTUSAN BISNIS yang sengaja (lihat kasus Grafik Laba minus di Phase 7.5) —
        jangan asumsikan angka aneh = bug tanpa verifikasi rumus/logic-nya dulu

Git Commit Strategy

    Prinsip: 1 unit logis = 1 commit, BUKAN 1 file = 1 commit. Commit yang saling
        bergantung (schema+migration, DTO+service, dst) harus digabung — kalau dipisah,
        tiap commit individual jadi gak bisa di-checkout sendirian tanpa compile error.
    Contoh grouping yang benar (dari kasus kategori Pengeluaran Lain, Phase 6):
        1. schema.prisma + migration file (database layer)
        2. DTO + service (application layer, depend on #1)
        3. FE types + lib/helpers (shared, dependency utk komponen)
        4. FE komponen UI (form, table, badge, filter-bar)
        5. FE page-client/page (wiring)
    Pengecualian: bug fix independen yang gak saling terkait (misal 2 bug beda akar
        di file berbeda) boleh dipisah per file/per bug karena masing-masing punya
        arti sendiri kalau di-revert terpisah.
