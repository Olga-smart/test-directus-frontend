import hljs from "highlight.js";
import "./theme.css";
import styles from "./component.module.css";

export type CodeBlock = {
  code: string;
};

export function Code(props: CodeBlock) {
  const highlighted = hljs.highlightAuto(props.code).value;

  return (
    <div className={styles.block}>
      <pre className={styles.pre}>
        <code
          className="hljs"
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      </pre>
    </div>
  );
}
