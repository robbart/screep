/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('utils'); // -> 'a thing'
 */
 
 module.exports = {
     getBodyPartCost: function(bodyPartName) {
         var dict = {};
         dict[MOVE] = 50;
         dict[WORK] = 100;
         dict[CARRY] = 50;
         dict[ATTACK] = 80;
         dict[RANGED_ATTACK] = 150;
         dict[HEAL] = 250;
         dict[TOUGH] = 10;
         return dict[bodyPartName];
     },
     getBodyPartsCost: function(parts) {
        var cost = 0;
        var partsIndex = 0;
        var partsCount = parts.length;
        for(partsIndex = 0; partsIndex< partsCount; partsIndex++) {
            cost += this.getBodyPartCost(parts[partsIndex]);
        }
        return cost;
     },
     isOfUnitType: function(unitTypeName){
         return function(creep){
             return creep.memory.role == unitTypeName;
         };
     },
 };