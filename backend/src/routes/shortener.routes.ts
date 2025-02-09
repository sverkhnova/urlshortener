import { Router, Request, Response } from 'express';
import { ShortenerService } from '../services/ShortenerService';

const router = Router();
const service = new ShortenerService();

// POST /shorten
router.post('/shorten', async (req: Request, res: Response) => {
  try {
    const { originalUrl, alias } = req.body;

    if (!originalUrl) {
      res.status(400).json({ error: 'originalUrl is required' });
      return;
    }

    const createdLink = await service.createShortLink(originalUrl, alias);

    // Возвращаем данные. expiresAt уже в базе хранится (через SQL default)
    res.status(201).json({
      id: createdLink.id,
      originalUrl: createdLink.originalUrl,
      alias: `http://localhost:3000/${createdLink.alias}`,
      createdAt: createdLink.createdAt,
      expiresAt: createdLink.expiresAt, // TypeORM загрузит это поле после save()
      clickCount: createdLink.clickCount,
    });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
    return;
  }
});

router.get('/:alias', async (req: Request, res: Response) => {
  try {
    const { alias } = req.params;
    if (!alias) {
      res.status(400).json({ error: 'Alias is required' });
      return;
    }

    const link = await service.findByAlias(alias);
    if (!link) {
      res.status(404).json({ error: 'Short link not found' });
      return;
    }

    // Проверяем, не просрочена ли ссылка
    if (link.expiresAt && link.expiresAt < new Date()) {
      // Можно вернуть статус 410 (Gone) или 400, как решите
      res.status(410).json({ error: 'Short link has expired' });
      return;
    }

    // Увеличиваем clickCount
    await service.incrementClickCount(link);

    // Редирект на originalUrl
    res.redirect(link.originalUrl);
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
    return;
  }
});

// GET /info/:alias
router.get('/info/:alias', async (req: Request, res: Response) => {
  try {
    const { alias } = req.params;
    if (!alias) {
      res.status(400).json({ error: 'Alias is required' });
      return;
    }

    const link = await service.findByAlias(alias);
    if (!link) {
      res.status(404).json({ error: 'Short link not found' });
      return;
    }

    // Возвращаем нужные поля
    res.json({
      id: link.id,
      originalUrl: link.originalUrl,
      alias: link.alias,
      createdAt: link.createdAt,
      expiresAt: link.expiresAt,
      clickCount: link.clickCount,
    });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
    return;
  }
});

// DELETE /delete/:alias
router.delete('/delete/:alias', async (req: Request, res: Response) => {
  try {
    const { alias } = req.params;
    if (!alias) {
      res.status(400).json({ error: 'Alias is required' });
      return;
    }

    const success = await service.deleteByAlias(alias);
    if (!success) {
      res.status(404).json({ error: 'Short link not found' });
      return;
    }

    res.json({ message: 'Short link deleted' });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
    return;
  }
});

// GET /analytics/:alias
router.get('/analytics/:alias', async (req: Request, res: Response) => {
  try {
    const { alias } = req.params;
    if (!alias) {
      res.status(400).json({ error: 'Alias is required' });
      return;
    }
    const result = await service.getAnalytics(alias);
    if (!result) {
      res.status(404).json({ error: 'Short link not found' });
      return;
    }
    res.json({
      clickCount: result.clickCount,
      lastIps: result.lastIps,
    });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
    return;
  }
});


export default router;
