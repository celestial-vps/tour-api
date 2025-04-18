Kolom	Tipe Data	Keterangan
booking_id	INT (PK)	ID pemesanan
customer_id	INT (FK)	Relasi ke pelanggan
tutor_id	INT (FK)	Relasi ke tutor
schedule_id	INT (FK)	Relasi ke slot waktu
booking_date	DATE	Tanggal pemesanan
status	ENUM	'booked', 'completed', 'cancelled'
total_fee	DECIMAL(10,2)	Total biaya