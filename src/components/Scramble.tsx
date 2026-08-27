import { useEffect, useRef, useState } from "react";

/**
 * Decrypt/scramble text reveal (in the spirit of React Bits' DecryptedText).
 * Characters resolve left to right from a pool of glyphs.
 */

const GLYPHS = "abcdefghijklmnopqrstuvwxyz0123456789<>/\\|=+*#%";

interface Props {
  text: string;
  /** delay before the effect starts, ms */
  delay?: number;
  /** ms per character resolved */
  speed?: number;
  className?: string;
}

export default function Scramble({ text, delay = 0, speed = 45, className }: Props) {
  const [out, setOut] = useState(() => text.replace(/\S/g, " "));
  const done = useRef(false);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOut(text);
      return;
    }
    let raf = 0;
    let start: number | null = null;

    const tick = (now: number) => {
      if (start === null) start = now + delay;
      const elapsed = now - start;
      if (elapsed < 0) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const resolved = Math.floor(elapsed / speed);
      let s = "";
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (i < resolved || ch === " ") s += ch;
        else if (i < resolved + 6) s += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        else s += " ";
      }
      setOut(s);
      if (resolved >= text.length) {
        done.current = true;
        setOut(text);
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, delay, speed]);

  return (
    <span className={className} aria-label={text}>
      {out}
    </span>
  );
}
