/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('utils'); // -> 'a thing'
 */
 
 module.exports = {
     getBodyPartCost: function(bodyPartName){
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
 };