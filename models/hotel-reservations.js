reservation_id	INT (PK)	ID reservasi
customer_id	INT (FK)	Relasi ke pelanggan
room_id	INT (FK)	Relasi ke kamar hotel
check_in_date	DATE	Tanggal check-in
check_out_date	DATE	Tanggal check-out
status	ENUM	'booked', 'cancelled', 'completed'
total_price	DECIMAL(10,2)	Total harga