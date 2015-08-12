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
        return [MOVE, ATTACK, TOUGH];
    },
    getCost: function(){
        return utils.getBodyPartsCost(this.getBodyParts());
    },
    getUnitName: function(){
        Memory.unitID++;
        return this.roleName + Memory.unitID.toString();
    },
    getMemory: function(){
        return {
            'role': this.roleName
        };
    },
    run: function (creep) { 
        var targets = creep.room.find(FIND_HOSTILE_CREEPS);
        if(targets.length) {
            creep.moveTo(targets[0]);
            creep.attack(targets[0]);
        }
    }
};
 
module.exports = guard;