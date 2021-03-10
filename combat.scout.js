/**
 * In this file contains all the logic and AI needed for running the scout creep
 * which is a subclass of combat creeps.
 * @author Sugaku, math0898
 */
//Public facing functions
module.exports = {
 /**
  * The main function that is called to run the scout creep AI and logic.
  * O(c) --> Runs in constant time
  * @param creep the creep on which the AI is being run.
  */
  run: function(creep){
    //Check if we have a path, if not find one
    if(creep.memory.path == undefined) creep.memory.path = creep.room.findPathTo(creep.pos.x,
      creep.pos.y, creep.memory.scoutTarget);
    //If the location is defined, move to it.
    creep.moveByPath(creep.memory.path);
    //check if we should suicide
    if(creep.memory.finished != undefined) creep.suicide();
  }
};
