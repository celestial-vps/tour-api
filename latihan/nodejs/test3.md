🟣 SOAL NODE.JS – LEVEL INTERMEDIATE
A. Asynchronous & Performance

1. Jelaskan bagaimana Event Loop bekerja secara lebih detail.
Jawaban :
    - Call stack: mengeksekusi synchronous code
    - Callback queue / microtask queue: menunggu task async (Promise, setTimeout)
    - Event loop: memindahkan task dari queue ke stack saat stack kosong.

2. Apa perbedaan process.nextTick(), setImmediate(), dan setTimeout()?
Jawaban :
    - process.nextTick(): dieksekusi sebelum microtask / event loop berikutnya
    - setImmediate(): dieksekusi di fase check setelah I/O
    - setTimeout(fn, 0): dieksekusi di timer phase, bisa lebih lambat dari setImmediate

3. Kapan sebaiknya menggunakan Promise.all()?
Jawaban :
    digunakan saat ingin menunggu semua Promise selesai secara parallel sebelum lanjut.

4. Apa yang terjadi jika satu Promise di Promise.all() gagal?
Jawaban :
    Promise.all() langsung reject, walau Promise lain selesai.

5. Jelaskan blocking vs non-blocking dengan contoh kasus nyata.
Jawaban :
    - Blocking: fs.readFileSync() → menunggu selesai
    - Non-blocking: fs.readFile() → proses lain tetap jalan

6. Apa itu worker_threads dan kapan digunakan?
Jawaban :
    - worker_threads: menjalankan thread terpisah untuk CPU-bound task (contoh: compress file besar)

7. Bagaimana cara menangani memory leak di Node.js?
Jawaban :
    - Hapus reference tidak terpakai
    - Hindari global variable berlebihan
    - Gunakan profiling (Node.js inspector)

8. Apa perbedaan cluster dan worker_threads?
Jawaban :
    - Cluster: skala multi-core, untuk handle banyak request
    - Worker_threads: skala CPU-bound task di satu core

9. Bagaimana Node.js menangani high concurrent requests?
Jawaban :
    High concurrent requests: Node.js tetap efisien karena non-blocking I/O, tapi bisa dibantu cluster / load balancer.

10. Apa dampak penggunaan async function di dalam loop?
Jawaban :
    Jangan pakai forEach async, gunakan for…of + await
    Contoh salah: arr.forEach(async () => {}) → tidak menunggu semua selesai

B. Express.js (Real Project)

11. Bagaimana cara membuat global error handler di Express?
Jawaban :
    app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({ message: err.message })
    })

12. Apa perbedaan app.use() dan app.get()?
Jawaban :
    app.use(): middleware, berlaku untuk semua method
    app.get(): khusus route GET

13. Bagaimana urutan eksekusi middleware di Express?
Jawaban :
    Urutan middleware: top-down, sesuai urutan app.use() & route

14. Bagaimana cara membuat middleware authentication JWT?
Jawaban :
    const jwt = require('jsonwebtoken')
    const auth = (req,res,next)=>{
    const token = req.headers['authorization']
    if(!token) return res.sendStatus(401)
    jwt.verify(token,'secret', (err,user)=>{
        if(err) return res.sendStatus(403)
        req.user = user
        next()
    })
    }

15. Apa itu rate limiting dan bagaimana implementasinya?
Jawaban :   
    Rate limiting: batasi request per user/IP.
    Contoh: express-rate-limit

16. Bagaimana cara menangani file upload besar agar tidak boros memory?
Jawaban :
    Upload file besar: gunakan streaming + Multer untuk menghindari memory full

17. Apa itu CORS preflight request?
Jawaban :
    CORS preflight: request OPTIONS sebelum POST/PUT/DELETE untuk cek izin domain

18. Bagaimana cara membuat API versioning?
Jawaban :
    /api/v1/users
    /api/v2/users

19. Bagaimana cara mengamankan endpoint admin?
Jawaban :
    Endpoint admin: pakai role check middleware + JWT

20. Bagaimana cara membuat logging system di Express?
Jawaban :
    const morgan = require('morgan')
    app.use(morgan('combined'))


C. Database & Data Handling

