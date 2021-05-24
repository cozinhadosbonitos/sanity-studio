export default {
  name: 'ingredient',
  title: 'Ingredient',
  type: 'object',
  fields: [
    {
      name: 'display',
      title: 'Display',
      type: 'string',
    },
    {
      name: 'food',
      title: 'Food',
      type: 'reference',
      to: [{ type: 'food' }],
    },
  ],
}
