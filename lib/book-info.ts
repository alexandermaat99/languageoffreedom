export type PreviousBook = {
  title: string;
  url?: string;
};

export function getPreviousBooks(bookInfo: {
  previousBooks?: PreviousBook[];
  previousBook?: string;
  previousBookUrl?: string;
} | null | undefined): PreviousBook[] {
  if (!bookInfo) return [];

  if (Array.isArray(bookInfo.previousBooks) && bookInfo.previousBooks.length > 0) {
    return bookInfo.previousBooks.filter((book) => book?.title?.trim());
  }

  if (bookInfo.previousBook?.trim()) {
    return [{ title: bookInfo.previousBook, url: bookInfo.previousBookUrl }];
  }

  return [];
}
