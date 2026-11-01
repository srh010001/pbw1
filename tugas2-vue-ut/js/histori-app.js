/* =========================================================
   1. MENGAMBIL FUNGSI CREATEAPP DARI VUE 3
   ========================================================= */

// 1. Mengambil fungsi createApp dari library Vue 3
// createApp merupakan fungsi utama Vue 3 untuk membuat
// sebuah aplikasi Vue baru.
const { createApp } = Vue;


/* =========================================================
   2. MEMBUAT DAN MENGATUR APLIKASI VUE
   ========================================================= */

// 2. Membuat instansiasi aplikasi Vue
// createApp() digunakan untuk membuat instance aplikasi Vue.
// Di dalamnya terdapat konfigurasi data, computed, methods,
// dan berbagai fitur lain yang diperlukan aplikasi.
createApp({

    /* -----------------------------------------------------
       A. DATA
       ----------------------------------------------------- */

    // data() digunakan untuk mendefinisikan state/data lokal aplikasi
    // Fungsi ini mengembalikan objek yang berisi data reaktif.
    // Data tersebut dapat digunakan dan ditampilkan oleh template Vue.
    data() {
        return {

            // Mengambil data riwayat umum dari objek global dataBahanAjar
            // historiList berisi daftar aktivitas atau riwayat aplikasi.
            // Data diambil dari properti histori pada objek dataBahanAjar.
            historiList: dataBahanAjar.histori,

            // Mengambil data pelacakan (tracking) dari objek global dataBahanAjar
            // trackingList berisi informasi pelacakan pengiriman bahan ajar.
            // Data diambil dari properti tracking pada objek dataBahanAjar.
            trackingList: dataBahanAjar.tracking
        };
    },


    /* -----------------------------------------------------
       B. COMPUTED
       ----------------------------------------------------- */

    // computed digunakan untuk membuat properti yang nilainya otomatis berubah
    // jika data di dalamnya (historiList/trackingList) mengalami perubahan
    //
    // Computed property digunakan untuk mengolah data sebelum ditampilkan.
    // Hasilnya akan diperbarui secara otomatis ketika data yang menjadi
    // ketergantungannya mengalami perubahan.
    computed: {

        // historiGabungan merupakan computed property
        // yang menghasilkan gabungan antara histori umum
        // dan histori yang berasal dari data tracking DO.
        historiGabungan() {

            // Mengubah objek trackingList menjadi array berformat standar
            //
            // Object.keys() mengambil seluruh nama properti atau key
            // dari objek trackingList.
            //
            // map() digunakan untuk mengolah setiap key tersebut
            // menjadi objek baru dengan struktur yang seragam.
            const historiDO = Object.keys(this.trackingList).map(nomor => {

                // Setiap data pelacakan di-mapping ulang strukturnya
                //
                // this.trackingList[nomor] mengakses data tracking
                // berdasarkan nomor DO yang sedang diproses.
                //
                // return mengembalikan objek baru yang berisi
                // informasi riwayat pengiriman.
                return {

                    // Mengambil tanggal pengiriman dari data tracking.
                    // Nilai tanggalKirim digunakan sebagai tanggal aktivitas.
                    tanggal: this.trackingList[nomor].tanggalKirim,

                    // Memberikan label aktivitas bahwa data berasal
                    // dari proses pelacakan Delivery Order.
                    aktivitas: "Tracking DO",

                    // Menggunakan nomor DO sebagai identitas
                    // dari setiap riwayat pelacakan.
                    nomorDO: nomor,

                    // Mengambil nama pengguna atau penerima
                    // dari data tracking.
                    pengguna: this.trackingList[nomor].nama,

                    // Menggabungkan teks "Status: " dengan status pengiriman.
                    // Contoh hasil: Status: Dalam Perjalanan.
                    keterangan: "Status: " + this.trackingList[nomor].status
                };
            });

            // Menggabungkan array historiList dan array historiDO yang baru dibuat
            // menggunakan spread operator (...) menjadi satu array tunggal
            //
            // Spread operator (...) mengambil seluruh elemen
            // dari masing-masing array dan memasukkannya ke array baru.
            //
            // Hasil akhirnya adalah gabungan riwayat umum
            // dan riwayat pelacakan Delivery Order.
            return [...this.historiList, ...historiDO];
        }
    }

// 3. Menghubungkan dan merender aplikasi Vue ini ke elemen HTML dengan id="historiApp"
// mount("#historiApp") menghubungkan aplikasi Vue ke elemen HTML
// yang memiliki atribut id="historiApp".
// Setelah terhubung, Vue akan mengelola tampilan pada elemen tersebut.
}).mount("#historiApp");