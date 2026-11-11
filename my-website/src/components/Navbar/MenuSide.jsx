import React, { useCallback, useEffect, useRef, useState } from "react";
import "@styles/SCSS/components/MenuSide.scss";
import { IoMdCloseCircle } from "react-icons/io";

const MENU_SIDE_MIN_VIEWPORT_WIDTH = 1300;
const NAVIGATION_SCROLL_OFFSET = 90;

const MenuSide = ({ classContainer, titleType, reference }) => {
  const [headings, setHeadings] = useState([]);
  const [activeHeading, setActiveHeading] = useState("");
  const pendingNavigationRef = useRef(null);
  const [isDesktop, setIsDesktop] = useState(
    () => window.innerWidth >= MENU_SIDE_MIN_VIEWPORT_WIDTH,
  );

  useEffect(() => {
    const headingContainer = document.querySelector(classContainer);

    if (!headingContainer) {
      setHeadings([]);
      return;
    }

    const headingData = Array.from(
      headingContainer.querySelectorAll(titleType),
    ).map((heading, index) => {
      if (!heading.id) {
        heading.id = `heading-${index}`;
      }

      return {
        id: heading.id,
        text: heading.textContent,
      };
    });

    setHeadings(headingData);
  }, [classContainer, titleType]);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= MENU_SIDE_MIN_VIEWPORT_WIDTH);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const updateActiveHeading = useCallback(() => {
    if (headings.length === 0) {
      return;
    }

    const pendingNavigation = pendingNavigationRef.current;
    if (
      pendingNavigation &&
      Math.abs(window.scrollY - pendingNavigation.targetTop) > 2
    ) {
      setActiveHeading(pendingNavigation.id);
      return;
    }

    pendingNavigationRef.current = null;
    const viewportCenter = window.innerHeight / 2;
    let nextActiveHeading = "";

    // The active section is the latest heading that has passed the viewport
    // center. This prevents ambiguous updates when multiple headings are visible.
    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);

      if (!element) {
        return;
      }

      const bounds = element.getBoundingClientRect();
      const headingCenter = bounds.top + bounds.height / 2;

      if (headingCenter <= viewportCenter) {
        nextActiveHeading = heading.id;
      }
    });

    setActiveHeading((currentHeading) =>
      currentHeading === nextActiveHeading ? currentHeading : nextActiveHeading,
    );
  }, [headings]);

  useEffect(() => {
    if (!isDesktop || headings.length === 0) {
      return;
    }

    let animationFrameId = null;
    let scrollEndTimeoutId = null;
    const scheduleActiveHeadingUpdate = () => {
      if (animationFrameId !== null) {
        return;
      }

      animationFrameId = window.requestAnimationFrame(() => {
        animationFrameId = null;
        updateActiveHeading();
      });
    };

    const releasePendingNavigation = () => {
      if (!pendingNavigationRef.current) {
        return;
      }

      pendingNavigationRef.current = null;
      scheduleActiveHeadingUpdate();
    };

    const handleScroll = () => {
      scheduleActiveHeadingUpdate();

      if (!pendingNavigationRef.current) {
        return;
      }

      if (scrollEndTimeoutId !== null) {
        window.clearTimeout(scrollEndTimeoutId);
      }

      // Fallback for browsers without the scrollend event and for an
      // interrupted smooth scroll.
      scrollEndTimeoutId = window.setTimeout(releasePendingNavigation, 150);
    };

    const handleScrollEnd = () => {
      if (scrollEndTimeoutId !== null) {
        window.clearTimeout(scrollEndTimeoutId);
      }

      releasePendingNavigation();
    };

    updateActiveHeading();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("scrollend", handleScrollEnd);
    window.addEventListener("resize", scheduleActiveHeadingUpdate);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scrollend", handleScrollEnd);
      window.removeEventListener("resize", scheduleActiveHeadingUpdate);

      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
      }

      if (scrollEndTimeoutId !== null) {
        window.clearTimeout(scrollEndTimeoutId);
      }
    };
  }, [headings.length, isDesktop, updateActiveHeading]);

  const scrollToHeading = (id) => {
    const element = document.getElementById(id);

    if (!element) {
      return;
    }

    const prefersReducedMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const requestedTop = Math.max(
      0,
      element.getBoundingClientRect().top +
        window.scrollY -
        NAVIGATION_SCROLL_OFFSET,
    );
    const maximumScrollTop = Math.max(
      0,
      document.documentElement.scrollHeight - window.innerHeight,
    );
    const targetTop = Math.min(requestedTop, maximumScrollTop);

    pendingNavigationRef.current = { id, targetTop };
    setActiveHeading(id);
    window.scrollTo({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      top: targetTop,
    });
    window.requestAnimationFrame(updateActiveHeading);
  };

  const handleCloseMenu = () => {
    if (!reference.current) {
      return;
    }

    reference.current.classList.remove("show-menu-side");
  };

  if (!isDesktop || headings.length === 0) {
    return null;
  }

  return (
    <div ref={reference} className="menu-side">
      <IoMdCloseCircle
        className="menu-side-icon-close"
        onClick={handleCloseMenu}
      />
      <ul className="flex-column-start-center menu-side-list" role="menu">
        {headings.map((heading) => (
          <li
            key={heading.id}
            className={activeHeading === heading.id ? "active" : ""}
            role="none"
          >
            <button
              type="button"
              role="menuitem"
              onClick={() => scrollToHeading(heading.id)}
              className="menu-side-link"
            >
              {heading.text}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export { MenuSide };
