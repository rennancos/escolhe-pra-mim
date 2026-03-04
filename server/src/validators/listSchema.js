const { z } = require('zod');
const { LIST_TYPES, CONTENT_TYPES } = require('../utils/constants');

const contentSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1),
  type: z.enum([CONTENT_TYPES.MOVIE, CONTENT_TYPES.SERIES]),
  overview: z.string().optional(),
  poster_path: z.string().optional().or(z.string().optional()), // poster_path or posterPath
  posterPath: z.string().optional(),
  rating: z.number().optional(),
  year: z.number().optional(),
  genres: z.array(z.string()).optional(),
  streaming: z.array(z.string()).optional()
});

const addToListSchema = z.object({
  body: z.object({
    content: contentSchema,
    listType: z.enum([LIST_TYPES.WATCHLIST, LIST_TYPES.WATCHED])
  })
});

const removeFromListSchema = z.object({
  params: z.object({
    contentId: z.string().regex(/^\d+$/).transform(Number),
    listType: z.enum([LIST_TYPES.WATCHLIST, LIST_TYPES.WATCHED])
  })
});

module.exports = {
  addToListSchema,
  removeFromListSchema
};
