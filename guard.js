/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('builder'); // -> 'a thing'
 */
 
var utils = require('utils');
var config = require('config');

var guard = {
    roleName: 'guard',
    getBodyParts: function(maxEnergy){
        var levels = config.unitConfig[this.roleName].levels;
        var levelIndex = levels.length - 1;
        for(levelIndex = levels.length - 1; levelIndex >= 0; levelIndex--) {
            var levelConfig = levels[levelIndex];
            var levelCost = utils.getBodyPartsCost(levelConfig.parts);
            if(levelCost <= maxEnergy) {
                return levelConfig.parts;
            }
        }
        return levels[0].parts;
    },
    getCost: function(maxEnergy){
        return utils.getBodyPartsCost(this.getBodyParts(maxEnergy));
    },
    getUnitName: function(){
        return this.roleName;
    },
    getMemory: function(){
        return {
            'role': this.roleName,
            'disabled': false
        };
    },
    isDisabled: function(creep){
        return creep.getActiveBodyparts(MOVE) <= 0;
    },
    run: function (creep) {
        
        if(this.isDisabled(creep)) {
            if(!creep.memory.disabled) {
                creep.memory.disabled = true;
            }
            return;
        }
        
        var targets = creep.room.find(FIND_HOSTILE_CREEPS, {
            filter: function(i){
                return i.owner.username != 'Source Keeper';
            }
        });
        if(targets.length) {
            creep.moveTo(targets[0]);
            creep.attack(targets[0]);
        }
    }
};
 
module.exports = guard;