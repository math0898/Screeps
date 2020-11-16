# Screeps
In this repository is the code I use to play the game Screeps... Yes that means you can use this against me but I hope my code is good enough to not have major flaws.
# Script Performance
Stats are taken from game start and runs for 20,000 ticks, the end of safe mode. The room used for testing also has two sources because... well who would want to spawn in a one source room. The test results can be expected to be similar over different rooms but mileage may vary.

CPU Usage: 5.141 avg.
Peak CPU: 31.240
Controller lvl: 2:35,547 - 79%
Mined Resources: 458,432
Wasted Resources: 126,964 - 28%
# Most Recent Update
A comprehensive list of updates can be found in Update Information.txt

------ Update 1.1.3 ------ Stable Workers ------
Goal: Make workers stable, and fix CPU spike at Era 2

Completed Tasks:
---> MAJOR CPU Optimization, citadels are no longer constructed every tick, now just when
     construction sites are less than 100, and try's just what needs to be added next.
---> +84 lines... doesn't mean much but hey
---> Implemented room build target which should prioritize tower > extension > road > wall and then progress.
---> Worker now takes it's build target from room memory rather than its own search algorithm.
---> logc.era.js now checks whether to run near future logic with construction or not.
---> main.js now uses this (^) to run logic, or logic with citadel.
---> Added some new performance calculations
---> Changed how citadel construction sites are added.

Additional TODO's:
---> Add basic scouting Mechanics.
---> Add automatic additional room taking.
---> Reimplement distance harvesters.
---> Check if more workers can be spawned.
---> Prevent the 1 tick loss when controller upgrades since era isn't updated.
---> Add a 'constant' in the code containing allies.

Performance Change:
---> (CPU Usage) (18.815) -> (5.141) avg. over the first 20,000 ticks
---> (Peak CPU) Previously untested -> (31.240) over the first 20,000 ticks
---> (Controller lvl) (2:[33,703] - 75%) -> (2:[35,547] - 79%) in 20,000 ticks
---> (Mined Resources) Previously untested -> (458,432) resources mined
---> (Wasted Resources) Previously untested -> ([126,964] - 28%) of mined resources unused
