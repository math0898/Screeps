/**
 * This file handles everything related to scouting including spawn requests and
 * saving of data scouted.
 * @author Sugaku, math0898
 */
//Public facing functions
module.exports = {
  /**
   * Initializes room and spawn for scouting.
   * Runtime: O(c) ---> Runs in constant time
   * @param currentRoom - The room doing the scouting.
   */
  init : function(currentRoom){
    //Check if there's an exit to the top
    if(currentRoom.findExitTo(FIND_EXIT_TOP) != -2) currentRoom.memory.scoutQueue.push("top");
    //Check for the right
    if(currentRoom.findExitTo(FIND_EXIT_RIGHT) != -2) currentRoom.memory.scoutQueue.push("right");
    //Check for the left
    if(currentRoom.findExitTo(FIND_EXIT_LEFT) != -2) currentRoom.memory.scoutQueue.push("left");
    //Check for the bottom
    if(currentRoom.findExitTo(FIND_EXIT_BOTTOM) != -2) currentRoom.memory.scoutQueue.push("bottom");
  },
  /**
   * Called on every tick involving scouting. Handles updating arrays and scout
   * targets.
   * @param currentRoom - The room doing the scouting.
   */
  runloop : function(currentRoom){

  },
  /**
   * Cleans up everything involving scouting.
   * @param currentRoom - The room doing the scouting.
   */
  teardown : function(currentRoom){

  }
};
