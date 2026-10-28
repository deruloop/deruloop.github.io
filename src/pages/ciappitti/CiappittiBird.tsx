import type { CSSProperties } from "react";

// Ciappitti's bird, traced from the 1024-point app icon (the same path the
// app draws with BirdShape). One line weight with rounded ends.
const DRAWING_WIDTH = 582;
// The frame leaves room around the drawing for the hop and the thinking bob,
// which tilt it up to 8 degrees and lift it by 14% of its height. Browsers
// don't reliably paint an animated SVG past its own frame, so the room has
// to be inside it.
const FRAME = { x: 160, y: 225, width: 690, height: 590 };
const LINE_WIDTH = 22;
const EYE = { cx: 333, cy: 403, r: (LINE_WIDTH * 1.1) / 2 };

const BODY =
  "M308 425 C316 380 342 342 388 342 C415 343 440 354 460 367 C548 413 618 482 655 561 " +
  "L768 691 L614 625 C572 664 523 698 470 696 C381 692 314 612 300 512 L310 466 L240 447 L308 425";
const WING = "M395 487 C470 501 548 541 617 602";
const LEGS = "M448 683 L442 762 M529 677 L536 762";

type Props = {
  /** The width of the drawing itself; the frame around it is a bit larger. */
  size: number;
  /** Draws itself on first appearance, like the app's welcome screen. */
  drawsIn?: boolean;
  /** Hops now and then once drawn. */
  idle?: boolean;
  thinking?: boolean;
  className?: string;
  label?: string;
};

// Seconds, matching the app's split of the drawing: body, wing, legs, eye.
const timing = {
  body: { delay: 0, duration: 1.1 },
  wing: { delay: 1.0, duration: 0.45 },
  legs: { delay: 1.35, duration: 0.5 },
  eye: 1.85,
};

export default function CiappittiBird({
  size,
  drawsIn = false,
  idle = false,
  thinking = false,
  className = "",
  label,
}: Props) {
  const classes = [
    drawsIn ? "ciappitti-bird" : "",
    idle ? "is-idle" : "",
    thinking ? "ciappitti-thinking" : "",
    className,
  ].join(" ");

  const line = (d: string, part: { delay: number; duration: number }) => (
    <path
      d={d}
      pathLength={1}
      className="bird-line"
      style={
        {
          "--draw-delay": `${part.delay}s`,
          "--draw-duration": `${part.duration}s`,
        } as CSSProperties
      }
    />
  );

  return (
    <svg
      viewBox={`${FRAME.x} ${FRAME.y} ${FRAME.width} ${FRAME.height}`}
      width={(size * FRAME.width) / DRAWING_WIDTH}
      height={(size * FRAME.height) / DRAWING_WIDTH}
      className={classes}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <g
        className="bird-body"
        fill="none"
        stroke="var(--ciappitti-ink)"
        strokeWidth={LINE_WIDTH}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {line(BODY, timing.body)}
        {line(WING, timing.wing)}
        {line(LEGS, timing.legs)}
        <circle
          cx={EYE.cx}
          cy={EYE.cy}
          r={EYE.r}
          fill="var(--ciappitti-ink)"
          stroke="none"
          className="bird-eye"
          style={{ "--eye-delay": `${timing.eye}s` } as CSSProperties}
        />
      </g>
    </svg>
  );
}
