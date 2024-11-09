export default function collideCheck({ rect1, rect2 }) {
  return (
    rect1.left - 3 < rect2.left + rect2.width &&
    rect1.left + 5 > rect2.left &&
    rect1.top - 3 < rect2.top + rect2.height &&
    rect1.top + 5 > rect2.top
  );
}
