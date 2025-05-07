import { clsx } from "clsx";
import Image from "next/image";
import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import { Link as TipTapLink } from "@tiptap/extension-link";
import styles from "./component.module.css";

export type QuoteBlock = {
  text: ProseMirrorNode;
  authorName: ProseMirrorNode;
  authorDuty: ProseMirrorNode;
  type: "small" | "medium" | "big" | "with photo";
  width: "content" | "screen";
  photo: {
    id: string;
  };
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

const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL;

export function Quote(props: QuoteBlock) {
  return (
    <div
      className={clsx(
        styles.block,
        props.type === "small" && styles.block_type_small,
        props.type === "medium" && styles.block_type_medium,
        props.type === "big" && styles.block_type_big,
        props.type === "with photo" && styles.block_type_withPhoto
      )}
    >
      <div className={styles.container}>
        {props.type === "with photo" && props.photo?.id && (
          <div className={styles.photoWrapper}>
            <Image
              src={`${directusUrl}/assets/${props.photo.id}`}
              alt=""
              width={250}
              height={250}
              className={styles.photo}
            />
          </div>
        )}
        <div>
          <blockquote
            className={styles.text}
            dangerouslySetInnerHTML={{
              __html: generateHTML(props.text, [StarterKit, TipTapLink]),
            }}
          ></blockquote>
          <div
            className={styles.author}
            dangerouslySetInnerHTML={{
              __html: generateHTML(props.authorName, [StarterKit, TipTapLink]),
            }}
          ></div>
          {props.authorDuty && (
            <div
              className={styles.duty}
              dangerouslySetInnerHTML={{
                __html: generateHTML(props.authorDuty, [
                  StarterKit,
                  TipTapLink,
                ]),
              }}
            ></div>
          )}
        </div>
      </div>
    </div>
  );
}
