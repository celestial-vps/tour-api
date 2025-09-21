1. Contoh Model MongoDB dengan Mongoose
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: Number,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

📋 2. Basic CRUD MongoDB (pakai Mongoose)
🟢 CREATE
await User.create({ name: 'Alice', email: 'alice@gmail.com' });

🔵 READ
await User.find({ isActive: true });
await User.findOne({ email: 'alice@gmail.com' });

🟡 UPDATE
await User.updateOne({ email: 'alice@gmail.com' }, { $set: { isActive: false } });

🔴 DELETE
await User.deleteOne({ email: 'alice@gmail.com' });

🧠 3. Filtering / Operator Query MongoDB
Operator	Contoh
$and	{ $and: [ { isActive: true }, { age: { $gte: 18 } } ] }
$or	{ $or: [ { name: 'Alice' }, { name: 'Bob' } ] }
$not	{ age: { $not: { $gte: 30 } } }
$in / $nin	{ age: { $in: [20, 25, 30] } }
$regex	{ name: { $regex: 'ali', $options: 'i' } }
$exists	{ deletedAt: { $exists: false } }
🔗 4. Join (Relasi) di MongoDB

MongoDB tidak punya JOIN native, tapi:

👉 Mongoose: pakai .populate()
const postSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String
});
const Post = mongoose.model('Post', postSchema);

// Query dengan join user:
await Post.find().populate('userId');

👉 Native MongoDB: pakai $lookup
db.posts.aggregate([
  {
    $lookup: {
      from: "users",
      localField: "userId",
      foreignField: "_id",
      as: "user"
    }
  }
]);

📊 5. Aggregation (Group, Count, Sum, etc)
db.orders.aggregate([
  { $match: { status: "paid" } },
  { $group: { _id: "$userId", total: { $sum: "$amount" } } },
  { $match: { total: { $gt: 100 } } }
]);

🧱 6. Composite Index dan Unique
userSchema.index({ email: 1, name: 1 }, { unique: true });

🔐 7. Validation

Mongoose mendukung validasi seperti:

email: {
  type: String,
  required: true,
  match: /.+\@.+\..+/,
  unique: true
}

🗑️ 8. Soft Delete dan Timestamps
const userSchema = new mongoose.Schema({
  deletedAt: { type: Date, default: null }
}, {
  timestamps: true // createdAt, updatedAt otomatis
});


Untuk soft delete, cukup update deletedAt tanpa menghapus data:

await User.updateOne({ _id: id }, { $set: { deletedAt: new Date() } });

🔄 9. Virtual Field (Tidak disimpan di DB)
userSchema.virtual('fullName').get(function() {
  return this.firstName + ' ' + this.lastName;
});

📌 10. Pagination dan Projection
await User.find({ isActive: true })
  .select('name email') // projection
  .skip(10)
  .limit(10)
  .sort({ createdAt: -1 });