import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import directus from "@/lib/directus";
import styles from "./page.module.css";

type Params = Promise<{ slug: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

type Tag = {
  name: string;
  slug: string;
};

type Article = {
  cover: {
    id: string;
  };
  title: string;
  slug: string;
  author: {
    name: string;
    duty: string | null;
  };
  tags: [
    {
      tags_id: {
        name: string;
        slug: string;
      };
    }
  ];
};

const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL;

export default async function Page(props: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { slug } = await props.params;
  const { page } = await props.searchParams;
  const currentPage = typeof page === "string" ? parseInt(page) : 1;
  const itemsPerPage = 6;

  const tagsData = await directus.query(
    `query Tags {
      tags(sort: "name") {
        name
        slug
      }
    }`,
    {}
  );
  const tags = tagsData.tags;

  if (!tags.find((tag: Tag) => tag.slug === slug)) {
    notFound();
  }

  const articlesData = await directus.query(
    `query ArticlesWithFilterAndCount(
        $page: Int
        $limit: Int
        $sort: [String]
        $tagSlug: String!
      ) {
        articles(
          sort: $sort
          limit: $limit
          page: $page
          filter: { tags: { tags_id: { slug: { _eq: $tagSlug } } } }
        ) {
          cover {
            id
          }
          title
          slug
          author {
            name
            duty
          }
          tags {
            tags_id {
              name
              slug
            }
          }
        }
        articles_aggregated(
          filter: { tags: { tags_id: { slug: { _eq: $tagSlug } } } }
        ) {
          count {
            id
          }
        }
      }`,
    {
      sort: "-publishedAt",
      limit: itemsPerPage,
      page: currentPage,
      tagSlug: slug,
    }
  );

  const articles = articlesData.articles;
  const numberOfPages = Math.ceil(
    articlesData.articles_aggregated[0].count.id / itemsPerPage
  );

  const pages = [];
  for (let i = 1; i <= numberOfPages; i++) {
    pages.push(i);
  }

  return (
    <div className="container">
      <h1 className={styles.pageTitle}>Sharing needed important</h1>
      <div className={styles.tags}>
        {tags.map((tag: Tag) => (
          <Link
            key={tag.slug}
            href={`/magazine/tags/${tag.slug}`}
            className={`${styles.tag} ${
              tag.slug === slug ? styles.currentTag : ""
            }`}
          >
            #{tag.name}
          </Link>
        ))}
      </div>
      <div className={styles.articles}>
        {articles.map((article: Article) => (
          <div key={article.slug} className={styles.articleCard}>
            <Image
              className={styles.articleImage}
              src={`${directusUrl}/assets/${article.cover.id}`}
              alt={""}
              width="400"
              height="300"
            />
            <h2 className={styles.articleTitle}>
              <Link href={`/magazine/article/${article.slug}`}>
                {article.title}
              </Link>
            </h2>
            {typeof article.author === "object" && (
              <div className={styles.articleAuthor}>{article.author.name}</div>
            )}
            <div className={styles.articleMeta}>
              <span className={styles.articleType}>Articles</span>
              {article.tags?.map((tag) => (
                <Link
                  href={`/magazine/tags/${tag.tags_id.slug}`}
                  key={tag.tags_id.slug}
                  className={styles.articleTag}
                >
                  #{tag.tags_id.name}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      {pages.length > 1 && (
        <div className={styles.pagination}>
          {pages.map((page) => (
            <a
              href={`?page=${page}`}
              key={page}
              className={`${styles.page} ${
                currentPage === page ? styles.currentPage : ""
              }`}
            >
              {page}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
