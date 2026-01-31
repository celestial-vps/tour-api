# 1. Basic Node.js Questions (Tujuan: Mengecek pemahaman dasar Node.js.)

Apa itu Node.js? Jelaskan perbedaan Node.js dengan browser JavaScript.
Jawaban:    Node.js adalah runtime environment berbasis JavaScript yang berjalan di luar browser. Node.js digunakan untuk membuat aplikasi server-side, 
            seperti backend API, real-time apps, dan koneksi ke database.
            Perbedaan dengan JavaScript di browser:

            Node.js berjalan di server, JavaScript biasa berjalan di browser.
            Node.js memiliki akses ke filesystem, jaringan, dan modul OS, sedangkan JavaScript di browser terbatas di DOM dan API browser.
            Node.js menggunakan module system (require/import) sedangkan browser biasanya menggunakan script tag atau ES modules.

Apa itu event loop di Node.js dan bagaimana cara kerjanya?
Jawaban : 
        Event loop adalah mekanisme di Node.js yang memungkinkan menjalankan kode non-blocking dan asynchronous.
        Cara kerjanya: Node.js menjalankan satu thread utama, memproses operasi asynchronous (seperti I/O, timer) secara antrian, dan mengeksekusi callback ketika operasi selesai. Ini membuat Node.js bisa menangani ribuan koneksi tanpa membuat thread baru untuk tiap request. 

Apa perbedaan antara require dan import di Node.js?
Jawaban : 
        require() adalah sintaks CommonJS, digunakan di Node.js versi lama dan synchronous.

        import adalah sintaks ES Module (ESM), digunakan di JavaScript modern, bersifat asynchronous, dan biasanya perlu "type": "module" di package.json.
        Contoh:

        const fs = require('fs'); // CommonJS
        import fs from 'fs';      // ES Module


Sebutkan 3 core module Node.js dan fungsinya.
Jawaban : 
        fs → membaca dan menulis file
        http → membuat HTTP server
        path → manipulasi path file dan direktori

Apa perbedaan antara process.nextTick(), setImmediate(), dan setTimeout()?
Jawaban :
        Function	        Kapan dieksekusi	                                                                        Catatan
        process.nextTick()	Setelah current operation selesai, sebelum event loop melanjutkan ke fase berikutnya	    Prioritas tertinggi
        setImmediate()	    Dieksekusi di fase check setelah I/O callbacks selesai	                                    Cocok untuk scheduling setelah I/O
        setTimeout(fn, 0)	Dieksekusi setelah minimal 0ms delay, di fase timers event loop	                            Bisa tertunda jika event loop sibuk

        setTimeout(() => console.log('Timeout'), 0);
        setImmediate(() => console.log('Immediate'));
        process.nextTick(() => console.log('NextTick'));

        // Output:
        // NextTick
        // Timeout (atau Immediate, tergantung Node.js version)
        // Immediate (atau Timeout)


# 2. Intermediate Node.js Questions (Tujuan: Mengecek pemahaman konsep asynchronous dan module management.)

Jelaskan perbedaan callback, Promises, dan async/await.
Jawaban : 
        Callback: fungsi yang dipanggil setelah operasi asynchronous selesai. Bisa menyebabkan “callback hell” jika bersarang.
        Promise: objek yang mewakili hasil dari operasi asynchronous yang akan selesai di masa depan (resolve) atau gagal (reject). Lebih mudah dibaca daripada callback.
        async/await: sintaks modern untuk menulis Promise secara synchronous-looking, lebih rapi dan mudah menangani error.

        // Callback
        fs.readFile('file.txt', 'utf8', (err, data) => {
        if (err) throw err;
        console.log(data);
        });

        // Promise
        const fsPromises = require('fs').promises;
        fsPromises.readFile('file.txt', 'utf8')
        .then(data => console.log(data))
        .catch(err => console.error(err));

        // async/await
        async function readFileAsync() {
        try {
            const data = await fsPromises.readFile('file.txt', 'utf8');
            console.log(data);
        } catch (err) {
            console.error(err);
        }
        }
        readFileAsync();



