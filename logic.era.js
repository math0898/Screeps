/**
 * Handles the general room logic for each era including but not limited to
 * defense, target flags, defense, and more. Included in this file is also the
 * instructions to build a citadel taking up roughly 9x9 centered on spawn.
 * @author Sugaku, math0898
 */
/**
 * Creates a construction site based at the offset of center. structureType determines
 * the type of structure to be made. O(c) --> Runs in constant time
 * @param center extends currentRoombject. Uses x and y position to determine the center
 * of construction
 * @param dx x offset
 * @param dy y offset
 * @param structureType extends Structure. The type of structure that should be
 * constructed at the location.
 */
function createConstructionSite(center, dx, dy, structureType){
  //Create the construction site
  return center.room.createConstructionSite(center.pos.x + dx, center.pos.y + dy, structureType);
}
/**
 * The logic for a 1st level controller room. Implements the most basic of all
 * defenses, which is just the safeMode, and logic for when we need to increase
 * our era count.
 * Worst case: O(t + s) --> s is the number of spawns
 * Expected case: O(c) --> runs in constant time
 * @param currentRoom the room in which the logic is run in.
 */
function era1(currentRoom){
  //The most basic defense that works... Note: We don't spend enough time at lvl 1 to be too worried about a flawed defense here.
  //Note: We should check if safeMode is active before summoning defense creeps
  if(currentRoom.memory.defend && currentRoom.controller.safeMode < 1 && currentRoom.controller.safeModeAvailable > 0
    && currentRoom.controller.safeModeCooldown == undefined) currentRoom.controller.activateSafeMode();
  //Assigning values can be hard so check if we need to before we do, ensures we're on the right era
  if(currentRoom.memory.era != currentRoom.controller.level) {
    //Update the era
    currentRoom.memory.era = currentRoom.controller.level;
  }
  //Count the number of sources so we know the number of miners to make
  if(currentRoom.memory.source == undefined) currentRoom.memory.source = currentRoom.find(FIND_SOURCES); //O(t)
  //Init distance mines
  if(currentRoom.memory.distanceMines == undefined) currentRoom.memory.distanceMines = [];
  //Reset our scout target
  currentRoom.memory.scoutTarget = null;
  //Find dropped energy
  var droppedEnergies = currentRoom.find(FIND_DROPPED_RESOURCES, {filter: (f) => f.resourceType == 'energy'});
  //Set the largest to memory
  if(droppedEnergies.length > 0){
    //Temporary 'largest'
    currentRoom.memory.droppedEnergy = droppedEnergies[0];
    //Find the largest
    for(var i = 1; i < droppedEnergies.length; i++) if(droppedEnergies[i].amount > currentRoom.memory.droppedEnergy.amount) currentRoom.memory.droppedEnergy = droppedEnergies[i]; //O(t)
  }
  //Initialize droppedEnergy if non are found
  else currentRoom.memory.droppedEnergy = null;
  //Check if we need a new build target
    //Build target
    var temp = currentRoom.find(FIND_CONSTRUCTION_SITES); //O(t)
    //If we have 100 construction sites we don't need more
    if(temp.length == 100) currentRoom.memory.newSites = false;
    else currentRoom.memory.newSites = true;
    //Used to determine the priority of the construction site saved
    var prio = 100;
    //See if anything needs to be built
    if(temp.length > 0) {
    var asdf = temp[0];
    for(var i = 1; i < temp.length; i++) {
        if(temp[i].structureType == STRUCTURE_TOWER) {asdf = temp[i];break;}
        else if(temp[i].structureType == STRUCTURE_EXTENSION && prio > 1) {asdf = temp[i];prio = 1;}
        else if(temp[i].structureType == STRUCTURE_ROAD && prio > 2) {asdf = temp[i];prio = 2;}
        else if(temp[i].structureType == STRUCTURE_WALL && prio > 3) {asdf = temp[i];prio = 3;}
      }
    } else asdf = 'null';
    currentRoom.memory.build = asdf;
}
/**
 * The logic for a 2nd levl controller room. Implements and initializes distance
 * mining, and adds sources to memory.
 * Worst case: O(t) --> t is the number of STRUCTURES
 * Average case: O(c) --> runs in constant time
 * @param currentRoom the room in which the logic is run in.
 */
