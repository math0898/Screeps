/**
 * In this file contains all the logic and AI needed for running the claimer creep
 * which is a subclass of combat creeps.
 * @author Sugaku, math0898
 */
//Public facing functions
module.exports = {
 /**
  * The main function that is called to run the claimer creep AI and logic.
  * O(c) --> Runs in constant time
  * @param creep the creep on which the AI is being run.
  */
  run: function(creep){
    //Check if we're in the right room or not and move there if we're not
    if (creep.room.name != creep.memory.distance) creep.moveTo(creep.pos.findClosestByPath(creep.room.findExitTo(creep.memory.distance)));
    //If we're in the right room let's do what we need to do
    else {
      //If we can't claim the controller move closer
      if(creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) creep.moveTo(creep.room.controller);
      //If we can and have claimed the controller
      else {
        //create a construction site where the flag was for a new spawn
        creep.room.createConstructionSite(Game.flags['Claim'].pos.x, Game.flags['Claim'].pos.y, STRUCTURE_SPAWN);
        //Remove the 'Claim' flag
        Game.flags['Claim'].remove();
        //The creep is no longer needed, suicide
        creep.suicide();
      }
    }
  }
};
