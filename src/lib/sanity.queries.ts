export const ARTICLES_LIST_QUERY = /* groq */ `
  *[_type == "article" && status == "published"]|order(coalesce(publishedDate, publishedAt, _createdAt) desc){
    _id,
    title,
    "slug": slug.current,
    summary,
    companyName,
    fundingAmount,
    fundingRound,
    "publishedDate": coalesce(publishedDate, publishedAt, _createdAt),
    sourceURL,
    featuredImage{
      crop,
      hotspot,
      asset->{
        _id,
        url,
        metadata{dimensions{width,height}}
      }
    },
    seoTitle,
    seoDescription,
    "categories": select(
      defined(categories) => categories[]->{
        _id,
        "name": coalesce(name, title),
        "slug": slug.current
      },
      defined(category) => [category->{
        _id,
        "name": coalesce(name, title),
        "slug": slug.current
      }],
      []
    ),
    "category": select(
      defined(categories[0]) => categories[0]->{
        _id,
        "name": coalesce(name, title),
        "slug": slug.current
      },
      defined(category) => category->{
        _id,
        "name": coalesce(name, title),
        "slug": slug.current
      },
      null
    )
  }
`

export const NEWS_RECOMMENDED_NEXT_QUERY = /* groq */ `
  *[
    _type == "article" &&
    status == "published" &&
    _id != $currentId &&
    (
      (defined(categories) && $categoryId in categories[]._ref) ||
      (defined(category) && category._ref == $categoryId)
    )
  ]|order(coalesce(publishedDate, publishedAt, _createdAt) desc)[0...$limit]{
    _id,
    title,
    "slug": slug.current,
    summary,
    companyName,
    fundingRound,
    "publishedDate": coalesce(publishedDate, publishedAt, _createdAt),
    featuredImage{
      crop,
      hotspot,
      asset->{
        _id,
        url,
        metadata{dimensions{width,height}}
      }
    },
    "category": select(
      defined(categories[0]) => categories[0]->{
        _id,
        "name": coalesce(name, title),
        "slug": slug.current
      },
      defined(category) => category->{
        _id,
        "name": coalesce(name, title),
        "slug": slug.current
      },
      null
    )
  }
`

export const LATEST_FEATURED_ARTICLE_QUERY = /* groq */ `
  *[_type == "article" && status == "published"]|order(coalesce(publishedDate, publishedAt, _createdAt) desc)[0]{
    _id,
    title,
    "slug": slug.current,
    summary,
    companyName,
    fundingAmount,
    fundingRound,
    "publishedDate": coalesce(publishedDate, publishedAt, _createdAt),
    sourceURL,
    featuredImage{
      crop,
      hotspot,
      asset->{
        _id,
        url,
        metadata{dimensions{width,height}}
      }
    },
    seoTitle,
    seoDescription,
    "categories": select(
      defined(categories) => categories[]->{
        _id,
        "name": coalesce(name, title),
        "slug": slug.current
      },
      defined(category) => [category->{
        _id,
        "name": coalesce(name, title),
        "slug": slug.current
      }],
      []
    ),
    "category": select(
      defined(categories[0]) => categories[0]->{
        _id,
        "name": coalesce(name, title),
        "slug": slug.current
      },
      defined(category) => category->{
        _id,
        "name": coalesce(name, title),
        "slug": slug.current
      },
      null
    )
  }
`

export const LATEST_NEWS_EXCLUDING_FEATURED_QUERY = /* groq */ `
  *[_type == "article" && status == "published" && _id != $featuredId]|order(coalesce(publishedDate, publishedAt, _createdAt) desc)[0...$limit]{
    _id,
    title,
    "slug": slug.current,
    summary,
    companyName,
    fundingAmount,
    fundingRound,
    "publishedDate": coalesce(publishedDate, publishedAt, _createdAt),
    sourceURL,
    featuredImage{
      crop,
      hotspot,
      asset->{
        _id,
        url,
        metadata{dimensions{width,height}}
      }
    },
    seoTitle,
    seoDescription,
    "categories": select(
      defined(categories) => categories[]->{
        _id,
        "name": coalesce(name, title),
        "slug": slug.current
      },
      defined(category) => [category->{
        _id,
        "name": coalesce(name, title),
        "slug": slug.current
      }],
      []
    ),
    "category": select(
      defined(categories[0]) => categories[0]->{
        _id,
        "name": coalesce(name, title),
        "slug": slug.current
      },
      defined(category) => category->{
        _id,
        "name": coalesce(name, title),
        "slug": slug.current
      },
      null
    )
  }
`

export const LATEST_NEWS_SIDEBAR_QUERY = /* groq */ `
  *[_type == "article" && status == "published" && slug.current != $slug]|order(coalesce(publishedDate, publishedAt, _createdAt) desc)[0...$limit]{
    _id,
    title,
    "slug": slug.current,
    "publishedDate": coalesce(publishedDate, publishedAt, _createdAt),
    featuredImage{
      crop,
      hotspot,
      asset->{
        _id,
        url,
        metadata{dimensions{width,height}}
      }
    },
    "category": select(
      defined(categories[0]) => categories[0]->{
        _id,
        "name": coalesce(name, title),
        "slug": slug.current
      },
      defined(category) => category->{
        _id,
        "name": coalesce(name, title),
        "slug": slug.current
      },
      null
    )
  }
`

