import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import { Link as TipTapLink } from "@tiptap/extension-link";
import styles from "./component.module.css";

export type LeadBlock = {
  text: ProseMirrorNode;
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

export function Lead(props: LeadBlock) {
  return (
    <div
      className={styles.block}
      dangerouslySetInnerHTML={{
        __html: generateHTML(props.text, [StarterKit, TipTapLink]),
      }}
    ></div>
  );
}