function era2(currentRoom){
  //If we have a distanceMine flag placed
  if(Game.flags['distanceMine'] != undefined){
    //If we can't see the room set our scout target to the flag
    if(Game.flags['distanceMine'].room == null) currentRoom.memory.scoutTarget = 'distanceMine';
    //If we can see the room and flag
    else {
      //Reset our scouting target
      currentRoom.memory.scoutTarget = null;
      //If we can find an exit from the host room to this room...
      if(currentRoom.findExitTo(Game.flags['distanceMine'].room.name) != undefined){
        //Add the distance mine
        currentRoom.memory.distanceMines.push(Game.flags['distanceMine'].room.name);
        //Remove the flag. Note: This can't be moved up because if the scout from one room beats
        // the one from the intended room then it would remove the flag before logic can be called.
        Game.flags['distanceMine'].remove();
      }
    }
  }
}
/**
 * The logic for a 3rd level controller room. Implements scouting the 'Claim', and
 * towers.
 * O(t) --> where t is  the number of structures
 * @param currentRoom the room in which the logic is run in.
 */ //TODO add logic for towers
function era3(currentRoom){
  //If there's a claim flag down, and we can't see it set our scouting target to it
  if(Game.flags['Claim'] != undefined && Game.flags['Claim'].room == null) currentRoom.memory.scoutTarget = 'Claim';
  //Find towers in the room
  var towers = currentRoom.find(FIND_MY_STRUCTURES, {filter: (b) => b.structureType == STRUCTURE_TOWER}); //O(t)
  //Run tower AI if its non zero
  for(var i = 0; i < towers.length; i++) towerAI(towers[i]);
}
/**
 * The logic for 4th level controller room.
 * O(c) --> runs in constant time
 */
function era4(currentRoom){

}
/**
 * Constructs a citadel.
 * @param center The center of the citadel
 */