Bagaimana cara menangani error pada asynchronous code? Berikan contoh.
Jawaban : 
        Callback: periksa parameter error (err)
        Promise: gunakan .catch()
        async/await: gunakan try/catch


Apa itu streams di Node.js dan kapan kita menggunakannya?
Jawaban : 
            Stream adalah objek yang memungkinkan membaca atau menulis data secara bertahap (chunk), sehingga tidak perlu memuat seluruh file ke memori.
            Digunakan ketika: file besar, network data, atau real-time processing.


Tulis contoh kode membuat HTTP server sederhana menggunakan core http module yang mengembalikan JSON.
Jawaban :  
        const http = require('http');

        const server = http.createServer((req, res) => {
        res.setHeader('Content-Type', 'application/json');

        if (req.method === 'GET' && req.url === '/') {
            res.end(JSON.stringify({ message: 'Hello, Node.js!' }));
        } else {
            res.statusCode = 404;
            res.end(JSON.stringify({ error: 'Not Found' }));
        }
        });

        const PORT = 3000;
        server.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}/`);
        });


Bagaimana cara membaca file besar di Node.js tanpa memakan terlalu banyak memori?
Jawaban : 
        Gunakan readable stream (fs.createReadStream) untuk membaca file bertahap.
        Cocok untuk file besar seperti CSV, log, video, atau file JSON besar
        const fs = require('fs');

        const readStream = fs.createReadStream('largeFile.txt', 'utf8');

        readStream.on('data', chunk => {
        console.log('Received chunk:', chunk.length, 'characters');
        });

        readStream.on('end', () => {
        console.log('Finished reading large file');
        });



# 3. Advanced Node.js Questions (Tujuan: Mengecek pemahaman mendalam tentang performa, design pattern, dan deployment.)

Jelaskan perbedaan Cluster module dan Worker Threads di Node.js.
Jawaban : 
        Cluster module:

        Membuat beberapa proses Node.js yang berjalan paralel, biasanya untuk memanfaatkan CPU multi-core.

        Tiap proses punya memory sendiri. Cocok untuk scaling server agar bisa handle banyak request.

        Komunikasi antar proses lewat IPC (Inter-Process Communication).

        Worker Threads:

        Membuat thread dalam satu proses Node.js.

        Bisa share memory dengan thread lain menggunakan SharedArrayBuffer.

        Cocok untuk komputasi CPU-intensive, bukan I/O

        const cluster = require('cluster');
        const http = require('http');
        const numCPUs = require('os').cpus().length;

        if (cluster.isMaster) {
        console.log(`Master ${process.pid} is running`);

        // fork workers
        for (let i = 0; i < numCPUs; i++) {
            cluster.fork();
        }

        cluster.on('exit', (worker, code, signal) => {
            console.log(`Worker ${worker.process.pid} died`);
        });
        } else {
        // Worker processes
        http.createServer((req, res) => {
            res.writeHead(200);
            res.end('Hello World\n');
        }).listen(8000);

        console.log(`Worker ${process.pid} started`);
        }


Bagaimana cara menangani high concurrency di Node.js?

Apa itu event-driven architecture dan bagaimana Node.js mendukungnya?

Bagaimana cara debugging Node.js yang lambat atau memory leak?

Buatlah contoh middleware sederhana untuk Express.js yang melakukan logging request.

# 4. Coding / Problem Solving Questions

Tujuan: Mengecek kemampuan coding langsung.

Buat fungsi Node.js yang membaca file JSON dan mengembalikan data yang sudah difilter berdasarkan properti tertentu.

Buat script Node.js yang melakukan HTTP request ke API publik dan menampilkan hasilnya di console.

Buat fungsi yang menerima array angka dan mengembalikan jumlah semua angka genap secara asynchronous (menggunakan Promise).

Implementasikan simple REST API menggunakan Express.js dengan endpoint:

GET /users → menampilkan semua user

POST /users → menambahkan user baru

Buat script yang membaca folder dan menampilkan semua file dengan ekstensi .js.