console.log('Code updated-----');
var controlledRooms = []; //Array containing controlled rooms
//This is all the logic for importing AI for the creeps, spawns, rooms, etc.
var roleDistanceHarvester = require('economy.distanceHarvester');
var roleRepairBot = require('economy.repairBot');
var roleHarvester = require('economy.harvester');
var roleCarrier = require('economy.carrier');
var roleMiner = require('economy.miner');
var roleWorker = require('economy.worker');
var roleClaimer = require('combat.claimer');
var roleScout = require('combat.scout');
var logicSpawn = require('logic.spawn');
var logicEra = require('logic.era');
//A couple booleans to handle certain situations
var hostiles;
//'Constants'
var allies = ["gavinmpaw2000","ser1618"];
/**
 * Looks at all the visible rooms and adds those of which are considered
 * under our control to the array controlledRooms. It also confirms all rooms
 * in controlledRooms are still controlled.
 * Expected case: O(r * t) --> r is the number of rooms, t is the number of buildings
 */
function initializeControlledRooms(){
  //Reset controlledRooms temporarily
  controlledRooms = [];
  //These are the rooms we can see
  var visibleRooms = Game.rooms;
  //In each room try to find a spawn, if we find one add it to controlled rooms
  for(let r in visibleRooms) if(Game.rooms[r].find(FIND_MY_SPAWNS).length > 0) controlledRooms.push(r); //O(r * t)
}
/**
 * Resets the count of the creeps in the room, also initializes arrays and variables
 * if necessary.
 * Runtime: O(c) ---> runs in constant time
 * @param currentRoom The room which has its counts reset
 */
function resetCreepCounts(currentRoom){
  //Check if the count array is defined, if its not, define it.
  if (currentRoom.memory.count == undefined) currentRoom.memory.count = [];
  //Reset counts for each creep type.
  currentRoom.memory.count.harvester = 0;
  currentRoom.memory.count.repairBot = 0;
  currentRoom.memory.count.miner = 0;
  currentRoom.memory.count.carrier = 0;
  // currentRoom.memory.count.distanceHarvester = 0;
  currentRoom.memory.count.scout = 0;
  currentRoom.memory.count.claimer = 0;
  currentRoom.memory.count.worker = 0;
}
/**
 * Runs the AI for the creeps and also counts them to save in their room's memory.
 * Runtime: O(r + n * t) --> r is the number of rooms, n is the number of creeps, t is the number of buildings
 */
function creepAI(){
  //Reset the counts for each room.
  for(var r in Game.rooms) resetCreepCounts(Game.rooms[r]); //O(r)
  //Loop through all creeps
  for(var name in Game.creeps){
    //Easy refrence and minimize .memory reading
    var creep = Game.creeps[name];
    var creepRole = Game.creeps[name].memory.role;
    //Check role agaisnt this list and run approiate function
    switch(creepRole){
      //Harvester AI
      case 'harvester': creep.room.memory.count.harvester++; roleHarvester.run(creep); break;
      //Miner AI
      case 'miner': creep.room.memory.count.miner++;  roleMiner.run(creep); break;
      //Carrier AI
      case 'carrier': creep.room.memory.count.carrier++;  roleCarrier.run(creep); break;
      //DistanceHarvester AI
      // case 'distanceHarvester': creep.room.memory.count.harvester++;  roleDistanceHarvester.run(creep); break;
      //RepairBot AI
      case 'repairBot': creep.room.memory.count.repairBot++;  roleRepairBot.run(creep); break;
      //Worker AI
      case 'worker': creep.room.memory.count.worker++;  roleWorker.run(creep); break;
      //Scout AI
      case 'scout': creep.room.memory.count.scout++;  roleScout.run(creep); break;
      //Claimer AI
      case 'claimer': creep.room.memory.count.claimer++;  roleClaimer.run(creep); break;
    }
  }
}
/**
 * Removes dead creeps from the memory to prevent using too much. O(n) --> n is number of creeps
 */
function updateCreepMemory(){
  //Iterate through creeps, checks if creep is still alive and deletes memory if it's dead
  for(let name in Memory.creeps) if(Game.creeps[name] == undefined) delete Memory.creeps[name];
}
/**
 * Collects data on a number of things including but not limited to cpu usage per tick,
 * mined resources, and wasted resources.
 * Runtime calculation not needed as this is only run when data flag is down.
 */
