A. Dasar Node.js

1. Apa itu Node.js dan apa kelebihannya dibandingkan server-side language lain?
jawaban :
    Node.js adalah runtime environment JavaScript yang berjalan di server (bukan framework).
    Kelebihan:
    Non-blocking (cepat)
    Cocok untuk API & real-time app
    Satu bahasa (JS) untuk frontend & backend

2. Jelaskan perbedaan Node.js dan JavaScript di browser.
jawaban : 
    Node.js: berjalan di server, bisa akses file system, database
    Browser JS: berjalan di browser, fokus ke UI & DOM

3. Apa fungsi dari V8 Engine dalam Node.js?
jawaban : 
    V8 Engine berfungsi mengeksekusi JavaScript menjadi machine code agar berjalan cepat.

4. Sebutkan kegunaan npm!
jawaban : 
    Mengelola package/library
    Install dependency
    Menjalankan script (npm run)

5. Apa itu package.json?
jawaban :
    File konfigurasi project Node.js yang berisi:
    - Dependency
    - Script
    - Informasi project


6. Jelaskan perbedaan require() dan import.
jawaban : 
    require() → CommonJS (lama)
    import → ES Module (modern)
    Cara pakai & support-nya berbeda


7. Apa yang dimaksud dengan non-blocking I/O?
jawaban : 
    Proses tidak menunggu tugas selesai, tapi lanjut mengerjakan task lain (asynchronous).

8. Sebutkan contoh built-in module di Node.js.
jawaban : 
    fs
    http
    path
    os
    events

9. Apa fungsi dari module fs?
jawaban : 
    Untuk read, write, delete file & folder.

10. Bagaimana cara menjalankan file Node.js di terminal?
Jawaban : 
    node index.js


🟡 B. Module & Asynchronous

11. Apa perbedaan synchronous dan asynchronous di Node.js?
jawaban : 
    Sync: nunggu proses selesai
    Async: tidak menunggu, lebih cepat

12. Jelaskan konsep callback function.
jawaban : 
    Function yang dijadikan parameter dan dipanggil setelah proses selesai.


13. Apa itu Promise?
jawaban :
    Object untuk menangani proses async dengan .then() dan .catch().


14. Apa kegunaan async/await?
Jawaban : 
    Membuat kode async terlihat seperti synchronous.


15. Jelaskan event loop secara singkat.
Jawaban : 
    Mekanisme Node.js untuk mengatur eksekusi asynchronous task.

16. pa itu stream di Node.js?
Jawaban : 
    Cara membaca/menulis data bertahap, cocok untuk file besar.

17. Sebutkan jenis-jenis stream.
Jawaban :   
    Readable
    Writable
    Duplex
    Transform

18. Apa fungsi module path?
Jawaban :
    Module path digunakan untuk mengelola dan memanipulasi path file agar konsisten di berbagai sistem operasi.

19. Jelaskan perbedaan readFile dan createReadStream.
Jawaban : 
    readFile → baca file sekaligus
    createReadStream → baca file bertahap

20. Apa itu buffer?
Jawaban :
    Tempat penyimpanan data sementara (binary).

🟠 C. Express.js

21. Apa itu Express.js?
Jawaban : express.js adalah sebuah framework node js 

22. Bagaimana cara membuat server sederhana menggunakan Express?
Jawaban :
    const express = require('express')
    const app = express()

    app.get('/', (req, res) => {
    res.send('Hello World')
    })
    app.listen(3000)


23. Apa fungsi middleware?
Jawaban :
    Function yang dijalankan sebelum request ke controller.

24. Jelaskan perbedaan req.params, req.query, dan req.body.
Jawaban : req param untuk mengambil id, req.query untuk mengambil beberapa req id, req body untuk mengambil data dari payload body 

25. Apa itu REST API?
Jawaban : 
    Standar komunikasi API berbasis HTTP Method.

26. Sebutkan HTTP Method yang sering digunakan.
Jawaban : 
    GET
    POST
    PUT
    DELETE
    PATCH

27. Apa fungsi res.json()?
Jawaban :
    Digunakan untuk mengirim response dalam format JSON ke client.

28. Bagaimana cara menangani error di Express?
Jawaban : 
    try-catch
    error middleware Express 

29. Apa itu router?
Jawaban : 
    Router digunakan untuk mengelompokkan dan mengatur endpoint API berdasarkan fitur

