$(document).ready(function () {
    const STORAGE_KEY = 'student_planner_k12_v2';
    const THEME_KEY = 'student_planner_k12_theme';
    let idTugasAkanDihapus = null;
    const modalHapus = new bootstrap.Modal(document.getElementById('modalHapusTugas'));

    function escapeHTML(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // ========================================================================
    // BAGIAN 0: PENGATURAN MODE GELAP / TERANG (ANGGOTA 1)
    // ========================================================================
    function terapkanTema(mode) {
        if (mode === 'dark') {
            $('body').addClass('dark-mode');
            $('#ikon-tema').removeClass('bi-moon-stars').addClass('bi-sun-fill');
            $('#teks-tema').text('Mode Terang');
        } else {
            $('body').removeClass('dark-mode');
            $('#ikon-tema').removeClass('bi-sun-fill').addClass('bi-moon-stars');
            $('#teks-tema').text('Mode Gelap');
        }
    }

    const temaTersimpan = localStorage.getItem(THEME_KEY) || 'light';
    terapkanTema(temaTersimpan);

    $('#btn-toggle-tema').on('click', function () {
        const modeBaru = $('body').hasClass('dark-mode') ? 'light' : 'dark';
        terapkanTema(modeBaru);
        localStorage.setItem(THEME_KEY, modeBaru);
    });

    // ========================================================================
    // BAGIAN 1: DATA AWAL & LOCALSTORAGE (ANGGOTA 1)
    // ========================================================================
    function buatTanggalRelatif(selisihHari) {
        const tgl = new Date();
        tgl.setDate(tgl.getDate() + selisihHari);
        return tgl.toISOString().split('T')[0];
    }

    const dataAwalDefault = [
        {
            id: 101,
            judul: 'Revisi Bab 1 Laporan UAS',
            deskripsi: 'Melengkapi latar belakang dan tujuan studi kasus K12.',
            prioritas: 'tinggi',
            deadline: buatTanggalRelatif(-1),
            status: 'belum',
            kategori: 'Kuliah'
        },
        {
            id: 102,
            judul: 'Penyempurnaan UI Student Planner',
            deskripsi: 'Menyesuaikan palet warna pastel lembut dan dukungan mode gelap.',
            prioritas: 'tinggi',
            deadline: buatTanggalRelatif(1),
            status: 'sedang',
            kategori: 'Proyek'
        },
        {
            id: 103,
            judul: 'Rapat Koordinasi Kepanitiaan',
            deskripsi: 'Finalisasi susunan acara seminar mahasiswa.',
            prioritas: 'sedang',
            deadline: buatTanggalRelatif(2),
            status: 'belum',
            kategori: 'Organisasi'
        },
        {
            id: 104,
            judul: 'Latihan Normalisasi Basis Data',
            deskripsi: 'Mengerjakan studi kasus relasi tabel 1NF hingga 3NF.',
            prioritas: 'rendah',
            deadline: buatTanggalRelatif(5),
            status: 'belum',
            kategori: 'Kuliah'
        },
        {
            id: 105,
            judul: 'Backup Repositori Kelompok',
            deskripsi: 'Unggah struktur folder akhir ke GitHub sebelum presentasi.',
            prioritas: 'sedang',
            deadline: buatTanggalRelatif(4),
            status: 'selesai',
            kategori: 'Pribadi'
        }
    ];

    function muatDariStorage() {
        const tersimpan = localStorage.getItem(STORAGE_KEY);
        if (tersimpan) {
            return JSON.parse(tersimpan);
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataAwalDefault));
        return [...dataAwalDefault];
    }

    function simpanKeStorage(daftar) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(daftar));
    }

    let daftarTugas = muatDariStorage();

    function tampilkanNotifikasi(pesan, tipe = 'success') {
        const $alert = $('#alert-notifikasi');
        $('#teks-notifikasi').text(pesan);
        $alert
            .removeClass('d-none alert-success alert-danger alert-warning')
            .addClass(`alert-${tipe} show`);
    }

    $('#btn-tutup-alert').on('click', function () {
        $('#alert-notifikasi').addClass('d-none').removeClass('show');
    });

    // ===== BLOK ANGGOTA 2: PERHITUNGAN DEADLINE & RENDER KANBAN =====

    // ===== BLOK ANGGOTA 3: VALIDASI FORM & MODAL KONFIRMASI HAPUS =====

    // ===== BLOK ANGGOTA 4: PINDAH STATUS, FILTER/SORT & FITUR BONUS =====

});