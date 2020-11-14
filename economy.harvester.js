/**
 * In this file contains all the logic and AI needed for running the harvester
 * creep which is a subclass of economy creeps.
 * @author Sugaku, math0898
 */
//Public facing functions
module.exports = {
 /**
  * The main function that is called to run the harvester creep AI and logic.
  * Worst case: O(2t) --> t is the number of structures
  * Average case: O(2t) --> t is the number of structures
  * Best case: O(t) --> t is the number of structures
  * @param creep the creep on which the AI is being run.
  */
  run: function(creep){
    //Creep is full of energy, start working
    if(creep.carry.energy == creep.carryCapacity) creep.memory.working = true;
    //We're out of energy so we need to go find some more
    else if (creep.carry.energy == 0 || creep.memory.working == undefined) creep.memory.working = false;
    //Let's spend some energy!
    if(creep.memory.working){
      //Find buildings that aren't full
      var building = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {filter: (b) => b.energy < b.energyCapacity}); //O(t)
      //Move to building when not in range
      if(creep.transfer(building, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) creep.moveTo(building);
      //If there isn't a building to transfer resources to
      if(building == undefined) {
          if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) creep.moveTo(creep.room.controller);
      }
    }
    //We aint working so we need to fill up
    else if (creep.memory.working == false){
      //Naturally droppedEnergy would be the easiest to pickup
      var droppedEnergy = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, (f) => f.resourceType == 'energy'); //O(t)
      //If its not undefined and we can't pick it up move to it
      if(droppedEnergy != undefined && creep.pickup(droppedEnergy) == ERR_NOT_IN_RANGE) creep.moveTo(droppedEnergy);
      //If there's no dropped energy we're going to need to mine it
      else {
        //Find closest source
        var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE); //O(t)
        //Move to source if not in range
        if(creep.harvest(source) == ERR_NOT_IN_RANGE) creep.moveTo(source);
      }
    }
  }
};
