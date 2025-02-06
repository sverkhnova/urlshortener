import { AppDataSource } from '../data-source';
import { ShortLink } from '../entities/ShortLink';

export class ShortenerService {
  private repository = AppDataSource.getRepository(ShortLink);

  async createShortLink(originalUrl: string, alias?: string): Promise<ShortLink> {
    const shortLink = this.repository.create({
      originalUrl,
      alias,
    });
    return this.repository.save(shortLink);
  }
  async findByAlias(alias: string): Promise<ShortLink | null> {
    // findOneBy -> ищет по одному конкретному полю (в TypeORM 0.3+)
    return this.repository.findOneBy({ alias });
  }

  // Инкрементируем clickCount
  async incrementClickCount(link: ShortLink): Promise<ShortLink> {
    link.clickCount += 1;
    return this.repository.save(link);
  }
}