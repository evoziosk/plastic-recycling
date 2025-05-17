# Kursi Plastic Recycling - Object Identifier System

This project implements an automated sorting system for Kursi Plastic Recycling, which classifies plastic objects as black, transparent, or colorful and routes them to the appropriate conveyor belt.

## Project Overview

Kursi specializes in processing three types of plastic objects that are sorted onto separate conveyor belts:
- Black objects → Conveyor Belt A
- Transparent objects → Conveyor Belt B
- Colorful objects → Conveyor Belt C

This sorting ensures that each type of plastic is processed independently to maintain purity during recycling into chairs.

## How to Run the Project

1. Clone this repository to your local machine
2. Make sure you have the images organized in these folders:
   - images/black/ (10+ images of black plastic objects)
   - images/transparent/ (10+ images of transparent plastic objects)
   - images/colorful/ (10+ images of colorful plastic objects)
3. Open `index.html` in a modern web browser
4. Use the interface buttons to select and process different plastic objects

## Implementation Details

### Image Analysis Logic

The system uses the following approach to classify plastic objects:

1. **Black Object Detection**:
   - If over 70% of pixels are dark (brightness < 50), the object is classified as black
   - These objects are sent to Conveyor Belt A

2. **Transparent Object Detection**:
   - If average brightness is high (> 180) with limited color variety
   - These objects are sent to Conveyor Belt B

3. **Colorful Object Detection**:
   - If the image contains many distinct colors (> 100)
   - These objects are sent to Conveyor Belt C

### Key Components

1. **PlasticObjectIdentifier.js**: Core module that determines the conveyor belt based on object type
2. **app.js**: Handles image analysis and user interface interactions
3. **index.html**: Web interface for demonstrating the system
4. **styles.css**: Styling for the web interface

### Image Analysis Process

1. Load image into a canvas element
2. Analyze pixel data to calculate:
   - Average brightness
   - Percentage of dark pixels
   - Variety of colors present
3. Apply classification rules based on these measurements
4. Determine the appropriate conveyor belt

## Dataset

The dataset consists of 10-20 images for each category:
- Black plastic objects (various black plastic items)
- Transparent plastic objects (clear plastics of different shapes)
- Colorful plastic objects (multi-colored plastic items)

All images were manually captured and sorted to ensure proper classification.

## Future Improvements

- Implement machine learning for more accurate classification
- Add support for processing video streams in real-time
- Enhance the analysis to detect specific types of plastic (PET, HDPE, etc.)
