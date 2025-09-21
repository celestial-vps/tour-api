1. WHERE dengan AND / OR
const { Op } = require("sequelize");

const users = await User.findAll({
  where: {
    [Op.and]: [
      { status: 'active' },
      { age: { [Op.gte]: 18 } }
    ]
  }
});

const users = await User.findAll({
  where: {
    [Op.or]: [
      { name: 'Alice' },
      { email: 'alice@example.com' }
    ]
  }
});


2. LIKE / NOT LIKE
const users = await User.findAll({
  where: {
    name: {
      [Op.like]: '%john%'
    }
  }
});



const users = await User.findAll({
  where: {
    id: {
      [Op.in]: [1, 2, 3]
    }
  }
});

const users = await User.findAll({
  where: {
    age: {
      [Op.between]: [18, 30]
    }
  }
});


🔗 5. JOIN antar tabel (Include / Associations)

Misal:

User punya relasi ke Post (One-to-Many)

const users = await User.findAll({
  include: [{
    model: Post,
    where: {
      title: {
        [Op.like]: '%sequalize%'
      }
    }
  }]
});

6. GROUP BY dan HAVING
const orders = await Order.findAll({
  attributes: [
    'userId',
    [Sequelize.fn('SUM', Sequelize.col('total')), 'totalSpent']
  ],
  group: ['userId'],
  having: Sequelize.literal('SUM(total) > 1000')
});


7. UNION / XOR (Pakai Raw Query)

Sequelize tidak langsung dukung UNION atau XOR, tapi bisa pakai raw SQL:

const [results] = await sequelize.query(`
  (SELECT name FROM Users WHERE role = 'admin')
  UNION
  (SELECT name FROM Users WHERE active = 1)
`);

8. XOR (Logika)

Untuk XOR (hanya satu kondisi yang benar):

const users = await User.findAll({
  where: {
    [Op.or]: [
      {
        [Op.and]: [
          { A: true },
          { B: false }
        ]
      },
      {
        [Op.and]: [
          { A: false },
          { B: true }
        ]
      }
    ]
  }
});

9. NOT (kebalikan dari kondisi)
const users = await User.findAll({
  where: {
    name: {
      [Op.not]: 'John Doe'
    }
  }
});

10. INNER JOIN (default saat required: true)
const users = await User.findAll({
  include: {
    model: Post,
    required: true, // INNER JOIN
    where: { published: true }
  }
});

11. LEFT JOIN (default saat required: false atau tanpa required)
const users = await User.findAll({
  include: {
    model: Post,
    required: false // LEFT JOIN
  }
});

12. RIGHT JOIN (⚠️ Tidak didukung langsung oleh Sequelize)

Sequelize tidak mendukung RIGHT JOIN secara langsung, tapi bisa pakai raw query jika sangat dibutuhkan.

const [results] = await sequelize.query(`
  SELECT * FROM Posts
  RIGHT JOIN Users ON Users.id = Posts.userId
`);

13. IS NULL / IS NOT NULL
const users = await User.findAll({
  where: {
    deletedAt: {
      [Op.is]: null // IS NULL
    }
  }
});

const users = await User.findAll({
  where: {
    deletedAt: {
      [Op.not]: null // IS NOT NULL
    }
  }
});


14. LIMIT, OFFSET, ORDER
const posts = await Post.findAll({
  limit: 10,
  offset: 20,
  order: [['createdAt', 'DESC']]
});

15. DISTINCT + COUNT (Jumlah user yang punya post unik)
const count = await Post.count({
  distinct: true,
  col: 'userId'
});

16. GROUP BY + HAVING
const posts = await Post.findAll({
  attributes: [
    'userId',
    [Sequelize.fn('COUNT', Sequelize.col('id')), 'postCount']
  ],
  group: ['userId'],
  having: Sequelize.literal('COUNT(id) > 5')
});

17. EXISTS / NOT EXISTS (via raw subquery)
const [users] = await sequelize.query(`
  SELECT * FROM Users u
  WHERE EXISTS (
    SELECT 1 FROM Posts p WHERE p.userId = u.id AND p.published = 1
  )
`);

18. Subquery manual (alias + include)
const users = await User.findAll({
  attributes: {
    include: [
      [Sequelize.literal(`(
        SELECT COUNT(*) FROM Posts AS p
        WHERE p.userId = User.id AND p.published = 1
      )`), 'publishedPostCount']
    ]
  }
});

19. Nested Include + Filter
const users = await User.findAll({
  include: {
    model: Post,
    required: true,
    include: {
      model: Comment,
      where: { content: { [Op.like]: '%thanks%' } }
    }
  }
});

