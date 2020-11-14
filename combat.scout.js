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
    //If the flag is not defined, our mission is done, suicide
    if(Game.flags[creep.memory.scoutTarget] == undefined) creep.suicide();
    //If the flag isn't defined... move to it... this ain't rocket science
    creep.moveTo(Game.flags[creep.memory.scoutTarget]);
  }
};
