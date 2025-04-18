Kolom	Tipe Data	Keterangan
room_id	INT (PK)	ID kamar
hotel_id	INT (FK)	Relasi ke hotel
room_type	VARCHAR(50)	Tipe kamar (Deluxe, Suite, dll)
capacity	INT	Kapasitas orang
price_per_night	DECIMAL(10,2)	Harga per malam
amenities	TEXT	Fasilitas (bisa JSON string)
status	ENUM	'available', 'booked', 'maintenance'