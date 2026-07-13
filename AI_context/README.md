KONTEKS TEKNIS

    Project: dapurhpp-fe/ (Next.js 14 App Router, TypeScript, Tailwind, Shadcn UI)
    Auth sudah setup: Zustand (store/auth-store.ts), Axios (lib/axios.ts), RHF + Zod sudah install
    Backend API: http://localhost:3001 (NestJS, endpoint /auth/login sudah jalan)
    JANGAN install dependency baru. Gunakan: zustand, axios, react-hook-form, zod, @hookform/resolvers, shadcn components (button, card, input, form, label, separator)
    JANGAN ubah file yang sudah ada (auth-store, axios, types) kecuali import font di layout

DESIGN SYSTEM (WAJIB 100%)
Typography:

    Heading: Playfair Display, weight 700
    Body/UI: Be Vietnam Pro, weight 400/600
    Numeric: font-variant-numeric: tabular-nums
    Hero Title Desktop: 32px/40px Playfair Display 700
    Hero Title Mobile: 28px/36px Playfair Display 700
    Form Title: 28px/36px Playfair Display 700
    Input Label: 12px/16px Be Vietnam Pro 700, uppercase, letter-spacing 0.05em
    Body: 16px/24px Be Vietnam Pro 400
    Button: 16px/24px Be Vietnam Pro 600

Shapes:

    Form card radius: 32px (2rem)
    Input radius: 16px (1rem)
    Button radius: 9999px (full pill)
    Badge radius: 16px

Shadows:

    Form card: 0 12px 40px rgba(78, 52, 46, 0.15)
    Badge omzet: 0 8px 30px rgba(109, 76, 65, 0.08)
    Button hover: 0 4px 12px rgba(255, 138, 0, 0.3)

STRUKTUR HALAMAN & KOMPONEN