function constructCitadel(center){
  //Progress counter for roads
  if(center.room.memory.roadProgress == undefined) center.room.memory.roadProgress = 0;
  //Progress counter for extensions
  if(center.room.memory.extensionProgress == undefined) center.room.memory.extensionProgress = 0;
  //Progress counter for walls
  if(center.room.memory.wallsProgress == undefined) center.room.memory.wallsProgress = 0;
  //Progress counter for towers
  if(center.room.memory.towersProgress == undefined) center.room.memory.towersProgress = 1;
  //Constant arrays holding relative positions of each building type
  //x offsets for roads
  var dxRoads = [-5,-4,-3,-2,-1,-5,-4,-3,-2,-1,-1,0,0,5,4,3,2,1,5,4,3,2,1,1,
    -3,-2,-1,0,1,2,3,-3,-2,-1,0,1,2,3,4,4,4,4,4,4,4,-4,-4,-4,-4,-4,-4,-4,-6,-6,6,
    6,-7,-7,7,7,-8,-8,8,8,-5,-4,-3,-2,-1,0,1,2,3,4,5,7,7,7,7,7,7,7,7,7,7,6,5,4,3,
    2,1,0,-1,-2,-3,-4,-5,-6,-7,-7,-7,-7,-7,-7,-7,-7,-7,-7,-7,-7];
  //y offsets for roads
  var dyRoads = [5,4,3,2,1,-5,-4,-3,-2,-1,0,1,-1,5,4,3,2,1,-5,-4,-3,-2,-1,0,
    4,4,4,4,4,4,4,-4,-4,-4,-4,-4,-4,-4,-3,-2,-1,0,1,2,3,-3,-2,-1,0,1,2,3,-6,6,-6,6,
    -7,7,-7,7,8,-8,8,-8,-7,-7,-7,-7,-7,-7,-7,-7,-7,-7,-7,-5,-4,-3,-2,-1,0,1,2,3,4,
    5,6,7,7,7,7,7,7,7,7,7,6,5,4,3,2,1,0,-1,-2,-3,-4,-5];
  //x offsets for extensions
  var dxExtensions = [0,5,-5,7,-7, 7,-7,4,3,2,1,-1,-2,-3,-4,-2,-1,0,1,2,-1,0,1,-1,
     1,-2,-1, 0, 1, 2,-5,-4,-2,-1, 0, 1, 2, 4, 5, 6, 6, 6, 6, 6,6,6,6,6,6,6,-6,-6,
    -6,-6,-6,-6,-6,-6,-6,-6,-6];
  //y offsets for extensions
  var dyExtensions = [8,7, 7,5, 5,-6,-6,6,6,6,6, 6, 6, 6, 6, 3, 3,3,3,3, 2,2,2,-2,
    -2,-3,-3,-3,-3,-3,-6,-6,-6,-6,-6,-6,-6,-6,-6,-5,-4,-3,-2,-1,0,1,2,3,4,5,-5,-4,
    -3,-2,-1, 0, 1, 2, 3, 4, 5];
  //x offsets for walls
  var dxWalls = [-5,-5,-5,-5,-5,-5,-5,-5,-5,5,5,5,5,5,5,5,5,5,4,3,2,1,0,-1,-2,
    -3,-4,4,3,2,1,0,-1,-2,-3,-4,-8,-8,-8,-8,-8,-8,-8,-8,-8,-8,-8,-8,-8,-8,-7,-6,
    -6,-5,-4,-3,-2,-1,1,2,3,4,5,6,6,7,8,8,8,8,8,8,8,8,8,8,8,8,8,8,-1,0,1,0,1,2,3,
    4,5,6,7,6,-1,-2,-3,-4,-5,-6,-7,-6];
  //y offsets for walls
  var dyWalls = [4,3,2,1,0,-1,-2,-3,-4,4,3,2,1,0,-1,-2,-3,-4,-5,-5,-5,-5,-5,
    -5,-5,-5,-5,5,5,5,5,5,5,5,5,5,0,1,2,3,4,5,6,-1,-2,-3,-4,-5,-6,-7,6,7,8,8,8,8,
    8,8,8,8,8,8,8,8,7,6,6,5,4,3,2,1,0,-1,-2,-3,-4,-5,-6,-7,9,9,9,-8,-8,-8,-8,-8,
    -8,-8,-8,-7,-8,-8,-8,-8,-8,-8,-8,-7];
  //x offsets for towers
  var dxTowers = [2];
  //y offsets for towers
  var dyTowers = [-1];
  switch(center.room.memory.era){
    case 4:
    //Era is 3 we can make extensions, walls, tower etc.
    case 3: var wallsPossible = dxWalls.length;
            var roadsPossible = dxRoads.length;
            var extensionsPossible = 10;
            var towersPossible = 1; break;
    //Era is 2 we can make extensions
    case 2: var extensionsPossible = 5; break;
  }
  //Make towers while we can
  while(center.room.memory.towersProgress < towersPossible){
    //Try to create the site
    if(createConstructionSite(center, dxTowers[center.room.memory.towersProgress], dyTowers[center.room.memory.towersProgress], STRUCTURE_TOWER) == OK) center.room.memory.towersProgress++;
    //If we fail we have too many construction sites
    else break;
  }
  //Make the extensions while we can
  while(center.room.memory.extensionProgress < extensionsPossible){
    //Try to create the site
    if(createConstructionSite(center, dxExtensions[center.room.memory.extensionProgress], dyExtensions[center.room.memory.extensionProgress], STRUCTURE_EXTENSION) == OK) center.room.memory.extensionProgress++;
    //If we fail we have too many construction sites
    else break;
  }
  //Make the roads we can
  while(center.room.memory.roadProgress < roadsPossible){
    //Try to create the site
    if(createConstructionSite(center, dxRoads[center.room.memory.roadProgress], dyRoads[center.room.memory.roadProgress], STRUCTURE_ROAD) == OK) center.room.memory.roadProgress++;
    //If we fail we have too many construction sites
    else break;
  }
  //Make the walls we can
  while(center.room.memory.wallsProgress < wallsPossible){
    //Try to create the site
    if(createConstructionSite(center, dxWalls[center.room.memory.wallsProgress], dyWalls[center.room.memory.wallsProgress], STRUCTURE_WALL) != ERR_FULL) center.room.memory.wallsProgress++;
    //If we fail we have too many construction sites
    else break;
  }
}
/**
 * Runs the logic required for turrets.
 * O(2n + 4t) --> n is the number of creeps
 * @param tower The tower being controlled
 */
