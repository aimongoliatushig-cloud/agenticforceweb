"use client";

import { useEffect, useRef } from "react";

type Point = {
  x: number;
  y: number;
};

type OrthogonalPath = {
  points: Point[];
  color: string;
  delay: number;
  active: boolean;
};

function segmentLength(a: Point, b: Point) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function pointOnPath(points: Point[], progress: number) {
  const lengths = points.slice(0, -1).map((point, index) => segmentLength(point, points[index + 1]));
  const total = lengths.reduce((sum, length) => sum + length, 0);
  let target = total * progress;

  for (let index = 0; index < lengths.length; index += 1) {
    const start = points[index];
    const end = points[index + 1];
    const length = lengths[index];

    if (target <= length) {
      const ratio = length === 0 ? 0 : target / length;
      return {
        x: start.x + (end.x - start.x) * ratio,
        y: start.y + (end.y - start.y) * ratio,
      };
    }

    target -= length;
  }

  return points[points.length - 1];
}

function drawOrthogonalPath(context: CanvasRenderingContext2D, path: OrthogonalPath) {
  context.save();
  context.strokeStyle = path.active ? path.color : "rgba(255,255,255,0.14)";
  context.lineWidth = path.active ? 2.5 : 1.25;
  context.shadowBlur = path.active ? 14 : 0;
  context.shadowColor = path.color;
  context.beginPath();
  context.moveTo(path.points[0].x, path.points[0].y);
  path.points.slice(1).forEach((point) => context.lineTo(point.x, point.y));
  context.stroke();

  context.fillStyle = path.active ? "rgba(251,191,36,0.82)" : "rgba(255,255,255,0.22)";
  path.points.slice(1, -1).forEach((point) => {
    context.beginPath();
    context.arc(point.x, point.y, path.active ? 3.2 : 2, 0, Math.PI * 2);
    context.fill();
  });
  context.restore();
}

function drawPacket(
  context: CanvasRenderingContext2D,
  path: OrthogonalPath,
  progress: number,
  size: number
) {
  const point = pointOnPath(path.points, progress);
  const trail = pointOnPath(path.points, Math.max(0, progress - 0.035));

  context.save();
  const gradient = context.createLinearGradient(trail.x, trail.y, point.x, point.y);
  gradient.addColorStop(0, "rgba(255,255,255,0)");
  gradient.addColorStop(1, path.color);
  context.strokeStyle = gradient;
  context.lineWidth = size * 1.4;
  context.beginPath();
  context.moveTo(trail.x, trail.y);
  context.lineTo(point.x, point.y);
  context.stroke();

  context.shadowBlur = 20;
  context.shadowColor = path.color;
  context.fillStyle = "rgba(255,255,255,0.98)";
  context.beginPath();
  context.roundRect(point.x - size * 1.15, point.y - size * 1.15, size * 2.3, size * 2.3, 2);
  context.fill();
  context.restore();
}

function drawDataCenter(context: CanvasRenderingContext2D, x: number, y: number, scale: number, pulse: number) {
  context.save();
  context.translate(x, y);
  context.scale(scale, scale);
  context.shadowBlur = 24;
  context.shadowColor = "rgba(248,113,113,0.42)";
  context.fillStyle = "rgba(12,12,14,0.82)";
  context.strokeStyle = "rgba(255,255,255,0.2)";
  context.lineWidth = 1;

  for (let rack = 0; rack < 3; rack += 1) {
    const rx = rack * 42;
    context.beginPath();
    context.roundRect(rx, 0, 32, 96, 6);
    context.fill();
    context.stroke();

    for (let row = 0; row < 6; row += 1) {
      const alpha = 0.36 + Math.sin(pulse + rack + row * 0.7) * 0.24;
      context.fillStyle = `rgba(248,113,113,${alpha})`;
      context.fillRect(rx + 7, 12 + row * 13, 18, 2.5);
      context.fillStyle = `rgba(251,191,36,${alpha + 0.1})`;
      context.beginPath();
      context.arc(rx + 24, 13 + row * 13, 1.8, 0, Math.PI * 2);
      context.fill();
    }
  }

  context.restore();
}

function drawBrain(context: CanvasRenderingContext2D, center: Point, radius: number, pulse: number) {
  context.save();
  context.translate(center.x, center.y);
  context.shadowBlur = 34;
  context.shadowColor = "rgba(251,191,36,0.72)";
  context.strokeStyle = "rgba(251,191,36,0.94)";
  context.fillStyle = "rgba(20,14,8,0.72)";
  context.lineWidth = 2;
  context.beginPath();
  context.ellipse(0, 0, radius * 1.08, radius * 0.78, 0, 0, Math.PI * 2);
  context.fill();
  context.stroke();

  const nodes = [
    { x: -0.48, y: -0.2 },
    { x: -0.18, y: -0.45 },
    { x: 0.2, y: -0.28 },
    { x: 0.48, y: 0.02 },
    { x: 0.18, y: 0.38 },
    { x: -0.26, y: 0.28 },
  ].map((node) => ({ x: node.x * radius, y: node.y * radius }));

  context.strokeStyle = "rgba(255,255,255,0.34)";
  context.lineWidth = 1.5;
  nodes.forEach((node, index) => {
    const next = nodes[(index + 1) % nodes.length];
    context.beginPath();
    context.moveTo(node.x, node.y);
    context.lineTo(next.x, next.y);
    context.stroke();
  });

  nodes.forEach((node, index) => {
    const size = 4.8 + Math.sin(pulse * 1.4 + index) * 1.2;
    context.fillStyle = index % 2 === 0 ? "rgba(251,191,36,0.98)" : "rgba(255,255,255,0.92)";
    context.beginPath();
    context.arc(node.x, node.y, size, 0, Math.PI * 2);
    context.fill();
  });

  context.restore();
}

