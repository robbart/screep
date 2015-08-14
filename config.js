/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('config'); // -> 'a thing'
 */
 
var config = {};

// Resources
config.MaxHarvestersCountPerResourcePoint = 6;
config.MaxBuildersNum = 4;
config.MinEnergyBuilderGetFromSpawn = 100;
config.MinEnergyBuilderGetFromExtension = 0;
config.RampartHitsMax = 20000;


config.RepairerRatio = {
    'rampart': 0.1
};
config.RepairerRatioDefault = 0.025;
config.getRepairerRatioForStructureType = function(st){
    if(st in config.RepairerRatio) {
        return config.RepairerRatio[st];
    }
    return config.RepairerRatioDefault;
};
config.DistancePriorityCost = 0.005;
config.getDistancePriority = function(distanceX, distanceY){
    return config.DistancePriorityCost * (Math.abs(distanceX) + Math.abs(distanceY));
};
config.getRepairPriority = function(structureType, hits, hitsMax, distanceX, distanceY){
    switch(structureType) {
        case STRUCTURE_ROAD: {
            return 0.50 + hits / hitsMax + config.getDistancePriority(distanceX, distanceY);
            break;
        }
        case STRUCTURE_RAMPART: {
            return 0.25 + hits / config.RampartHitsMax + config.getDistancePriority(distanceX, distanceY);
            break;
        }
    }
    return 1 + hits / hitsMax + config.getDistancePriority(distanceX, distanceY);
};

// Units
config.unitConfig = {};

config.unitConfig.harvester = {
    levels: [
        {
            level: 1,
            parts: [WORK, CARRY, MOVE, MOVE]
        },
        {
            level: 2,
            parts: [WORK, WORK, CARRY, MOVE, MOVE, MOVE]
        },
        {
            level: 3,
            parts: [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE]
        },
        {
            level: 4,
            parts: [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE]
        },
        {
            level: 5,
            parts: [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
        },
    ]
};

config.unitConfig.builder = {
    levels: [
        {
            level: 1,
            parts: [WORK, CARRY, MOVE, MOVE]
        },
        {
            level: 2,
            parts: [WORK, CARRY, CARRY, MOVE, MOVE, MOVE]
        },
        {
            level: 3,
            parts: [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE]
        },
        {
            level: 4,
            parts: [WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE]
        },
        {
            level: 5,
            parts: [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
        },
    ]
};

config.unitConfig.repairer = {
    levels: [
        {
            level: 1,
            parts: [WORK, CARRY, MOVE, MOVE]
        },
        {
            level: 2,
            parts: [WORK, CARRY, CARRY, MOVE, MOVE, MOVE]
        },
        {
            level: 3,
            parts: [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE]
        },
        {
            level: 4,
            parts: [WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE]
        },
        {
            level: 5,
            parts: [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
        },
    ]
};

config.unitConfig.guard = {
    levels: [
        {
            level: 1,
            parts: [MOVE, ATTACK]
        },
        {
            level: 2,
            parts: [TOUGH, MOVE, MOVE, ATTACK]
        },
        {
            level: 3,
            parts: [TOUGH, TOUGH, MOVE, MOVE, MOVE, ATTACK]
        },
    ]
};


module.exports = config;