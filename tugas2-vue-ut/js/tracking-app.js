/* =========================================================
   1. MENGAMBIL FUNGSI CREATEAPP DARI VUE 3
   ========================================================= */

/* Mengambil fungsi createApp dari library Vue 3.
   Fungsi ini digunakan untuk membuat instance aplikasi Vue
   yang mengelola data dan tampilan halaman tracking. */
const { createApp } = Vue;


/* =========================================================
   2. MEMBUAT INSTANCE APLIKASI VUE
   ========================================================= */

createApp({

    // =====================================================
    // 2.1. MANAJEMEN DATA (STATE)
    // =====================================================

    /* data() digunakan untuk menyimpan seluruh data utama
       yang digunakan dan dikelola oleh aplikasi Vue. */
    data() {
        return {

            // Mengambil data master dari dataBahanAjar.js
            pengirimanList: dataBahanAjar.pengirimanList,
            paketList: dataBahanAjar.paket,
            stokList: dataBahanAjar.stok,
            trackingList: dataBahanAjar.tracking,

            // Menampung nomor DO yang dimasukkan pengguna.
            inputDO: "",

            // Menampung data formulir pembuatan DO baru.
            newDO: {
                nomorDO: "",
                nim: "",
                nama: "",
                ekspedisi: "",
                paket: "",
                tanggalKirim: "",
                total: 0
            }
        };
    },


    // =====================================================
    // 2.2. COMPUTED PROPERTY
    // =====================================================

    /* computed digunakan untuk mengolah data secara otomatis
       ketika data yang menjadi ketergantungannya berubah. */
    computed: {

        // Mencari detail paket berdasarkan kode paket terpilih.
        selectedPaket() {
            return this.paketList.find(
                item => item.kode === this.newDO.paket
            );
        },


        // Mengambil detail bahan ajar yang terdapat dalam paket.
        isiPaketTerpilih() {

            // Jika belum memilih paket, kembalikan array kosong.
            if (!this.selectedPaket) return [];

            // Mencari detail setiap bahan ajar berdasarkan kode.
            return this.selectedPaket.isi
                .map(kodeItem =>
                    this.stokList.find(stok => stok.kode === kodeItem)
                )
                .filter(Boolean);
        },


        // Menghasilkan nomor DO berikutnya secara otomatis.
        nextNomorDO() {

        // Menggunakan tahun tetap 2025.
        const tahun = 2025;

        // Menghitung jumlah data DO yang sudah tersedia.
        const jumlahData =
            Object.keys(this.trackingList).length + 1;

        // Membuat nomor urut dengan tiga digit.
        const sequence = String(jumlahData).padStart(4, "0");

        // Menggabungkan kode DO, tahun, dan nomor urut.
        return "DO" + tahun + "-" + sequence;
},


        // Mencari data tracking berdasarkan nomor DO.
        hasilTracking() {

            // Jika input kosong, tidak perlu melakukan pencarian.
            if (!this.inputDO) return null;

            // Mengambil data berdasarkan nomor DO.
            const data = this.trackingList[this.inputDO];

            // Jika data tidak ditemukan, kembalikan null.
            if (!data) return null;

            // Mengembalikan informasi tracking.
            return {
                nomorDO: this.inputDO,
                nim: data.nim,
                nama: data.nama,
                status: data.status,
                ekspedisi: data.ekspedisi,
                tanggalKirim: data.tanggalKirim,
                paket: data.paket,
                total: data.total,
                perjalanan: data.perjalanan
            };
        }
    },


    // =====================================================
    // 2.3. WATCHER
    // =====================================================

    /* watch digunakan untuk mengamati perubahan data tertentu
       dan menjalankan fungsi ketika terjadi perubahan. */
    watch: {

        // Memperbarui total harga ketika paket berubah.
        selectedPaket(newValue) {
            this.newDO.total = newValue
                ? newValue.harga
                : 0;
        },


        // Memantau perubahan pilihan ekspedisi.
        "newDO.ekspedisi"(newValue) {
            console.log("Ekspedisi dipilih:", newValue);
        }
    },


    // =====================================================
    // 2.4. METHODS
    // =====================================================

    methods: {

        // -------------------------------------------------
        // FUNGSI TANGGAL DAN WAKTU LOKAL
        // -------------------------------------------------

        /* Mengambil tanggal dan waktu lokal perangkat
           dalam format YYYY-MM-DDTHH:mm.

           Format ini sesuai untuk input datetime-local. */
        getLocalDateTime() {
            const now = new Date();
            const offset = now.getTimezoneOffset() * 60000;

            return new Date(now.getTime() - offset)
                .toISOString()
                .slice(0, 16);
        },


        /* Mengambil tanggal lokal dengan format YYYY-MM-DD.
           Zona waktu ditetapkan ke Asia/Jakarta (WIB). */
        getLocalDate() {
            const now = new Date();

            const parts = new Intl.DateTimeFormat("en-CA", {
                timeZone: "Asia/Jakarta",
                year: "numeric",
                month: "2-digit",
                day: "2-digit"
            }).formatToParts(now);

            const year = parts.find(p => p.type === "year").value;
            const month = parts.find(p => p.type === "month").value;
            const day = parts.find(p => p.type === "day").value;

            return `${year}-${month}-${day}`;
        },


        // -------------------------------------------------
        // FORMAT HARGA
        // -------------------------------------------------

        /* Mengubah angka menjadi format mata uang Rupiah. */
        formatRupiah(value) {
            return "Rp " + Number(value).toLocaleString("id-ID");
        },


        // -------------------------------------------------
        // PENCARIAN NOMOR DELIVERY ORDER
        // -------------------------------------------------

        /* Memvalidasi nomor DO yang dimasukkan pengguna
           dan memberikan peringatan jika data tidak ditemukan. */
        cariDO() {

            // Memeriksa apakah nomor DO belum diisi.
            if (!this.inputDO) {
                Swal.fire({
                    title: "Nomor DO Kosong",
                    text: "Masukkan nomor DO terlebih dahulu.",
                    icon: "warning",
                    confirmButtonColor: "#f97316"
                });

                return;
            }

            // Memeriksa apakah nomor DO tersedia.
            if (!this.trackingList[this.inputDO]) {
                Swal.fire({
                    title: "Data Tidak Ditemukan",
                    text: "Nomor DO " + this.inputDO + " tidak tersedia.",
                    icon: "error",
                    confirmButtonColor: "#1e3a8a"
                });
            }
        },


        // -------------------------------------------------
        // MENENTUKAN WARNA STATUS PENGIRIMAN
        // -------------------------------------------------

        /* Menentukan kelas CSS berdasarkan status pengiriman. */
        statusClass(status) {

            const statusLower = status.toLowerCase();

            if (statusLower.includes("selesai")) {
                return "bg-green-100 text-green-700 border-green-200";

            } else if (statusLower.includes("perjalanan")) {
                return "bg-blue-100 text-blue-700 border-blue-200";

            } else if (statusLower.includes("proses")) {
                return "bg-orange-100 text-orange-700 border-orange-200";

            } else {
                return "bg-gray-100 text-gray-700 border-gray-200";
            }
        },


        // -------------------------------------------------
        // MEMBUAT DELIVERY ORDER BARU
        // -------------------------------------------------

        /* submitDO() digunakan untuk memvalidasi formulir,
           membuat nomor DO, menyimpan data pengiriman,
           mencatat histori, dan mengosongkan formulir. */
        submitDO() {

            // Memeriksa kelengkapan data formulir.
            if (
                !this.newDO.nim ||
                !this.newDO.nama ||
                !this.newDO.ekspedisi ||
                !this.newDO.paket
            ) {
                Swal.fire({
                    icon: "warning",
                    title: "Data Belum Lengkap",
                    text: "NIM, nama, ekspedisi, dan paket wajib diisi.",
                    confirmButtonColor: "#f39c12"
                });

                return;
            }


            // Mengambil nomor DO berikutnya.
            const nomor = this.nextNomorDO;


            // Membentuk objek data pengiriman baru.
            const dataBaru = {

                // Identitas penerima.
                nim: this.newDO.nim,
                nama: this.newDO.nama,

                // Status awal pengiriman.
                status: "Dalam Proses",

                // Informasi ekspedisi dan paket.
                ekspedisi: this.newDO.ekspedisi,
                paket: this.newDO.paket,

                // Menggunakan tanggal kirim yang dipilih pengguna.
                // Jika kosong, sistem menggunakan tanggal lokal WIB.
                tanggalKirim:
                    this.newDO.tanggalKirim || this.getLocalDate(),

                // Mengambil total harga paket.
                total: this.newDO.total,

                // Membuat riwayat perjalanan awal.
                perjalanan: [
                    {
                        waktu: new Date().toLocaleString("id-ID", {
                            timeZone: "Asia/Jakarta"
                        }),

                        keterangan:
                            "Data DO dibuat dan menunggu pengiriman"
                    }
                ]
            };


            // Menyimpan data DO baru ke dalam trackingList.
            this.trackingList[nomor] = dataBaru;


            // Menambahkan aktivitas baru ke histori.
            dataBahanAjar.histori.push({
                tanggal: this.getLocalDate(),
                aktivitas: "Delivery Order dibuat",
                nomorDO: nomor,
                pengguna: this.newDO.nama,

                keterangan:
                    "Paket " + this.newDO.paket +
                    " dibuat dengan status Dalam Proses"
            });


            // Menyimpan perubahan data ke localStorage.
            simpanDataBahanAjar();


            // Menampilkan notifikasi keberhasilan.
            Swal.fire({
                icon: "success",
                title: "Data Berhasil Disimpan",
                html: `
                    <p>Nomor DO: <b>${nomor}</b></p>
                    <p>Nama: <b>${this.newDO.nama}</b></p>
                    <p>Paket: <b>${this.newDO.paket}</b></p>
                `,
                confirmButtonText: "Oke",
                confirmButtonColor: "#3085d6"
            });


            // Langsung menampilkan tracking DO yang baru dibuat.
            this.inputDO = nomor;


            // Mengosongkan formulir setelah data berhasil disimpan.
            this.newDO = {
                nomorDO: this.nextNomorDO,
                nim: "",
                nama: "",
                ekspedisi: "",
                paket: "",
                tanggalKirim: this.getLocalDateTime(),
                total: 0
            };
        }
    },


    // =====================================================
    // 2.5. LIFECYCLE HOOK
    // =====================================================

    /* mounted() dijalankan setelah aplikasi Vue
       berhasil dipasang pada elemen HTML. */
    mounted() {

        // Mengisi nomor DO otomatis.
        this.newDO.nomorDO = this.nextNomorDO;

        // Mengisi tanggal dan waktu lokal saat halaman dibuka.
        this.newDO.tanggalKirim = this.getLocalDateTime();

        // Menampilkan nomor DO contoh saat halaman pertama dibuka.
        this.inputDO = "DO2025-0001";
    }


// =========================================================
// 3. MEMASANG APLIKASI VUE KE HALAMAN HTML
// =========================================================

/* Menghubungkan aplikasi Vue dengan elemen HTML
   yang memiliki id="trackingApp". */
}).mount("#trackingApp");