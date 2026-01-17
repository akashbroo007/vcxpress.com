import type {SchemaTypeDefinition} from 'sanity'

import {article} from './article'
import {author} from './author'
import {category} from './category'
import {generalCategory} from './generalCategory'
import {learnArticle} from './learnArticle'

export const schemaTypes: SchemaTypeDefinition[] = [article, learnArticle, generalCategory, category, author]
