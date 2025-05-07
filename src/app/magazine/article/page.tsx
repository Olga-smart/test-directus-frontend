import Image from "next/image";
import Link from "next/link";
import directus from "@/lib/directus";
import { formatDate } from "@/lib/utils";
import styles from "./page.module.css";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

type Article = {
  cover: {
    id: string;
  };
  tags: [
    {
      tags_id: {
        name: string;
        slug: string;
      };
    }
  ];
  publishedAt: string;
  title: string;
  slug: string;
  description: string;
  author: {
    name: string;
    duty: string | null;
  };
};

const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL;

export default async function Page(props: { searchParams: SearchParams }) {
  const params = await props.searchParams;
  const currentPage =
    typeof params.page === "string" ? parseInt(params.page) : 1;
  const itemsPerPage = 6;

  const data = await directus.query(
    `query ArticlesWithCount($page: Int, $limit: Int, $sort: [String]) {
      articles(sort: $sort, limit: $limit, page: $page) {
        cover {
          id
        }
        tags {
          tags_id {
            name
            slug
          }          
        }
        publishedAt
        title
        slug
        description
        author {
          name
          duty
        }
      }
      articles_aggregated {
        count {
          id
        }
      }
    }`,
    {
      sort: "-publishedAt",
      limit: itemsPerPage,
      page: currentPage,
    }
  );

  const articles = data.articles;
  const numberOfPages = Math.ceil(
    data.articles_aggregated[0].count.id / itemsPerPage
  );

  const pages = [];
  for (let i = 1; i <= numberOfPages; i++) {
    pages.push(i);
  }

  return (
    <div className="container">
      <h1 className={styles.heading}>All materials</h1>
      {articles.map((article: Article) => (
        <div key={article.slug} className={styles.articleCard}>
          <Image
            className={styles.articleImage}
            src={`${directusUrl}/assets/${article.cover.id}`}
            alt={""}
            width="500"
            height="300"
          />
          <div className={styles.articleMeta}>
            <span className={styles.articleType}>Articles</span>
            {article.tags?.map(
              (tag) =>
                typeof tag === "object" && (
                  <Link
                    href={`/magazine/tags/${tag.tags_id.slug}`}
                    key={tag.tags_id.slug}
                    className={styles.articleTag}
                  >
                    #{tag.tags_id.name}
                  </Link>
                )
            )}
            <span className={styles.articleDate}>
              {formatDate(new Date(article.publishedAt))}
            </span>
          </div>
          <h2 className={styles.articleTitle}>
            <Link href={`/magazine/article/${article.slug}`}>
              {article.title}
            </Link>
          </h2>
          <div className={styles.articleDescription}>{article.description}</div>
          {typeof article.author === "object" && (
            <div className={styles.articleAuthor}>{article.author.name}</div>
          )}
        </div>
      ))}
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
