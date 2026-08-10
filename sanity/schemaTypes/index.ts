import { type SchemaTypeDefinition } from 'sanity'
import { news } from '@/sanity/schemaTypes/news'
import { contact } from '@/sanity/schemaTypes/contact'
import { author } from '@/sanity/schemaTypes/author'
import { comment } from '@/sanity/schemaTypes/comment'
import { blockContent } from '@/sanity/schemaTypes/blockContent'

import { project } from '@/sanity/schemaTypes/project'
import { businessRegistration } from './businessRegistrations'
import { lead } from './lead'
import { payment } from './payment'
import { onboarding } from './onboarding'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    news,
    contact,
    author,
    comment,
    project,
    blockContent,
    businessRegistration,
    lead,
    payment,
    onboarding,
  ],
}
