/* =========================================================
   1. MENGAMBIL FUNGSI CREATEAPP DARI VUE 3
   ========================================================= */

/* Mengambil fungsi createApp dari library Vue 3.
   Fungsi ini digunakan untuk membuat instance aplikasi Vue
   yang akan mengelola data dan tampilan halaman. */
const { createApp } = Vue;


/* =========================================================
   2. MEMBUAT INSTANCE APLIKASI VUE
   ========================================================= */

/* createApp() digunakan untuk membuat aplikasi Vue.
   Konfigurasi aplikasi terdiri dari:
   1. data()     : mengatur state atau data utama.
   2. computed   : mengolah data secara reaktif.
   3. watch      : mengamati perubahan data.
   4. methods    : menyediakan fungsi-fungsi aksi. */
createApp({

    // --- 1. MANAJEMEN STATE / DATA UTAMA ---

    /* data() digunakan untuk mendefinisikan seluruh data
       yang dikelola oleh aplikasi Vue.

       Data yang dikembalikan melalui return akan menjadi
       state reaktif sehingga perubahan nilainya dapat
       memengaruhi tampilan aplikasi secara otomatis. */
    data() {
        return {

            // Data master (diambil dari objek global dataBahanAjar)
            // Mengambil daftar UPBJJ dari objek dataBahanAjar.
            // Data ini digunakan sebagai pilihan lokasi pada filter.
            upbjjList: dataBahanAjar.upbjjList,

            // Mengambil daftar kategori bahan ajar.
            // Data ini digunakan sebagai pilihan kategori pada filter
            // dan formulir penambahan maupun pengeditan bahan ajar.
            kategoriList: dataBahanAjar.kategoriList,

            // Mengambil seluruh data stok bahan ajar.
            // Data ini menjadi sumber utama untuk menampilkan,
            // menyaring, menambah, dan mengubah data persediaan.
            stok: dataBahanAjar.stok,


            // State untuk menampung filter dan pengurutan (sorting) aktif

            // Menyimpan pilihan UPBJJ yang sedang digunakan.
            // Nilai awal kosong berarti belum ada filter UPBJJ.
            selectedUpbjj: "",

            // Menyimpan pilihan kategori yang sedang digunakan.
            // Nilai awal kosong berarti belum ada filter kategori.
            selectedKategori: "",

            // Menyimpan status filter stok kritis.
            // Nilai false berarti filter stok kritis belum diaktifkan.
            // Jika true, hanya stok di bawah batas aman atau stok kosong
            // yang akan ditampilkan.
            isSafety: false,

            // Menyimpan jenis pengurutan data yang dipilih.
            // Nilai awal kosong berarti data belum diurutkan.
            sortBy: "",


            // Template objek untuk menampung input data baru

            /* newItem merupakan objek sementara yang digunakan
               untuk menampung nilai dari formulir penambahan bahan ajar.

               Setiap properti mewakili satu kolom data bahan ajar. */
            newItem: {
                // Kode unik bahan ajar.
                kode: "",

                // Judul atau nama bahan ajar.
                judul: "",

                // Kategori bahan ajar.
                kategori: "",

                // Lokasi UPBJJ tempat bahan ajar berada.
                upbjj: "",

                // Lokasi rak penyimpanan bahan ajar.
                lokasiRak: "",

                // Harga satuan bahan ajar.
                harga: "",

                // Jumlah stok bahan ajar.
                qty: "",

                // Batas minimum stok aman.
                safety: "",

                // Catatan tambahan yang dapat berisi teks atau HTML.
                catatanHTML: ""
            },


            // State untuk manajemen mode edit data

            /* editIndex digunakan untuk menyimpan posisi atau indeks
               data stok yang sedang diedit.

               Nilai null berarti belum ada data yang dipilih
               untuk proses pengeditan. */
            editIndex: null,

            /* editItemData merupakan objek sementara untuk menampung
               data bahan ajar yang akan diedit.

               Nilai awal setiap properti dibuat kosong sebelum
               data dari item yang dipilih dimasukkan. */
            editItemData: {
                kode: "",
                judul: "",
                kategori: "",
                upbjj: "",
                lokasiRak: "",
                harga: "",
                qty: "",
                safety: "",
                catatanHTML: ""
            }
        };
    },


    // --- 2. LOGIKA REAKTIF (FILTER & SORTING DATA) ---

    /* computed digunakan untuk membuat properti hasil pengolahan data.

       Nilai computed akan dihitung ulang secara otomatis
       ketika data yang menjadi ketergantungannya berubah.

       Bagian ini digunakan untuk memproses filter kategori,
       filter lokasi, filter stok kritis, dan pengurutan stok. */
    computed: {

        // Menyaring daftar kategori secara dinamis berdasarkan UPBJJ yang dipilih

        /* kategoriListFiltered menghasilkan daftar kategori
           berdasarkan lokasi UPBJJ yang sedang dipilih.

           Dengan demikian, pilihan kategori dapat menyesuaikan
           data bahan ajar yang tersedia pada lokasi tersebut. */
        kategoriListFiltered() {

            // Jika belum ada UPBJJ yang dipilih,
            // kembalikan array kosong agar tidak menampilkan kategori.
            if (!this.selectedUpbjj) return [];

            /* Membuat daftar kategori berdasarkan UPBJJ terpilih.

               filter() menyaring data stok agar hanya mengambil
               bahan ajar yang lokasi UPBJJ-nya sesuai pilihan.

               map() mengambil nilai kategori dari setiap data
               yang sudah disaring. */
            const hasil = this.stok
                .filter(item => item.upbjj === this.selectedUpbjj)

                // Menghilangkan duplikasi kategori
                // map() mengubah setiap objek menjadi nilai kategori.
                .map(item => item.kategori);

            /* Set digunakan untuk menghilangkan nilai yang sama
               atau duplikat dari array.

               Spread operator (...) mengubah kembali hasil Set
               menjadi array biasa.

               Hasilnya adalah daftar kategori unik sesuai UPBJJ. */
            return [...new Set(hasil)];
        },


        // Memproses filter (UPBJJ, Kategori, Stok Kritis/Safety) dan pengurutan data stok untuk ditampilkan di UI

        /* filteredData menghasilkan daftar stok yang telah
           melewati proses penyaringan dan pengurutan.

           Data hasilnya dapat digunakan pada template Vue
           untuk menampilkan daftar bahan ajar. */
        filteredData() {

            /* Membuat salinan array stok menggunakan spread operator.
               Tujuannya agar proses filter dan sorting dilakukan
               pada array baru tanpa langsung mengubah array stok asli. */
            let data = [...this.stok];


            /* Memeriksa apakah pengguna memilih UPBJJ.
               Jika dipilih, data disaring berdasarkan lokasi UPBJJ tersebut. */
            if (this.selectedUpbjj) {

                // filter() mengambil data yang memiliki UPBJJ
                // sama dengan pilihan pengguna.
                data = data.filter(item => item.upbjj === this.selectedUpbjj);
            }


            /* Memeriksa apakah pengguna memilih kategori.
               Jika dipilih, data disaring berdasarkan kategori tersebut. */
            if (this.selectedKategori) {

                // Hanya bahan ajar dengan kategori yang sesuai
                // yang akan dimasukkan ke dalam hasil filter.
                data = data.filter(item => item.kategori === this.selectedKategori);
            }


            /* Memeriksa apakah filter stok kritis diaktifkan.
               Jika isSafety bernilai true, hanya data dengan stok
               di bawah batas aman atau stok kosong yang ditampilkan. */
            if (this.isSafety) {

                // item.qty < item.safety:
                // Memeriksa stok yang lebih kecil dari batas aman.
                //
                // item.qty === 0:
                // Memeriksa stok yang jumlahnya sama dengan nol.
                //
                // Operator || berarti salah satu kondisi harus terpenuhi.
                data = data.filter(item => item.qty < item.safety || item.qty === 0);
            }


            // Eksekusi pengurutan berdasarkan judul, qty, atau harga

            /* Memeriksa pilihan pengurutan berdasarkan judul.
               Jika sortBy bernilai "judul", data diurutkan
               berdasarkan nama atau judul bahan ajar. */
            if (this.sortBy === "judul") {

                /* sort() digunakan untuk mengurutkan elemen array.
                   localeCompare() membandingkan teks berdasarkan
                   aturan bahasa atau lokal yang digunakan.

                   a.judul dan b.judul merupakan judul dua item
                   yang sedang dibandingkan. */
                data.sort((a, b) => a.judul.localeCompare(b.judul));

            /* Jika pilihan pengurutan adalah "qty",
               data diurutkan berdasarkan jumlah stok. */
            } else if (this.sortBy === "qty") {

                /* Pengurutan dilakukan secara numerik
                   dari jumlah stok terkecil ke terbesar.

                   Hasil pengurangan a.qty - b.qty menentukan
                   posisi setiap item dalam array. */
                data.sort((a, b) => a.qty - b.qty);

            /* Jika pilihan pengurutan adalah "harga",
               data diurutkan berdasarkan harga bahan ajar. */
            } else if (this.sortBy === "harga") {

                /* Pengurutan harga dilakukan dari nilai terkecil
                   ke nilai terbesar menggunakan pengurangan angka. */
                data.sort((a, b) => a.harga - b.harga);
            }


            /* Mengembalikan data yang sudah melalui proses filter
               dan sorting agar dapat digunakan pada tampilan aplikasi. */
            return data;
        }
    },


    // --- 3. PENGAMAT PERUBAHAN DATA (WATCHER) ---

    /* watch digunakan untuk mengamati perubahan nilai suatu data.

       Berbeda dengan computed yang menghasilkan nilai olahan,
       watch menjalankan tindakan tertentu ketika data berubah. */
    watch: {

        // Jika pilihan UPBJJ berubah, otomatis reset pilihan kategori ke kosong

        /* selectedUpbjj() merupakan watcher untuk mengamati
           perubahan nilai selectedUpbjj.

           Ketika lokasi UPBJJ berubah, pilihan kategori
           dikosongkan agar kategori sebelumnya tidak terbawa
           ke lokasi UPBJJ yang baru. */
        selectedUpbjj() {

            // Mengatur ulang pilihan kategori menjadi kosong.
            this.selectedKategori = "";
        },


        // Melacak perubahan mode pengurutan di console log

        /* sortBy(newValue) merupakan watcher untuk mengamati
           perubahan pilihan pengurutan.

           newValue berisi nilai terbaru dari sortBy
           setelah pengguna mengubah pilihan sorting. */
        sortBy(newValue) {

            /* console.log() menampilkan informasi pada Console
               di Developer Tools browser.

               Pesan ini membantu memeriksa perubahan mode sorting
               selama proses pengembangan dan pengujian aplikasi. */
            console.log("Sort berubah:", newValue);
        }
    },


    // --- 4. KUMPULAN FUNGSI AKSI (METHODS) ---

    /* methods berisi kumpulan fungsi yang dapat dipanggil
       melalui template HTML maupun bagian lain dari aplikasi Vue.

       Bagian ini menangani reset filter, penentuan status stok,
       pemformatan harga, penambahan data, pengeditan data,
       penyimpanan perubahan, dan pembatalan edit. */
    methods: {

        // Mengembalikan semua kondisi filter ke pengaturan awal

        /* resetFilter() digunakan untuk menghapus seluruh
           pilihan filter dan pengurutan yang sedang aktif.

           Setelah fungsi dijalankan, daftar stok akan kembali
           ditampilkan tanpa filter tambahan. */
        resetFilter() {

            // Mengosongkan pilihan UPBJJ.
            this.selectedUpbjj = "";

            // Mengosongkan pilihan kategori.
            this.selectedKategori = "";

            // Menonaktifkan filter stok kritis.
            this.isSafety = false;

            // Menghapus pilihan sorting.
            this.sortBy = "";
        },


        // Menentukan teks indikator status ketersediaan barang (Kosong/Menipis/Aman)

        /* statusText() digunakan untuk menentukan status
           persediaan berdasarkan jumlah stok dan batas stok aman.

           Parameter item berisi objek bahan ajar yang diperiksa. */
        statusText(item) {

            // Jika jumlah stok sama dengan nol,
            // status bahan ajar adalah Kosong.
            if (item.qty === 0) return "Kosong";

            // Jika jumlah stok lebih kecil dari batas aman,
            // status bahan ajar adalah Menipis.
            if (item.qty < item.safety) return "Menipis";

            // Jika kedua kondisi tidak terpenuhi,
            // status bahan ajar adalah Aman.
            return "Aman";
        },


        // Menentukan warna badge (class Tailwind) berdasarkan status ketersediaan barang

        /* statusClass() menentukan class Tailwind yang digunakan
           untuk memberikan warna indikator status stok.

           Warna merah menunjukkan stok kosong.
           Warna oranye menunjukkan stok menipis.
           Warna hijau menunjukkan stok aman. */
        statusClass(item) {

            // Jika stok kosong, gunakan warna merah.
            if (item.qty === 0) return "bg-red-100 text-red-700";

            // Jika stok berada di bawah batas aman,
            // gunakan warna oranye.
            if (item.qty < item.safety) return "bg-orange-100 text-orange-700";

            // Jika stok aman, gunakan warna hijau.
            return "bg-green-100 text-green-700";
        },


        // Helper untuk mengubah angka biasa menjadi format mata uang Rupiah

        /* formatRupiah() digunakan untuk mengubah angka
           menjadi tampilan nominal mata uang Rupiah.

           Parameter value merupakan angka yang akan diformat. */
        formatRupiah(value) {

            /* Number(value) mengubah nilai menjadi tipe angka.

               toLocaleString("id-ID") mengatur format angka
               berdasarkan standar penulisan angka Indonesia.

               Teks "Rp " ditambahkan sebagai simbol mata uang Rupiah. */
            return "Rp " + Number(value).toLocaleString("id-ID");
        },


        // Validasi input, cek duplikasi kode, lalu menambahkan item baru ke array stok

        /* addItem() digunakan untuk menambahkan bahan ajar baru
           ke dalam array stok.

           Prosesnya terdiri dari:
           1. Memeriksa kelengkapan input.
           2. Memeriksa apakah kode sudah terdaftar.
           3. Memasukkan data baru ke array stok.
           4. Menyimpan perubahan ke localStorage.
           5. Menampilkan notifikasi keberhasilan.
           6. Mengosongkan formulir input. */
        addItem() {

            /* Memeriksa kelengkapan seluruh field wajib.
               Operator || berarti jika salah satu kondisi benar,
               maka data dianggap belum lengkap.

               Field harga, qty, dan safety diperiksa menggunakan
               perbandingan terhadap string kosong. */
            if (
                !this.newItem.kode ||
                !this.newItem.judul ||
                !this.newItem.kategori ||
                !this.newItem.upbjj ||
                !this.newItem.lokasiRak ||
                this.newItem.harga === "" ||
                this.newItem.qty === "" ||
                this.newItem.safety === ""
            ) {

                /* Jika ada data yang belum diisi,
                   tampilkan peringatan menggunakan SweetAlert2. */
                Swal.fire({
                    title: "Data Belum Lengkap",
                    text: "Semua field wajib diisi.",
                    icon: "warning",
                    confirmButtonColor: "#f97316"
                });

                // Menghentikan proses penambahan data
                // karena masih terdapat field yang belum lengkap.
                return;
            }


            /* some() digunakan untuk memeriksa apakah terdapat
               minimal satu data yang memenuhi kondisi tertentu.

               Pada bagian ini, sistem memeriksa apakah kode bahan ajar
               yang dimasukkan sudah terdapat di dalam array stok. */
            const kodeSudahAda = this.stok.some(item => item.kode === this.newItem.kode);


            /* Jika kode sudah ditemukan, penambahan data dibatalkan
               agar tidak terdapat kode bahan ajar yang duplikat. */
            if (kodeSudahAda) {

                // Menampilkan pemberitahuan bahwa kode sudah terdaftar.
                Swal.fire({
                    title: "Kode Sudah Ada",
                    text: "Kode bahan ajar sudah terdaftar.",
                    icon: "error",
                    confirmButtonColor: "#1e3a8a"
                });

                // Menghentikan proses penambahan data.
                return;
            }


            /* push() digunakan untuk menambahkan objek baru
               ke bagian akhir array stok.

               Nilai yang dimasukkan berasal dari objek newItem
               yang menampung data formulir. */
            this.stok.push({

                // Mengambil kode bahan ajar dari formulir.
                kode: this.newItem.kode,

                // Mengambil judul bahan ajar dari formulir.
                judul: this.newItem.judul,

                // Mengambil kategori bahan ajar dari formulir.
                kategori: this.newItem.kategori,

                // Mengambil lokasi UPBJJ dari formulir.
                upbjj: this.newItem.upbjj,

                // Mengambil lokasi rak penyimpanan dari formulir.
                lokasiRak: this.newItem.lokasiRak,

                // Mengubah nilai harga menjadi tipe angka.
                // Number() diperlukan agar harga dapat dihitung secara numerik.
                harga: Number(this.newItem.harga),

                // Mengubah nilai jumlah stok menjadi tipe angka.
                qty: Number(this.newItem.qty),

                // Mengubah nilai batas stok aman menjadi tipe angka.
                safety: Number(this.newItem.safety),

                // Mengambil catatan tambahan.
                // Jika catatan kosong, nilai default yang digunakan adalah "-".
                catatanHTML: this.newItem.catatanHTML || "-"
            });


            /* Memanggil fungsi simpanDataBahanAjar()
               untuk menyimpan perubahan data stok ke localStorage.

               Fungsi ini didefinisikan pada bagian pengelolaan
               penyimpanan data bahan ajar. */
            simpanDataBahanAjar();


            /* Menampilkan notifikasi bahwa data bahan ajar
               berhasil ditambahkan. */
            Swal.fire({
                title: "Berhasil!",
                text: "Data bahan ajar berhasil ditambahkan.",
                icon: "success",
                timer: 2000,
                showConfirmButton: false
            });


            // Reset form input data baru

            /* Mengembalikan objek newItem ke kondisi awal.
               Seluruh nilai input dikosongkan agar formulir
               siap digunakan untuk menambahkan data berikutnya. */
            this.newItem = {
                kode: "",
                judul: "",
                kategori: "",
                upbjj: "",
                lokasiRak: "",
                harga: "",
                qty: "",
                safety: "",
                catatanHTML: ""
            };
        },


        // Membuka modal/form edit dan memuat data item yang dipilih berdasarkan kodenya

        /* openEdit() digunakan untuk memulai proses pengeditan
           data bahan ajar yang dipilih pengguna.

           Parameter item merupakan objek bahan ajar
           yang akan diedit. */
        openEdit(item) {

            /* findIndex() digunakan untuk mencari posisi indeks
               data di dalam array stok.

               Pencarian dilakukan dengan membandingkan kode
               bahan ajar pada setiap data dengan kode item terpilih.

               Hasil indeks disimpan ke editIndex agar sistem
               mengetahui data mana yang harus diperbarui. */
            this.editIndex = this.stok.findIndex(data => data.kode === item.kode);


            /* Menyalin seluruh informasi item terpilih
               ke dalam objek editItemData.

               Objek ini menjadi tempat penampungan sementara
               selama pengguna mengubah data pada formulir edit. */
            this.editItemData = {

                // Menyalin kode bahan ajar.
                kode: item.kode,

                // Menyalin judul bahan ajar.
                judul: item.judul,

                // Menyalin kategori bahan ajar.
                kategori: item.kategori,

                // Menyalin lokasi UPBJJ.
                upbjj: item.upbjj,

                // Menyalin lokasi rak penyimpanan.
                lokasiRak: item.lokasiRak,

                // Menyalin harga bahan ajar.
                harga: item.harga,

                // Menyalin jumlah stok.
                qty: item.qty,

                // Menyalin batas stok aman.
                safety: item.safety,

                // Menyalin catatan tambahan.
                catatanHTML: item.catatanHTML
            };
        },


        // Menyimpan data yang diubah kembali ke array stok berdasarkan indeksny

        /* saveEdit() digunakan untuk menyimpan perubahan
           data bahan ajar setelah pengguna selesai melakukan edit.

           Data yang diperbarui akan ditempatkan kembali
           pada posisi indeks yang sebelumnya disimpan di editIndex. */
        saveEdit() {

            /* Memeriksa apakah editIndex bernilai null.
               Jika null, berarti tidak ada data yang sedang diedit
               sehingga fungsi langsung dihentikan. */
            if (this.editIndex === null) return;


            /* Memperbarui objek stok pada indeks yang sedang diedit.
               Nilai baru diambil dari objek editItemData. */
            this.stok[this.editIndex] = {

                // Mengambil kode bahan ajar dari formulir edit.
                kode: this.editItemData.kode,

                // Mengambil judul bahan ajar dari formulir edit.
                judul: this.editItemData.judul,

                // Mengambil kategori bahan ajar dari formulir edit.
                kategori: this.editItemData.kategori,

                // Mengambil lokasi UPBJJ dari formulir edit.
                upbjj: this.editItemData.upbjj,

                // Mengambil lokasi rak dari formulir edit.
                lokasiRak: this.editItemData.lokasiRak,

                // Mengubah harga menjadi tipe angka.
                harga: Number(this.editItemData.harga),

                // Mengubah jumlah stok menjadi tipe angka.
                qty: Number(this.editItemData.qty),

                // Mengubah batas stok aman menjadi tipe angka.
                safety: Number(this.editItemData.safety),

                // Mengambil catatan tambahan.
                // Jika kosong, nilai default yang digunakan adalah "-".
                catatanHTML: this.editItemData.catatanHTML || "-"
            };


            /* Menyimpan perubahan data stok ke localStorage.
               Dengan demikian, perubahan tidak hanya berlaku
               pada tampilan saat ini, tetapi juga tersimpan
               pada penyimpanan lokal browser. */
            simpanDataBahanAjar(); // Menyimpan perubahan ke penyimpanan lokal/database


            /* Mengatur editIndex kembali menjadi null.
               Artinya, proses pengeditan telah selesai
               dan tidak ada data yang sedang diedit. */
            this.editIndex = null;


            /* Menampilkan notifikasi bahwa data bahan ajar
               berhasil diperbarui. */
            Swal.fire({
                title: "Berhasil!",
                text: "Data bahan ajar berhasil diperbarui.",
                icon: "success",
                timer: 2000,
                showConfirmButton: false
            });
        },


        // Membatalkan mode edit data

        /* cancelEdit() digunakan untuk membatalkan proses pengeditan.

           editIndex diatur menjadi null agar aplikasi mengetahui
           bahwa tidak ada data yang sedang berada dalam mode edit. */
        cancelEdit() {

            // Mengakhiri mode edit tanpa menyimpan perubahan.
            this.editIndex = null;
        }
    }


// Menghubungkan aplikasi Vue ke elemen HTML dengan id="stockApp"
// mount() memasang aplikasi Vue pada elemen HTML yang memiliki
// id="stockApp".

// Setelah dipasang, Vue akan mengelola data, filter, sorting,
// formulir penambahan, dan formulir pengeditan pada elemen tersebut.
}).mount("#stockApp");