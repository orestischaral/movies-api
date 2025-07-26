import request from "supertest";
import app from "../../app";
import { prisma } from "../../infrastructure/db/prismaDbConnector";

describe("GET /movies/popular", () => {
  const apiKey = Buffer.from("secret").toString("base64");
  beforeAll(async () => {
    process.env.ENCODED_API_KEYS = Buffer.from("secret").toString("base64");
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should return a list of popular movies with expected fields", async () => {
    const response = await request(app)
      .get("/movies/popular")
      .query({ api_key: apiKey, page: 1 });

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);

    const movie = response.body[0];
    expect(movie).toHaveProperty("id");
    expect(movie).toHaveProperty("title");
    expect(movie).toHaveProperty("releaseDate");
    expect(movie).toHaveProperty("posterUrl");
    expect(movie).toHaveProperty("rating");

    expect(typeof movie.id).toBe("number");
    expect(typeof movie.title).toBe("string");
  });

  it("should respect pagination (page=2)", async () => {
    const res1 = await request(app)
      .get("/movies/popular")
      .query({ api_key: apiKey, page: 1 });
    const res2 = await request(app)
      .get("/movies/popular")
      .query({ api_key: apiKey, page: 2 });

    expect(res1.status).toBe(200);
    expect(res2.status).toBe(200);

    expect(res1.body[0].id).not.toBe(res2.body[0].id);
  });
});

describe("GET /movies/search", () => {
  const apiKey = Buffer.from("secret").toString("base64");

  beforeAll(async () => {
    process.env.ENCODED_API_KEYS = Buffer.from("secret").toString("base64");
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
  it("returns movies with the proper fields", async () => {
    const res = await request(app)
      .get("/movies/search")
      .query({ query: "Movie", api_key: apiKey });

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty("id");
    expect(res.body[0]).toHaveProperty("title");
    expect(res.body[0]).toHaveProperty("releaseDate");
    expect(res.body[0]).toHaveProperty("posterUrl");
    expect(res.body[0]).toHaveProperty("rating");
  });

  it("returns movies matching the title query", async () => {
    const res = await request(app)
      .get("/movies/search")
      .query({ query: "Movie", api_key: apiKey });

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty("id");
    expect(res.body[0]).toHaveProperty("title");
    expect(res.body[0]).toHaveProperty("releaseDate");
    expect(res.body[0]).toHaveProperty("posterUrl");
    expect(res.body[0]).toHaveProperty("rating");
    res.body.forEach((movie: any) => {
      expect(movie.title).toContain("Movie");
    });
  });

  it("respects genre filter", async () => {
    const res = await request(app).get("/movies/search").query({
      query: "Movie",
      filter: "genre:Action",
      api_key: apiKey,
    });

    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body.length).toBeLessThan(100);
  });

  it("respects year filter via combined filter", async () => {
    const res = await request(app).get("/movies/search").query({
      query: "Movie",
      filter: "genre:Action,year:2015",
      api_key: apiKey,
    });

    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    res.body.forEach((movie: { releaseDate: string }) => {
      expect(new Date(movie.releaseDate)?.getUTCFullYear()).toBe(2015);
    });
  });

  it("rejects request with missing API key", async () => {
    const res = await request(app)
      .get("/movies/search")
      .query({ query: "Movie" });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("error");
  });
});

describe("GET /movies/:id", () => {
  const apiKey = Buffer.from("secret").toString("base64");

  let existingId: number;

  beforeAll(async () => {
    process.env.ENCODED_API_KEYS = Buffer.from("secret").toString("base64");
    await prisma.$connect();

    const movie = await prisma.movie.findFirst();
    if (!movie) throw new Error("No movies in DB to test with");

    existingId = movie.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("returns full movie details for a valid ID", async () => {
    const res = await request(app)
      .get(`/movies/${existingId}`)
      .query({ api_key: apiKey });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      title: expect.any(String),
      releaseDate: expect.any(String),
      overview: expect.any(String),
      genres: expect.any(Array),
      rating: expect.any(Number),
      runtime: expect.any(Number),
      language: expect.any(String),
    });
  });

  it("returns 404 for an invalid/nonexistent ID", async () => {
    const res = await request(app)
      .get(`/movies/999999`)
      .query({ api_key: apiKey });

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error");
  });

  it("returns 400 for a non-numeric ID", async () => {
    const res = await request(app)
      .get(`/movies/abc`)
      .query({ api_key: apiKey });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("returns 401 if API key is missing", async () => {
    const res = await request(app).get(`/movies/${existingId}`);
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("error");
  });
});
