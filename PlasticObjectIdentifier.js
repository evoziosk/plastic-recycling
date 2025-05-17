/**
 * This figures out where to send plastic things based on color.
 */

// Types of plastic we can handle
const PlasticObjectType = {
  BLACK: 'black',
  TRANSPARENT: 'transparent',
  COLORFUL: 'colorful'
};

// Our conveyor belts
const ConveyorBelt = {
  A: 'A', // Black stuff goes here
  B: 'B', // Clear stuff goes here
  C: 'C'  // Colorful stuff goes here
};

/**
 * This is the main class that does all the work
 */
class PlasticObjectIdentifier {
  /**
   * Figure out what type of plastic it is by looking at it
   * Might not work for weird colors or dark lighting!
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
   * Once we know what kind of plastic it is, send it to the right belt
   * just a switch statement
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
   * Takes a plastic object and processes it from start to finish
   * This is what you should call from outside
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

module.exports = {
  PlasticObjectIdentifier,
  PlasticObjectType,
  ConveyorBelt
};
