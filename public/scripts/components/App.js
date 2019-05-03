import { DinnerTable } from './DinnerTable.js';
import { DiningPhilosophers } from '../models/Philosopher.js';

export function App() {
  const [state, setState] = React.useState(new DiningPhilosophers(5));
  
  React.useEffect(() => {
    let interval = window.setInterval(() => {
      setState(state.tick());
    }, 400);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  return React.createElement(
    DinnerTable,
    { tableRadius: 144, tableColor: '#f0f0f0', state }
  );
}
