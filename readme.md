Dining philosophers problem.

Solution created by using Web Workers and some fancy CSS3 for displaying the state.

The philosophers are state machines (eat-state and think-state). They also have a hunger status indicating their level of starvation. To make it more interesting, when philosophers eat they reduce their hunger by 2, making them eat longer than one tick.

The forks and the philosophers are observables in order to send updates to the main thread, which in turn makes sure other copies of forks in other threads are updated. This is necessary since Web Workers doesn't share objects, it simply copies stuff.
