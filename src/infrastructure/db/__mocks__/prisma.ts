const mockFindMany = jest.fn();

export const prisma = {
  movie: {
    findMany: mockFindMany,
  },
};

export default prisma;
