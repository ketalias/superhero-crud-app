import { Request, Response } from 'express';
import { Superhero } from '../models/Superhero';
import { cloudinary } from '../config/cloudinary';

interface IImage {
  url: string;
  public_id: string;
}

interface MulterRequest extends Request {
  files?: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] };
}

export const getAllSuperheroes = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = 5;

  try {
    const total = await Superhero.countDocuments();
    const heroes = await Superhero.find()
      .select('nickname images')
      .skip((page - 1) * limit)
      .limit(limit);

    const formatted = heroes.map((h) => ({
      id: h._id,
      nickname: h.nickname,
      image: h.images[0] || null,
    }));

    res.json({
      page,
      totalPages: Math.ceil(total / limit),
      superheroes: formatted,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getSuperheroById = async (req: Request, res: Response) => {
  try {
    const hero = await Superhero.findById(req.params.id);
    if (!hero) return res.status(404).json({ error: 'Not found' });
    res.json(hero);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createSuperhero = async (req: MulterRequest, res: Response) => {
  try {
    const newImages: IImage[] = Array.isArray(req.files)
      ? req.files.map((file: Express.Multer.File) => ({
          url: file.path,
          public_id: file.filename,
        }))
      : [];

    const superhero = new Superhero({ ...req.body, images: newImages });
    await superhero.save();
    res.status(201).json(superhero);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const updateSuperhero = async (req: MulterRequest, res: Response) => {
  try {
    const hero = await Superhero.findById(req.params.id);
    if (!hero) return res.status(404).json({ error: 'Not found' });

    if (Array.isArray(req.files) && req.files.length > 0) {
      const newImages: IImage[] = req.files.map((file: Express.Multer.File) => ({
        url: file.path,
        public_id: file.filename,
      }));
      hero.images.push(...newImages);
    }

    Object.assign(hero, req.body);
    await hero.save();
    res.json(hero);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteSuperhero = async (req: Request, res: Response) => {
  try {
    const hero = await Superhero.findById(req.params.id);
    if (!hero) return res.status(404).json({ error: 'Not found' });

    for (const img of hero.images) {
      await cloudinary.uploader.destroy(img.public_id);
    }
    await hero.deleteOne();
    res.json({ message: 'Hero and images deleted' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteHeroImage = async (req: Request, res: Response) => {
  try {
    const hero = await Superhero.findById(req.params.id);
    if (!hero) return res.status(404).json({ error: 'Hero not found' });

    await cloudinary.uploader.destroy(req.params.publicId);

    hero.images = hero.images.filter((img) => img.public_id !== req.params.publicId);
    await hero.save();

    res.json(hero);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};