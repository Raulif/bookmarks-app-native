import { useQuery, useMutation } from 'convex/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { api } from '@/convex/_generated/api';
import { Bookmark } from '@/types/bookmark';
import { sortByDateAdded, sortByConsumed } from '@/lib/helpers';
import type { Id } from '@/convex/_generated/dataModel';

type ReturnUseBookmarks = {
  bookmarks: Bookmark[];
  updateBookmark: (id: string, consumed: boolean) => void;
};
export const useBookmarks = (): ReturnUseBookmarks => {
  const [collectionId, setCollectionId] = useState<Id<'bookmarks'> | ''>('');
  const updateBookmarks = useMutation(api.bookmarks.put);
  const data = useQuery(api.bookmarks.get);

  const sortedBookmarks = useMemo(() => {
    if (!data?.bookmarks.length) return [];
    const bookmarks = [...(data?.bookmarks || [])];
    const sortedByConsumed = bookmarks.sort(sortByConsumed);
    const firstConsumedIndex = sortedByConsumed.findIndex((bm) => bm.consumed);
    const notConsumed = sortedByConsumed.slice(0, firstConsumedIndex);
    const consumed = sortedByConsumed.slice(firstConsumedIndex, -1);
    return [
      ...notConsumed.sort(sortByDateAdded),
      ...consumed.sort(sortByDateAdded),
    ];
  }, [data?.bookmarks]);

  useEffect(() => {
    if (data?._id && !collectionId) {
      setCollectionId(data._id);
    }
  }, [data]);

  const updateBookmark = useCallback(
    async (id: string, consumed: boolean) => {
      const bookmarks = data?.bookmarks as Bookmark[];
      if (!bookmarks?.length) return;
      const index = bookmarks.findIndex((b: Bookmark) => b.id === id);
      if (index === -1) return;
      bookmarks[index].consumed = consumed;
      if (collectionId) {
        await updateBookmarks({
          id: collectionId,
          bookmarks,
        });
      }
    },
    [data, collectionId]
  );

  return {
    bookmarks: sortedBookmarks || [],
    updateBookmark,
  };
};
