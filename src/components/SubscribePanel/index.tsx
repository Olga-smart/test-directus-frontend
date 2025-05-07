"use client";

import { useEffect, useRef, useState } from "react";
import { clsx } from "clsx";
import styles from "./component.module.css";

export function SubscribePanel() {
  const panelRef = useRef<HTMLFormElement | null>(null);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const panel = panelRef.current;
      const sections = document.querySelectorAll(".js-fullWidthSection");

      if (!panel) return;

      const panelRect = panel.getBoundingClientRect();

      const isOverlapping = Array.from(sections).some((section) => {
        const sectionRect = section.getBoundingClientRect();
        return (
          sectionRect.bottom > panelRect.top &&
          sectionRect.top < panelRect.bottom
        );
      });

      setIsHidden(isOverlapping);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <form
      ref={panelRef}
      className={clsx(styles.subscribePanel, isHidden && styles.hidden)}
    >
      <div className={styles.subscribeTitle}>Subscribe to newsletter</div>
      <input
        type="email"
        className={styles.subscribeInput}
        name="email"
        placeholder="E-mail"
        required
      ></input>
      <button className={styles.subscribeButton}>Send</button>
    </form>
  );
}
