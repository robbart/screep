/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('builder'); // -> 'a thing'
 */
 
var utils = require('utils');

var guard = {
    roleName: 'guard',
    getBodyParts: function(){
        return [TOUGH, MOVE, MOVE, ATTACK];
    },
    getCost: function(){
        return utils.getBodyPartsCost(this.getBodyParts());
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