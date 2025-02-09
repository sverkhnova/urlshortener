import { AppDataSource } from '../data-source';
import { ShortLink } from '../entities/ShortLink';
import { Analytics } from '../entities/Analytics';
import crypto from 'crypto';

function generateRandomAlias(): string {
  return crypto.randomBytes(4).toString('hex');
}

export class ShortenerService {
  private repository = AppDataSource.getRepository(ShortLink);
  private analyticsRepo = AppDataSource.getRepository(Analytics);

  async createShortLink(originalUrl: string, alias?: string): Promise<ShortLink> {
    let finalAlias = alias || generateRandomAlias();
  
    // сохраняем, если конфликт по уникальному полю - регенерим
    for (let i = 0; i < 5; i++) {
      try {
        const shortLink = this.repository.create({
          originalUrl,
          alias: finalAlias
        });
        return await this.repository.save(shortLink);
      } catch (error) {
        // проверяем, это ли ошибка DuplicateKey (например, code=23505)
        if (
          (error as any).code === '23505' 
          && !alias // регенерить имеет смысл только если alias не задан пользователем
        ) {
          finalAlias = generateRandomAlias(); 
          continue;
        }
        throw error; 
      }
    }
    throw new Error('Failed to generate unique alias (too many collisions).');
  }

  async findByAlias(alias: string): Promise<ShortLink | null> {
    // findOneBy -> ищет по одному конкретному полю (в TypeORM 0.3+)
    return this.repository.findOneBy({ alias });
  }

  async deleteByAlias(alias: string): Promise<boolean> {
    const result = await this.repository.delete({ alias });
    return result.affected !== 0;
  }
  // Инкрементируем clickCount
  async incrementClickCount(link: ShortLink, ip: string | null = null): Promise<ShortLink> {
    // Увеличиваем счётчик
    link.clickCount += 1;
    await this.repository.save(link);

    // Создаём запись в Analytics
    const analyticsRecord = this.analyticsRepo.create({
      shortLink: link,
      ip: ip,
    });
    await this.analyticsRepo.save(analyticsRecord);

    return link;
  }
  async getAnalytics(alias: string): Promise<{ clickCount: number; lastIps: string[] } | null> {
    // Находим ShortLink
    const link = await this.repository.findOne({ where: { alias } });
    if (!link) {
      return null;
    }
  
    const clickCount = link.clickCount;
  
    // Ищем последние 5 записей в Analytics
    const lastRecords = await this.analyticsRepo.find({
      where: { shortLink: { id: link.id } },
      order: { clickedAt: 'DESC' },
      take: 5
    });
  
    const lastIps = lastRecords.map((rec) => rec.ip || '');
  
    return { clickCount, lastIps };
  }
}