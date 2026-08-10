import { defineQuery } from "next-sanity";

export const POSTS_QUERY = defineQuery(`
  *[_type == "newsStories" 
    && ($search == null || title match "*" + $search + "*" || pt::text(body) match "*" + $search + "*")
    && ($category == null || category == $category)
    && ($tag == null || $tag in tags)
  ] | order(_createdAt desc) [$start..$end] {
    _id,
    title,
    slug,
    "author": {
      "name": author
    },
    category,
    tags,
    "publishedAt": _createdAt,
    "mainImage": image,
    "thumbnail": thumbnail,
    "description": pt::text(body)[0...220],
    body
  }
`);

export const POST_QUERY = defineQuery(`
  *[_type == "newsStories" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    "author": {
      "name": author
    },
    category,
    tags,
    "publishedAt": _createdAt,
    "mainImage": image,
    "description": pt::text(body)[0...220],
    body,

    "comments": *[
      _type == "comment" 
      && post._ref == ^._id 
      && approved == true
    ] | order(_createdAt desc) {
      name,
      comment,
      _createdAt
    }
  }
`);

export const LATEST_NEWS_QUERY = defineQuery(`
  *[_type == "newsStories"] | order(_createdAt desc) [0..2] {
    title,
    slug,
    "author": {
      "name": coalesce(author->name, author)
    },
    "publishedAt": _createdAt,
    "commentsCount": count(*[_type == "comment" && post._ref == ^._id && approved == true])
  }
`);

export const CATEGORIES_QUERY = defineQuery(`
  *[_type == "category"] {
    title,
    "count": count(*[_type == "newsStories" && references(^._id)])
  }
`);

export const TAGS_QUERY = defineQuery(`
  array::unique(*[_type == "newsStories"].tags[])
`);


export const PROJECTS_QUERY = defineQuery(`
  *[_type == "project"] | order(_createdAt desc) {
    _id,
    title,
    category,
    slug,
    mainImage,
    body
  }
`);

export const LAUNCH_PORTFOLIO_QUERY = defineQuery(`
  *[_type == "project"] | order(_createdAt desc) [0...6] {
    _id,
    title,
    category,
    slug,
    mainImage,
    "description": pt::text(body)[0...160]
  }
`);

export const PROJECT_QUERY = defineQuery(`
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    category,
    slug,
    mainImage,
    body,
    _createdAt
  }
`);
