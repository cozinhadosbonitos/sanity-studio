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
      description: 'Name of the recipe.',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'The path of the recipe page for its URL. Should be unique.',
      options: {
        source: 'title',
      },
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
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      description:
        'Quick description of the dish. Displayed at the top of the recipe and in previews.',
    },
    {
      name: 'servings',
      title: 'Number of people',
      type: 'number',
      description: 'Number of portions the dish is for.',
      validation: (Rule) => Rule.positive().integer(),
    },
    {
      name: 'prepTime',
      title: 'Preparation time',
      type: 'number',
      description: 'In minutes.',
      validation: (Rule) => Rule.positive().integer(),
    },
    {
      name: 'cookingTime',
      title: 'Cooking time',
      type: 'number',
      description: 'In minutes.',
      validation: (Rule) => Rule.positive().integer(),
    },
    {
      name: 'isSweet',
      title: 'Sweet dish?',
      type: 'boolean',
      description: 'Check if this is a sweet dish.',
    },
    {
      name: 'isSavoury',
      title: 'Savoury dish?',
      type: 'boolean',
      description: 'Check if this is a savoury dish.',
    },
    {
      name: 'courseType',
      title: 'Type of course',
      type: 'string',
      description: 'Starter, main, dessert....',
      options: {
        list: [
          { title: 'Appetizer', value: 'appetizer' },
          { title: 'Dessert', value: 'dessert' },
          { title: 'Main', value: 'main' },
          { title: 'Snack', value: 'snack' },
          { title: 'Starter', value: 'starter' },
        ],
      },
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      description: 'Some keywords/tags to classify recipes.',
      of: [
        {
          type: 'string',
        },
      ],
    },
  ],
}
