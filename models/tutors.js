Kolom	Tipe Data	Keterangan
tutor_id	INT (PK)	ID unik tutor
name	VARCHAR(100)	Nama lengkap
subject	VARCHAR(100)	Mata pelajaran (Math, English)
bio	TEXT	Deskripsi singkat/kualifikasi
hourly_rate	DECIMAL(10,2)	Tarif per jam
city	VARCHAR(50)	Lokasi tutor
phone	VARCHAR(20)	Kontak
status	ENUM	'available', 'unavailable'