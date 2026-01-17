import {BookIcon, DocumentTextIcon, TagIcon, UserIcon} from '@sanity/icons'
import type {StructureResolver} from 'sanity/desk'

export const deskStructure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.documentTypeListItem('article').title('Article').icon(DocumentTextIcon),
      S.documentTypeListItem('generalArticle').title('General Articles').icon(BookIcon),
      S.documentTypeListItem('generalCategory').title('General Categories').icon(TagIcon),
      S.divider(),
      S.documentTypeListItem('category').title('Category').icon(TagIcon),
      S.documentTypeListItem('author').title('Author').icon(UserIcon),
    ])
