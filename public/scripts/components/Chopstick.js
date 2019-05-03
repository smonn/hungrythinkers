export function Chopstick({ color, tableRadius, height, offset, rotate }) {
  return React.createElement(
    'rect',
    {
      className: 'Chopstick',
      fill: color,
      x: tableRadius - 2,
      y: offset,
      width: 4,
      height,
      rx: 2,
      transform: `rotate(${rotate}, ${tableRadius}, ${tableRadius})`
    }
  );
}
