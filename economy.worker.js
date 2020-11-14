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
       var temp = creep.room.find(FIND_CONSTRUCTION_SITES); //O(t)
       //Used to determine the priority of the construction site saved
       var prio = 100;
       //See if anything needs to be built
       if(temp.length > 0 && creep.room.controller.ticksToDowngrade > 5000 && !creep.memory.upgrade) {
         for(var i = 0; i < temp.length; i++) {
           if(temp[i].structureType == STRUCTURE_TOWER) { asdf = temp[i]; break;}
           else if(temp[i].structureType == STRUCTURE_EXTENSION && prio > 1) { asdf = temp[i]; prio = 1;}
           else if(temp[i].structureType == STRUCTURE_ROAD && prio > 2) { asdf = temp[i]; prio = 2;}
           else if(temp[i].structureType == STRUCTURE_WALL && prio > 3) {asdf = temp[i]; prio = 3;}
         }
       } else asdf = 'null';
       //Check if we need to build something
       if(asdf != 'null') { if(creep.build(asdf) == ERR_NOT_IN_RANGE) creep.moveTo(asdf);}
       //If we don't need to build something, upgrade the controller
       else {
         creep.memory.upgrade = true;
         if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) creep.moveTo(creep.room.controller);
       }
   } else {
     var droppedEnergy = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {filter: (f) => f.resourceType == 'energy'}); //O(e)? negligible
     //Check if the droppedEnergy is defined, Move to dropppedEnergy if not in range
     if(droppedEnergy != undefined) {if(creep.pickup(droppedEnergy) == ERR_NOT_IN_RANGE) creep.moveTo(droppedEnergy);}
   }
 }
};
