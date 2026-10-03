import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { protect } from '../middleware/authMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '../uploads');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, 'service-' + uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp|svg/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);
  if (ext && mime) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, PNG, WebP, SVG) are allowed!'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter
});

const router = express.Router();

router.post('/', protect, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({
    url: fileUrl,
    filename: req.file.filename,
    size: req.file.size
  });
});

export default router;
