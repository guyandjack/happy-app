const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Create uploads/articles directory for article content
const articlesDir = path.join(uploadsDir, 'articles');
if (!fs.existsSync(articlesDir)) {
  fs.mkdirSync(articlesDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'htmlContent') {
      cb(null, articlesDir);
    } else {
      cb(null, uploadsDir);
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'htmlContent') {
    // Accept only HTML files for content
    if (file.mimetype === 'text/html') {
      cb(null, true);
    } else {
      cb(new Error('Only HTML files are allowed for article content!'), false);
    }
  } else if (file.fieldname === 'image' || file.fieldname === 'images') {
    // Accept only images
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  } else {
    cb(new Error('Unexpected field'), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  }
});

// Export different upload configurations
module.exports = {
  single: upload.single('image'),
  article: upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'images', maxCount: 10 },
    { name: 'htmlContent', maxCount: 1 }
  ])
}; 