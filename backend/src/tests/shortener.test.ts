import request from 'supertest';
import { app } from '../app'; // см. пояснение, нужно экспортировать `app` отдельно
import { AppDataSource } from '../data-source';
import { ShortLink } from '../entities/ShortLink';
import { Analytics } from '../entities/Analytics';

describe('Shortener API', () => {
  beforeAll(async () => {
    // инициализируем БД
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
  });

  beforeEach(async () => {
    // очищаем таблицы
    await AppDataSource.getRepository(Analytics).delete({});
    await AppDataSource.getRepository(ShortLink).delete({});
  });

  afterAll(async () => {
    // отключаемся от БД, чтобы Jest не висел
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  });

  it('should create a new short link with a custom alias', async () => {
    const alias = 'unique-alias-test';

    const response = await request(app)
      .post('/shorten')
      .send({ originalUrl: 'https://example.com', alias });

    expect(response.status).toBe(201);
    expect(response.body.alias).toContain(alias);

    // проверим, что запись реально создалась в БД
    const linkInDb = await AppDataSource.getRepository(ShortLink).findOneBy({ alias });
    expect(linkInDb).toBeDefined();
    expect(linkInDb?.originalUrl).toBe('https://example.com');
  });

  it('should redirect to the original URL if alias is found', async () => {
    const alias = 'redirect-test';

    // сначала создаём ссылку
    await request(app)
      .post('/shorten')
      .send({ originalUrl: 'https://github.com', alias });

    // запрашиваем GET /:alias
    const response = await request(app).get(`/${alias}`);

    // проверяем, что есть редирект (302 или 3xx)
    expect(response.status).toBe(302);
    expect(response.headers.location).toBe('https://github.com');
  });
});