21. Apa perbedaan populate dan lookup di MongoDB?
Jawaban :
    Populate: Mongoose, ambil data relasi di app
    Lookup: MongoDB aggregation, ambil data langsung di DB

22. Apa itu index dan dampaknya ke performance?
Jawaban :
    Index: mempercepat query, tapi bisa menambah storage & write cost

23. Kapan sebaiknya menggunakan transaction?
Jawaban :
    Transaction: gunakan saat multi-document harus konsisten (contoh transfer uang)

24. Apa perbedaan findOne() dan findById()?
Jawaban :
    findOne() → query pertama cocok kriteria
    findById() → query berdasarkan _id

25. Bagaimana cara menghindari N+1 query problem?
Jawaban :
    Hindari N+1 query → gunakan populate / aggregation daripada loop query

26. Apa itu soft delete?
Jawaban :
    Soft delete: data tidak dihapus, hanya ditandai isDeleted = true

27. Bagaimana cara membuat pagination yang efisien di database besar?
Jawaban :
    Pagination efisien: gunakan skip & limit atau range query dengan _id

28. Apa itu aggregation pipeline?
Jawaban :
    Aggregation pipeline: urutan stage untuk transform & filter data di MongoDB

29. Bagaimana cara handle race condition di database?
Jawaban :
    Race condition: gunakan transaction atau atomic update ($inc, $push)

30. Apa itu connection pooling?
Jawaban :
    Connection pooling: beberapa koneksi siap pakai, mempercepat query

D. Security (WAJIB BACKEND)

31. Apa perbedaan authentication dan authorization?
Jawaban :
    Authentication: verifikasi identitas
    Authorization: cek akses/izin

32. Apa itu CSRF dan bagaimana mencegahnya?
Jawaban :
    CSRF: serangan request palsu. Cegah pakai CSRF token atau same-site cookie

33. Apa itu XSS dan bagaimana Node.js menghindarinya?
Jawaban :
    XSS: serangan script di client. Cegah pakai input validation & sanitize output

34. Kenapa password tidak boleh disimpan plain text?
Jawaban :
    Password harus di-hash agar aman jika DB bocor

35. Apa itu refresh token?
Jawaban :
    Refresh token: token jangka panjang untuk request JWT baru tanpa login ulang

36. Bagaimana cara mengamankan environment variable?
Jawaban :
    Environment variable: simpan di .env, jangan commit ke git

37. Apa itu helmet?
Jawaban :
    Helmet: middleware untuk set HTTP headers aman

38. Bagaimana cara mencegah brute force attack?
Jawaban :
    Brute force: batasi login attempt, pakai rate limit

39. Apa risiko membuka API tanpa rate limit?
Jawaban :
    API tanpa rate limit → rentan DDOS & overload server

40. Bagaimana cara menyimpan secret dengan aman?
Jawaban :
    Menyimpan secret: gunakan env vars, vault, atau secret manager

E. Studi Kasus (Think Like Backend Engineer)

41. Bagaimana desain API login + refresh token?
Jawaban :
    Login + refresh token: gabungkan JWT + refresh token di DB

42. Bagaimana membuat sistem role-based access control?
Jawaban :
    Role-based access control: middleware cek req.user.role

43. Bagaimana handle upload file besar (video)?
Jawaban :
    Upload video besar: streaming + chunk upload + Multer + S3
44. Bagaimana desain API untuk chat real-time?
Jawaban :
    Chat real-time: Socket.io + namespace + rooms
45. Bagaimana strategi scaling Node.js app?
Jawaban :
    Scaling Node.js: cluster, load balancer, horizontal scaling

46. Bagaimana cara logging & monitoring production?
Jawaban :
    Logging & monitoring: morgan + winston + PM2 + NewRelic

47. Bagaimana rollback jika deploy gagal?
Jawaban :
    Rollback deploy: gunakan Git tags, Docker image, atau feature toggle

48. Bagaimana cara membuat API idempotent?
Jawaban :
    API idempotent: pastikan repeat request tidak duplikat efek

49. Bagaimana handle API timeout?
Jawaban :
    API timeout: server.setTimeout() + client-side timeout handling

50. Bagaimana cara desain microservice sederhana?
Jawaban :
    Microservice sederhana: pisahkan service → gateway → database → message queue (RabbitMQ/Kafka)