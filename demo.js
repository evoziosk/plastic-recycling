const { PlasticObjectIdentifier } = require('./PlasticObjectIdentifier');

// Create an instance of the identifier
const identifier = new PlasticObjectIdentifier();

// Example plastic objects to process
const objects = [
  { id: 1, color: 'black', transparency: 0.1, hasMultipleColors: false },
  { id: 2, color: 'clear', transparency: 0.9, hasMultipleColors: false },
  { id: 3, color: 'mixed', transparency: 0.3, hasMultipleColors: true }
];

// Process each object
console.log('=== Kursi Plastic Object Processing ===');
objects.forEach(object => {
  try {
    const result = identifier.processObject(object);
    console.log(`Object ${object.id}: ${result.objectType} → Conveyor Belt ${result.conveyorBelt}`);
  } catch (error) {
    console.error(`Error processing object ${object.id}: ${error.message}`);
  }
});
