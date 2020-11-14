console.log('Code updated-----');
var controlledRooms = []; //Array containing controlled rooms, updated on code refresh
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
var seige = false;
var hostiles;
var oneTime = true;
//Initialize controlledRooms
for(let r in Game.rooms) controlledRooms.push(r);
/**
 * Counts the number of each creep assigned to the room. Note this accesses
 * all creeps in order to find scouts, claimers, and distanceHarvesters. Otherwise
 * it should only scale on the number of creeps in the room. O(9n) --> n is the number of creeps
 * @param currentRoom The room in which creeps are counted and the room in which
 * the counts are saved in memory.
 */
function countCreeps(currentRoom){
  if (currentRoom.memory.count == undefined) currentRoom.memory.count = [];
  //Count era 1 creeps
  currentRoom.memory.count.harvester = _.sum(currentRoom.find(FIND_MY_CREEPS), (c) => c.memory.role == 'harvester' && c.memory.distance == undefined); //O(n)
  //Count era 2 creeps
  currentRoom.memory.count.repairBot = _.sum(currentRoom.find(FIND_MY_CREEPS), (c) => c.memory.role == 'repairBot'); //O(n)
  currentRoom.memory.count.miner = _.sum(currentRoom.find(FIND_MY_CREEPS), (c) => c.memory.role ==  'miner'); //O(n)
  currentRoom.memory.count.carrier = _.sum(currentRoom.find(FIND_MY_CREEPS), (c) => c.memory.role == 'carrier'); //O(n)
  currentRoom.memory.count.distanceHarvester = _.sum(Game.creeps, (c) => c.memory.role == 'distanceHarvester' && c.memory.home == currentRoom.name); //O(n)
  currentRoom.memory.count.scout = _.sum(Game.creeps, (c) => c.memory.role == 'scout' && c.memory.home == currentRoom.name); //O(n)
  //Count era 3 creeps
  currentRoom.memory.count.towerFiller = _.sum(currentRoom.find(FIND_MY_CREEPS), (c) => c.memory.role == 'towerFiller'); //O(n)
  currentRoom.memory.count.claimer = _.sum(Game.creeps, (c) => c.memory.role == 'claimer'); //O(n)
  currentRoom.memory.count.worker = _.sum(Game.creeps, (c) => c.memory.role == 'worker'); //O(n)
}
/**
 * Runs the AI for the creeps relating to the economy.
 * Worst case: O(9t * n) --> n is the number of creeps, t is the number of buildings
 * Expected case: O(2t * n) --> n is the number of creeps, t is the number of buildings
 */
function economyCreepAI(){
  //Loop through all creeps
  for(var name in Game.creeps){
    //Easy refrence and minimize .memory reading
    var creep = Game.creeps[name];
    var creepRole = Game.creeps[name].memory.role;
    //Check role agaisnt this list and run approiate function
    switch(creepRole){
      //Harvester AI
      case 'harvester': roleHarvester.run(creep); break;
      //Miner AI
      case 'miner': roleMiner.run(creep); break;
      //Carrier AI
      case 'carrier': roleCarrier.run(creep); break;
      //DistanceHarvester AI
      case 'distanceHarvester': roleDistanceHarvester.run(creep); break;
      //RepairBot AI
      case 'repairBot': roleRepairBot.run(creep); break;
      //Worker AI
      case 'worker': roleWorker.run(creep); break;
    }
  }
}
/**
 * Runs the AI for creeps relating to combat and claiming of new rooms. O(n) --> n is the number of creeps
 */
function combatCreepAI(){
  //Loop through all creeps
  for(var name in Game.creeps){
    //Easy refrence and minimize .memory reading
    var creep = Game.creeps[name];
    var creepRole = Game.creeps[name].memory.role;
    //Check role against this list and run approiate function
    switch(creepRole){
      //Scout AI
      case 'scout': roleScout.run(creep); break;
      //Claimer AI
      case 'claimer': roleClaimer.run(creep); break;
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
  //Run creep AI
  //Ecnomic creeps are more important
  economyCreepAI(); //O(9t * n) - O(2t * n)
  //Combat is pretty important but comes second
  combatCreepAI(); //O(n)
  //We should update our memory sometime, why not now?
  updateCreepMemory(); //O(n)
  //Iterate by controlledRooms, casualy check for undefined rooms and condense currentRoom
  for(var i = 0; i < controlledRooms.length; i++) { if(Game.rooms[controlledRooms[i]] == undefined) continue; else currentRoom = Game.rooms[controlledRooms[i]]; //O(r)
    //Check if era is undefined
    if(currentRoom.memory.era == undefined) currentRoom.memory.era = 1;
    //Run the room era logic
    logicEra.runWithCitadel(currentRoom); //O(t + s) - O(c)
    //Count the creeps
    countCreeps(currentRoom); //O(9n)
    //Run the spawning logic for the room
    logicSpawn.spawn(currentRoom); //O(s * t * n)/O(s * 2t) - O(s * n)
  }

  //Collect data
  if(Game.flags['Data'] != undefined) {
    if(Game.flags['Data'].memory.cpuUsage == undefined) Game.flags['Data'].memory.cpuUsage = [];
    Game.flags['Data'].memory.cpuUsage.push(Game.cpu.getUsed());
  }
  if(Game.flags['Print'] != undefined && Game.time % 1000 == 0){
    var total = 0;
    var local = Game.flags['Data'].memory.cpuUsage;
    for(var i = 0; i < local.length; i++) total += local[i];
    console.log('Average CPU usage over ' + local.length + ' ticks: ' + total/local.length)
  }
}
