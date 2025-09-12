import { Router } from 'express';
import multer from 'multer';
import { storage } from '../config/cloudinary';
import {
  getAllSuperheroes,
  getSuperheroById,
  createSuperhero,
  updateSuperhero,
  deleteSuperhero,
  deleteHeroImage,
} from '../controllers/superheroController';

const router = Router();
const upload = multer({ storage });

router.get('/', getAllSuperheroes);
router.get('/:id', getSuperheroById);
router.post('/', upload.array('images', 5), createSuperhero);
router.put('/:id', upload.array('images', 5), updateSuperhero);
router.delete('/:id', deleteSuperhero);
router.delete('/:id/image/:publicId', deleteHeroImage);

export default router;
