# Kursi Plastic Recycling — Image Classification Report

## 1. Approach & Logic
- **Canvas-based analysis**  
  We loaded each image onto a canvas and grabbed the pixel colors using JavaScript.
- **HSL Color Checking**  
  Instead of RGB, we converted to HSL because it's easier to tell colors apart:  
  • Lightness (L) shows how bright it is  
  • Saturation (S) shows how colorful it is  
- **White Check**  
  We counted how many super bright pixels there are to find clear plastic.
- **How We Sort Stuff**  
  • **Black**: dark stuff with not much color (L < 30% & S < 40%)  
  • **Transparent**: lots of white pixels (>40%) or super bright with no color  
  • **Colorful**:  
    - Anything with decent color (S ≥ 35%)  
    - If it's not dark enough for black or bright enough for clear, it's probably colorful

## 2. Challenges & Solutions
- **Clear vs. Colorful mix-ups**  
  At first our system kept thinking white plastic with patterns was colorful.  
  _How we fixed it_: Started counting white pixels and tweaked the brightness cutoffs.
- **Weird lighting problems**  
  Sometimes shadows made clear stuff look dark or colorful.  
  _How we fixed it_: Added backup checks and confidence scores.
- **Slow processing**  
  Checking every pixel in big images made the page freeze up.  
  _How we fixed it_: Made the images smaller and optimized the code a bit.

## 3. Results & Screenshots
- **Black Plastic → Belt A**  
  ![Black Chair](screenshots/black1.jpg)
- **Transparent Plastic → Belt B**  
  ![Clear Chair](screenshots/transparent3.jpg)
- **Colorful Plastic → Belt C**  
  ![Colorful Chair](screenshots/colorful2.jpg)

## 4. Repository
All our code is on GitHub:  
https://github.com/yourusername/KursiPlasticRecycling
