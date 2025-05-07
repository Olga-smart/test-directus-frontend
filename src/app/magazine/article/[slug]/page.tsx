import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { clsx } from "clsx";
import directus from "@/lib/directus";
import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import { Link as TipTapLink } from "@tiptap/extension-link";
import { formatDate } from "@/lib/utils";
import styles from "./page.module.css";
import { SubscribePanel } from "@/components/SubscribePanel";
import { AdvertisementPanel } from "@/components/AdvertisementPanel";
import { Picture, ImageBlock } from "@/components/Picture";
import { Advertising, AdvertisingBlock } from "@/components/Advertising";
import { Quote, QuoteBlock } from "@/components/Quote";
import { Lead, LeadBlock } from "@/components/Lead";
import { Code, CodeBlock } from "@/components/Code";

type Params = Promise<{ slug: string }>;

type Article = {
  id: number;
  title: string;
  cover: {
    id: string;
  };
  coverColor: string;
  author: {
    name: string;
    duty: string | null;
  };
  publishedAt: string;
  readingTime: number;
  contentFlexible: {
    type: "doc";
    content: ProseMirrorNode[];
  };
  tags: [
    {
      tags_id: {
        name: string;
        slug: string;
      };
    }
  ];
  titleForRelatedArticlesSection: string | null;
  relatedArticles: RelatedArticle[] | [];
};

type ProseMirrorNode = {
  type: string;
  attrs?: {
    id?: string;
    collection?: string;
    [key: string]: unknown;
  };
  content?: ProseMirrorNode[];
};

type RelatedArticle = {
  related_articles_id: {
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
    title: string;
    slug: string;
    author: {
      name: string;
      duty: string | null;
    };
  };
};

type CustomBlocks = BlockItem[];

type BlockItem =
  | { id: string; collection: "block_lead"; item: LeadBlock }
  | { id: string; collection: "block_image"; item: ImageBlock }
  | { id: string; collection: "block_advertising"; item: AdvertisingBlock }
  | { id: string; collection: "block_code"; item: CodeBlock }
  | { id: string; collection: "block_quote"; item: QuoteBlock };

const getBlockProps = (id: string, blocks: CustomBlocks) => {
  const block = blocks.find((item) => item.id === id);
  return block?.item;
};

const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL;

