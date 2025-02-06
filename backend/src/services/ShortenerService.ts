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
}