function collectData(){
  //Grab the cpu usage this tick before we do anything to mess it up
  thisTickUsage = Game.cpu.getUsed();
  //Check if our cpuUsage array is setup, if it isn't, set it up
  if(Game.flags['Data'].memory.cpuUsage == undefined) Game.flags['Data'].memory.cpuUsage = [];
  //Check if our start tick is setup, if it isn't, set it
  if(Game.flags['Data'].memory.startTick == undefined) Game.flags['Data'].memory.startTick = Game.time;
  //Check if our peak tick is setup, if it isn't, set it up
  if(Game.flags['Data'].memory.peakUsage == undefined) Game.flags['Data'].memory.peakUsage = thisTickUsage;
  //Check if our total mined is seutp, if it isn't, set it
  if(Game.flags['Data'].memory.totalMined == undefined) Game.flags['Data'].memory.totalMined = 0;
  //Check if our decaying resources is setup, if it isn't, set it up
  if(Game.flags['Data'].memory.lostedResources == undefined) Game.flags['Data'].memory.lostedResources = 0;
  //Collect source information but not proccess yet
  var thisTickSources = Game.flags['Data'].room.find(FIND_SOURCES);
  //Collect dropped resources information but not proccess yet
  var droppedResources = Game.flags['Data'].room.find(FIND_DROPPED_RESOURCES);
  //Push the new tick data to the usage array
  Game.flags['Data'].memory.cpuUsage.push(thisTickUsage);
  //Check if this tick was a new peak usage
  if(thisTickUsage > Game.flags['Data'].memory.peakUsage) Game.flags['Data'].memory.peakUsage = thisTickUsage;
  //Add mined resources information
  for(var i = 0; i < thisTickSources.length; i++){
    //If there are no past sources, make them and we should be good here
    if(Game.flags['Data'].memory.pastSources == undefined) { Game.flags['Data'].memory.pastSources = thisTickSources; break; }
    //The difference between the two is how much we mined, check if the source refilled itself though
    if(Game.flags['Data'].memory.pastSources[i].energy >= thisTickSources[i].energy){
      //Add the difference to memory
      Game.flags['Data'].memory.totalMined += (Game.flags['Data'].memory.pastSources[i].energy - thisTickSources[i].energy);
    } else {
      //You had to make things complicated didn't you? Oh well, we should just need this
      Game.flags['Data'].memory.totalMined += thisTickSources[i].energyCapacity - thisTickSources[i].energy;
    }
    //Set our past sources to the current ones
    Game.flags['Data'].memory.pastSources = thisTickSources;
  }
  //Proccess dropped resources information
  for(var i = 0; i < droppedResources.length; i++){
    //This amount of resources will decay
    Game.flags['Data'].memory.lostedResources += Math.ceil(droppedResources[i].amount/1000);
  }
  //Check if 20,000 ticks have passed and we can print final stats
  if(Game.time - Game.flags['Data'].memory.startTick == 20000  || Game.time % 100 == 0){
    //Print start and header information
    var p = 'Preformence Report\nTick Started On: ' + Game.flags['Data'].memory.startTick + '\nTick Ended On: ' + Game.time + '\n';
    //Data capture stats
    p += 'Data Captured on: ' + Game.flags['Data'].memory.cpuUsage.length + ' / ' + (Game.time - Game.flags['Data'].memory.startTick) + ' for a rate of ' + (Game.flags['Data'].memory.cpuUsage.length/(Game.time - Game.flags['Data'].memory.startTick)) + '\n';
    //Calculate average usage
    //Running total
    var total = 0;
    //Localized data array so we don't have to access it a ton
    var local = Game.flags['Data'].memory.cpuUsage;
    //Sum the array
    for(var i = 0; i < local.length; i++) total += local[i];
    //Average CPU usage
    p += 'Average CPU Usage: ' + total/local.length + '\n';
    //Peak CPU usage
    p += 'Peak CPU Usage: ' + Game.flags['Data'].memory.peakUsage + '\n';
    //Controller Level and progress
    p += 'Controller lvl and Progress: ' + Game.flags['Data'].room.controller.level + ':' + Game.flags['Data'].room.controller.progress + '\n';
    //Total resources mined
    p += 'Total Mined Resources: ' + Game.flags['Data'].memory.totalMined + '\n';
    //Total lost resources
    p += 'Lost Resources: ' + Game.flags['Data'].memory.lostedResources + '\n';
    //Resource usage rate
    p += 'Resource Usage Rate: ' + ((Game.flags['Data'].memory.totalMined - Game.flags['Data'].memory.lostedResources)/Game.flags['Data'].memory.totalMined) + '\n';
    //Print p
    console.log(p);
  }
}
/**
 * This is the int main of this project. It runs through a lot of things each tick
 * including but not limited to creep AI and era AI of rooms.
 * Worst case:    O(n * 9t + 2n + 9n * r + n * s * t * r + r * s + r * t)
 * Expected case: O(n * 2t + 2n + 9n * r + n * s * r + r)
 * Key:
 * @n --> number of creeps
 * @t --> number of buildings
 * @r -- > number of rooms
 * @s --> number of spawns
 */
module.exports.loop = function(){
  //Check if controlled rooms need to be initialized or refreshed
  if(controlledRooms == undefined || Game.time % 1 == 0) initializeControlledRooms(); //O(r * t)
  //Run creep AI
  creepAI(); //O(r + n * t)
  //We should update our memory sometime, why not now?
  updateCreepMemory(); //O(n)
  //Iterate by controlledRooms, casualy check for undefined rooms and condense currentRoom
  for(var i = 0; i < controlledRooms.length; i++) { if(Game.rooms[controlledRooms[i]] == undefined) continue; else currentRoom = Game.rooms[controlledRooms[i]]; //O(r)
    //Check if era is undefined
    if(currentRoom.memory.era == undefined) currentRoom.memory.era = 1;
    //Run the room era logic with construction, if we can add new sites
    if(currentRoom.memory.newSites) logicEra.runWithCitadel(currentRoom); //TODO: O(t + s) - O(c)
    //Run the room era logic without construction
    else logicEra.run(currentRoom);
    //Run the spawning logic for the room
    logicSpawn.spawn(currentRoom); //O(s * t * n)/O(s * 2t) - O(s * n)
  }
  //Collect data
  if(Game.flags['Data'] != undefined) collectData();
}
