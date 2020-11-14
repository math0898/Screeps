/**
 * In this file contains all the logic and AI needed for running the distance
 * harvester creep which is a subclass of economy creeps.
 * @author Sugaku, math0898
 */
//Public facing functions
module.exports = {
  /**
   * The main function that is called to run the distance harvester creep AI and logic.
   * Worst case: O(t) --> t is the number of structures
   * Average case: O(t) --> t is the number of structures
   * Best case: O(c) --> runs in constant time
   * @param creep the creep on which the AI is being run.
   */
  run: function(creep){
    //Key for states
    // 0 --> out of energy need more
    // 1 --> full on energy repairing
    // 2 --> full on energy building
    // 3 --> full on energy filling
    // 4 --> returning home
    //We're full on energy start distributing it
    if(creep.carry.energy == creep.carryCapacity) creep.memory.state = 1;
    //We're out of energy lets get some more
    else if (creep.carry.energy == 0 || creep.memory.state == undefined) creep.memory.state = 0;
    //Call some logic based on each state
    switch(creep.memory.state){
      //We need more energy, if we're not in the room we can harvest in move there
      case 0: if(creep.room != creep.distance) creep.moveTo(creep.pos.findClosestByPath(creep.room.findExitTo(creep.memory.distance)));
              //If you're in the room we can harvest
              else {
                //Find the closest source
                var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE); //O(t)
                //If we can't harvest it
                if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                  //Create a raod construction site
                  creep.room.createConstructionSite(creep.pos.x, creep.pos.y, STRUCTURE_ROAD);
                  //Move to the source
                  creep.moveTo(source);
                } //Don't run the other cases
              } break;
      //We're ready to spend energy on repairing the roads, find roads with less than max hits
      case 1: var repairRoad = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_ROAD && s.hits < s.hitsMax}); //O(t)
              //If we haven't found any roads to repair move onto the next place to spend energy
              if(repairRoad == undefined) creep.memory.state = 2;
              //If we're out of range move to the repair target
              else if (creep.repair(repairRoad) == ERR_NOT_IN_RANGE) creep.moveTo(repairRoad);
              //Don't run the other cases
              break;
      //We're ready to spend energy on construction sites, find those sites!
      case 2: var constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES); //O(t)
              //If we haven't found any construction sites move onto the next place to spend energy
              if(constructionSite == undefined) creep.memory.state = 3;
              //If we're out of range move to the build target
              else if (creep.build(constructionSite) == ERR_NOT_IN_RANGE) creep.moveTo(constructionSite);
              //Don't run the other cases
              break;
      //We're ready to spend energy on filling up buildings, find those buildings
      case 3: var building = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {filter: (b) => b.energy < b.energyCapacity}); //O(t)
              //If we haven't found any buildings move back home
              if(building == undefined) creep.memory.state = 4;
              //If we're out of range move to the transfer target
              else if (creep.transfer(building, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) creep.moveTo(building);
              //Don't run the other cases
              break;
      //We're ready to head home and spend energy there, find the exit
      case 4: if(creep.room != creep.home) creep.moveTo(creep.pos.findClosestByPath(creep.room.findExitTo(creep.memory.home)));
              //Move off the exit so we don't bounce, move our state back to spending energy on roads, except now at home
              else { creep.moveTo(25,25); creep.memory.state = 1;}
              //Not really needed but hey its consistant this way
              break;
    }
  }
};
