# Plastic Recycling - Object Identifier System

This project creates a sorting system for Plastic Recycling that can tell the difference between black, transparent, and colorful plastic objects, then send them to the right conveyor belt.

## Project Overview

We handle three main types of plastic that need to be sorted separately:
- Black plastic → Conveyor Belt A
- Transparent plastic → Conveyor Belt B
- Colorful plastic → Conveyor Belt C

This separation is important because it keeps each type of plastic pure during the recycling process when we turn them into chairs.

## How to Run the Project

1. Clone this repository to your computer
2. Add your plastic images to these folders:
   - images/black/ (at least 10 images of black plastic)
   - images/transparent/ (at least 10 images of clear plastic)
   - images/colorful/ (at least 10 images of colored plastic)
3. Open `index.html` in Chrome, Firefox, or any modern browser
4. Try it out! Click different buttons to process plastic objects

## Implementation Details

### How the Image Analysis Works

Our system looks at images of plastic and sorts them using HSL color analysis:

1. **Black Plastic Detection**:
   - We check if the image has low lightness (L < 30%) and low saturation
   - Dark objects with little color variation go to Conveyor Belt A

2. **Transparent Plastic Detection**:
   - We look for high lightness values and count near-white pixels
   - Objects with many bright pixels and low color saturation go to Conveyor Belt B

3. **Colorful Plastic Detection**:
   - We measure color saturation - how vivid the colors are
   - Objects with moderate to high saturation go to Conveyor Belt C

### Key Components

1. **PlasticObjectIdentifier.js**: Core module that routes objects to the right conveyor belt
2. **app.js**: Handles the image processing and user interface
3. **index.html**: The web interface you interact with
4. **styles.css**: Makes everything look nice

### The Analysis Process Step by Step

1. We load your image onto a virtual canvas
2. For each pixel, we calculate:
   - Lightness (how bright/dark it is)
   - Saturation (how colorful it is)
   - Percentage of white pixels (for transparent detection)
3. Based on these values, we classify the object
4. The system displays results and shows the object moving to the correct belt

## Dataset

Our testing dataset has 10-20 images in each category:
- Various black plastic items
- Clear/transparent plastics of different shapes
- Colorful plastic objects with different patterns

The images were taken in consistent lighting to help with accurate classification.
