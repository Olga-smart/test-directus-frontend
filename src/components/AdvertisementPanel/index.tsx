"use client";

import { useEffect, useRef, useState } from "react";
import { clsx } from "clsx";
import styles from "./component.module.css";

export function AdvertisementPanel() {
  const panelRef = useRef<HTMLDivElement | null>(null);
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
    <div
      ref={panelRef}
      className={clsx(styles.advertisementPanel, isHidden && styles.hidden)}
    >
      <div className={styles.advertisementTitle}>Join our Telegram channel</div>
      <div className={styles.advertisementText}>
        In this space, we discuss the latest news, provide reviews, and share
        our insights on innovations and products in the world of web3.
      </div>
      <a href="#" className={styles.advertisementLink}>
        Join us
      </a>
    </div>
  );
}
