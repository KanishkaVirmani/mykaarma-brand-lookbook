// A short, outward-moving brand-pattern accent behind the final wordmark.
// Timing follows the existing last colour pass: 2.8 + 4 * 1.55 + 1.7.
export const BLACK_COMPLETE_SECONDS = 10.7;
export const BURST_START_SECONDS = BLACK_COMPLETE_SECONDS + 0.5;
export const BURST_DURATION_SECONDS = 1.15;
const palette = ['#C61354', '#D1BBFF', '#FF5500'];
const clamp = value => Math.max(0, Math.min(1, value));
const ease = value => value * value * (3 - 2 * value);

export const burstRays = Array.from({length: 36}, (_, index) => {
  const angle = (index < 18 ? 200 + index * 140 / 17 : 20 + (index - 18) * 140 / 17) * Math.PI / 180;
  const variation = index % 3;
  const x = Math.cos(angle), y = Math.sin(angle);
  return {
    x1: 800 + x * 570, y1: 444.5 + y * 125,
    x2: 800 + x * (690 + variation * 12), y2: 444.5 + y * (230 + variation * 8),
    color: palette[index % palette.length], delay: (index % 5) * 0.012
  };
});

export function burstFrame(time, ray) {
  const progress = (time - BURST_START_SECONDS - ray.delay) / BURST_DURATION_SECONDS;
  const head = ease(clamp(progress / 0.55));
  const tail = ease(clamp((progress - 0.4) / 0.6));
  const dx = ray.x2 - ray.x1, dy = ray.y2 - ray.y1;
  return {
    x1: ray.x1 + dx * tail, y1: ray.y1 + dy * tail,
    x2: ray.x1 + dx * head, y2: ray.y1 + dy * head,
    opacity: progress > 0 && progress < 1 ? 1 : 0
  };
}

export function createRevealBurst(svg) {
  const lines = burstRays.map(ray => {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('stroke', ray.color);
    line.setAttribute('stroke-width', '5');
    line.setAttribute('stroke-linecap', 'round');
    line.setAttribute('opacity', '0');
    svg.append(line);
    return line;
  });
  return time => {
    let visible = false;
    burstRays.forEach((ray, index) => {
      const frame = burstFrame(time, ray);
      for (const [key, value] of Object.entries(frame)) lines[index].setAttribute(key, String(value));
      visible ||= frame.opacity > 0;
    });
    svg.style.visibility = visible ? 'visible' : 'hidden';
  };
}
