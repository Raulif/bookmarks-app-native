import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

const Bookmark = v.object({
  id: v.string(),
  title: v.string(),
  url: v.string(),
  dateAdded: v.number(),
  consumed: v.boolean(),
  createdAt: v.number(),
  hearable: v.boolean()
});
export const post = mutation({
  handler: async (ctx, args) => {
    return await ctx.db.insert('bookmarks', { bookmarks: args.bookmarks });
  },
});

export const get = query({
  args: {},
  handler: async (ctx) => {
    const response = await ctx.db.query('bookmarks').collect();
    return response[0];
  },
});

export const put = mutation({
  args: {
    id: v.id('bookmarks'),
    bookmarks: v.array(Bookmark),
  },
  handler: async (ctx, args) => {
    const { id, bookmarks } = args;
    return await ctx.db.patch(id, { bookmarks });
  },
});
