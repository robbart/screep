/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('spawn'); // -> 'a thing'
 */
 
var strategy = require('strategy');
 
module.exports = function (spawn) { 
    
    if(spawn.spawning) {
        return;
    }
    
    var unitType = strategy.getCurrentSpawnTarget(spawn);

    if(!unitType)
        return;
    
    var totalEnergy = spawn.getEnergyTotal();
    var totalEnergyCapacity = spawn.getEnergyCapacityTotal();
	if(totalEnergy >= unitType.getCost(totalEnergyCapacity)) {
	    spawn.createUnitOfType(unitType, new Date().getTime(), totalEnergyCapacity);
    }
    
}
 
 