import { Request, Response } from "express";
import { Superhero } from "../models/Superhero";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

interface IImage {
  url: string;
  public_id: string;
}

interface MulterRequest extends Request {
  files?: Express.Multer.File[];
}

const uploadDir = path.join(process.cwd(), "uploads");
const BASE_URL = process.env.BASE_URL;

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

export const createSuperhero = async (req: MulterRequest, res: Response) => {
  try {
    let newImages: IImage[] = [];

    if (req.files && req.files.length) {
      newImages = (req.files as Express.Multer.File[]).map((file) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
        const filePath = path.join(uploadDir, filename);
        fs.writeFileSync(filePath, file.buffer);
        return {
          url: `${BASE_URL}/uploads/${filename}`,
          public_id: filename,
        };
      });
    }

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
    if (!hero) return res.status(404).json({ error: "Not found" });

    let newImages: IImage[] = [];

    if (req.files && req.files.length) {
      newImages = (req.files as Express.Multer.File[]).map((file) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
        const filePath = path.join(uploadDir, filename);
        fs.writeFileSync(filePath, file.buffer);
        return {
          url: `${BASE_URL}/uploads/${filename}`,
          public_id: filename,
        };
      });
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
    if (!hero) return res.status(404).json({ error: "Not found" });

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

export const deleteHeroImage = async (req: Request, res: Response) => {
  try {
    const hero = await Superhero.findById(req.params.id);
    if (!hero) return res.status(404).json({ error: "Hero not found" });

    const imgToDelete = hero.images.find(
      (img) => img.public_id === req.params.publicId
    );
    if (!imgToDelete) return res.status(404).json({ error: "Image not found" });

    const filePath = path.join(uploadDir, imgToDelete.public_id);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    hero.images = hero.images.filter(
      (img) => img.public_id !== req.params.publicId
    );
    await hero.save();

    res.json(hero);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
