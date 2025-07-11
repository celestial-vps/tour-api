const multer = require('multer');
const path = require('path');

// Konfigurasi storage multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/'); // pastikan folder uploads ada
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});

// Tambahkan filter file image only
const imageFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true); // terima file
  } else {
    cb(new Error('Only image files are allowed!'), false); // tolak file
  }
};

const upload = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // max 5MB optional
});

module.exports = upload;
