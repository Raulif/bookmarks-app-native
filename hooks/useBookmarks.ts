import { useQuery } from 'convex/react';
import { useMemo, useState } from 'react';
import { api } from '@/convex/_generated/api';
import { Bookmark } from '@/types/bookmark';

export const useBookmarks = () => {
  const data = useQuery(api.bookmarks.get)

  return {
    bookmarks: data?.bookmarks || []
  }
}