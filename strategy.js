/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('strategy'); // -> 'a thing'
 */
 
var harvester = require('harvester');
var guard = require('guard');
var builder = require('builder');
var repairer = require('repairer');
var config = require('config');
 
module.exports = {
    getCurrentSpawnTarget: function(spawn){
        
        var targetRoom = spawn.room;
        
        var hostileCreeps = targetRoom.find(FIND_HOSTILE_CREEPS);
        if(hostileCreeps.length > 0 && targetRoom.memory.unitCount['guard'] < hostileCreeps.length) {
            return guard;
        }
        
        if(!targetRoom.memory.harvestersFull) {
            return harvester;
        }
        
        var buildersCurrent = targetRoom.memory.unitCount['builder'];
        if(buildersCurrent < config.MaxBuildersNum && targetRoom.find(FIND_CONSTRUCTION_SITES).length > buildersCurrent) {
            return builder;
        }
        
        var repairersCount = targetRoom.memory.unitCount['repairer'];
        if(repairersCount < targetRoom.memory.repairersNeeded) {
            return repairer;
        }
        
        return null;
    },
};