function towerAI(tower){
  //Search for hostiles
  var hostiles = tower.room.find(FIND_HOSTILE_CREEPS, {filter: (c) => c.owner != 'ser1618' && c.owner != 'gavinmpaw200'}); //O(n)
  //Search for creeps with low health
  var healCreep = tower.room.find(FIND_MY_CREEPS, {filter: (c) => c.hits < c.hitsMax}); //(n)
  //Search for repair targets (non-wall)
  var nonWallRepair = tower.room.find(FIND_STRUCTURES, {filter: (s) => s.hits < s.hitsMax && s.structureType != STRUCTURE_WALL}); //O(t)
  //Search for wall repair targets
  var wallRepair = tower.room.find(FIND_STRUCTURES, {filter: (w) => w.hits < tower.room.memory.wallHPFloor + 1000 && w.structureType == STRUCTURE_WALL}); //O(t)
  //Attack the hostile creeps
  if(hostiles.length > 0) tower.attack(hostiles[0]);
  //Heal low health creep
  else if(healCreep.length > 0) tower.heal(healCreep[0]);
  //Repair a non-wall
  else if(nonWallRepair.length > 0) tower.repair(nonWallRepair[0]);
  //Repair a wall
  else if(wallRepair.length > 0 && tower.energy > tower.energyCapacity * 0.75) tower.repair(wallRepair[0]);
  //Set the room wall health floor to that of the lowest health wall
  else if(tower.energy > tower.energyCapacity * 0.75){
    //Find all the walls in the room
    var walls = tower.room.find(FIND_STRUCTURES, {filer: (w) => w.structureType == STRUCTURE_WALL}); //O(t)
    //Set the hp floor to something we can do something with
    tower.room.memory.wallHPFloor = walls[0].hits;
    //See if we can lower it even more
    for(var i = 0; i < walls.length; i++) if(walls[i].hits < tower.room.memory.wallHPFloor) tower.room.wallHPFloor = walls[i].hits; //O(t)
  }
}
//Public facing functions
module.exports = {
 /**
  * The main center piece from which the logic for each level is called.
  * Worst case: O(t) --> t is the number of STRUCTURES
  * Average case: O(c) --> runs in constant time
  * @param currentRoom the room in which the logic is being called.
  */
  run: function(currentRoom){
    //Call the corosponding and previous logic based on the current era level
    switch(currentRoom.memory.era){
      //Era 4 logic
      case 4: era4(currentRoom);
      //Era 3 logic
      case 3: era3(currentRoom);
      //Era 2 logic
      case 2: era2(currentRoom);
      //Era 1 logic
      case 1: era1(currentRoom);
    }
    //Note: When placed as such without break; eraN logic is called when era >= N
  },
 /**
  * Era logic which includes citadel construction.
  * Worst case: O(t + s * t) --> t is the number of STRUCTURES, s is the number of spawns
  * Average case: O(s * t) --> s is the number of spawns
  * @param currentRoom the room in which the logic and citadel are being constructed.
  */
  runWithCitadel: function(currentRoom){
    //Target room
    var targetRoom = currentRoom.name;
    //Iterate through all the spawns and check the room of spawn against the room we want and set the center if it's right
    for(var spawnNames in Game.spawns) if(targetRoom == Game.spawns[spawnNames].room.name) var center = Game.spawns[spawnNames]; //O(s)
    //Call the corosponding logic and previous logic based on the era level
    switch(currentRoom.memory.era){
      //Era 4 citadel and logic
      case 4: era4(currentRoom);
      //Era 3 citadel and logic
      case 3: era3(currentRoom);
      //Era 2 citadel and logic
      case 2: era2(currentRoom);
      //Era 1 citadel and logic
      case 1: constructCitadel(center); era1(currentRoom);
    }
    //Note: when placed as such without break; constructCitadelN is called when era >= N
  }
};
