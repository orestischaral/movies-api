import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const genres = ["Action", "Drama", "Comedy", "Thriller", "Sci-Fi", "Fantasy"];

  // Create genres
  const genreRecords = await Promise.all(
    genres.map((name) =>
      prisma.genre.upsert({
        where: { name },
        update: {},
        create: { name },
      })
    )
  );

  // Create 100 sample movies
  for (let i = 1; i <= 100; i++) {
    const movie = await prisma.movie.create({
      data: {
        title: `Movie ${i}`,
        releaseDate: new Date(2000 + (i % 20), 0, 1),
        posterUrl: `https://example.com/posters/movie-${i}.jpg`,
        fullPosterUrl: `https://cdn.example.com/full/movie-${i}.jpg`,
        overview: `Overview for Movie ${i}`,
        rating: parseFloat((Math.random() * 5 + 5).toFixed(1)), // 5.0–10.0
        runtime: 90 + (i % 30),
        language: ["en", "es", "fr", "de"][i % 4],
        genres: {
          create: [
            {
              genre: {
                connect: { name: genreRecords[i % genres.length].name },
              },
            },
          ],
        },
      },
    });

    console.log(`Seeded: ${movie.title}`);
  }
}

main()
  .then(() => {
    console.log("✅ Seeding complete");
    return prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