function drawUserNode(context: CanvasRenderingContext2D, point: Point, scale: number, active: boolean) {
  context.save();
  context.translate(point.x, point.y);
  context.scale(scale, scale);
  context.shadowBlur = active ? 24 : 12;
  context.shadowColor = active ? "rgba(251,191,36,0.7)" : "rgba(255,255,255,0.28)";
  context.strokeStyle = active ? "rgba(251,191,36,0.9)" : "rgba(255,255,255,0.38)";
  context.fillStyle = "rgba(10,10,12,0.72)";
  context.lineWidth = 1.6;
  context.beginPath();
  context.arc(0, -8, 9, 0, Math.PI * 2);
  context.fill();
  context.stroke();
  context.beginPath();
  context.roundRect(-16, 8, 32, 24, 10);
  context.fill();
  context.stroke();
  context.restore();
}

export function WorkflowParticles() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;

    let width = 0;
    let height = 0;
    let animationFrame = 0;
    let tick = 0;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * pixelRatio);
      canvas.height = Math.floor(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const draw = () => {
      tick += reducedMotion ? 0 : 1;
      const time = tick / 60;
      context.clearRect(0, 0, width, height);

      const mobileScale = width < 760 ? 0.72 : 1;
      const dataCenter = { x: width * 0.08, y: height * 0.19 };
      const backupCenter = { x: width * 0.17, y: height * 0.62 };
      const brain = { x: width * 0.52, y: height * 0.39 };
      const users = [
        { x: width * 0.84, y: height * 0.2 },
        { x: width * 0.92, y: height * 0.42 },
        { x: width * 0.8, y: height * 0.66 },
        { x: width * 0.64, y: height * 0.76 },
      ];
      const decision = Math.floor(time / 2.4) % users.length;
      const brainIn = { x: brain.x - 76 * mobileScale, y: brain.y };
      const brainOut = { x: brain.x + 76 * mobileScale, y: brain.y };

      const background = context.createLinearGradient(0, 0, width, height);
      background.addColorStop(0, "rgba(248,113,113,0.18)");
      background.addColorStop(0.44, "rgba(251,191,36,0.12)");
      background.addColorStop(1, "rgba(255,255,255,0.04)");
      context.fillStyle = background;
      context.fillRect(0, 0, width, height);

      const inbound: OrthogonalPath[] = [
        {
          points: [
            { x: dataCenter.x + 126 * mobileScale, y: dataCenter.y + 38 * mobileScale },
            { x: width * 0.28, y: dataCenter.y + 38 * mobileScale },
            { x: width * 0.28, y: brainIn.y - 28 },
            { x: brainIn.x, y: brainIn.y - 28 },
            brainIn,
          ],
          color: "rgba(248,113,113,0.88)",
          delay: 0,
          active: true,
        },
        {
          points: [
            { x: backupCenter.x + 118 * mobileScale, y: backupCenter.y + 46 * mobileScale },
            { x: width * 0.35, y: backupCenter.y + 46 * mobileScale },
            { x: width * 0.35, y: brainIn.y + 34 },
            { x: brainIn.x, y: brainIn.y + 34 },
            brainIn,
          ],
          color: "rgba(255,255,255,0.62)",
          delay: 0.28,
          active: true,
        },
      ];

      const decisionBusX = width * 0.7;
      const outbound: OrthogonalPath[] = users.map((user, index) => ({
        points: [
          brainOut,
          { x: decisionBusX, y: brainOut.y },
          { x: decisionBusX, y: user.y + 4 },
          { x: user.x - 30 * mobileScale, y: user.y + 4 },
        ],
        color: index === decision ? "rgba(251,191,36,0.96)" : "rgba(255,255,255,0.28)",
        delay: index * 0.17,
        active: index === decision,
      }));

      const allPaths = [...inbound, ...outbound];
      allPaths.forEach((path) => drawOrthogonalPath(context, path));

      inbound.forEach((path, index) => {
        for (let packet = 0; packet < 3; packet += 1) {
          const progress = (time * 0.22 + path.delay + packet * 0.32 + index * 0.1) % 1;
          drawPacket(context, path, progress, 3.4 * mobileScale);
        }
      });

      outbound.forEach((path, index) => {
        for (let packet = 0; packet < (index === decision ? 4 : 1); packet += 1) {
          const speed = index === decision ? 0.26 : 0.12;
          const progress = (time * speed + path.delay + packet * 0.24) % 1;
          drawPacket(context, path, progress, (index === decision ? 3.8 : 2.2) * mobileScale);
        }
      });

      drawDataCenter(context, dataCenter.x, dataCenter.y, 0.98 * mobileScale, time * 3);
      drawDataCenter(context, backupCenter.x, backupCenter.y, 0.82 * mobileScale, time * 2.4 + 1.2);
      drawBrain(context, brain, 62 * mobileScale, time * 3.2);
      users.forEach((user, index) => drawUserNode(context, user, 0.9 * mobileScale, index === decision));

      context.strokeStyle = "rgba(251,191,36,0.38)";
      context.lineWidth = 2;
      context.setLineDash([8, 8]);
      context.beginPath();
      context.arc(brain.x, brain.y, (86 + Math.sin(time * 3) * 5) * mobileScale, 0, Math.PI * 2);
      context.stroke();
      context.setLineDash([]);

      animationFrame = window.requestAnimationFrame(draw);
    };

    resize();
    draw();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-100"
    />
  );
}
