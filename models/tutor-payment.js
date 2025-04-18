Kolom	Tipe Data	Keterangan
payment_id	INT (PK)	ID pembayaran
booking_id	INT (FK)	Relasi ke pemesanan tutor
payment_date	DATETIME	Tanggal bayar
amount_paid	DECIMAL(10,2)	Jumlah
payment_method	ENUM	'cash', 'transfer', 'credit_card'
status	ENUM	'paid', 'pending', 'failed'