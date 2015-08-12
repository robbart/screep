/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('init'); // -> 'a thing'
 */
 
module.exports = function () { 

	Memory.initialized = true;
	Memory.unitID = 0;
	Memory.unitCount = {
	    'harvester': 0,
	    'guard': 0,
	    'harvester': 0
	};
	
}