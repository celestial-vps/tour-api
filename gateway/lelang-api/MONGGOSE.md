| Method                     | Kegunaan                                          |
| -------------------------- | ------------------------------------------------- |
| `find()`                   | Menemukan semua dokumen yang cocok dengan kondisi |
| `findOne()`                | Menemukan satu dokumen yang cocok                 |
| `findById()`               | Menemukan berdasarkan `_id`                       |
| `countDocuments()`         | Menghitung jumlah dokumen yang cocok              |
| `estimatedDocumentCount()` | Menghitung seluruh dokumen dalam koleksi          |
| `distinct()`               | Mengambil nilai unik untuk satu field             |
| `exists()`                 | Cek apakah dokumen dengan kondisi tertentu ada    |


| Method     | Kegunaan                                               |
| ---------- | ------------------------------------------------------ |
| `create()` | Menambahkan satu atau beberapa dokumen                 |
| `save()`   | Menyimpan dokumen baru dari instance `new Model(data)` |

| Method                | Kegunaan                                                              |
| --------------------- | --------------------------------------------------------------------- |
| `updateOne()`         | Update satu dokumen                                                   |
| `updateMany()`        | Update banyak dokumen                                                 |
| `findOneAndUpdate()`  | Cari satu dokumen lalu update + return dokumen sebelum/sesudah update |
| `findByIdAndUpdate()` | Sama seperti `findOneAndUpdate` tapi berdasarkan `_id`                |
| `replaceOne()`        | Mengganti seluruh dokumen dengan yang baru                            |


| Method                | Kegunaan                                    |
| --------------------- | ------------------------------------------- |
| `deleteOne()`         | Menghapus satu dokumen                      |
| `deleteMany()`        | Menghapus semua yang cocok                  |
| `findOneAndDelete()`  | Hapus satu dokumen dan kembalikan           |
| `findByIdAndDelete()` | Sama seperti di atas tapi berdasarkan `_id` |
| `remove()`            | (⚠️ Deprecated)                             |


| Method    | Kegunaan                             |
| --------- | ------------------------------------ |
| `sort()`  | Mengurutkan hasil                    |
| `limit()` | Membatasi jumlah hasil               |
| `skip()`  | Lewati sekian dokumen (untuk paging) |


const categories = await Category.find();
const items = await Item.find({ categoryId: { $in: categories.map(c => c._id) } });

| **Operator** | **Keterangan**        | **Contoh**                                 |
| ------------ | --------------------- | ------------------------------------------ |
| `$eq`        | Sama dengan           | `{ price: { $eq: 10000 } }`                |
| `$ne`        | Tidak sama            | `{ price: { $ne: 10000 } }`                |
| `$gt`        | Lebih besar dari      | `{ startingPrice: { $gt: 50000 } }`        |
| `$gte`       | Lebih besar atau sama | `{ startingPrice: { $gte: 50000 } }`       |
| `$lt`        | Kurang dari           | `{ startingPrice: { $lt: 50000 } }`        |
| `$lte`       | Kurang atau sama      | `{ startingPrice: { $lte: 50000 } }`       |
| `$in`        | Salah satu dari list  | `{ itemName: { $in: ['Laptop', 'HP'] } }`  |
| `$nin`       | Tidak termasuk list   | `{ itemName: { $nin: ['Laptop', 'HP'] } }` |

2. Logical Operators ($and, $or, $not, $nor)

// Semua kondisi harus terpenuhi
Item.find({
  $and: [
    { startingPrice: { $gte: 50000 } },
    { itemName: /laptop/i }
  ]
});

// Salah satu kondisi cukup
Item.find({
  $or: [
    { startingPrice: { $lt: 10000 } },
    { itemName: /hp/i }
  ]
});

// Negasi
Item.find({
  startingPrice: { $not: { $gte: 100000 } }
});

3. Text & Pattern
Item.find({ itemName: /laptop/i }); // Case-insensitive regex

4. Projection (select field)
Item.find({}, 'itemName startingPrice'); // Hanya ambil field tersebut

5. Sorting & Pagination
Item.find()
  .sort({ startingPrice: -1 })   // Urut harga desc
  .skip(10)                      // Lewati 10 pertama
  .limit(5);                     // Ambil 5 berikutnya

6. Populate (JOIN ke collection lain)
Item.find()
  .populate('itemCategory'); // JOIN ke ItemCategory

7. Aggregation (untuk GROUP BY, JOIN, dll)
7. a. Join ItemCategory dan Items (seperti LEFT JOIN)
ItemCategory.aggregate([
  { $match: { categoryName: 'Laptop' } },
  {
    $lookup: {
      from: 'items',
      localField: '_id',
      foreignField: 'itemCategory',
      as: 'items'
    }
  }
]);

7. b. Hitung jumlah item per kategori
Item.aggregate([
  {
    $group: {
      _id: "$itemCategory",
      totalItems: { $sum: 1 }
    }
  }
]);

7. c. Hitung rata-rata dan total harga per kategori
Item.aggregate([
  {
    $group: {
      _id: "$itemCategory",
      totalPrice: { $sum: "$startingPrice" },
      avgPrice: { $avg: "$startingPrice" }
    }
  }
]);

7. d Gabungkan dengan nama kategori
Item.aggregate([
  {
    $group: {
      _id: "$itemCategory",
      totalItems: { $sum: 1 }
    }
  },
  {
    $lookup: {
      from: "item_categories",
      localField: "_id",
      foreignField: "_id",
      as: "category"
    }
  },
  { $unwind: "$category" },
  {
    $project: {
      categoryName: "$category.categoryName",
      totalItems: 1
    }
  }
]);

8. Count
Item.countDocuments({ startingPrice: { $gt: 10000 } });

9. Distinct
Item.distinct("owner");

10. Update Banyak
Item.updateMany(
  { startingPrice: { $lt: 5000 } },
  { $set: { deletedBy: 'system', deletedAt: new Date() } }
);

11. Soft Delete
Item.find({ deletedAt: null });

12. Ambil ItemCategory beserta items-nya, + total item + avg harg
ItemCategory.aggregate([
  { $match: {} },
  {
    $lookup: {
      from: "items",
      localField: "_id",
      foreignField: "itemCategory",
      as: "items"
    }
  },
  {
    $addFields: {
      totalItems: { $size: "$items" },
      avgPrice: { $avg: "$items.startingPrice" }
    }
  },
  {
    $project: {
      categoryName: 1,
      totalItems: 1,
      avgPrice: 1,
      items: 1
    }
  }
]);
