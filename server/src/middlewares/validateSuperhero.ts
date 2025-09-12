import { Request, Response, NextFunction } from 'express';

export const validateSuperhero = (req: Request, res: Response, next: NextFunction) => {
  const { nickname, real_name, origin_description, superpowers, catch_phrase } = req.body;

  if (!nickname || typeof nickname !== 'string' || nickname.trim().length === 0) {
    return res.status(400).json({ error: 'Nickname is required and must be a non-empty string' });
  }

  if (!real_name || typeof real_name !== 'string' || real_name.trim().length === 0) {
    return res.status(400).json({ error: 'Real name is required and must be a non-empty string' });
  }

  if (origin_description && typeof origin_description !== 'string') {
    return res.status(400).json({ error: 'Origin description must be a string' });
  }

  if (superpowers && typeof superpowers !== 'string') {
    return res.status(400).json({ error: 'Superpowers must be a string (comma separated)' });
  }

  if (catch_phrase && typeof catch_phrase !== 'string') {
    return res.status(400).json({ error: 'Catch phrase must be a string' });
  }

  next();
};
