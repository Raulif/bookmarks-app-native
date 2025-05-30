import { useQuery } from 'convex/react';
import { useMemo, useState } from 'react';
import { api } from '@/convex/_generated/api';
import { Bookmark } from '@/types/bookmark';
import { sortBookmarksByDateAdded } from '@/lib/helpers';

type ReturnUseBookmarks = {
  bookmarks: Bookmark[];
};
export const useBookmarks = (): ReturnUseBookmarks => {
  const data = useQuery(api.bookmarks.get);
  const sortedBookmarks = [...data?.bookmarks || []].sort(sortBookmarksByDateAdded)
  return {
    bookmarks: sortedBookmarks || [],
  };
};
