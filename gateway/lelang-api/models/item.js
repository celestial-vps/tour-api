const ItemSchema = new mongoose.Schema({
  title:         { type: String, required: true },
  description:   { type: String },
  images:        [{ type: mongoose.Schema.Types.ObjectId, ref: 'Image' }], // relasi ke banyak gambar
  startingPrice: { type: Number, required: true },
  owner:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt:     { type: Date, default: Date.now }
});
