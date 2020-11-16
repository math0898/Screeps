# Screeps
In this repository is the code I use to play the game Screeps... Yes that means you can use this against me but I hope my code is good enough to not have major flaws.
# Script Performance
Stats are taken from game start and runs for 20,000 ticks, the end of safe mode. The room used for testing also has two sources because... well who would want to spawn in a one source room. The test results can be expected to be similar over different rooms but mileage may vary.
```
CPU Usage: 4.200 avg.
Peak CPU: 30.522
Controller lvl: 3:1,689 - 1%
Mined Resources: 441,098
Wasted Resources: 158,993 - 36%
```
# Most Recent Update
A comprehensive list of updates can be found in Update Information.txt

```
------ Update 1.1.4 ------ Optimization 1 ------
Goal: Reduce accesses to the entire creeps list

Completed Tasks:
---> Optimizations:
     Removed O(9n) to be replaced with O(n * t) -> O(r * n * t).
---> -25 Lines... doesn't mean much but hey
---> Running Creep AI now also counts them.
---> New function resetCreepCounts(room) resets creep counts in the room.
---> New constant now holds players who are considered allies.
---> Changed build in room memory to exclude non-extensions bellow controller level
     3 which should allow for faster early game progression.
---> Removed random runWithCitadel(room) call in era2 logic.

Additional TODO's:
---> Add basic scouting Mechanics.
---> Add automatic additional room taking.
---> Reimplement distance harvesters.
---> Check if more workers can be spawned.
---> Check if a helper carrier can move resources to a nearby ally.
---> Give carriers more idle options.
---> Implement a method to build road network outside of the "core".
---> Add spawn "core" is centered on to memory so it doesn't need to be searched
     for every tick. This can also be checked as a shortcut when searching for
     controlled rooms.
---> Check citadel building priorities, tower > extensions > roads > walls
---> Finish hardcoding the citadel structures
---> Implement a strategy to choose "core" structure in a room.

Performance Change:
---> (CPU Usage) (5.141) -> (4.200) avg. over the first 20,000 ticks
---> (Peak CPU) (31.240) -> (30.522) over the first 20,000 ticks
---> (Controller lvl) (2:[35,547] - 79%) -> (3:[1,689] - 1%) in 20,000 ticks
---> (Mined Resources) (458,432) -> (441,098) resources mined
---> (Wasted Resources) ([126,964] - 28%) -> ([158,993] - 36%) of mined resources unused
```
