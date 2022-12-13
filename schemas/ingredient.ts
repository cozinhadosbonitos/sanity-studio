import { Rule } from 'sanity'

export default {
  name: 'ingredient',
  title: 'Ingredient',
  type: 'object',
  fields: [
    {
      name: 'display',
      title: 'Display',
      type: 'string',
      description:
        'As it should be displayed in the recipe. Typically the ' +
        'quantity + name (e.g. "3 eggs", "100g of flour")',
      validation: (rule: Rule) => rule.required(),
    },
    {
      name: 'food',
      title: 'Food',
      type: 'reference',
      to: [{ type: 'food' }],
      validation: (rule: Rule) => rule.required(),
    },
  ],
}
