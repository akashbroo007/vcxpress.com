import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './sanity/schemaTypes'
import {deskStructure} from './sanity/deskStructure'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET

if (!projectId) {
  throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID')
}

if (!dataset) {
  throw new Error('Missing NEXT_PUBLIC_SANITY_DATASET')
}

export default defineConfig({
  name: 'default',
  title: 'VC Express',
  basePath: '/studio',
  projectId,
  dataset,
  plugins: [deskTool({structure: deskStructure}), visionTool()],
  schema: {
    types: schemaTypes,
  },
})