30. Bagaimana cara menghubungkan Express dengan database?
Jawaban : 
    Menggunakan driver DB (mongoose, mysql2, dll).

🔵 D. Database & Keamanan

31. Apa perbedaan SQL dan NoSQL?
Jawaban : 
    SQL → relational
    NoSQL → flexible schema


32. Apa itu MongoDB?
Jawaban : 
    mongodb adalah sebuah database

33. Jelaskan fungsi Mongoose.
Jawaban : 
    ODM untuk MongoDB (schema & query).

34. Apa itu JWT (JSON Web Token)?
Jawaban : 
    Token untuk authentication & authorization.

35. Bagaimana cara melakukan authentication di Node.js?
Jawaban : 
    Login → bcrypt → JWT → middleware auth.

36. Apa itu bcrypt?
Jawaban : 
    bcrypt digunakan untuk hashing password, bukan enkripsi (tidak bisa dibalik).

37. Jelaskan dotenv dan kegunaannya.
Jawaban :
     untuk memanggil env

38. Apa itu CORS?
Jawaban : 
    Mengatur izin akses API dari domain lain.

39. Apa risiko SQL Injection?
Jawaban : 
    erangan query berbahaya ke database.

40. Bagaimana cara mengamankan API Node.js?
Jawaban : 
    JWT
    Validation
    Rate limit
    HTTPS

🔴 E. Studi Kasus / Praktik

41. Buat program Node.js untuk membaca file .txt.
Jawaban : 
    const fs = require('fs')
    fs.readFile('data.txt', 'utf8', (err, data) => {
    if (err) throw err
    console.log(data)
    })

42. Buat REST API CRUD sederhana.
Jawaban : 
    const express = require('express')
    const app = express()

    app.use(express.json())

    let users = []

    app.post('/users', (req, res) => {
    users.push(req.body)
    res.json(users)
    })

    app.get('/users', (req, res) => {
    res.json(users)
    })

    app.put('/users/:id', (req, res) => {
    users[req.params.id] = req.body
    res.json(users)
    })

    app.delete('/users/:id', (req, res) => {
    users.splice(req.params.id, 1)
    res.json(users)
    })

    app.listen(3000)


43. Buat endpoint login menggunakan JWT.
Jawaban : 
    const jwt = require('jsonwebtoken')
    const express = require('express')
    const app = express()

    app.use(express.json())

    app.post('/login', (req, res) => {
    const user = { username: req.body.username }

    const token = jwt.sign(user, 'secretkey', { expiresIn: '1h' })
    res.json({ token })
    })

    app.listen(3000)


44. Buat middleware untuk logging request.
Jawaban : 
    const logger = (req, res, next) => {
    console.log(req.method, req.url)
    next()
    }
    module.exports = logger


45. Buat API upload file menggunakan Multer.
Jawaban : 
    const express = require('express')
    const multer = require('multer')
    const app = express()

    const upload = multer({ dest: 'uploads/' })

    app.post('/upload', upload.single('file'), (req, res) => {
    res.json({ message: 'File uploaded' })
    })

    app.listen(3000)


46. Buat koneksi Node.js dengan MongoDB.
Jawaban : 
    const mongoose = require('mongoose')
    mongoose.connect('mongodb://localhost:27017/testdb')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err))


47. Buat aplikasi chat sederhana menggunakan Socket.io.
Jawaban : 
    const express = require('express')
    const http = require('http')
    const { Server } = require('socket.io')

    const app = express()
    const server = http.createServer(app)
    const io = new Server(server)

    io.on('connection', (socket) => {
    socket.on('message', msg => {
        io.emit('message', msg)
    })
    })

    server.listen(3000)


48. Buat pagination pada API.
Jawaban :
    app.get('/users', (req, res) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 5

    const start = (page - 1) * limit
    const end = page * limit

    res.json(users.slice(start, end))
    })



49. Buat validasi input menggunakan middleware.
Jawaban : 
    const validate = (req, res, next) => {
    if (!req.body.name || req.body.name.length < 3) {
        return res.status(400).json({ message: 'Name minimal 3 karakter' })
    }
    next()
    }


50. Buat API dengan struktur MVC.
Jawaban : 
    src/
    ├── controller/
    ├── service/
    ├── repository/
    ├── routes/
    └── app.js
    exports.getUser = (req, res) => {
        res.json({ message: 'Get user' })
    }

