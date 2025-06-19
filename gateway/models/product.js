// const Product = sequelize.define('Product', {
//   oid: {
//     type: DataTypes.UUID,
//     defaultValue: DataTypes.UUIDV4,
//     primaryKey: true,
//   },
//   name: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   sku: {
//     type: DataTypes.STRING,
//     allowNull: false,
//     unique: true,
//   },
//   categoryId: {
//     type: DataTypes.UUID,
//     allowNull: true,
//     references: {
//       model: 'product_categories',
//       key: 'id',
//     },
//   },
//   brandId: {
//     type: DataTypes.UUID,
//     allowNull: true,
//     references: {
//       model: 'brands',
//       key: 'oid',
//     },
//   },
//   price: {
//     type: DataTypes.DECIMAL(10, 2),
//     allowNull: false,
//   },
//   costPrice: {
//     type: DataTypes.DECIMAL(10, 2),
//     allowNull: true,
//   },
//   stock: {
//     type: DataTypes.INTEGER,
//     defaultValue: 0,
//   },
//   description: {
//     type: DataTypes.TEXT,
//     allowNull: true,
//   },
//   imageUrl: {
//     type: DataTypes.STRING,
//     allowNull: true,
//     validate: {
//       isUrl: true,
//     },
//   },
//   isActive: {
//     type: DataTypes.BOOLEAN,
//     defaultValue: true,
//   },
// }, {
//   tableName: 'products',
//   timestamps: true,
//   paranoid: true,
// });
