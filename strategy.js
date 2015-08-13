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
        
        if(targetRoom.find(FIND_CONSTRUCTION_SITES).length > targetRoom.memory.unitCount['builder']) {
            return builder;
        }
        
        return null;
    },
};