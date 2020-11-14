/**
 * In this file contains all the logic and AI needed for running the miner
 * creep which is a subclass of economy creeps.
 * @author Sugaku, math0898
 */
//Public facing functions
module.exports = {
 /**
  * The main function that is called to run the miner creep AI and logic.
  * Worst case: O(t) --> t is the number of buildings
  * Average case: O(c) --> runs in constant time
  * @param creep the creep on which the AI is being run.
  */
  run: function(creep){
      //Check if we need to find a source to mine
      if(creep.memory.source == undefined) {
        //Make an attempt at a good source to mine
        attempt = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE, {filter: (s) => s.energy == s.energyCapacity || s.energy > (s.ticksToRegeneration * 10) + 1}); //O(t)
        //Check if we have an attempt
        if(attempt != undefined) {
          //Check if our previous 'try' is defined
          if(creep.memory.try != undefined) {
            //We can check if it was any good and if it was set our source
            if(creep.memory.try.id == attempt.id) creep.memory.source = attempt;
            //If it wasn't any good we can set this current guess to our next one
            else creep.memory.try = attempt;
          }
          //If we haven't tried one yet we can set a new attempt
          else creep.memory.try = attempt;
        }
      }
      //Are we in range of the source
      else if(creep.harvest(Game.getObjectById(creep.memory.source.id)) == ERR_NOT_IN_RANGE) {
        //Move to the source, no need to worry about creeps or make new paths
        creep.moveTo(creep.memory.source.pos.x, creep.memory.source.pos.y, {ignoreCreeps: false, reusePath: 1500});
      }
  }
};
