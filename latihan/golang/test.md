1. Apa fungsi package main?
Jawaban:
    package main adalah package utama tempat program Go dieksekusi.

2. Fungsi fmt.Println()?
Jawaban:
    Menampilkan output ke layar dan otomatis pindah baris.

3. Bagaimana cara mendeklarasikan variabel:
Jawaban:
    var a int          // tanpa nilai awal
    var b int = 10     // dengan nilai awal
    c := 20            // short declaration

4. Apa perbedaan var, const, dan :=?
Jawaban:
    var → variabel bisa diubah
    const → nilai tetap (tidak bisa diubah)
    := → deklarasi cepat di dalam function


5. Tipe data apa saja yang tersedia di Golang? Sebutkan minimal 5.
Jawaban:
    int, float64, string, bool, byte

6. Apa output dari kode berikut?
Jawaban:   
    var x int = 10
    fmt.Println(x)


package main
import "fmt"

func main() {
    var x int = 10
    fmt.Println(x)
}

🟡 SOAL STRUKTUR KONTROL

Buat program untuk menentukan bilangan ganjil atau genap.

Jelaskan perbedaan if, if-else, dan switch di Golang.

Apa perbedaan for, for range, dan for {}?

Apa output dari kode berikut?

for i := 1; i <= 5; i++ {
    fmt.Println(i)
}

🟠 SOAL FUNCTION & ARRAY

Buat fungsi tambah(a int, b int) int yang mengembalikan hasil penjumlahan.

Apa perbedaan array dan slice?

Bagaimana cara:

membuat slice

menambahkan data ke slice

Apa output kode berikut?

angka := []int{1, 2, 3}
fmt.Println(len(angka))

🔵 SOAL STRUCT & MAP

Buat struct Mahasiswa dengan field Nama, NIM, dan Jurusan.

Bagaimana cara mengakses field struct?

Apa kegunaan map di Golang?

Buat contoh map dengan key string dan value int.

🔴 SOAL MENENGAH

Jelaskan konsep pointer di Golang.

Apa itu goroutine?

Apa perbedaan goroutine dan thread?

Jelaskan kegunaan channel.

Apa fungsi keyword defer?

Apa itu interface dan kapan digunakan?

💡 SOAL PRAKTIK

Buat program yang menerima input nilai dan menampilkan grade (A, B, C, D).

Buat program untuk menghitung faktorial.

Buat program sederhana CRUD data mahasiswa menggunakan slice dan struct.

Buat program yang menampilkan angka 1–10 menggunakan goroutine.