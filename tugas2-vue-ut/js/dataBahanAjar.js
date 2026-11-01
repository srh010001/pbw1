/* =========================================================
   1. DATA PENGGUNA
   ========================================================= */

/* Menyimpan daftar pengguna aplikasi dalam bentuk array.
   Setiap objek mewakili satu pengguna dengan informasi:
   id, nama, email, password, role, dan lokasi. */
var dataPengguna = [
  {
    id: 1,
    nama: "Rina Wulandari",
    email: "rina@ut.ac.id",
    password: "rina123",
    role: "UPBJJ-UT",
    lokasi: "UPBJJ Jakarta"
  },
  {
    id: 2,
    nama: "Agus Pranoto",
    email: "agus@ut.ac.id",
    password: "agus123",
    role: "UPBJJ-UT",
    lokasi: "UPBJJ Makassar"
  },
  {
    id: 3,
    nama: "Siti Marlina",
    email: "siti@ut.ac.id",
    password: "siti123",
    role: "Puslaba",
    lokasi: "Pusat"
  },
  {
    id: 4,
    nama: "Doni Setiawan",
    email: "doni@ut.ac.id",
    password: "doni123",
    role: "Fakultas",
    lokasi: "FISIP"
  },
  {
    id: 5,
    nama: "Admin SITTA",
    email: "admin@ut.ac.id",
    password: "admin123",
    role: "Administrator",
    lokasi: "Pusat"
  }
];


/* =========================================================
   2. DATA BAHAN AJAR
   ========================================================= */

/* Menyimpan seluruh data utama yang digunakan dalam
   aplikasi pengelolaan bahan ajar. */
var dataBahanAjar = {

  /* Daftar UPBJJ yang tersedia dalam aplikasi.
     Data ini dapat digunakan sebagai pilihan lokasi. */
  upbjjList: ["Jakarta", "Surabaya", "Makassar", "Padang", "Denpasar"],

  /* Daftar kategori bahan ajar.
     Digunakan untuk mengelompokkan jenis bahan ajar. */
  kategoriList: ["MK Wajib", "MK Pilihan", "Praktikum", "Problem-Based"],

  /* Daftar jenis pengiriman beserta kode dan estimasi waktu.
     Kode digunakan sebagai identitas jenis pengiriman. */
  pengirimanList: [
    { kode: "REG", nama: "Reguler (3-5 hari)" },
    { kode: "EXP", nama: "Ekspres (1-2 hari)" }
  ],

  /* Daftar paket bahan ajar.
     Setiap paket memiliki kode, nama, isi bahan ajar,
     dan harga paket. */
  paket: [
        { kode: "PAKET-UT-001", nama: "PAKET IPS Dasar", isi: ["EKMA4116","EKMA4115"], harga: 120000 },
        { kode: "PAKET-UT-002", nama: "PAKET IPA Dasar", isi: ["BIOL4201","FISIP4001"], harga: 140000 }
      ],

  /* Daftar stok bahan ajar.
     Setiap objek menyimpan informasi kode, judul, kategori,
     lokasi UPBJJ, rak penyimpanan, harga, jumlah stok,
     batas stok aman, dan catatan tambahan. */
  stok: [
        {
          kode: "EKMA4116",
          judul: "Pengantar Manajemen",
          kategori: "MK Wajib",
          upbjj: "Jakarta",
          lokasiRak: "R1-A3",
          harga: 65000,
          qty: 28,
          safety: 20,
          catatanHTML: "<em>Edisi 2024, cetak ulang</em>"
        },
        {
          kode: "EKMA4115",
          judul: "Pengantar Akuntansi",
          kategori: "MK Wajib",
          upbjj: "Jakarta",
          lokasiRak: "R1-A4",
          harga: 60000,
          qty: 7,
          safety: 15,
          catatanHTML: "<strong>Cover baru</strong>"
        },
        {
          kode: "BIOL4201",
          judul: "Biologi Umum (Praktikum)",
          kategori: "Praktikum",
          upbjj: "Surabaya",
          lokasiRak: "R3-B2",
          harga: 80000,
          qty: 12,
          safety: 10,
          catatanHTML: "Butuh <u>pendingin</u> untuk kit basah"
        },
        {
          kode: "FISIP4001",
          judul: "Dasar-Dasar Sosiologi",
          kategori: "MK Pilihan",
          upbjj: "Makassar",
          lokasiRak: "R2-C1",
          harga: 55000,
          qty: 2,
          safety: 8,
          catatanHTML: "Stok <i>menipis</i>, prioritaskan reorder"
        }
      ],

  /* Data tracking pengiriman bahan ajar.
     Nomor DO digunakan sebagai identitas pengiriman.
     Informasi di dalamnya meliputi NIM, nama penerima,
     status, ekspedisi, tanggal kirim, paket, total biaya,
     dan riwayat perjalanan paket. */
  tracking: {
    "DO2025-0001": {
      nim: "123456789",
      nama: "Rina Wulandari",
      status: "Dalam Perjalanan",
      ekspedisi: "JNE",
      tanggalKirim: "2025-08-25",
      paket: "PAKET-UT-001",
      total: 120000,

      /* Array perjalanan menyimpan riwayat proses pengiriman.
         Setiap objek berisi waktu dan keterangan lokasi
         atau aktivitas pengiriman. */
      perjalanan: [
        { waktu: "2025-08-25 10:12:20", keterangan: "Penerimaan di Loket: TANGSEL" },
        { waktu: "2025-08-25 14:07:56", keterangan: "Tiba di Hub: JAKSEL" },
        { waktu: "2025-08-26 08:44:01", keterangan: "Diteruskan ke Kantor Tujuan" }
      ]
    }
  },

  /* Menyimpan riwayat aktivitas aplikasi.
     Informasi meliputi tanggal aktivitas, jenis aktivitas,
     nomor DO, pengguna yang melakukan aktivitas,
     dan keterangan aktivitas. */
  histori: [
    {
      tanggal: "2025-08-25",
      aktivitas: "Delivery Order dibuat",
      nomorDO: "DO2025-0001",
      pengguna: "Rina Wulandari",
      keterangan: "Paket PAKET-UT-001 sedang dalam perjalanan"
    }
  ]
};


