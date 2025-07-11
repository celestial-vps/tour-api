// Kolom	Tipe Data	Keterangan
// schedule_id	INT (PK)	ID slot waktu
// tutor_id	INT (FK)	Relasi ke tutor
// available_date	DATE	Tanggal ketersediaan
// start_time	TIME	Jam mulai
// end_time	TIME	Jam selesai
// status	ENUM	'open', 'booked', 'cancelled'