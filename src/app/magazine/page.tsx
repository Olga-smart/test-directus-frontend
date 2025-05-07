import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <Link href="/magazine/article" className={styles.link}>
        All materials
      </Link>
    </div>
  );
}
