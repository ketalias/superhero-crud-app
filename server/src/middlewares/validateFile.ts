import { Request, Response, NextFunction } from 'express';

export const validateFile = (req: Request, res: Response, next: NextFunction) => {
    const files = req.files as Express.Multer.File[] | undefined;

    if (!files || files.length === 0) {
        return next();
    }

    if (files.length > 5) {
        return res.status(400).json({ error: 'Maximum 5 images allowed' });
    }

    for (const file of files) {
        if (!['image/jpeg', 'image/png'].includes(file.mimetype)) {
            return res.status(400).json({ error: 'Only JPG and PNG files are allowed' });
        }

        if (file.size > 5 * 1024 * 1024) {
            return res.status(400).json({ error: `File ${file.originalname} is too large (max 5MB)` });
        }
    }

    next();
};
 
