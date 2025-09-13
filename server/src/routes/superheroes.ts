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

import { validateSuperhero } from '../middlewares/validateSuperhero';
import { validateFile } from '../middlewares/validateFile';

const router = Router();
const upload = multer({ storage });

router.get('/', getAllSuperheroes);
router.get('/:id', getSuperheroById);
router.post(
  '/',
  upload.array('images', 5), 
  validateFile,              
  validateSuperhero,        
  createSuperhero            
);
router.put(
  '/:id',
  upload.array('images', 5),
  validateFile,
  validateSuperhero,
  updateSuperhero
);
router.delete('/:id', deleteSuperhero);
router.delete('/:id/image/:publicId', deleteHeroImage);

export default router;