export default async function Page({ params }: { params: Params }) {
  const { slug } = await params;

  const articlesData = await directus.query(
    `query ArticleBySlug($slug: String!) {
        articles(filter: { slug: { _eq: $slug } }) {
          id
          title
          cover {
            id
          }
          coverColor
          author {
            name
            duty
          }
          publishedAt
          readingTime
          contentFlexible
          tags {
            tags_id {
              name
              slug
            }
          }
          titleForRelatedArticlesSection
          relatedArticles {
            related_articles_id {
              cover {
                id
              }
              tags {
                tags_id {
                  name
                  slug
                }
              }
              title
              slug
              author {
                name
                duty
              }
            }
          }
        }
      }`,
    {
      slug: slug,
    }
  );
  const article: Article = articlesData.articles[0];

  if (!article) {
    notFound();
  }

  const customBlocksData = await directus.query(
    `query CustomBlocks($articleId: GraphQLStringOrFloat!) {
      article_blocks(filter: { articles_id: { id: { _eq: $articleId } } }) {
        id
        collection
        item {
          ... on block_lead {
            text
          }
          ... on block_image {
            image {
              id
              width
              height
            }
            caption
            backgroundColor
            width
            padding
            stretch
          }
          ... on block_advertising {
            title
            content
            linkText
            linkUrl
          }
          ... on block_code {
            code
          }
          ... on block_quote {
            text
            authorName
            authorDuty
            type
            width
            photo {
              id
            }
          }
        }
      }
    }
    `,
    { articleId: article.id }
  );
  const customBlocks: CustomBlocks = customBlocksData.article_blocks;

  return (
    <>
      <div className="container">
        <h1 className={styles.pageTitle}>{article.title}</h1>
      </div>
      <div
        className={styles.cover}
        style={{ backgroundColor: article.coverColor }}
      >
        <div className={styles.coverImageWrapper}>
          <Image
            className={styles.coverImage}
            src={`${directusUrl}/assets/${article.cover.id}`}
            alt=""
            width={1200}
            height={700}
          />
          <div
            className={styles.coverLeftGradient}
            style={{ backgroundColor: article.coverColor }}
          ></div>
          <div
            className={styles.coverRightGradient}
            style={{ backgroundColor: article.coverColor }}
          ></div>
        </div>
      </div>
      <div className="container">
        <div className={styles.articleContainer}>
          <div className={styles.metaHeader}>
            {typeof article.author === "object" && (
              <div className={styles.author}>
                <span className={styles.authorName}>{article.author.name}</span>
                <span className={styles.authorDuty}>{article.author.duty}</span>
              </div>
            )}
            <span className={styles.publishedDate}>
              {formatDate(new Date(article.publishedAt))}
            </span>
            <span className={styles.readingTime}>
              Read for {article.readingTime} minutes
            </span>
          </div>
        </div>
      </div>
      <div className={clsx("container", styles.articleBodyAndSidebarWrapper)}>
        <div className={styles.sidebar}>
          <SubscribePanel />
          <AdvertisementPanel />
        </div>
        <div className={styles.articleBody}>
          {article.contentFlexible.content.map((block, index) => {
            if (block.type !== "relation-block") {
              return (
                <div key={index} className={styles.articleContainer}>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: generateHTML({ type: "doc", content: [block] }, [
                        StarterKit,
                        TipTapLink,
                      ]),
                    }}
                  ></div>
                </div>
              );
            }
            if (block.attrs?.id && block.attrs?.collection) {
              switch (block.attrs?.collection) {
                case "block_lead": {
                  return (
                    <div key={index} className={styles.articleContainer}>
                      <Lead
                        {...(getBlockProps(
                          block.attrs?.id,
                          customBlocks
                        ) as LeadBlock)}
                      />
                    </div>
                  );
                }
                case "block_image": {
                  const blockProps = getBlockProps(
                    block.attrs?.id,
                    customBlocks
                  );
                  const isFullWidthBlock =
                    (blockProps as ImageBlock).width === "screen";
                  return (
                    <div
                      key={index}
                      className={clsx(
                        !isFullWidthBlock && styles.articleContainer,
                        isFullWidthBlock && "js-fullWidthSection"
                      )}
                    >
                      <Picture {...(blockProps as ImageBlock)} />
                    </div>
                  );
                }
                case "block_advertising": {
                  const blockProps = getBlockProps(
                    block.attrs?.id,
                    customBlocks
                  );
                  return (
                    <div key={index} className={"js-fullWidthSection"}>
                      <Advertising {...(blockProps as AdvertisingBlock)} />
                    </div>
                  );
                }
                case "block_code": {
                  const blockProps = getBlockProps(
                    block.attrs?.id,
                    customBlocks
                  );
                  return (
                    <div key={index} className={"js-fullWidthSection"}>
                      <Code {...(blockProps as CodeBlock)} />
                    </div>
                  );
                }
                case "block_quote": {
                  const blockProps = getBlockProps(
                    block.attrs?.id,
                    customBlocks
                  );
                  const isFullWidthBlock =
                    (blockProps as QuoteBlock).width === "screen";
                  return (
                    <div
                      key={index}
                      className={clsx(
                        !isFullWidthBlock && styles.articleContainer,
                        isFullWidthBlock && "js-fullWidthSection"
                      )}
                    >
                      <Quote {...(blockProps as QuoteBlock)} />
                    </div>
                  );
                }
              }
            }
          })}
        </div>
      </div>
      <div className="container">
        <div className={styles.articleContainer}>
          <div className={styles.metaFooter}>
            {typeof article.author === "object" && (
              <div className={styles.author}>
                <span className={styles.authorName}>{article.author.name}</span>
                <span className={styles.authorDuty}>{article.author.duty}</span>
              </div>
            )}
            <span className={styles.publishedDate}>
              {formatDate(new Date(article.publishedAt))}
            </span>
            <span className={styles.tags}>
              {article.tags?.map(
                (tag) =>
                  typeof tag !== "number" && (
                    <Link
                      href={`/magazine/tags/${tag.tags_id.slug}`}
                      key={tag.tags_id.slug}
                      className={styles.tag}
                    >
                      #{tag.tags_id.name}
                    </Link>
                  )
              )}
            </span>
          </div>
        </div>
      </div>
      {article.relatedArticles?.length > 0 && (
        <div className="container">
          <h2 className={styles.sectionHeading}>
            {article.titleForRelatedArticlesSection ||
              "More interesting articles"}
          </h2>
          <div className={styles.relatedArticles}>
            {article.relatedArticles.map((article) => (
              <div
                key={article.related_articles_id.slug}
                className={styles.articleCard}
              >
                {
                  <Image
                    className={styles.articleCardCover}
                    src={`${directusUrl}/assets/${article.related_articles_id.cover.id}`}
                    alt=""
                    width="290"
                    height="200"
                  />
                }
                {article.related_articles_id.tags.length > 0 && (
                  <div className={styles.articleCardMeta}>
                    <span>Articles</span>
                    {article.related_articles_id.tags?.map((tag) => (
                      <Link
                        href={`/magazine/tags/${tag.tags_id.slug}`}
                        key={tag.tags_id.slug}
                        className={styles.articleCardTag}
                      >
                        #{tag.tags_id.name}
                      </Link>
                    ))}
                  </div>
                )}
                <h3 className={styles.articleCardTitle}>
                  <Link
                    href={`/magazine/article/${article.related_articles_id.slug}`}
                  >
                    {article.related_articles_id.title}
                  </Link>
                </h3>
                {
                  <div className={styles.articleCardAuthor}>
                    {article.related_articles_id.author.name}
                  </div>
                }
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
