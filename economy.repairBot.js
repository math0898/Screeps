/**
 * In this file contains all the logic and AI needed for running the repair bot
 * creep which is a subclass of economy creeps.
 * @author Sugaku, math0898
 */
//Public facing functions
module.exports = {
 /**
  * The main function that is called to run the repair bot creep AI and logic.
  * O(2t) --> t is the number of buildings
  * @param creep the creep on which the AI is being run.
  */
  run: function(creep){
    //We're filled up and ready to spend some energy
    if(creep.carry.energy == creep.carryCapacity) creep.memory.working = true;
    //We need to get some more energy
    else if (creep.carry.energy == 0 || creep.memory.working == undefined) creep.memory.working = false;
    //Let's spend that energy we gathered
    if(creep.memory.working){
      //Find buildings that aren't full
      var firstChoiceBuilding = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (b) => b.hits < b.hitsMax && b.structureType != STRUCTURE_WALL}); //O(t)
      //Find walls that aren't full
      var secondChoiceBuilding = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (b) => b.hits < b.hitsMax}); //O(t)
      //Check if the first choice is aviable
      if(firstChoiceBuilding == undefined) {if(creep.repair(secondChoiceBuilding) == ERR_NOT_IN_RANGE) creep.moveTo(secondChoiceBuilding);}
      //If we're out of range when it comes to repairing the building, move closer
      else if(creep.repair(firstChoiceBuilding) == ERR_NOT_IN_RANGE) creep.moveTo(firstChoiceBuilding);
    //We need to fill up on energy
    } else if (creep.memory.working == false){
      //Room will have highest dropped energy saved here
      var droppedEnergy = creep.room.memory.droppedEnergy;
      //Check if the droppedEnergy is defined, Move to dropppedEnergy if not in range
      if(droppedEnergy != null) {if(creep.pickup(Game.getObjectById(droppedEnergy.id)) == ERR_NOT_IN_RANGE) creep.moveTo(droppedEnergy.pos.x,droppedEnergy.pos.y);}
    }
  }
};
