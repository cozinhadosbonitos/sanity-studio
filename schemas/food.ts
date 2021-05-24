import { IoFastFood } from 'react-icons/io5'
import { GrCafeteria } from 'react-icons/gr'

export default {
  name: 'food',
  title: 'Food',
  type: 'document',
  icon: GrCafeteria,
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
    },
    {
      name: 'photo',
      title: 'Photo',
      type: 'image',
    },
  ],
  preview: {
    select: { title: 'name', media: 'photo' },
  },
}
