import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import schemas from './schemas/schema'

export default defineConfig({
  title: 'Cozinha dos Bonitos',
  projectId: 'nufe3788',
  dataset: 'production',
  plugins: [deskTool()],
  schema: {
    types: schemas,
  },
})
