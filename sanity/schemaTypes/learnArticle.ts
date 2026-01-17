import {BookIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const learnArticle = defineType({
  name: 'learnArticle',
  title: 'Learn Articles',
  type: 'document',
  icon: BookIcon,
  description: 'Evergreen educational content for the Learn section (separate from News).',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [{type: 'block'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'learnCategory',
      title: 'Learn Category',
      type: 'reference',
      to: [{type: 'generalCategory'}],
      hidden: true,
    }),
    defineField({
      name: 'learnCategories',
      title: 'Learn Categories',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'generalCategory'}]}],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        defineField({
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string',
        }),
        defineField({
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          rows: 3,
        }),
      ],
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{type: 'author'}],
      description: 'Defaults to VCXpress if left empty.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'learnCategories.0.title',
    },
  },
})
