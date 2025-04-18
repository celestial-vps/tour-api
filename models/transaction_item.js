Column	Type	Description
transaction_item_id	INT (PK)	Unique ID for this record
transaction_id	INT (FK)	Relates to the transaction
item_type	ENUM ('car', 'room', 'tutor')	Type of item (car, room, tutor)
item_id	INT	ID of the specific item (car_id, room_id)
quantity	INT	Quantity of items (if applicable)
price_per_unit	DECIMAL(10, 2)	Price per unit of the item
total_price	DECIMAL(10, 2)	Total price for this item