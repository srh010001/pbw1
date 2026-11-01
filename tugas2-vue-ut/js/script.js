/* =========================================================
   1. MENUNGGU DOKUMEN HTML SELESAI DIMUAT
   ========================================================= */

/* DOMContentLoaded merupakan event yang dijalankan ketika
   struktur HTML sudah selesai dibaca oleh browser.

   Tujuannya agar elemen HTML seperti form login, tombol logout,
   dan elemen dashboard sudah tersedia sebelum JavaScript
   mencoba mengaksesnya. */
document.addEventListener("DOMContentLoaded", function () {


    // ==========================================
    // LOGIN
    // ==========================================

    /* Mengambil elemen HTML dengan id "loginForm".
       Elemen ini merupakan form yang digunakan pengguna
       untuk memasukkan email dan password. */
    const loginForm = document.getElementById("loginForm");

    /* Memeriksa apakah form login tersedia pada halaman.
       Pemeriksaan ini mencegah JavaScript menjalankan
       proses login jika elemen form tidak ditemukan. */
    if (loginForm) {

        /* Menambahkan event listener submit.
           Fungsi di dalamnya dijalankan ketika pengguna
           mengirimkan form login. */
        loginForm.addEventListener("submit", function (e) {

            /* Mencegah perilaku bawaan form HTML.
               Secara default, submit dapat menyebabkan halaman
               dimuat ulang. preventDefault() menghentikan proses tersebut. */
            e.preventDefault();

            /* Mengambil nilai email dari elemen HTML dengan id "email".
               trim() menghapus spasi kosong di awal dan akhir teks. */
            const email = document.getElementById("email").value.trim();

            /* Mengambil nilai password dari elemen HTML dengan id "password".
               trim() menghapus spasi kosong di awal dan akhir teks. */
            const password = document.getElementById("password").value.trim();

            /* Memeriksa apakah variabel global dataPengguna tersedia.
               typeof digunakan untuk mengetahui tipe atau keberadaan
               suatu variabel tanpa langsung menyebabkan ReferenceError. */
            if (typeof dataPengguna === "undefined") {

                /* Swal.fire() merupakan fungsi dari library SweetAlert2.
                   Digunakan untuk menampilkan pesan kesalahan
                   dalam bentuk popup. */
                Swal.fire({
                    title: "Error",
                    text: "Data pengguna belum dimuat.",
                    icon: "error"
                });

                /* return menghentikan proses login karena
                   data pengguna belum tersedia. */
                return;
            }

            /* find() digunakan untuk mencari satu data pengguna
               di dalam array dataPengguna yang memenuhi kondisi tertentu.

               Parameter item mewakili setiap objek pengguna
               yang sedang diperiksa. */
            const user = dataPengguna.find(function (item) {

                /* Memeriksa apakah email dan password yang dimasukkan
                   sama dengan data pengguna yang tersimpan.

                   Operator && berarti kedua kondisi harus benar:
                   1. Email harus sesuai.
                   2. Password harus sesuai. */
                return item.email === email && item.password === password;
            });

            /* Memeriksa hasil pencarian pengguna.
               Jika user memiliki data, berarti proses login berhasil. */
            if (user) {

                /* localStorage.setItem() digunakan untuk menyimpan
                   informasi pengguna pada penyimpanan browser.

                   Key "namaUser" digunakan untuk menyimpan nama pengguna.
                   Value diambil dari properti nama pada objek user. */
                localStorage.setItem("namaUser", user.nama);

                /* Menyimpan role atau hak akses pengguna.
                   Contohnya Administrator, Fakultas, atau UPBJJ-UT. */
                localStorage.setItem("roleUser", user.role);

                /* Menyimpan lokasi pengguna.
                   Contohnya UPBJJ Jakarta, UPBJJ Makassar, atau Pusat. */
                localStorage.setItem("lokasiUser", user.lokasi);

                /* Menampilkan popup pemberitahuan bahwa login berhasil.
                   SweetAlert2 digunakan untuk menampilkan pesan
                   dengan tampilan yang lebih interaktif. */
                Swal.fire({
                    title: "Login Berhasil!",
                    text: "Selamat datang, " + user.nama + "!",
                    icon: "success",
                    confirmButtonColor: "#0ab5ff",
                    confirmButtonText: "Lanjutkan"

                /* then() dijalankan setelah pengguna menekan
                   tombol konfirmasi pada popup SweetAlert2. */
                }).then(function () {

                    /* Mengarahkan pengguna ke halaman dashboard.html
                       setelah proses login berhasil. */
                    window.location.href = "dashboard.html";
                });

            } else {

                /* Jika data pengguna tidak ditemukan atau email
                   dan password tidak sesuai, tampilkan pesan gagal. */
                Swal.fire({
                    title: "Login Gagal!",
                    text: "Email atau password salah. Silakan coba lagi.",
                    icon: "error",
                    confirmButtonColor: "#1e3a8a",
                    confirmButtonText: "OK"
                });
            }
        });
    }


    // ==========================================
    // LUPA PASSWORD DAN BUAT AKUN
    // ==========================================

    /* Mengambil elemen HTML dengan id "forgetLink".
       Elemen ini digunakan untuk menangani pilihan lupa password. */
    const forgetLink = document.getElementById("forgetLink");

    /* Mengambil elemen HTML dengan id "registerLink".
       Elemen ini digunakan untuk menangani pilihan pendaftaran akun. */
    const registerLink = document.getElementById("registerLink");

    /* Memeriksa apakah tautan lupa password tersedia
       pada halaman HTML. */
    if (forgetLink) {

        /* Menambahkan event listener click.
           Fungsi dijalankan ketika pengguna mengeklik tautan
           lupa password. */
        forgetLink.addEventListener("click", function (e) {

            /* Mencegah tautan menjalankan perilaku bawaan browser,
               seperti berpindah ke alamat URL yang terdapat pada href. */
            e.preventDefault();

            /* Menampilkan popup informasi menggunakan SweetAlert2.
               Pesan ini mengarahkan pengguna untuk menghubungi admin
               apabila ingin melakukan reset password. */
            Swal.fire({
                title: "Lupa Password?",
                text: "Silakan hubungi admin UT untuk reset password.",
                icon: "info"
            });
        });
    }

    /* Memeriksa apakah tautan pendaftaran akun tersedia
       pada halaman HTML. */
    if (registerLink) {

        /* Menambahkan event listener click.
           Fungsi dijalankan ketika pengguna mengeklik tautan
           untuk membuat akun baru. */
        registerLink.addEventListener("click", function (e) {

            /* Mencegah perilaku bawaan tautan HTML
               agar tidak langsung berpindah halaman. */
            e.preventDefault();

            /* Menampilkan popup informasi kepada pengguna.
               Popup memberikan arahan untuk mengunjungi laman MyUT
               apabila ingin membuat akun baru. */
            Swal.fire({
                title: "Buat Akun Baru",
                text: "Kunjungi laman MyUT untuk membuat akun baru.",
                icon: "question"
            });
        });
    }


    // ==========================================
    // GREETING DASHBOARD
    // ==========================================

    /* Mengambil elemen HTML dengan id "greetingText".
       Elemen ini digunakan untuk menampilkan ucapan selamat
       berdasarkan waktu dan nama pengguna. */
    const greetingText = document.getElementById("greetingText");

    /* Mengambil elemen HTML dengan id "greetingIcon".
       Elemen ini digunakan untuk menampilkan ikon
       yang menyesuaikan waktu sapaan. */
    const greetingIcon = document.getElementById("greetingIcon");

    /* Memeriksa apakah elemen greetingText tersedia.
       Jika tersedia, proses pembuatan sapaan dashboard dijalankan. */
    if (greetingText) {

        /* Mengambil nama pengguna dari localStorage.
           Jika data namaUser tidak ditemukan atau bernilai kosong,
           nama default "Admin SITTA" akan digunakan.

           Operator || disebut logical OR.
           Nilai di sebelah kanan digunakan jika nilai di sebelah kiri
           bersifat falsy. */
        const namaUser = localStorage.getItem("namaUser") || "Admin SITTA";

        /* Membuat objek Date untuk mendapatkan waktu saat ini.
           getHours() mengambil nilai jam dalam format 0 sampai 23
           berdasarkan waktu lokal perangkat pengguna. */
        const hour = new Date().getHours();

        /* Menyiapkan variabel greeting untuk menampung
           teks sapaan berdasarkan waktu. */
        let greeting = "";

        /* Menyiapkan variabel iconClass untuk menampung
           nama class ikon yang akan digunakan. */
        let iconClass = "";

        /* Memeriksa apakah waktu berada di antara pukul 04.00
           sampai sebelum pukul 11.00.
           Jika benar, sapaan yang digunakan adalah Selamat Pagi. */
        if (hour >= 4 && hour < 11) {
            greeting = "Selamat Pagi";
            iconClass = "fa-solid fa-sun";

        /* Jika kondisi pertama tidak terpenuhi, periksa apakah
           waktu berada di antara pukul 11.00 sampai sebelum 15.00.
           Jika benar, sapaan yang digunakan adalah Selamat Siang. */
        } else if (hour >= 11 && hour < 15) {
            greeting = "Selamat Siang";
            iconClass = "fa-solid fa-cloud-sun";

        /* Jika kondisi sebelumnya tidak terpenuhi, periksa apakah
           waktu berada di antara pukul 15.00 sampai sebelum 18.00.
           Jika benar, sapaan yang digunakan adalah Selamat Sore. */
        } else if (hour >= 15 && hour < 18) {
            greeting = "Selamat Sore";
            iconClass = "fa-solid fa-cloud";

        /* Jika tidak memenuhi seluruh kondisi sebelumnya,
           sistem menggunakan sapaan Selamat Malam.
           Kondisi ini mencakup pukul 18.00 sampai sebelum 04.00. */
        } else {
            greeting = "Selamat Malam";
            iconClass = "fa-solid fa-moon";
        }

        /* innerText digunakan untuk mengubah teks di dalam
           elemen greetingText.

           Operator + menggabungkan teks sapaan dengan nama pengguna.
           Contoh: Selamat Pagi, Rina Wulandari. */
        greetingText.innerText = greeting + ", " + namaUser;

        /* Memeriksa apakah elemen greetingIcon tersedia.
           Pemeriksaan ini mencegah kesalahan jika elemen ikon
           tidak ditemukan pada halaman. */
        if (greetingIcon) {

            /* className digunakan untuk mengganti seluruh class
               pada elemen greetingIcon.

               Nilai iconClass menentukan ikon Font Awesome
               yang sesuai dengan waktu sapaan. */
            greetingIcon.className = iconClass;
        }
    }


    // ==========================================
    // LOGOUT
    // ==========================================

    /* Mengambil elemen HTML dengan id "logoutBtn".
       Elemen ini merupakan tombol yang digunakan pengguna
       untuk keluar dari aplikasi. */
    const logoutBtn = document.getElementById("logoutBtn");

    /* Memeriksa apakah tombol logout tersedia pada halaman.
       Jika tersedia, event click akan dipasang. */
    if (logoutBtn) {

        /* Menambahkan event listener click.
           Fungsi dijalankan ketika pengguna mengeklik tombol logout. */
        logoutBtn.addEventListener("click", function () {

            /* Menampilkan popup konfirmasi sebelum pengguna keluar.
               showCancelButton mengaktifkan tombol pembatalan
               agar pengguna dapat membatalkan proses logout. */
            Swal.fire({
                title: "Yakin ingin logout?",
                text: "Anda akan keluar dari sistem.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#161af9",
                cancelButtonColor: "rgb(221, 51, 125)",
                confirmButtonText: "Logout",
                cancelButtonText: "Batal"

            /* then() digunakan untuk menerima hasil pilihan pengguna
               setelah popup konfirmasi ditampilkan. */
            }).then(function (result) {

                /* isConfirmed bernilai true jika pengguna menekan
                   tombol konfirmasi Logout.

                   Jika pengguna memilih Batal, proses di dalam
                   kondisi ini tidak dijalankan. */
                if (result.isConfirmed) {

                    /* Menghapus data nama pengguna dari localStorage.
                       Data ini digunakan untuk menampilkan nama pengguna
                       pada dashboard. */
                    localStorage.removeItem("namaUser");

                    /* Menghapus data role pengguna dari localStorage.
                       Data ini menyimpan informasi hak akses pengguna. */
                    localStorage.removeItem("roleUser");

                    /* Menghapus data lokasi pengguna dari localStorage.
                       Data ini menyimpan informasi lokasi pengguna. */
                    localStorage.removeItem("lokasiUser");

                    /* Menampilkan popup informasi bahwa proses logout
                       telah berhasil dilakukan. */
                    Swal.fire({
                        title: "Logout Berhasil",
                        text: "Anda telah keluar dari sistem.",
                        icon: "info",
                        confirmButtonColor: "#1e3a8a"

                    /* then() dijalankan setelah pengguna menekan
                       tombol konfirmasi pada popup logout berhasil. */
                    }).then(function () {

                        /* Mengarahkan pengguna kembali ke halaman index.html
                           yang merupakan halaman awal atau halaman login. */
                        window.location.href = "index.html";
                    });
                }
            });
        });
    }
});