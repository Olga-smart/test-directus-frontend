import { clsx } from "clsx";
import Image from "next/image";
import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import { Link as TipTapLink } from "@tiptap/extension-link";
import styles from "./component.module.css";

export type ImageBlock = {
  image: { id: string; width: number; height: number };
  caption: ProseMirrorNode | null;
  backgroundColor: string | null;
  width: "content" | "screen";
  padding: boolean;
  stretch: boolean;
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

export function Picture(props: ImageBlock) {
  return (
    <figure className={clsx(styles.block)}>
      <div
        className={clsx(
          styles.imageWrapper,
          props.padding && styles.imageWrapperWithPadding
        )}
        style={{ backgroundColor: props.backgroundColor || "" }}
      >
        <Image
          className={clsx(styles.image, props.stretch && styles.imageStretched)}
          src={`${directusUrl}/assets/${props.image.id}`}
          alt=""
          width={props.image.width}
          height={props.image.height}
        />
      </div>
      {props.caption && (
        <div
          className={styles.caption}
          dangerouslySetInnerHTML={{
            __html: generateHTML(props.caption, [StarterKit, TipTapLink]),
          }}
        ></div>
      )}
    </figure>
  );
}
