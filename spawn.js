/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('spawn'); // -> 'a thing'
 */
 
Spawn.prototype.createUnitOfType = function(unitType, nameSuffix) {
    if(!nameSuffix) nameSuffix = "";
    return this.createCreep(unitType.getBodyParts(), unitType.getUnitName() + nameSuffix, unitType.getMemory());
};

 
var strategy = require('strategy');
 
module.exports = function (spawn) { 
    
    if(spawn.spawning) {
        return;
    }
    
    var unitType = strategy.getCurrentSpawnTarget(spawn);

    if(!unitType)
        return;
        
	if(spawn.energy >= unitType.getCost()) {
	    spawn.createUnitOfType(unitType, new Date().getTime());
    }
    
}
 
 