# Student Task Planner K12 — Manajemen Tugas Harian

Aplikasi manajemen tugas harian berbasis web (*Daily Student Task Planner*) dengan antarmuka papan Kanban 3 kolom, indikator prioritas dan tenggat waktu (*deadline*), mode gelap/terang, serta penyimpanan lokal (`localStorage`). Repositori ini dirancang dengan arsitektur modular untuk dikerjakan secara kolaboratif oleh 4 anggota Kelompok K12 pada UAS Praktikum Pemrograman Web Dasar.

## 1. Spesifikasi Teknologi
- **Markup & Styling:** HTML5 Semantik & CSS3 (*Custom Properties* / Variabel Tema Terang & Gelap)
- **Framework UI & Ikon:** Bootstrap 5.3.2 & Bootstrap Icons 1.11.1 (CDN)
- **Interaktivitas & DOM:** jQuery 3.7.1 & jQuery UI 1.13.2 (*Sortable* untuk *Drag & Drop*)
- **Tipografi:** Google Fonts (`Lora` & `Plus Jakarta Sans`)
- **Penyimpanan Data:** Web Storage API (`localStorage`)
- **Web Server Lokal:** Laragon (`http://localhost/manajemen-tugas-k12/`) / VS Code Live Server

## 2. Pembagian Tugas Tim & Roadmap Modul

| Modul | PIC | Ruang Lingkup Fitur | Penguji (Peer Review) | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Modul 1** | **Novita (Lead)** | Struktur folder, HTML5 semantik (`index.html`), pengaturan Mode Gelap/Terang, data demo awal, & persistensi `localStorage` (`js/script.js` Bagian 0 & 1) | Anggota 4 | **Selesai** |
| **Modul 2** | **Anggota 2** | Desain *Soft Aesthetic Planner* & variabel *Dark Mode* (`css/style.css`), responsivitas (`375px–1440px`), render kartu Kanban, badge prioritas, & statistik (`js/script.js` Bagian 2) | Novita (Lead) | Dalam Pengerjaan |
| **Modul 3** | **Anggota 3** | Validasi formulir tambah tugas (*HTML5 + jQuery*), validasi *deadline* masa depan, & fitur hapus tugas dengan Bootstrap Modal (`js/script.js` Bagian 3) | Anggota 2 | Menunggu |
| **Modul 4** | **Anggota 4** | Perpindahan status (`Kerjakan` / `Selesai`), pencarian *real-time*, filter prioritas & kategori, urutkan *deadline*, serta fitur bonus *Drag & Drop* & *Inline Editing* (`js/script.js` Bagian 4) | Anggota 3 | Menunggu |

## 3. Arsitektur Folder & Skema Data

### Struktur Direktori Proyek
```text
manajemen-tugas-k12/
├── assets/               # Aset gambar atau ikon pendukung
├── css/
│   └── style.css         # Desain Soft Student Planner, variabel Dark Mode, & media queries
├── js/
│   └── script.js         # Logika aplikasi terstruktur (Bagian 0 s.d. Bagian 4)
├── index.html            # Halaman utama (HTML5 Semantik + Bootstrap 5)
├── README.md             # Dokumentasi proyek dan panduan kolaborasi tim
└── laporan.pdf           # Laporan akhir proyek kelompok (ditambahkan saat finalisasi)