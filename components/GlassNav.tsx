"use client";
import { useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const rate = (speed: number) => 1.6 - (speed / 100) * 1.2;

const overshoot = (bounce: number, tuned: number) =>
  Number((1 + (bounce / 100) * (tuned - 1) * 2).toFixed(3));

const curve = (bounce: number, tuned: number, x1 = 0.28, x2 = 0.36) =>
  `cubic-bezier(${x1}, ${overshoot(bounce, tuned)}, ${x2}, 1)`;

export type NavItem = {
  key: string;
  label: string;
  href: string;
  matches?: (pathname: string) => boolean;
  render?: () => React.ReactNode;
  className?: string;
};

type Ind = { p: number; s: number };

const settleCurve = (bounce: number) => ({
  move: curve(bounce, 1.28, 0.28, 0.36),
  size: curve(bounce, 1.34, 0.24, 0.38),
});

function deriveActive(pathname: string, items: NavItem[]): string {
  const hit = items.find((item) => item.matches?.(pathname));
  return hit?.key ?? items[0]?.key ?? "";
}

export function IconNav({
  items,
  axis = "row",
  dilate = 100,
  bounce = 50,
  speed = 50,
  hug = 6,
  ariaLabel = "Main",
  className,
  end,
}: {
  items: NavItem[];
  axis?: "row" | "column";
  dilate?: number;
  bounce?: number;
  speed?: number;
  hug?: number;
  ariaLabel?: string;
  className?: string;
  end?: React.ReactNode;
}) {
  const vertical = axis === "column";
  const pathname = usePathname();
  const active = deriveActive(pathname, items);

  const trackRef = useRef<HTMLElement | null>(null);
  const refs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [ind, setInd] = useState<Ind | null>(null);
  const [phase, setPhase] = useState<"idle" | "stretch" | "settle">("idle");
  const indRef = useRef<Ind | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const previous = useRef<string | null>(null);

  const measure = (k: string): Ind | null => {
    const el = refs.current[k];
    if (!el) return null;
    return vertical
      ? { p: el.offsetTop, s: el.offsetHeight }
      : { p: el.offsetLeft, s: el.offsetWidth };
  };

  const snap = (to: Ind) => {
    window.clearTimeout(timer.current);
    indRef.current = to;
    setPhase("idle");
    setInd(to);
  };

  const travel = (from: Ind, to: Ind) => {
    const start = Math.min(from.p, to.p);
    const end = Math.max(from.p + from.s, to.p + to.s);
    const grow = dilate / 100;
    setPhase("stretch");
    setInd({
      p: to.p + (start - to.p) * grow,
      s: to.s + (end - start - to.s) * grow,
    });
    timer.current = window.setTimeout(() => {
      indRef.current = to;
      setPhase("settle");
      setInd(to);
    }, 150 * rate(speed));
  };

  useLayoutEffect(() => {
    const to = measure(active);
    if (!to) return;

    if (previous.current === null || previous.current === active) {
      snap(to);
    } else if (indRef.current) {
      travel(indRef.current, to);
    } else {
      snap(to);
    }
    previous.current = active;

    const ro = new ResizeObserver(() => {
      const next = measure(active);
      if (next) snap(next);
    });
    if (trackRef.current) ro.observe(trackRef.current);
    return () => {
      ro.disconnect();
      window.clearTimeout(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, vertical, items]);

  const style = ind
    ? vertical
      ? { transform: `translate3d(0, ${ind.p}px, 0)`, height: ind.s }
      : { transform: `translate3d(${ind.p}px, 0, 0)`, width: ind.s }
    : { opacity: 0 };

  const curves = settleCurve(bounce);
  const vars = {
    "--nav-pad": `${hug}px`,
    "--ind-stretch": `${Math.round(190 * rate(speed))}ms`,
    "--ind-settle": `${Math.round(420 * rate(speed))}ms`,
    "--ind-move": curves.move,
    "--ind-size": curves.size,
  } as React.CSSProperties;

  return (
    <nav
      ref={trackRef as React.RefObject<HTMLElement>}
      className={["gnav", className].filter(Boolean).join(" ")}
      data-orientation={vertical ? "vertical" : "horizontal"}
      style={vars}
      aria-label={ariaLabel}
    >
      <span className="gnav-ind" data-phase={phase} style={style} aria-hidden />
      {items.map(({ key, label, href, render, className }) => {
        const isActive = active === key;
        return (
          <Link
            key={key}
            ref={(el) => {
              refs.current[key] = el;
            }}
            href={href}
            className={["gnav-item", className].filter(Boolean).join(" ")}
            data-active={isActive}
            aria-label={label}
            aria-current={isActive ? "page" : undefined}
          >
            {render?.()}
          </Link>
        );
      })}
      {end ? <div className="gnav-end">{end}</div> : null}
    </nav>
  );
}
