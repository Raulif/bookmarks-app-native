import { Bookmark } from '@/types/bookmark';
export const formatDate = (date: number) =>
  new Date(date).toLocaleString('de', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

export const isHearable = (u: string) => {
  const url = new URL(u);
  const isGithubRepo = url.host.includes('github.com');
  if (isGithubRepo) return false;
  return true;
};

export const sortByDateAdded = (a: Bookmark, b: Bookmark) =>
  a.dateAdded - b.dateAdded;

export const sortByConsumed = (a: Bookmark, b: Bookmark) => 
  a.consumed ? 1 : b.consumed ? -1 : 0;
;
