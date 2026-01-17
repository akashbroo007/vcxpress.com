import type {SchemaTypeDefinition} from 'sanity'

import {article} from './article'
import {author} from './author'
import {category} from './category'
import {generalArticle} from './generalArticle'
import {generalCategory} from './generalCategory'

export const schemaTypes: SchemaTypeDefinition[] = [article, generalArticle, generalCategory, category, author]
