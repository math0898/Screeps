/**
 * In this file contains all the logic and AI needed for running the carrier creep
 * which is a subclass of economy creeps.
 * @author Sugaku, math0898
 */
//Public facing functions
module.exports = {
 /**
  * The main function that is called to run the carrier creep AI and logic.
  * O(t) --> t is the number of structures
  * @param creep the creep on which the AI is being run.
  */
  run: function(creep){
    //If the creep is full on energy, start working
    if(creep.carry.energy == creep.carryCapacity) creep.memory.working = true;
    //If we're out of energy signal we're not working anymore
    else if (creep.carry.energy == 0 || creep.memory.working == undefined) creep.memory.working = false;
    //If we're working
    if(creep.memory.working){
      //Look for buildings that aren't containers to fill
      var building = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {filter: (b) => b.energy < b.energyCapacity && b.structureType != STRUCTURE_CONTAINER}); //O(t)
      //If we can't transfer energy move to the building
      if(creep.transfer(building, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) creep.moveTo(building);
      //If everything is full check if we're full then rest at 25,25 for now TODO
      else if (building == undefined && creep.carry.energy == creep.carryCapacity) creep.moveTo(25, 25);
    //Gather energy
    } else if (creep.memory.working == false){
      //Search for dropped energy
      var droppedEnergy = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {filter: (f) => f.resourceType == 'energy'}); //O(e)? negligible
      //Check if the droppedEnergy is defined, Move to dropppedEnergy if not in range
      if(droppedEnergy != undefined) {if(creep.pickup(droppedEnergy) == ERR_NOT_IN_RANGE) creep.moveTo(droppedEnergy);}
      //Withdraw from a container
      var container = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (i) => i.structureType == STRUCTURE_CONTAINER && i.store[RESOURCE_ENERGY] > 0}); //O(t)
      //If we're not in range to withdraw from the container, move to it
      if(creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) creep.moveTo(container);
    }
  }
};
