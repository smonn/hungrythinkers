import { Bowl } from './Bowl.js';
import { Chopstick } from './Chopstick.js';

const colors = [
  '#bfa044',
  '#62a35e',
  '#5e9da8',
  '#8a77ad',
  '#aa587d',
];

export function DinnerTable({ children, tableColor, tableRadius, state }) {
  const degreeIncrease = 360 / state.bowls.length;
  const bowls = state.bowls.map((bowl, i) => {
    return React.createElement(Bowl, { key: bowl.id, color: colors[i], tableRadius, radius: 32, offset: 16, rotate: i * degreeIncrease, stroke: colors[i], strokeWidth: 8 });
  });
  const bowlFills = state.bowls.map((bowl, i) => {
    return React.createElement(Bowl, { key: bowl.id, color: '#f0f0f0', tableRadius, radius: 32, offset: 16, rotate: i * degreeIncrease, style: { transform: `scale(${bowl.fillLevel})` } });
  });
  const chopsticks = state.chopsticks.map((chopstick, i) => {
    const color = chopstick.philosopher ? colors[chopstick.philosopher.id] : '#c0c0c0';
    return React.createElement(Chopstick, { key: chopstick.id, color: color, tableRadius, height: 64, offset: 16, rotate: i * degreeIncrease - (degreeIncrease / 2) });
  });

  return React.createElement(
    'svg',
    {
      className: 'DinnerTable',
      viewBox: `0 0 ${tableRadius * 2} ${tableRadius * 2}`,
      width: tableRadius * 2,
      height: tableRadius * 2
    },
    React.createElement(
      'g',
      { fillRule: 'evenodd' },
      React.createElement(
        'circle',
        { fill: tableColor, cx: tableRadius, cy: tableRadius, r: tableRadius }
      ),
      bowls,
      bowlFills,
      chopsticks
    )
  );
}
