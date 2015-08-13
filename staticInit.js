/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('staticInit'); // -> 'a thing'
 */
 
 /*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('init'); // -> 'a thing'
 */
 
var utils = require('utils');
var config = require('config');
 
module.exports = function () { 
    
    Room.prototype.initStats = function() {
        
        var room = this;
        var harvesters = room.find(FIND_MY_CREEPS, {filter: utils.isOfUnitType('harvester')});
        var guards = room.find(FIND_MY_CREEPS, {filter: utils.isOfUnitType('guard')});
        var builders = room.find(FIND_MY_CREEPS, {filter: utils.isOfUnitType('builder')});
        var resourcePoints = room.find(FIND_SOURCES_ACTIVE);
        
        // Collect room stats
        room.memory.unitCount = {
            'harvester': harvesters.length,
            'guard': guards.length,
            'builder': builders.length,
        };
        
        // Collect resource point stats
        var resourceTargetedStat = {};
        
        var resourcePointIndex;
        var resourcePointsCount = resourcePoints.length;
        for(resourcePointIndex = 0; resourcePointIndex < resourcePointsCount; resourcePointIndex++) {
            resourceTargetedStat[resourcePoints[resourcePointIndex].id] = [];
        }
        
        var harvesterIndex;
        var harvestersCount = harvesters.length;
        for(harvesterIndex = 0; harvesterIndex < harvestersCount; harvesterIndex++) {
            var harvesterCreep = harvesters[harvesterIndex];
            if(harvesterCreep.memory.target && harvesterCreep.memory.target.length > 0 && harvesterCreep.memory.target in resourceTargetedStat) {
                resourceTargetedStat[harvesterCreep.memory.target].push(harvesterCreep);
            }
        }
        room.memory.resourcePointsCount = resourcePoints.length;
        room.memory.resourceTargeted = resourceTargetedStat;
        var maxResourceWorkersCount = resourcePointsCount * config.MaxHarvestersCountPerResourcePoint;
        room.memory.harvestersFull = harvestersCount >= maxResourceWorkersCount;
        
        
    };
    
}