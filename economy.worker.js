/**
 * In this file contains all the logic and AI needed for running the vanilla
 * worker creep which is a subclass of economy creeps.
 * @author Sugaku, math0898
 */
//Public facing functions
module.exports = {
  /**
   * The main function that is called to run the worker creep AI and logic.
   * Worst case: O(c) --> runs in constant time
   * @param creep the creep on which the AI is being run.
   */
   run: function(creep){
     //Creep is full of energy, start working
     if(creep.carry.energy == creep.carryCapacity) creep.memory.working = true;
     //We're out of energy so we need to go find some more
     else if (creep.carry.energy == 0 || creep.memory.working == undefined) {
       creep.memory.upgrade = false;
       creep.memory.working = false;
     }
     //Lock for when we're doing upgrade things
     if(creep.memory.upgrade == undefined) creep.memory.upgrade = false;
     //Let's spend some energy!
     if(creep.memory.working){
       //Check if we need to build something
       if(creep.room.memory.build != 'null') { if(creep.build(Game.getObjectById(creep.room.memory.build.id)) == ERR_NOT_IN_RANGE) creep.moveTo(creep.room.memory.build.pos.x,creep.room.memory.build.pos.y);}
       //If we don't need to build something, upgrade the controller
       else {
         creep.memory.upgrade = true;
         if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) creep.moveTo(creep.room.controller);
       }
   } else {
     //Room will have highest dropped energy saved here
     var droppedEnergy = creep.room.memory.droppedEnergy;
     //Check if the droppedEnergy is defined, Move to dropppedEnergy if not in range
     if(droppedEnergy != null) {if(creep.pickup(Game.getObjectById(droppedEnergy.id)) == ERR_NOT_IN_RANGE) creep.moveTo(droppedEnergy.pos.x,droppedEnergy.pos.y);}
  }
 }
};
