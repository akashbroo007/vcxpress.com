import {defineField, defineType} from 'sanity'

export const article = defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
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
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [{type: 'block'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'companyName',
      title: 'Company Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'fundingAmount',
      title: 'Funding Amount',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'fundingRound',
      title: 'Funding Round',
      type: 'string',
      options: {
        list: [
          {title: 'Angel', value: 'Angel'},
          {title: 'Pre-Seed', value: 'Pre-Seed'},
          {title: 'Seed', value: 'Seed'},
          {title: 'Convertible Note', value: 'Convertible Note'},
          {title: 'Series A', value: 'Series A'},
          {title: 'Series B', value: 'Series B'},
          {title: 'Series C', value: 'Series C'},
          {title: 'Series D', value: 'Series D'},
          {title: 'Series E', value: 'Series E'},
          {title: 'Series F', value: 'Series F'},
          {title: 'Series G', value: 'Series G'},
          {title: 'Series H', value: 'Series H'},
          {title: 'Series I', value: 'Series I'},
          {title: 'Series J', value: 'Series J'},
          {title: 'Series K', value: 'Series K'},
          {title: 'Series L', value: 'Series L'},
          {title: 'Series M', value: 'Series M'},
          {title: 'Series N', value: 'Series N'},
          {title: 'Series O', value: 'Series O'},
          {title: 'Series P', value: 'Series P'},
          {title: 'Grant', value: 'Grant'},
          {title: 'Extension Rounds', value: 'Extension Rounds'},
          {title: 'Venture Debt', value: 'Venture Debt'},
          {title: 'Non-Dilutive funding', value: 'Non-Dilutive funding'},
          {title: 'Growth Capital', value: 'Growth Capital'},
          {title: 'Acquisition', value: 'Acquisition'},
          {title: 'Mergers', value: 'Mergers'},
          {title: 'Pre-IPO', value: 'Pre-IPO'},
          {title: 'IPO', value: 'IPO'},
          {title: 'Unspecified', value: 'Unspecified'},
          {title: 'Combination Round', value: 'Combination Round'},
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'category'}],
        },
      ],
      validation: (rule) =>
        rule.custom((value, context) => {
          const hasNew = Array.isArray(value) && value.length > 0
          const doc = context.document as {category?: unknown} | undefined
          const legacyCategory = doc?.category
          const hasLegacy = Boolean(legacyCategory)
          if (hasNew || hasLegacy) return true
          return 'Select at least one category'
        }),
    }),
    defineField({
      name: 'category',
      title: 'Category (Legacy)',
      type: 'reference',
      to: [{type: 'category'}],
      hidden: true,
    }),
    defineField({
      name: 'publishedDate',
      title: 'Published Date',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'sourceURL',
      title: 'Source URL',
      type: 'url',
      validation: (rule) => rule.required().uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'Draft', value: 'draft'},
          {title: 'Published', value: 'published'},
        ],
        layout: 'radio',
      },
      initialValue: 'draft',
      validation: (rule) => rule.required(),
    }),
  ],
})
