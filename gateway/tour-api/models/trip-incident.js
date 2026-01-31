// Field	Type	Description
// id	BIGINT (PK)	Incident ID
// schedule_id	BIGINT (FK)	Jadwal yang mengalami insiden
// reporter_id	BIGINT (FK)	User/Driver yang melaporkan
// title	VARCHAR	Judul kejadian (misal: Ban Bocor)
// description	TEXT	Detail laporan
// incident_type	ENUM	technical, traffic, medical, other
// location_lat	DECIMAL(10,6)	Lokasi insiden
// location_long	DECIMAL(10,6)	
// reported_at	TIMESTAMP	Tanggal insiden
// resolved_at	TIMESTAMP	Kapan diselesaikan
// status	ENUM	open, in_progress, resolved