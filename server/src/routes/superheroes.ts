import { Router, Request, Response, NextFunction } from "express";
import path from "path";
import {
  getAllSuperheroes,
  getSuperheroById,
  createSuperhero,
  updateSuperhero,
  deleteSuperhero,
  deleteHeroImage,
} from "../controllers/superheroController";
import { upload } from "../config/multer";
import { validateSuperhero } from "../middlewares/validateSuperhero";
import { validateFile } from "../middlewares/validateFile";

const router = Router();

const asyncHandler = (fn: any) => (req: Request, res: Response, next: NextFunction) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// ❌ ПРОБЛЕМА: Статический роутер должен быть в главном app файле, а не здесь
// router.use("/uploads", require("express").static("uploads"));

// ✅ ИСПРАВЛЕНИЕ: Добавляем тестовые маршруты перед параметризованными
router.get("/test-upload", async (req: Request, res: Response) => {
  res.json({
    message: "Upload endpoint is ready",
    upload_url: "/superheroes",
    max_files: 5,
    accepted_formats: ["jpg", "jpeg", "png", "webp"]
  });
});

router.get("/storage-status", async (req: Request, res: Response) => {
  res.json({
    storage: "local",
    upload_path: path.join(process.cwd(), "uploads", "superheroes"),
    status: "active"
  });
});

// Основные маршруты
router.get("/", asyncHandler(getAllSuperheroes));

// ✅ Параметризованные маршруты идут после статических
router.get("/:id", asyncHandler(getSuperheroById));

router.post(
  "/",
  upload.array("images", 5),
  (req, res, next) => {
    console.log("📁 Files received:", req.files?.length || 0);
    console.log("📝 Body data:", Object.keys(req.body));
    next();
  },
  validateFile,
  validateSuperhero,
  asyncHandler(createSuperhero)
);

router.put(
  "/:id",
  upload.array("images", 5),
  (req, res, next) => {
    console.log(`📁 Update ${req.params.id}: Files received:`, req.files?.length || 0);
    next();
  },
  validateFile,
  validateSuperhero,
  asyncHandler(updateSuperhero)
);

router.delete("/:id", asyncHandler(deleteSuperhero));
router.delete("/:id/image/:publicId", asyncHandler(deleteHeroImage));

// Глобальный обработчик ошибок для этого роутера
router.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("🚨 SUPERHERO ROUTER ERROR:", err);
  
  // Специфичная обработка различных типов ошибок
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: "Validation Error",
      errors: err.errors,
    });
  }
  
  if (err.name === 'CastError') {
    return res.status(400).json({
      message: "Invalid ID format",
      error: "The provided ID is not a valid MongoDB ObjectId",
    });
  }
  
  if (err.code === 11000) {
    return res.status(409).json({
      message: "Duplicate Error",
      error: "A superhero with this nickname already exists",
    });
  }
  
  // Общая обработка остальных ошибок
  res.status(500).json({
    message: "Internal Server Error",
    error: process.env.NODE_ENV === 'development' ? err.message : "Something went wrong",
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

export default router;