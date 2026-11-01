/* =========================================================
   1. MENGAMBIL FUNGSI CREATEAPP DARI VUE 3
   ========================================================= */

// Mengambil fungsi createApp dari library Vue 3.
// createApp digunakan untuk membuat instance aplikasi Vue.
const { createApp } = Vue;


/* =========================================================
   2. MEMBUAT INSTANCE APLIKASI VUE
   ========================================================= */

// Membuat aplikasi Vue dengan konfigurasi data, computed,
// dan methods yang digunakan untuk menampilkan dashboard laporan.
createApp({

    // --- 1. MANAJEMEN DATA (STATE) ---

    /* data() digunakan untuk mendefinisikan data lokal aplikasi.
       Data yang dikembalikan melalui return akan menjadi
       bagian dari state reaktif Vue. */
    data() {
        return {

            // Mengambil data utama stok dan pelacakan DO dari objek globa
            // stokList digunakan untuk menyimpan daftar stok bahan ajar.
            // Data diambil dari properti stok pada objek dataBahanAjar.
            stokList: dataBahanAjar.stok,

            // trackingList digunakan untuk menyimpan data pelacakan
            // pengiriman bahan ajar berdasarkan nomor Delivery Order.
            // Data diambil dari properti tracking pada objek dataBahanAjar.
            trackingList: dataBahanAjar.tracking
        };
    },


    // --- 2. AKUMULASI & REKAP DATA (COMPUTED) ---

    /* computed digunakan untuk membuat properti hasil perhitungan
       atau pengolahan data secara otomatis.

       Hasil computed akan diperbarui ketika data yang menjadi
       ketergantungannya mengalami perubahan. */
    computed: {

        // Mengubah format data tracking (objek) menjadi array agar mudah di-looping di UI
        // daftarDO menghasilkan array dari data tracking.
        // Array lebih mudah digunakan untuk perulangan pada template Vue,
        // misalnya menggunakan direktif v-for.
        daftarDO() {

            // Object.keys() mengambil seluruh key atau nama properti
            // dari objek trackingList.
            //
            // map() mengolah setiap key menjadi objek baru.
            // Variabel nomor berisi nomor Delivery Order yang sedang diproses.
            return Object.keys(this.trackingList).map(nomor => {

                // Mengembalikan objek baru untuk setiap data Delivery Order.
                return {

                    // Menyimpan nomor DO sebagai properti nomorDO.
                    // Nilainya berasal dari key objek trackingList.
                    nomorDO: nomor,

                    // Spread operator (...) mengambil seluruh properti
                    // dari objek tracking berdasarkan nomor DO.
                    // Dengan demikian, seluruh informasi tracking
                    // dimasukkan ke dalam objek baru.
                    ...this.trackingList[nomor]
                };
            });
        },


        // Menghitung variasi jenis/judul bahan ajar yang terdaftar
        // Menghasilkan jumlah jenis bahan ajar yang terdapat
        // dalam array stokList.
        totalBahanAjar() {

            // length digunakan untuk menghitung jumlah elemen
            // yang terdapat di dalam array stokList.
            return this.stokList.length;
        },


        // Menghitung total keseluruhan unit fisik barang yang ada di gudang
        // reduce() digunakan untuk menjumlahkan seluruh jumlah stok
        // dari setiap bahan ajar.
        totalStok() {

            // total merupakan nilai akumulasi sementara.
            // item merupakan objek bahan ajar yang sedang diproses.
            //
            // item.qty mengambil jumlah stok dari setiap bahan ajar.
            // Hasil penjumlahan seluruh qty dikembalikan sebagai total stok.
            return this.stokList.reduce((total, item) => total + item.qty, 0);
        },


        // Menghitung jumlah item yang stoknya kritis (di bawah angka safety) atau habis
        // filter() digunakan untuk menyaring data stok berdasarkan kondisi tertentu.
        // Data yang memenuhi kondisi akan dimasukkan ke array hasil filter.
        stokMenipis() {

            // item.qty < item.safety:
            // Memeriksa apakah jumlah stok lebih kecil dari batas stok aman.
            //
            // item.qty === 0:
            // Memeriksa apakah jumlah stok sama dengan nol.
            //
            // Operator || berarti salah satu kondisi harus terpenuhi.
            // length menghitung jumlah bahan ajar yang memenuhi kondisi tersebut.
            return this.stokList.filter(item => item.qty < item.safety || item.qty === 0).length;
        },


        // Menghitung total seluruh dokumen Delivery Order (DO) yang berjalan
        // Menghitung jumlah data Delivery Order yang telah diolah
        // oleh computed property daftarDO.
        totalDO() {

            // length digunakan untuk menghitung jumlah
            // Delivery Order yang terdapat dalam array daftarDO.
            return this.daftarDO.length;
        }
    },


    // --- 3. FORMATTING & INDIKATOR VISUAL (METHODS) ---

    /* methods digunakan untuk mendefinisikan kumpulan fungsi
       yang dapat dipanggil oleh template maupun bagian lain
       dari instance aplikasi Vue. */
    methods: {

        // Mengubah nominal angka biasa menjadi format mata uang Rupia
        // formatRupiah() menerima parameter value berupa angka nominal.
        formatRupiah(value) {

            // Number(value) memastikan nilai dikonversi menjadi angka.
            //
            // toLocaleString("id-ID") mengubah format angka
            // mengikuti aturan penulisan angka di Indonesia.
            //
            // Teks "Rp " ditambahkan di depan angka sebagai simbol Rupiah.
            return "Rp " + Number(value).toLocaleString("id-ID");
        },


        // Menentukan label teks status stok barang
        // statusStok() menerima parameter item berupa objek bahan ajar.
        // Fungsi ini menentukan status berdasarkan jumlah stok
        // dan batas stok aman.
        statusStok(item) {

            // Jika jumlah stok sama dengan nol,
            // fungsi mengembalikan status "Kosong".
            if (item.qty === 0) return "Kosong";

            // Jika jumlah stok lebih kecil dari batas stok aman,
            // fungsi mengembalikan status "Menipis".
            if (item.qty < item.safety) return "Menipis";

            // Jika kedua kondisi di atas tidak terpenuhi,
            // stok dinyatakan dalam kondisi "Aman".
            return "Aman";
        },


        // Menentukan warna badge (class Tailwind) sesuai kondisi riil stok
        // statusClass() digunakan untuk menentukan class CSS
        // berdasarkan kondisi jumlah stok bahan ajar.
        statusClass(item) {

            // Jika stok kosong, gunakan class Tailwind
            // dengan latar belakang merah dan teks merah.
            if (item.qty === 0) return "bg-red-100 text-red-700";

            // Jika stok berada di bawah batas aman,
            // gunakan class Tailwind dengan latar belakang oranye
            // dan teks oranye.
            if (item.qty < item.safety) return "bg-orange-100 text-orange-700";

            // Jika stok aman, gunakan class Tailwind
            // dengan latar belakang hijau dan teks hijau.
            return "bg-green-100 text-green-700";
        }
    }


// Menghubungkan aplikasi Vue ke elemen HTML dashboard dengan id="laporanApp"
// mount() digunakan untuk memasang aplikasi Vue pada elemen HTML.
// Selector "#laporanApp" menunjuk elemen yang memiliki id="laporanApp".
// Setelah dipasang, Vue mengelola tampilan dan data pada elemen tersebut.
}).mount("#laporanApp");