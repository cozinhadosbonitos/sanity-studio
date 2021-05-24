import { GrOrderedList } from 'react-icons/gr'

export default {
  name: 'recipe',
  title: 'Recipe',
  type: 'document',
  icon: GrOrderedList,
  preview: {
    select: { title: 'title' },
  },
  initialValue: () => ({
    createdAt: new Date().toISOString(),
  }),
  orderings: [
    {
      title: 'Date',
      name: 'createdDesc',
      by: [{ field: 'createdAt', direction: 'desc' }],
    },
  ],
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'photo',
      title: 'Photo',
      type: 'image',
    },
    {
      name: 'createdAt',
      title: 'Date created',
      type: 'datetime',
      hidden: true,
    },
    {
      name: 'ingredients',
      title: 'Ingredients',
      type: 'array',
      of: [
        {
          type: 'ingredient',
        },
      ],
    },
    {
      name: 'steps',
      title: 'Steps',
      type: 'array',
      of: [
        {
          type: 'text',
        },
      ],
    },
  ],
}
