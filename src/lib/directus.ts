import { createDirectus, graphql } from "@directus/sdk";

interface Article {
  id: number;
  status: string;
  title: string;
  slug: string;
  publishedAt: string;
  author: Author;
  description: string;
  readingTime: number;
  tags: Tag[];
  cover: string;
  coverColor: string;
  contentFlexible: object;
  titleForRelatedArticlesSection: string;
  relatedArticles: Article[];
}

interface Author {
  id: number;
  name: string;
  slug: string;
}

interface Tag {
  id: number;
  name: string;
  slug: string;
}

interface Schema {
  articles: Article[];
  tags: Tag[];
  authors: Author[];
}

const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL;
const directus = createDirectus<Schema>(directusUrl || "").with(graphql());

export default directus;
