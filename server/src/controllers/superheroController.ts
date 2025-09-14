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
    console.log("=== CREATE HERO START ===");
    console.log("REQ BODY:", JSON.stringify(req.body, null, 2));
    console.log("REQ FILES:", JSON.stringify(req.files, null, 2));

    const newImages: IImage[] = Array.isArray(req.files) && req.files.length > 0
      ? req.files.map((file: any) => ({
          url: file.path,
          public_id: file.filename,
        }))
      : [];

    console.log("NEW IMAGES TO SAVE:", JSON.stringify(newImages, null, 2));

    const superhero = new Superhero({ ...req.body, images: newImages });
    await superhero.save();

    console.log("SUPERHERO CREATED:", JSON.stringify(superhero, null, 2));
    console.log("=== CREATE HERO END ===");

    res.status(201).json(superhero);
  } catch (err: any) {
    console.error("CREATE HERO ERROR:", err);
    res.status(400).json({ error: err.message, stack: err.stack });
  }
};

export const updateSuperhero = async (req: MulterRequest, res: Response) => {
  try {
    console.log("=== UPDATE HERO START ===");
    console.log("REQ PARAMS:", req.params);
    console.log("REQ BODY:", JSON.stringify(req.body, null, 2));
    console.log("REQ FILES:", JSON.stringify(req.files, null, 2));

    const hero = await Superhero.findById(req.params.id);
    if (!hero) {
      console.log("HERO NOT FOUND");
      return res.status(404).json({ error: "Not found" });
    }

    console.log("HERO BEFORE UPDATE:", JSON.stringify(hero, null, 2));

    if (Array.isArray(req.files) && req.files.length > 0) {
      const newImages: IImage[] = req.files.map((file: any) => ({
        url: file.path,
        public_id: file.filename,
      }));
      console.log("NEW IMAGES TO ADD:", JSON.stringify(newImages, null, 2));
      hero.images.push(...newImages);
    }

    Object.assign(hero, req.body);
    await hero.save();

    console.log("HERO AFTER UPDATE:", JSON.stringify(hero, null, 2));
    console.log("=== UPDATE HERO END ===");

    res.json(hero);
  } catch (err: any) {
    console.error("UPDATE HERO ERROR:", err);
    res.status(400).json({ error: err.message, stack: err.stack });
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