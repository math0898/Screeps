/**
 * Spawns a carrier creep at the given spawn and at the level given.
 * O(c) --> runs in constant time
 * @param capacity The max energy the creep can use
 * @param spawn The spawn where the creep will be spawned
 */
function spawnCarrier(capacity, spawn){
  //Temporaily stores how much energy we've spent on our creep
  var spent = 100; //Starts at 100 since everything has 2 move (50) parts
  //No matter how much energy we have the carrier starts with 2 move components
  var body = [MOVE,MOVE];
  //Add move parts so as not to exceed 4 parts or 1/3 our energy budget
  while(spent + 50 <= (capacity / 3) && body.length < 4) { body.push(MOVE); spent += 50;}
  //Fill the remaining space with carry (50) parts as not to exceed 600 total cost
  while(spent + 50 <= capacity && spent < 600) { body.push(CARRY); spent += 50;}
  //Temp name storing
  var name = '[' + spawn.room.name + '] Carrier ' + Game.time;
  //Spawn the creep, Increment the carrier count in the room if successful
  if(spawn.spawnCreep(body, name, {memory: {role: 'carrier'}}) == OK) spawn.room.memory.count.carrier++;
}
/**
 * Spawns a claimer creep at the given spawn and at the level given.
 * O(c) --> runs in constant time
 * @param capacity The max energy the creep can use
 * @param spawn The spawn where the creep will be spawned
 */
function spawnClaimer(capacity, spawn){
  //Claimers are easy... basic body
  var body = [MOVE,CLAIM]; //Cost - 650
  //Temp name storage
  var name = '[' + spawn.room.name + '] Claimer ' + Game.time;
  //Spawn the creep, Increment the claimer count in the room if successful
  if(spawn.spawnCreep(body,name, {memory: {role: 'claimer', distance: Game.flags['Claim'].room.name}}) == OK) spawn.room.memory.count.claimer++;
}
/**
 * Spawns a distance harvester creep at the given spawn and at the level given.
 * O(c) --> runs in constant time
 * @param capacity The max energy the creep can use
 * @param spawn The spawn where the creep will be spawned
 * @param targetRoom The room which the distance harvester will be mining in
 */
function spawnDistanceHarvester(capacity, spawn, targetRoom){
  //The amount of energy towards our total we've spent
  var spent = 200; //Starts at 200 since we have 2 move (50) parts and 2 carry (50) parts
  //The starting body for our distance harvester
  var body = [MOVE,MOVE,CARRY,CARRY];
  //Add another carry part if we have the space
  if(capacity > 550) { body.push(CARRY); spent += 50;}
  //Add work parts until we're out of energy but not to exceed 750 cost
  while(spent + 100 <= capacity && spent < 750) { body.push(WORK); spent += 100;}
  //Temp name storing
  var name = '[' + spawn.room.name + '] Distance Harvester ' + Game.time;
  //Spawn the creep, Increment the distance harvester count in the room if successful
  if(spawn.spawnCreep(body, name, {memory: {role: 'distanceHarvester', home: spawn.room, distance: targetRoom}}) == OK) spawn.room.meory.count.distanceHarvester++;
}
/**
 * Spawns a harvester creep at the given spawn and at the level given.
 * O(c) --> runs in constant time
 * @param capacity The max energy the creep can use
 * @param spawn The spawn where the creep will be spawned
 */
function spawnHarvester(capacity, spawn){
  //It's important to note that the harvester creep is also used for recovery
  // and as such can't cost more than 300 energy
  //Temp body storing
  var body = [MOVE,MOVE,CARRY,CARRY,WORK]; //Cost - 300
  //Temp name storing
  var name = '[' + spawn.room.name + '] Harvester ' + Game.time;
  //Spawn the creep, Increment the harvester count in the room if successful
  if(spawn.spawnCreep(body, name, {memory: {role: 'harvester'}}) == OK) spawn.room.memory.count.harvester++;
}
/**
 * Spawns a miner creep at the given spawn and at the level given.
 * O(c) --> runs in constant time
 * @param capacity The max energy the creep can use
 * @param spawn The spawn where the creep will be spawned
 */
function spawnMiner(capacity, spawn){
  //The amount of energy towards our total we've spent
  var spent = 250; //Starts at 200 since we have 1 move (50) parts and 2 work (100) parts
  //The starting body for our miner
  var body = [MOVE,WORK,WORK];
  //Append work body parts until out of energy, not to exceed 5 total
  while(spent + 100 <= capacity && body.length < 6) { body.push(WORK); spent += 100; }
  //Temp name storing
  var name = '[' + spawn.room.name + '] Miner ' + Game.time;
  //Spawn the creep, Increment the miner count in the room if successful
  if(spawn.spawnCreep(body, name, {memory: {role: 'miner'}}) == OK) spawn.room.memory.count.miner++;
}
/**
 * Spawns a repair bot creep at the given spawn and at the level given.
 * O(c) --> runs in constant time
 * @param capacity The max energy the creep can use
 * @param spawn The spawn where the creep will be spawned
 */