/* =========================================================
   3. MEMUAT DATA DARI LOCAL STORAGE
   ========================================================= */

/* IIFE (Immediately Invoked Function Expression) adalah
   fungsi yang langsung dijalankan setelah didefinisikan.

   Tujuannya untuk memeriksa apakah terdapat data bahan ajar
   yang sebelumnya telah disimpan di browser. */
(function () {

  /* Mengambil data dari localStorage menggunakan key
     "dataBahanAjarLocal".

     localStorage merupakan penyimpanan data pada browser
     yang tetap tersedia setelah halaman dimuat ulang. */
  const dataLocal = localStorage.getItem("dataBahanAjarLocal");

  /* Memeriksa apakah data berhasil ditemukan di localStorage.
     Jika tersedia, proses pembacaan dan pemulihan data dilakukan. */
  if (dataLocal) {

    /* try digunakan untuk menangani kemungkinan kesalahan
       ketika data dari localStorage diubah menjadi objek JavaScript. */
    try {

      /* JSON.parse() mengubah data berbentuk teks JSON
         menjadi objek JavaScript agar dapat digunakan aplikasi. */
      const parsed = JSON.parse(dataLocal);

      /* Jika data stok tersedia, data stok awal akan diganti
         dengan data stok yang tersimpan di localStorage. */
      if (parsed.stok) {
        dataBahanAjar.stok = parsed.stok;
      }

      /* Jika data tracking tersedia, data tracking awal
         akan diganti dengan data tracking yang tersimpan. */
      if (parsed.tracking) {
        dataBahanAjar.tracking = parsed.tracking;
      }

      /* Jika data histori tersedia, data histori awal
         akan diganti dengan data histori yang tersimpan. */
      if (parsed.histori) {
        dataBahanAjar.histori = parsed.histori;
      }

    } catch (error) {

      /* catch menangani kesalahan apabila data JSON tidak valid
         atau gagal dibaca dari localStorage.

         console.log() menampilkan informasi kesalahan
         pada Console di Developer Tools browser. */
      console.log("Gagal membaca localStorage:", error);
    }
  }
})();


/* =========================================================
   4. MENYIMPAN DATA BAHAN AJAR KE LOCAL STORAGE
   ========================================================= */

/* Fungsi simpanDataBahanAjar() digunakan untuk menyimpan
   perubahan data bahan ajar ke dalam localStorage.

   Fungsi ini perlu dipanggil setelah terdapat perubahan
   pada data yang ingin disimpan. */
function simpanDataBahanAjar() {

  /* localStorage.setItem() digunakan untuk menyimpan data
     ke browser menggunakan key "dataBahanAjarLocal".

     JSON.stringify() mengubah objek JavaScript menjadi
     teks JSON agar dapat disimpan oleh localStorage. */
  localStorage.setItem(
    "dataBahanAjarLocal",

    /* Data yang disimpan hanya mencakup:
       1. stok     : data persediaan bahan ajar
       2. tracking : data pelacakan pengiriman
       3. histori  : riwayat aktivitas aplikasi */
    JSON.stringify({
      stok: dataBahanAjar.stok,
      tracking: dataBahanAjar.tracking,
      histori: dataBahanAjar.histori
    })
  );
}