20. Filtering pakai OR + LIKE + NOT LIKE kombinasi:
const posts = await Post.findAll({
  where: {
    [Op.or]: [
      { title: { [Op.like]: '%sequelize%' } },
      { content: { [Op.notLike]: '%boring%' } }
    ]
  }
});


===========================================================
🧱 1. Scopes & Default Scopes

Untuk membuat query reusable, DRY (Don't Repeat Yourself).

const User = sequelize.define('User', {
  name: DataTypes.STRING,
  active: DataTypes.BOOLEAN
}, {
  defaultScope: {
    where: { active: true }
  },
  scopes: {
    withInactive: {
      where: {}
    }
  }
});

// Penggunaan:
User.findAll(); // hanya user aktif
User.scope('withInactive').findAll(); // semua user


2. Soft Delete (paranoid: true)

Menandai data sebagai "dihapus", tanpa benar-benar menghapusnya dari DB.

const Post = sequelize.define('Post', {
  title: DataTypes.STRING
}, {
  paranoid: true
});

await Post.destroy({ where: { id: 1 } }); // tidak benar-benar hapus


3. Hooks (Lifecycle Events)

Seperti beforeCreate, afterUpdate, dll.

User.beforeCreate((user, options) => {
  user.username = user.username.toLowerCase();
});

4. Model-Level Validation & Sanitasi

Menjaga validitas data secara otomatis di model.

const User = sequelize.define('User', {
  email: {
    type: DataTypes.STRING,
    validate: {
      isEmail: true
    }
  }
});

5. Upsert (Insert or Update)

Cocok untuk sinkronisasi data.

await User.upsert({ id: 1, name: 'Updated Name' });

6. Bulk Insert / Bulk Update

Untuk efisiensi saat proses data besar.

await User.bulkCreate([
  { name: 'User A' },
  { name: 'User B' }
]);

7. Custom Getter & Setter di Model

Agar field bisa dimodifikasi saat diakses/disimpan.

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    get() {
      const raw = this.getDataValue('name');
      return raw.toUpperCase();
    }
  }
});

9. Integrasi Sequelize dengan REST API / GraphQL

Contoh di Express:

app.get('/users', async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

10. Advanced Query Optimization

Gunakan attributes untuk ambil kolom spesifik

Gunakan raw: true saat perlu data murni

Indexing di model (contoh):

const Post = sequelize.define('Post', {
  title: DataTypes.STRING
}, {
  indexes: [
    {
      unique: true,
      fields: ['title']
    }
  ]
});


CONTOH MODEL SEQUELIZE DENGAN TIPE DATA

Berikut contoh model lengkap dengan tipe data bervariasi, validasi, relasi, dan pengaturan khusus.

🧩 Model: User
const { DataTypes } = require('sequelize');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  fullName: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  gender: {
    type: DataTypes.ENUM('male', 'female', 'other'),
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  birthDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  loginCount: {
    type: DataTypes.INTEGER.UNSIGNED,
    defaultValue: 0
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true
  },
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
  deletedAt: DataTypes.DATE
}, {
  paranoid: true, // enable soft delete
  tableName: 'users'
});

🧩 Model: Post (Relasi: User hasMany Posts)
const Post = sequelize.define('Post', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  published: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  publishedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'posts'
});

// Relasi
User.hasMany(Post, { foreignKey: 'userId' });
Post.belongsTo(User, { foreignKey: 'userId' });


1. Composite Primary Key (Dua kolom sebagai primary key bersama)

Kalau kamu ingin kombinasi dua kolom menjadi primary key, ini disebut Composite Primary Key.

✅ Contoh:
const Enrollment = sequelize.define('Enrollment', {
  userId: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  courseId: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  enrolledAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW
  }
}, {
  tableName: 'enrollments',
  timestamps: false
});


🎯 Artinya:

userId dan courseId bersama-sama menjadi Primary Key

Tidak boleh ada 2 baris dengan kombinasi userId dan courseId yang sama.

🔶 2. Composite Unique Constraint (Kalau bukan PK, tapi tetap tidak boleh sama)

Kalau kamu ingin dua kolom tidak boleh punya kombinasi yang sama, tapi bukan primary key, kamu bisa pakai unique index.

✅ Contoh:
const Vote = sequelize.define('Vote', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  postId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  voteValue: {
    type: DataTypes.INTEGER
  }
}, {
  indexes: [
    {
      unique: true,
      fields: ['userId', 'postId']
    }
  ]
});


🎯 Artinya:

Kombinasi userId dan postId harus unik

Bisa dipakai untuk sistem voting (1 user hanya boleh vote 1 kali per post