export const ARTICLE_BY_SLUG_QUERY = /* groq */ `
  *[_type == "article" && slug.current == $slug && status == "published"][0]{
    _id,
    title,
    "slug": slug.current,
    summary,
    body,
    companyName,
    fundingAmount,
    fundingRound,
    publishedDate,
    sourceURL,
    featuredImage{
      crop,
      hotspot,
      asset->{
        _id,
        url,
        metadata{dimensions{width,height}}
      }
    },
    seoTitle,
    seoDescription,
    "categories": select(
      defined(categories) => categories[]->{
        _id,
        "name": coalesce(name, title),
        "slug": slug.current
      },
      defined(category) => [category->{
        _id,
        "name": coalesce(name, title),
        "slug": slug.current
      }],
      []
    ),
    "category": select(
      defined(categories[0]) => categories[0]->{
        _id,
        "name": coalesce(name, title),
        "slug": slug.current
      },
      defined(category) => category->{
        _id,
        "name": coalesce(name, title),
        "slug": slug.current
      },
      null
    )
  }
`

export const CATEGORIES_LIST_QUERY = /* groq */ `
  *[_type == "category"]|order(name asc){
    _id,
    "name": coalesce(name, title),
    "slug": slug.current,
    description
  }
`

export const CATEGORIES_PAGED_QUERY = /* groq */ `
  {
    "total": count(*[_type == "category"]),
    "items": *[_type == "category"]|order(name asc)[$start...$end]{
      _id,
      "name": coalesce(name, title),
      "slug": slug.current,
      description
    }
  }
`

export const CATEGORY_BY_SLUG_WITH_ARTICLES_QUERY = /* groq */ `
  *[_type == "category" && slug.current == $slug][0]{
    _id,
    "name": coalesce(name, title),
    "slug": slug.current,
    description,
    "articles": *[_type == "article" && status == "published" && (references(^._id) || category._ref == ^._id || ^._id in categories[]._ref)]|order(coalesce(publishedDate, publishedAt, _createdAt) desc){
      _id,
      title,
      "slug": slug.current,
      summary,
      "publishedDate": coalesce(publishedDate, publishedAt, _createdAt),
      companyName,
      fundingAmount,
      fundingRound,
      featuredImage{
        crop,
        hotspot,
        asset->{
          _id,
          url,
          metadata{dimensions{width,height}}
        }
      }
    }
  }
`

export const AUTHORS_LIST_QUERY = /* groq */ `
  *[_type == "author"]|order(name asc){
    _id,
    name,
    "slug": slug.current
  }
`

export const AUTHOR_BY_SLUG_QUERY = /* groq */ `
  *[_type == "author" && slug.current == $slug][0]{
    _id,
    name,
    "slug": slug.current
  }
`

export const LEARN_CATEGORIES_LIST_QUERY = /* groq */ `
  *[_type == "generalCategory"]|order(coalesce(order, 9999) asc, title asc){
    _id,
    title,
    "slug": slug.current,
    description,
    tags,
    order
  }
`

export const LEARN_LATEST_ARTICLES_QUERY = /* groq */ `
  *[_type == "learnArticle" && !(_id in path("drafts.**"))]|order(_createdAt desc)[0...12]{
    _id,
    title,
    "slug": slug.current,
    summary,
    coverImage,
    tags,
    "category": coalesce(learnCategories[0], learnCategory)->{
      _id,
      title,
      "slug": slug.current
    },
    "categories": learnCategories[]->{
      _id,
      title,
      "slug": slug.current
    }
  }
`

export const LEARN_CATEGORY_ARTICLES_QUERY = /* groq */ `
  *[_type == "learnArticle" && !(_id in path("drafts.**")) && ($categorySlug in learnCategories[]->slug.current || learnCategory->slug.current == $categorySlug)]|order(_createdAt desc){
    _id,
    title,
    "slug": slug.current,
    summary,
    coverImage,
    tags,
    "category": coalesce(learnCategories[0], learnCategory)->{
      _id,
      title,
      "slug": slug.current
    },
    "categories": learnCategories[]->{
      _id,
      title,
      "slug": slug.current
    }
  }
`

export const LEARN_ARTICLE_BY_CATEGORY_AND_SLUG_QUERY = /* groq */ `
  *[_type == "learnArticle" && !(_id in path("drafts.**")) && ($categorySlug in learnCategories[]->slug.current || learnCategory->slug.current == $categorySlug) && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    summary,
    content,
    coverImage,
    tags,
    "category": coalesce(learnCategories[0], learnCategory)->{
      _id,
      title,
      "slug": slug.current,
      description
    },
    "categories": learnCategories[]->{
      _id,
      title,
      "slug": slug.current
    },
    seo{
      metaTitle,
      metaDescription
    }
  }
`

export const LEARN_READ_NEXT_QUERY = /* groq */ `
  *[_type == "learnArticle" && !(_id in path("drafts.**")) && ($categoryId in learnCategories[]._ref || learnCategory._ref == $categoryId) && _id != $currentId]|order(_createdAt desc)[0...4]{
    _id,
    title,
    "slug": slug.current,
    summary,
    coverImage,
    tags,
    "category": coalesce(learnCategories[0], learnCategory)->{
      _id,
      title,
      "slug": slug.current
    },
    "categories": learnCategories[]->{
      _id,
      title,
      "slug": slug.current
    }
  }
`
