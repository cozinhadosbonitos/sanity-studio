import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import schemas from './schemas/schema'

export default defineConfig({
  title: 'Cozinha dos Bonitos',
  projectId: 'nufe3788',
  dataset: 'production',
  plugins: [structureTool(), visionTool()],
  schema: {
    types: schemas,
  },
})
