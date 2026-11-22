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

    // =========================================================================
    // BAGIAN 2: PERHITUNGAN DEADLINE, BADGE & RENDER KANBAN (Render Kartu, Statistik & Highlight Deadline)
    // =========================================================================
    function hitungSelisihHari(tanggalDeadline) {
        const hariIni = new Date();
        hariIni.setHours(0, 0, 0, 0);
        const target = new Date(tanggalDeadline);
        target.setHours(0, 0, 0, 0);
        return Math.ceil((target - hariIni) / (1000 * 60 * 60 * 24));
    }

    function dapatkanBadgePrioritas(prioritas) {
        if (prioritas === 'tinggi') {
            return '<span class="badge rounded-pill badge-prio-tinggi">Tinggi</span>';
        } else if (prioritas === 'sedang') {
            return '<span class="badge rounded-pill badge-prio-sedang">Sedang</span>';
        }
        return '<span class="badge rounded-pill badge-prio-rendah">Rendah</span>';
    }

    function renderSemuaTugas() {
        const kataKunci = $('#search-tugas').val().toLowerCase().trim();
        const filterPrioritas = $('#filter-prioritas').val();
        const filterKategori = $('#filter-kategori').val();
        const urutanDeadline = $('#sort-deadline').val();

        let jmlBelum = 0, jmlSedang = 0, jmlSelesai = 0, jmlOverdue = 0;

        daftarTugas.forEach(function (tugas) {
            if (tugas.status === 'belum') jmlBelum++;
            if (tugas.status === 'sedang') jmlSedang++;
            if (tugas.status === 'selesai') jmlSelesai++;
            if (hitungSelisihHari(tugas.deadline) < 0 && tugas.status !== 'selesai') {
                jmlOverdue++;
            }
        });

        $('#count-belum, #badge-belum').text(jmlBelum);
        $('#count-sedang, #badge-sedang').text(jmlSedang);
        $('#count-selesai, #badge-selesai').text(jmlSelesai);
        $('#count-overdue').text(jmlOverdue);

        let tugasTersaring = daftarTugas.filter(function (tugas) {
            const cocokCari = tugas.judul.toLowerCase().includes(kataKunci) ||
                tugas.deskripsi.toLowerCase().includes(kataKunci);
            const cocokPrioritas = (filterPrioritas === 'semua') || (tugas.prioritas === filterPrioritas);
            const cocokKategori = (filterKategori === 'semua') || (tugas.kategori === filterKategori);
            return cocokCari && cocokPrioritas && cocokKategori;
        });

        tugasTersaring.sort(function (a, b) {
            const tglA = new Date(a.deadline);
            const tglB = new Date(b.deadline);
            return urutanDeadline === 'terdekat' ? (tglA - tglB) : (tglB - tglA);
        });

        $('#list-belum').html('');
        $('#list-sedang').html('');
        $('#list-selesai').html('');

        tugasTersaring.forEach(function (tugas) {
            const sisaHari = hitungSelisihHari(tugas.deadline);
            let classHighlight = '';
            let labelWaktu = `<small class="text-muted-custom"><i class="bi bi-calendar3 me-1"></i>${escapeHTML(tugas.deadline)}</small>`;

            if (tugas.status !== 'selesai') {
                if (sisaHari < 0) {
                    classHighlight = 'task-overdue';
                    labelWaktu = `<small class="text-danger-soft fw-semibold"><i class="bi bi-exclamation-circle me-1"></i>Lewat (${escapeHTML(tugas.deadline)})</small>`;
                } else if (sisaHari < 3) {
                    classHighlight = 'task-urgent';
                    labelWaktu = `<small class="fw-semibold"><i class="bi bi-clock-history me-1"></i>${sisaHari === 0 ? 'Hari Ini' : sisaHari + ' hari lagi'}</small>`;
                }
            }

            let tombolPindah = '';
            if (tugas.status === 'belum') {
                tombolPindah = `<button type="button" class="btn btn-next-step btn-pindah" data-id="${tugas.id}" data-next="sedang">Kerjakan &rarr;</button>`;
            } else if (tugas.status === 'sedang') {
                tombolPindah = `<button type="button" class="btn btn-next-step btn-pindah" data-id="${tugas.id}" data-next="selesai">Selesai &check;</button>`;
            } else {
                tombolPindah = `<span class="badge rounded-pill badge-soft-green">Tuntas</span>`;
            }

            const safeJudul = escapeHTML(tugas.judul);
            const safeDeskripsi = escapeHTML(tugas.deskripsi);
            const safeKategori = escapeHTML(tugas.kategori);

            const kartuHTML = `
                <div class="card task-card ${classHighlight} mb-3" data-id="${tugas.id}">
                    <div class="card-body p-3">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <div class="d-flex flex-wrap gap-1">
                                ${dapatkanBadgePrioritas(tugas.prioritas)}
                                <span class="badge rounded-pill badge-kategori">${safeKategori}</span>
                            </div>
                            <div class="d-flex gap-1">
                                <button type="button" class="btn btn-card-action btn-edit-inline" data-id="${tugas.id}" title="Edit Langsung"><i class="bi bi-pencil-square"></i></button>
                                <button type="button" class="btn btn-card-action btn-buka-hapus text-danger-soft" data-id="${tugas.id}" title="Hapus"><i class="bi bi-trash"></i></button>
                            </div>
                        </div>
                        <div class="view-mode-${tugas.id}">
                            <h3 class="h6 fw-bold mb-1">${safeJudul}</h3>
                            <p class="small text-muted-custom mb-3">${safeDeskripsi}</p>
                        </div>
                        <div class="edit-mode-${tugas.id} d-none mb-3">
                            <input type="text" class="form-control form-control-sm planner-input mb-2 edit-judul-${tugas.id}" value="${safeJudul}">
                            <textarea class="form-control form-control-sm planner-input mb-2 edit-deskripsi-${tugas.id}" rows="2">${safeDeskripsi}</textarea>
                            <div class="d-flex gap-2">
                                <button type="button" class="btn btn-soft-primary btn-sm btn-simpan-inline" data-id="${tugas.id}">Simpan</button>
                                <button type="button" class="btn btn-soft-outline btn-sm btn-batal-inline" data-id="${tugas.id}">Batal</button>
                            </div>
                        </div>
                        <div class="d-flex justify-content-between align-items-center pt-2 border-top">
                            ${labelWaktu}
                            ${tombolPindah}
                        </div>
                    </div>
                </div>`;

            $(`#list-${tugas.status}`).append(kartuHTML);
        });

        $('.kanban-list').each(function () {
            if ($(this).children().length === 0) {
                $(this).html('<div class="text-center text-muted-custom small py-5">Belum ada tugas di kolom ini</div>');
            }
        });
    }


    // ===== BLOK ANGGOTA 3: VALIDASI FORM & MODAL KONFIRMASI HAPUS =====
    function validasiFormTugas() {
        let valid = true;
        $('.error-text').text('');
        $('#form-tambah-tugas .form-control, #form-tambah-tugas .form-select').removeClass('is-invalid');

        const judul = $('#input-judul').val().trim();
        const deskripsi = $('#input-deskripsi').val().trim();
        const prioritas = $('#input-prioritas').val();
        const kategori = $('#input-kategori').val();
        const deadline = $('#input-deadline').val();

        if (judul.length < 3) {
            $('#error-judul').text('Judul tugas minimal 3 karakter.');
            $('#input-judul').addClass('is-invalid');
            valid = false;
        }

        if (deskripsi.length < 5) {
            $('#error-deskripsi').text('Deskripsi tugas minimal 5 karakter.');
            $('#input-deskripsi').addClass('is-invalid');
            valid = false;
        }

        if (!prioritas) {
            $('#error-prioritas').text('Pilih prioritas.');
            $('#input-prioritas').addClass('is-invalid');
            valid = false;
        }

        if (!kategori) {
            $('#error-kategori').text('Pilih kategori.');
            $('#input-kategori').addClass('is-invalid');
            valid = false;
        }

        if (!deadline) {
            $('#error-deadline').text('Deadline wajib diisi.');
            $('#input-deadline').addClass('is-invalid');
            valid = false;
        } else if (hitungSelisihHari(deadline) <= 0) {
            $('#error-deadline').text('Deadline harus di masa depan.');
            $('#input-deadline').addClass('is-invalid');
            valid = false;
        }

        return valid;
    }

    $('#form-tambah-tugas').on('submit', function (e) {
        e.preventDefault();
        if (!validasiFormTugas()) {
            tampilkanNotifikasi('Gagal menyimpan: Periksa kembali isian form yang belum sesuai.', 'danger');
            return;
        }

        const tugasBaru = {
            id: Date.now(),
            judul: $('#input-judul').val().trim(),
            deskripsi: $('#input-deskripsi').val().trim(),
            prioritas: $('#input-prioritas').val(),
            kategori: $('#input-kategori').val(),
            deadline: $('#input-deadline').val(),
            status: 'belum'
        };

        daftarTugas.push(tugasBaru);
        simpanKeStorage(daftarTugas);
        renderSemuaTugas();

        $('#form-tambah-tugas')[0].reset();
        tampilkanNotifikasi('Tugas baru berhasil ditambahkan!', 'success');
    });

        $(document).on('click', '.btn-buka-hapus', function () {
        idTugasAkanDihapus = Number($(this).data('id'));
        const tugas = daftarTugas.find(t => t.id === idTugasAkanDihapus);
        if (tugas) {
            $('#nama-tugas-hapus').text(`"${tugas.judul}"`);
            modalHapus.show();
        }
    });
    
    $('#btn-konfirmasi-hapus').on('click', function () {
        if (idTugasAkanDihapus !== null) {
            daftarTugas = daftarTugas.filter(t => t.id !== idTugasAkanDihapus);
            simpanKeStorage(daftarTugas);
            renderSemuaTugas();
            modalHapus.hide();
            tampilkanNotifikasi('Tugas telah dihapus.', 'warning');
            idTugasAkanDihapus = null;
        }
    });
    // ===== BLOK ANGGOTA 4: PINDAH STATUS, FILTER/SORT & FITUR BONUS =====
    $(document).on('click', '.btn-pindah', function () {
    const id = Number($(this).data('id'));
    const statusBaru = $(this).data('next');
    const index = daftarTugas.findIndex(t => t.id === id);
    if (index !== -1) {
        daftarTugas[index].status = statusBaru;
        simpanKeStorage(daftarTugas);
        renderSemuaTugas();
        tampilkanNotifikasi(`Status tugas diperbarui menjadi "${statusBaru.toUpperCase()}".`, 'success');
        }
        });
    
    $('#filter-prioritas, #filter-kategori').on('change', function () {
    renderSemuaTugas();
    });

    $('#sort-deadline').on('change', function () {
    renderSemuaTugas();
    });
    // Render awal: HARUS di baris paling akhir (sementara untuk uji)
    renderSemuaTugas();
});