1.  NAVBAR (components/navbar.tsx)

    Background: #FFF8F6 (atau transparent)
    Height: 64px, padding horizontal 24px
    Left: Logo DapurHPP. Gunakan placeholder <logo-dapurhpp.png> (nanti user ganti). Text: "Dapur" (#FF8A00, Playfair Display 700, 20px) + "HPP" (#2A1711, Playfair Display 700, 20px)
    Right: Links "Bantuan" dan "Tentang Kami" (Be Vietnam Pro 14px #2A1711, hover #FF8A00)
    Border bottom: 1px solid #DDC1AE (subtle)

2.  MAIN LAYOUT

    Desktop (lg:): flex flex-row, max-width 1200px, centered, gap 40px, padding 40px 24px
    Mobile (<lg): flex flex-col, padding 24px 16px

3.  LEFT SIDE — HERO SECTION (components/hero-section.tsx)
    Konten:

        Heading: "Selamat Datang Kembali ke" (Playfair 32px #2A1711) + "Dapur HPP" (Playfair 32px #FF8A00)
        Subtitle: "Pantau performa menu, kelola Harga Pokok Penjualan, dan kembangkan profitabilitas bisnis kuliner Anda dalam satu dashboard terpadu." (Be Vietnam Pro 16px #564334, max-width 480px, margin-top 16px)
        Illustration Area: Container relative, min-height 400px, margin-top 32px
            Gambar 1: <chef-akuntan.png> — posisi absolute top-left, width 200px, z-10
            Gambar 2: <gambar-berempuan.png> — posisi absolute center/bottom, width 300px, z-0 (ilustrasi utama wanita di stand)
            Gambar 3: <logo-keranjang.png> — posisi absolute top-right atau floating accent, width 80px, z-20
            Sementara gambar belum ada: gunakan div dengan bg-[#DDC1AE]/30 + border-2 border-dashed border-[#8A7362]/40 + rounded-2xl + flex items-center justify-center + text-[#8A7362] text-sm
        Floating Badge 1 — Omzet:
            Position: absolute top-4 right-4 (di atas ilustrasi)
            Background: #FFFFFF, border: 1px solid #DDC1AE, radius: 16px, padding: 12px 16px
            Shadow: 0 8px 30px rgba(109, 76, 65, 0.08)
            Content: Icon TrendingUp (Lucide, #FF8A00, size 20) + text block:
                "PERTUMBUHAN OMZET" (12px, #564334, uppercase, tracking-wider)
                "+28.4%" (20px, #2A1711, font-weight 600, tabular-nums)
        Floating Badge 2 — Bisnis Bergabung:
            Position: absolute bottom-4 left-4 (di bawah ilustrasi)
            Background: #5D4037, radius: 16px (atau 9999px pill), padding: 12px 16px
            Shadow: soft
            Content: 3 overlapping avatar circles (diameter 28px, bg #FF8A00, border 2px solid #5D4037, text white 12px bold: "A", "B", "C") + "1,200+ Pemilik Bisnis Bergabung" (Be Vietnam Pro 14px #FFFFFF)
        Bottom Features (desktop only, optional):
            Flex row, gap 32px, margin-top 32px
            Item: Icon + "Analitik Real-time" / "Laporan HPP Akurat" (14px #8A7362)

4.  RIGHT SIDE — FORM CARD (components/auth/login-form.tsx)

    Container: max-width 480px, width 100%, margin auto
    Card:
    Background: #4E342E (deep chocolate)
    Radius: 32px
    Padding: 40px (desktop) / 24px (mobile)
    Shadow: 0 12px 40px rgba(78, 52, 46, 0.15)

Form Header:

    "Silakan Masuk" (Playfair 28px #FFFFFF, text-align left)
    "Akses dashboard bisnis Anda hari ini untuk mulai mengelola operasional kuliner Anda secara cerdas." (Be Vietnam Pro 14px #FFEDE8, opacity 90%, margin-top 8px)

Form Fields (React Hook Form + Zod):

    Schema Zod:
    TypeScript

    const loginSchema = z.object({
      email: z.string().email("Format email tidak valid"),
      password: z.string().min(6, "Kata sandi minimal 6 karakter"),
    });

    Field Email:
        Label: "Alamat Email" (12px, #FFEDE8, uppercase, tracking-wider, margin-bottom 8px)
        Input container: flex items-center gap-3, bg #FFFFFF, border 1px solid #DDC1AE, radius 16px, padding 12px 16px
        Left icon: Mail (Lucide, #8A7362, size 20)
        Input: flex-1, border-none, outline-none, bg transparent, placeholder nama@bisnisanda.com (#8A7362), text #2A1711, font 16px
        Focus: border #FF8A00, ring 2px rgba(255,138,0,0.2)
        Error: text #BA1A1A, 14px, margin-top 4px, icon AlertCircle kecil
    Field Password:
        Label: "Kata Sandi" (sama style)
        Input container: sama
        Left icon: Lock (Lucide, #8A7362)
        Right icon: Eye / EyeOff toggle (Lucide, #8A7362, clickable)
        Input: type="password" (toggleable), placeholder ••••••••
        Spacing antar field: 20px

Form Actions:

    Link "Lupa Kata Sandi?" — align right, #FF8A00, 14px, hover underline, margin-top 8px, margin-bottom 24px
    Button Submit:
        Width: 100%
        Background: #FF8A00, text: #613100 (atau #2A1711), Be Vietnam Pro 16px 600
        Padding: 14px 24px, radius: 9999px (pill)
        Content: "Masuk Ke Dashboard" + icon ArrowRight (di kanan, size 20)
        Hover: bg #E67E00, shadow 0 4px 12px rgba(255,138,0,0.3)
        Loading: spinner + text "Memuat..."
        Margin-top: 24px

Social Login Section:

    Divider: flex items-center gap-4, margin 24px 0
        Line: flex-1 h-px bg-[#8A7362]/30
        Text: "ATAU DAFTAR DENGAN" (12px, #8A7362, uppercase, tracking-wider)
        Line: flex-1 h-px bg-[#8A7362]/30
    Social buttons row: flex justify-center gap-3
        Button Google: circle 48px, bg #2A1711, icon Chrome atau svg Google (white), hover scale-105
        Button Apple: circle 48px, bg #2A1711, icon Apple (white), hover scale-105
        ⚠️ CRITICAL: KEDUA TOMBOL WAJIB DISABLED (opacity-50, cursor-not-allowed, pointer-events-none) dengan tooltip text "Segera Hadir" karena backend belum support OAuth. Jangan buat functional handler.

Form Footer:

    Text: "Belum punya akun?" (#FFEDE8, 14px) + "Daftar Sekarang" (#FF8A00, 14px 600, hover underline) → link ke /register
    Centered, margin-top 24px

5. FOOTER (components/footer.tsx)

   Background: #FFF8F6
   Border-top: 1px solid #DDC1AE
   Padding: 24px
   Text: "© {currentYear} DapurHPP. All rights reserved." (center, #8A7362, 14px Be Vietnam Pro)
   pakai ini
   export default function Footer() {
   const currentYear = new Date().getFullYear();
   }

RESPONSIVE BREAKPOINTS

    Mobile (< 768px):
        Layout: stacked vertical. Navbar → Hero (centered, badges lebih kecil) → Form (full width, card radius 24px atas saja seperti bottom sheet)
        Hero heading: 28px
        Form padding: 24px
        Hide bottom features
    Tablet (768px - 1024px):
        Split 45/55 atau tetap stacked tapi form lebih narrow
    Desktop (> 1024px):
        Split 50/50, max-width 1200px centered
        Form card sticky atau centered

INTERAKSI & BEHAVIOR

    Form pakai React Hook Form + Zod resolver (@hookform/resolvers)
    On submit: panggil useAuthStore.getState().login(data)
    Success: redirect ke /dashboard (router.push)
    Error: tampilkan pesan dari store (error state) di atas form sebagai alert merah
    Password toggle: state lokal showPassword boolean
    Input focus: border #FF8A00, ring orange
    Loading state: button disabled, show spinner

STRUKTUR FILE YANG DIGENERATE
plain

dapurhpp-fe/src/
├── app/
│ ├── login/
│ │ └── page.tsx ← Compose Navbar + Hero + Form + Footer
│ ├── layout.tsx ← TAMBAH: import Google Fonts (Playfair Display, Be Vietnam Pro)
│ └── globals.css ← TAMBAH: custom color variables (optional)
├── components/
│ ├── navbar.tsx
│ ├── hero-section.tsx
│ ├── footer.tsx
│ └── auth/
│ ├── login-form.tsx
│ ├── password-input.tsx
│ └── social-button.tsx

CATATAN PENTING

    Google/Apple Sign In: Tombolnya ada di UI (sesuai permintaan), tapi WAJIB disabled karena backend hanya support email+password JWT. Backend belum ada OAuth endpoint. Jangan buat handler kosong yang misleading.
    Gambar: Sementara gunakan placeholder div dengan border dashed + icon Image dari Lucide. User akan ganti dengan file asli (<chef-akuntan.png>, <gambar-berempuan.png>, <logo-keranjang.png>, <logo-dapurhpp.png>).
    Font: Tambahkan di app/layout.tsx:
    tsx

    import { Playfair_Display, Be_Vietnam_Pro } from 'next/font/google';

    Jangan generate file selain yang terkait login page. Jangan sentuh store, axios, atau halaman lain.

❓ Konfirmasi dari Kamu
Sebelum saya eksekusi jadi kode, saya perlu pastikan:

    Warna card form coklat tua (#4E342E) — ini dari gambar Visily. Apakah kamu setuju dengan warna ini, atau mau lebih terang/mirip inverse-surface #412B24 dari DESIGN.md?
    Tombol Google & Apple — saya akan buat tombolnya ada tapi disabled (tidak bisa diklik, opacity 50%, ada tulis "Segera Hadir") karena backend belum ada OAuth. Setuju?
    Badge "1,200+ Pemilik Bisnis" — di gambar Visily ini ada avatar A, B, C. Saya buat jadi 3 lingkaran dengan inisial saja (tanpa gambar real), atau kamu punya gambar avatar khusus?
    Apakah saya langsung eksekusi jadi file kode sekarang, atau kamu mau adjust prompt di atas dulu?

Bilang aja "langsung eksekusi" atau "ganti [bagian ini]" — nggak perlu pilihan A/B/C. 👍
