import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { storage } from '../config/cloudinary';
import { cloudinary } from '../config/cloudinary';
import {
  getAllSuperheroes,
  getSuperheroById,
  createSuperhero,
  updateSuperhero,
  deleteSuperhero,
  deleteHeroImage,
} from '../controllers/superheroController';

import { validateSuperhero } from '../middlewares/validateSuperhero';
import { validateFile } from '../middlewares/validateFile';

const router = Router();
const upload = multer({ storage });

const asyncHandler = (fn: any) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.get('/', asyncHandler(getAllSuperheroes)); 
router.get('/test-cloudinary', async (req, res) => {
  try {
    const result = await cloudinary.api.ping();
    res.json({ status: 'Cloudinary connected', result });
  } catch (error) {
    res.status(500).json({ status: 'Cloudinary error', error });
  }
});
router.get('/:id', asyncHandler(getSuperheroById));


router.post(
  "/",
  upload.array("images", 5),
  (req, res, next) => {
    console.log("FILES RECEIVED:", req.files);
    next();
  },
  validateFile,
  validateSuperhero,
  asyncHandler(createSuperhero)
);

router.put(
  '/:id',
  upload.array('images', 5),
  validateFile,
  validateSuperhero,
  asyncHandler(updateSuperhero)
);

router.delete('/:id', asyncHandler(deleteSuperhero));
router.delete('/:id/image/:publicId', asyncHandler(deleteHeroImage));

router.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("🚨 SERVER ERROR:", err);
  res.status(500).json({
    message: "Internal Server Error",
    error: err.message,
    stack: err.stack,
  });
});

export default router;
