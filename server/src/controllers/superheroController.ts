import { Request, Response } from "express";
import { Superhero } from "../models/Superhero";
import path from "path";
import fs from "fs";

interface IImage {
  url: string;
  public_id: string;
}

interface MulterRequest extends Request {
  files?: Express.Multer.File[];
}

const uploadDir = path.join(__dirname, "../uploads");

// --- GET ---
export const getAllSuperheroes = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = 5;

  try {
    const total = await Superhero.countDocuments();
    const heroes = await Superhero.find()
      .select("nickname images")
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
    if (!hero) return res.status(404).json({ error: "Not found" });
    res.json(hero);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// --- CREATE ---
export const createSuperhero = async (req: MulterRequest, res: Response) => {
  try {
    let newImages: IImage[] = [];

    if (req.files && req.files.length) {
      newImages = req.files.map((file) => ({
        url: `/uploads/${file.filename}`,
        public_id: file.filename,
      }));
    }

    const superhero = new Superhero({ ...req.body, images: newImages });
    await superhero.save();

    res.status(201).json(superhero);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// --- UPDATE ---
export const updateSuperhero = async (req: MulterRequest, res: Response) => {
  try {
    const hero = await Superhero.findById(req.params.id);
    if (!hero) return res.status(404).json({ error: "Not found" });

    let newImages: IImage[] = [];

    if (req.files && req.files.length) {
      newImages = req.files.map((file) => ({
        url: `/uploads/${file.filename}`,
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

// --- DELETE HERO ---
export const deleteSuperhero = async (req: Request, res: Response) => {
  try {
    const hero = await Superhero.findById(req.params.id);
    if (!hero) return res.status(404).json({ error: "Not found" });

    // Видаляємо файли з локальної системи
    for (const img of hero.images) {
      const filePath = path.join(uploadDir, img.public_id);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await hero.deleteOne();
    res.json({ message: "Hero and images deleted" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// --- DELETE IMAGE ---
export const deleteHeroImage = async (req: Request, res: Response) => {
  try {
    const hero = await Superhero.findById(req.params.id);
    if (!hero) return res.status(404).json({ error: "Hero not found" });

    const imgToDelete = hero.images.find(
      (img) => img.public_id === req.params.publicId
    );
    if (!imgToDelete) return res.status(404).json({ error: "Image not found" });

    // Видаляємо локальний файл
    const filePath = path.join(uploadDir, imgToDelete.public_id);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    hero.images = hero.images.filter((img) => img.public_id !== req.params.publicId);
    await hero.save();

    res.json(hero);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
