import type { ReactNode } from 'react';
import type { DiagramShape } from '@/domain/page';

/**
 * Every box shape drawn as SVG rather than CSS clip-path + border. Clip-path
 * only clips whatever the box already painted — border included — so any
 * edge that doesn't sit on the box's original rectangular perimeter (every
 * diagonal, curve or notch) came out unstroked. SVG's `stroke` follows the
 * actual path, so every shape gets a complete outline regardless of how it's
 * cut, and the stroke width is trivial to keep thin and consistent.
 */
function shapeContent(
  shape: DiagramShape,
  width: number,
  height: number,
  strokeWidth: number,
  fill: string,
): ReactNode {
  const stroke = 'var(--color-text)';
  const inset = strokeWidth / 2;
  const w = width;
  const h = height;

  switch (shape) {
    case 'process':
      return (
        <rect
          x={inset}
          y={inset}
          width={w - strokeWidth}
          height={h - strokeWidth}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      );

    case 'terminator':
      return (
        <rect
          x={inset}
          y={inset}
          width={w - strokeWidth}
          height={h - strokeWidth}
          rx={(h - strokeWidth) / 2}
          ry={(h - strokeWidth) / 2}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      );

    case 'decision':
      return (
        <polygon
          points={`${w / 2},${inset} ${w - inset},${h / 2} ${w / 2},${h - inset} ${inset},${h / 2}`}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      );

    case 'data': {
      const skew = w * 0.16;
      return (
        <polygon
          points={`${skew},${inset} ${w - inset},${inset} ${w - skew},${h - inset} ${inset},${h - inset}`}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      );
    }

    case 'document': {
      const wave = Math.min(8, h / 6);
      const baseY = h - wave - inset;
      return (
        <path
          d={`M${inset},${inset} L${w - inset},${inset} L${w - inset},${baseY} C${w * 0.75},${baseY + wave * 2} ${w * 0.25},${baseY - wave * 2} ${inset},${baseY} Z`}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      );
    }

    case 'predefined': {
      const bar = Math.min(6, w * 0.12);
      return (
        <>
          <rect
            x={inset}
            y={inset}
            width={w - strokeWidth}
            height={h - strokeWidth}
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
          />
          <line
            x1={bar}
            y1={inset}
            x2={bar}
            y2={h - inset}
            stroke={stroke}
            strokeWidth={strokeWidth}
          />
          <line
            x1={w - bar}
            y1={inset}
            x2={w - bar}
            y2={h - inset}
            stroke={stroke}
            strokeWidth={strokeWidth}
          />
        </>
      );
    }

    case 'preparation': {
      const cut = w * 0.15;
      return (
        <polygon
          points={`${cut},${inset} ${w - cut},${inset} ${w - inset},${h / 2} ${w - cut},${h - inset} ${cut},${h - inset} ${inset},${h / 2}`}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      );
    }

    case 'connector': {
      const r = Math.min(w, h) / 2 - inset;
      return (
        <circle cx={w / 2} cy={h / 2} r={r} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
      );
    }

    case 'manualOperation': {
      const skew = w * 0.14;
      return (
        <polygon
          points={`${inset},${inset} ${w - inset},${inset} ${w - skew},${h - inset} ${skew},${h - inset}`}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      );
    }

    case 'storedData': {
      const bow = Math.min(14, w * 0.12);
      return (
        <path
          d={`M${bow + inset},${inset} L${w - inset},${inset} L${w - inset},${h - inset} L${bow + inset},${h - inset} C${inset},${h - inset} ${inset},${inset} ${bow + inset},${inset} Z`}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      );
    }

    case 'internalStorage': {
      const barX = w * 0.24;
      const barY = h * 0.34;
      return (
        <>
          <rect
            x={inset}
            y={inset}
            width={w - strokeWidth}
            height={h - strokeWidth}
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
          />
          <line
            x1={barX}
            y1={inset}
            x2={barX}
            y2={h - inset}
            stroke={stroke}
            strokeWidth={strokeWidth}
          />
          <line
            x1={inset}
            y1={barY}
            x2={w - inset}
            y2={barY}
            stroke={stroke}
            strokeWidth={strokeWidth}
          />
        </>
      );
    }

    case 'directData': {
      const rx = w / 2 - inset;
      const ry = Math.min(10, h * 0.22);
      return (
        <path
          d={`M${inset},${ry} A${rx},${ry} 0 0 1 ${w - inset},${ry} L${w - inset},${h - ry} A${rx},${ry} 0 0 1 ${inset},${h - ry} Z M${inset},${ry} A${rx},${ry} 0 0 0 ${w - inset},${ry}`}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      );
    }

    case 'manualInput':
      return (
        <polygon
          points={`${inset},${h * 0.28} ${w - inset},${inset} ${w - inset},${h - inset} ${inset},${h - inset}`}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      );

    case 'card': {
      const cut = Math.min(16, w * 0.18);
      return (
        <polygon
          points={`${cut},${inset} ${w - inset},${inset} ${w - inset},${h - inset} ${inset},${h - inset} ${inset},${cut}`}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      );
    }

    case 'paperTape': {
      const wave = Math.min(6, h / 8);
      const topY = wave + inset;
      const botY = h - wave - inset;
      return (
        <path
          d={`M${inset},${topY} C${w * 0.25},${topY - wave * 2} ${w * 0.75},${topY + wave * 2} ${w - inset},${topY} L${w - inset},${botY} C${w * 0.75},${botY - wave * 2} ${w * 0.25},${botY + wave * 2} ${inset},${botY} Z`}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      );
    }

    case 'display': {
      const notch = w * 0.12;
      return (
        <path
          d={`M${notch},${inset} L${w * 0.7},${inset} C${w - inset},${inset} ${w - inset},${h - inset} ${w * 0.7},${h - inset} L${notch},${h - inset} C${notch * 0.4},${h - inset} ${notch * 0.4},${inset} ${notch},${inset} Z`}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      );
    }

    case 'loopLimit': {
      const cut = Math.min(14, h * 0.35);
      return (
        <polygon
          points={`${cut},${inset} ${w - cut},${inset} ${w - inset},${cut} ${w - inset},${h - inset} ${inset},${h - inset} ${inset},${cut}`}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      );
    }

    case 'offPageOut':
      return (
        <polygon
          points={`${inset},${inset} ${w - inset},${inset} ${w - inset},${h * 0.6} ${w / 2},${h - inset} ${inset},${h * 0.6}`}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      );

    case 'offPageIn': {
      const notch = w * 0.12;
      return (
        <polygon
          points={`${inset},${inset} ${w - inset},${inset} ${w - inset},${h - inset} ${inset},${h - inset} ${inset + notch},${h / 2}`}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      );
    }

    case 'offPageArrow': {
      const notch = w * 0.28;
      return (
        <polygon
          points={`${inset},${h * 0.22} ${w - notch},${h * 0.22} ${w - notch},${inset} ${w - inset},${h / 2} ${w - notch},${h - inset} ${w - notch},${h * 0.78} ${inset},${h * 0.78}`}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      );
    }

    default:
      return null;
  }
}

export function DiagramShapeSvg({
  shape,
  width,
  height,
  strokeWidth = 1.5,
  fillColor = 'var(--color-bg)',
  className,
}: {
  shape: DiagramShape;
  width: number;
  height: number;
  strokeWidth?: number;
  fillColor?: string;
  className?: string;
}) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden="true"
    >
      {shapeContent(shape, width, height, strokeWidth, fillColor)}
    </svg>
  );
}