function spawnRepairBot(capacity, spawn){
  //This little guy just needs to move around and fix things
  //Alternate case
  var body = [MOVE,MOVE,CARRY,CARRY,WORK]; //Cost 300
  //Temp name storing
  var name = '[' + spawn.room.name + '] Repair Bot ' + Game.time;
  //Spawn the creep, Increment the repair bot count in the room if successful
  if(spawn.spawnCreep(body, name, {memory: {role: 'repairBot'}}) == OK) spawn.room.memory.count.repairBot++;
}
/**
 * Spawns a scout creep at the given spawn and at the level given.
 * O(c) --> runs in constant time
 * @param capacity The max energy the creep can use
 * @param spawn The spawn where the creep will be spawned
 */
function spawnScout(capacity, spawn){
  //It's important to note that the scout creep's only purpose is to move and
  // as such its body leaves much to desire
  //Temp body storing
  var body = [MOVE]; //Cost - 50
  //Temp name storing
  var name = '[' + spawn.room.name + '] Scout ' + Game.time;
  //Spawn the creep, Increment the scout count in the room if successful
  if(spawn.spawnCreep(body, name, {memory: {role: 'scout', scoutTarget: spawn.room.memory.scoutTarget}}) == OK) spawn.room.memory.count.scout++;
}
/**
 * Spawns a worker creep at the given spawn and at the level given.
 * O(c) --> runs in constant time
 * @param capacity The max energy the creep can use
 * @param spawn The spawn where the creep will be spawned
 */
function spawnWorker(capacity, spawn){
  //The amount of energy towards our total we've spent
  var spent = 200; //Starts at 200 since we have 2 move (50) parts and 2 carry (50) parts
  //The starting body for our worker
  var body = [MOVE,MOVE,CARRY,CARRY];
  //Add another carry part if we have the space
  if(capacity > 550) { body.push(CARRY); spent += 50;}
  //Add work parts until we're out of energy but not to exceed 750 cost
  while(spent + 100 <= capacity && spent < 750) { body.push(WORK); spent += 100;}
  //Temp name storing
  var name = '[' + spawn.room.name + '] Worker ' + Game.time;
  //Spawn the creep, Increment the upgrader count in the room if successful
  if(spawn.spawnCreep(body, name, {memory: {role: 'worker'}}) == OK) spawn.room.memory.count.worker++;
}
//Public facing functions
module.exports = {
 /**
  * Finds spawns in the room given and runs the logic for what needs to be spawned.
  * Then functions higher up in the file are called to handle the spawning of specifc
  * creeps.
  * Worst case: O(s + t) --> s is the number of spawns
  * Expected case: O(s + t) --> s is the number of spwans, t is the number of buildings
  * Best case: O(s + t) --> s is the number of spawns
  * @param currentRoom The room in which spawning occurs
  */
  spawn: function(currentRoom){
    //Check the capacity we can spawn at
    var capacity = 300 + (currentRoom.find(FIND_MY_STRUCTURES,
      {filter: (s) => s.structureType == STRUCTURE_EXTENSION && s.progress == undefined}).length * 50); //O(t)
    //Iterate through spwans in the game
    for(var spawn in Game.spawns){ //TODO implement spawns into room.memory so this is O(c), current O(s)
      //Why is this harder than it needs to be?
      spawn = Game.spawns[spawn];
      //Is the spawn in the room we want?
      if (currentRoom.name == spawn.room.name){
        //Check if a harvester creep needs to be spawned, this includes recovery if all creeps die
        if(currentRoom.memory.count.harvester < 1) spawnHarvester(capacity, spawn);
        //Check if a carrier creep needs to be spawned, 2 per miner
        else if(currentRoom.memory.count.carrier < currentRoom.memory.count.miner * 2) spawnCarrier(capacity, spawn);
        //Check if a miner creep needs to be spawned, 1 per source
        else if(currentRoom.memory.count.miner < currentRoom.memory.source.length) spawnMiner(capacity, spawn);
        //Check if workers should be spawned, 4 base, // TODO: check if more can be spawned
        else if(currentRoom.memory.count.worker < 4) spawnWorker(capacity, spawn);
        //Check if a repair bot should be spawned
        else if(currentRoom.memory.count.repairBot < 1) spawnRepairBot(capacity, spawn);
        //Check if a scout should be spawned
        else if(currentRoom.memory.count.scout < 1 && currentRoom.scoutTarget != null) spawnScout(capacity, spawn);
        //Check if a claimer should be spawned
        else if(currentRoom.memory.countClaimer < 1 && Game.flags['Claim'] != undefined) spawnClaimer(capacity, spawn);
        // TODO: reimplement distance harvesters
     }
   }
  }
};
