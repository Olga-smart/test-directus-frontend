import Link from "next/link";
import directus from "@/lib/directus";
import styles from "./page.module.css";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

type Tag = {
  id: number;
  name: string;
  slug: string;
};

export default async function Page(props: { searchParams: SearchParams }) {
  const params = await props.searchParams;
  const currentPage =
    typeof params.page === "string" ? parseInt(params.page) : 1;
  const itemsPerPage = 10;

  const data = await directus.query(
    `query TagsWithCount($page: Int, $limit: Int, $sort: [String]) {
      tags(sort: $sort, limit: $limit, page: $page) {
        name
        slug
      }
      tags_aggregated {
        count {
          id
        }
      }
    }`,
    {
      sort: "name",
      limit: itemsPerPage,
      page: currentPage,
    }
  );

  const tags = data.tags;
  const numberOfPages = Math.ceil(
    data.tags_aggregated[0].count.id / itemsPerPage
  );

  const pages = [];
  for (let i = 1; i <= numberOfPages; i++) {
    pages.push(i);
  }

  return (
    <div className="container">
      <h1 className={styles.heading}>All tags</h1>
      {Array.isArray(tags) &&
        tags.map((tag: Tag) => (
          <Link
            key={tag.slug}
            href={`/magazine/tags/${tag.slug}`}
            className={styles.tag}
          >
            #{tag.name}
          </Link>
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
