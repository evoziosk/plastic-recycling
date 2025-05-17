/**
 * Kursi Plastic Recycling - Object Identifier Module
 * 
 * This module identifies plastic objects by type and routes them
 * to the appropriate conveyor belt for recycling.
 */

// Object type constants
const PlasticObjectType = {
  BLACK: 'black',
  TRANSPARENT: 'transparent',
  COLORFUL: 'colorful'
};

// Conveyor belt constants
const ConveyorBelt = {
  A: 'A', // For black objects
  B: 'B', // For transparent objects
  C: 'C'  // For colorful objects
};

/**
 * Class responsible for identifying plastic objects and routing them
 * to the correct conveyor belt.
 */
class PlasticObjectIdentifier {
  /**
   * Identifies the type of a plastic object based on its properties
   * @param {Object} object - The plastic object to identify
   * @returns {string} The type of the plastic object
   */
  identifyObjectType(object) {
    if (!object || typeof object !== 'object') {
      throw new Error('Invalid object provided');
    }

    // Simple identification logic based on object properties
    if (object.color === 'black') {
      return PlasticObjectType.BLACK;
    } else if (object.transparency > 0.8) {
      return PlasticObjectType.TRANSPARENT;
    } else if (object.hasMultipleColors) {
      return PlasticObjectType.COLORFUL;
    } else {
      throw new Error('Unable to identify object type');
    }
  }

  /**
   * Routes an object to the appropriate conveyor belt based on its type
   * @param {string} objectType - The type of plastic object
   * @returns {string} The conveyor belt to route the object to
   */
  routeToConveyorBelt(objectType) {
    switch (objectType) {
      case PlasticObjectType.BLACK:
        return ConveyorBelt.A;
      case PlasticObjectType.TRANSPARENT:
        return ConveyorBelt.B;
      case PlasticObjectType.COLORFUL:
        return ConveyorBelt.C;
      default:
        throw new Error(`Unknown object type: ${objectType}`);
    }
  }

  /**
   * Processes a plastic object by identifying it and routing it
   * to the correct conveyor belt
   * @param {Object} object - The plastic object to process
   * @returns {Object} The processing result containing object type and conveyor belt
   */
  processObject(object) {
    const objectType = this.identifyObjectType(object);
    const conveyorBelt = this.routeToConveyorBelt(objectType);
    
    return {
      objectType,
      conveyorBelt
    };
  }
}

// Make the module work in both Node.js and browser environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    PlasticObjectIdentifier,
    PlasticObjectType,
    ConveyorBelt
  };
}
