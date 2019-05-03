export function Bowl({ color, tableRadius, radius, offset, rotate, ...props }) {
  return React.createElement(
    'g',
    { transform: `rotate(${rotate}, ${tableRadius}, ${tableRadius}) translate(${tableRadius}, ${offset + radius})` },
    React.createElement(
      'circle',
      {
        className: 'Bowl',
        fill: color,
        cx: 0,
        cy: 0,
        r: radius,
        ...props
      }
    )
  );
}
