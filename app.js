document.addEventListener('DOMContentLoaded', function() {
    // Make a new plastic sorter thingy
    const identifier = new PlasticObjectIdentifier();

    // All the pictures we have
    const allImages = {
        'images/black': ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg', '8.jpg', '9.jpg', '10.jpg'],
        'images/transparent': ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg', '8.jpg'],
        'images/colorful': ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg']
    };
    
    // DOM elements
    const objectSelectorDiv = document.querySelector('.object-selector');
    const currentObject = document.getElementById('current-object');
    const resultsDisplay = document.getElementById('results-display');
    const beltAItems = document.getElementById('belt-A-items');
    const beltBItems = document.getElementById('belt-B-items');
    const beltCItems = document.getElementById('belt-C-items');
    
    // Clear out the existing buttons and create a new interface
    objectSelectorDiv.innerHTML = '';
    
    // Create the random object button
    const analyzeRandomBtn = document.createElement('button');
    analyzeRandomBtn.id = 'analyze-random';
    analyzeRandomBtn.className = 'object-btn random';
    analyzeRandomBtn.textContent = 'Analyze Random Object';
    objectSelectorDiv.appendChild(analyzeRandomBtn);
    
    // Create a button to process multiple objects
    const processBatchBtn = document.createElement('button');
    processBatchBtn.id = 'process-batch';
    processBatchBtn.className = 'object-btn process-all';
    processBatchBtn.textContent = 'Process 10 Random Objects';
    objectSelectorDiv.appendChild(processBatchBtn);
    
    // Add file selection option
    const fileLabel = document.createElement('label');
    fileLabel.className = 'file-input-label';
    fileLabel.innerHTML = '<span>Upload Your Own Image</span>';
    
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.className = 'file-input';
    fileInput.id = 'image-upload';
    
    fileLabel.appendChild(fileInput);
    objectSelectorDiv.appendChild(fileLabel);
    
    // Add heading above the controls
    const controlHeading = document.createElement('h3');
    controlHeading.textContent = 'Select an object for analysis:';
    objectSelectorDiv.insertBefore(controlHeading, objectSelectorDiv.firstChild);
    
    // Event listener for random object button
    analyzeRandomBtn.addEventListener('click', () => analyzeRandomObject());
    
    // Event listener for batch processing
    processBatchBtn.addEventListener('click', () => processBatchObjects(10));
    
    // Event listener for file upload
    fileInput.addEventListener('change', (event) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const imageUrl = URL.createObjectURL(file);
            analyzeSpecificImage(imageUrl, file.name);
        }
    });
    
    // image color checking stuff
    const imageAnalyzer = {
        /**
         * Look at an image and figure out what color it is
         * @param {string} imageSrc - Path to the image
         * @param {Function} callback - Callback function with result
         */
        analyze: function(imageSrc, callback) {
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.onload = function() {
                const result = imageAnalyzer.processImage(img);
                callback(result);
            };
            img.onerror = function() {
                console.error("Error loading image for analysis");
                callback({type: null, error: "Failed to load image"});
            };
            img.src = imageSrc;
        },
        
        /**
         * this actually checks the colors
         * It's pretty math-heavy but it works... most of the time :)
         * @param {HTMLImageElement} img - The image to analyze
         * @returns {Object} Analysis results
         */
        processImage: function(img) {
            // Draw the image on a canvas so we can mess with it
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            // Get all the pixels - this might be slow for big pictures!
            const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const totalPixels = data.length / 4;

            // Add up the brightness and color stuff
            let sumLightness = 0;
            let sumSaturation = 0;

            // Look at each pixel one by one
            for (let i = 0; i < data.length; i += 4) {
                const r = data[i] / 255;
                const g = data[i + 1] / 255;
                const b = data[i + 2] / 255;

                const max = Math.max(r, g, b);
                const min = Math.min(r, g, b);
                const l = (max + min) / 2;
                const delta = max - min;
                const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

                sumLightness += l * 100;   // %
                sumSaturation += s * 100;  // %
            }

            // After HSL accumulators loop, count near-white pixels
            let whitePixels = 0;
            for (let i = 0; i < data.length; i += 4) {
                const r0 = data[i], g0 = data[i+1], b0 = data[i+2];
                if (r0 > 200 && g0 > 200 && b0 > 200) whitePixels++;
            }
            const whitePixelPercentage = whitePixels / totalPixels * 100;

            const avgL = sumLightness / totalPixels;
            const avgS = sumSaturation / totalPixels;

            // Figure out if it's black, clear or colorful
            let objectType, confidenceScore, classificationReason;
            if (avgL < 30 && avgS < 40) {
                objectType = 'black';
                confidenceScore = 100 - avgL;
                classificationReason = 'Low lightness & low saturation';
            }
            else if (whitePixelPercentage > 40 && avgS < 35) {
                objectType = 'transparent';
                confidenceScore = whitePixelPercentage;
                classificationReason = 'High white-pixel ratio (>40%) & low saturation';
            }
            else if (avgL > 75 && avgS < 25) {
                objectType = 'transparent';
                confidenceScore = avgL;
                classificationReason = 'Very high lightness (>75%) & very low saturation';
            }
            else {
                objectType = 'colorful';
                confidenceScore = avgS;
                classificationReason = 'Higher saturation or mixed colors';
            }

            return {
                type: objectType,
                confidenceScore: Math.round(confidenceScore),
                classificationReason,
                avgLightness: Math.round(avgL),
                avgSaturation: Math.round(avgS),
                whitePixelPercentage: Math.round(whitePixelPercentage),
                imageWidth: img.width,
                imageHeight: img.height
            };
        }
    };
    
    /**
     * Process a bunch of objects at once 
     * @param {number} count - Number of objects to process
     */
    function processBatchObjects(count) {
        // Disable buttons during batch processing
        setButtonsEnabled(false);
        
        let processed = 0;
        
        // Display a message that batch processing is starting
        resultsDisplay.innerHTML = `
            <p><strong>Batch Processing:</strong> Starting to analyze ${count} random plastic objects...</p>
            <p>Processing object 1 of ${count}...</p>
        `;
        
        // Process the first object
        processNextObject();
        
        // Function to process objects in sequence
        function processNextObject() {
            if (processed < count) {
                // Update the status message
                resultsDisplay.innerHTML = `
                    <p><strong>Batch Processing:</strong> ${processed + 1} of ${count}</p>
                    <p>Analyzing random plastic object...</p>
                `;
                
                // Process a random object with callback to process the next one
                analyzeRandomObject(function() {
                    processed++;
                    // Set a timeout before processing the next object for visual effect
                    setTimeout(processNextObject, 1500);
                });
            } else {
                // Batch processing complete
                resultsDisplay.innerHTML += `
                    <p class="success"><strong>Batch Processing Complete!</strong></p>
                    <p>All ${count} objects have been analyzed and sorted to appropriate conveyor belts.</p>
                `;
                // Re-enable buttons
                setButtonsEnabled(true);
            }
        }
    }
    
    /**
     * Enable or disable all control buttons
     */
    function setButtonsEnabled(enabled) {
        const buttons = [analyzeRandomBtn, processBatchBtn];
        const fileInputLabel = document.querySelector('.file-input-label');
        
        buttons.forEach(button => {
            button.disabled = !enabled;
            if (enabled) {
                button.classList.remove('disabled');
            } else {
                button.classList.add('disabled');
            }
        });
        
        // Also disable/enable the file input
        if (enabled) {
            fileInputLabel.classList.remove('disabled');
        } else {
            fileInputLabel.classList.add('disabled');
        }
    }
    
    /**
     * Get a random image from any folder
     */
    function getRandomImage() {
        // Get all folder paths
        const folders = Object.keys(allImages);
        
        // Select a random folder
        const randomFolder = folders[Math.floor(Math.random() * folders.length)];
        
        // Select a random image from the folder
        const images = allImages[randomFolder];
        const randomImage = images[Math.floor(Math.random() * images.length)];
        
        // Return the full path
        return `${randomFolder}/${randomImage}`;
    }
    
    /**
     * Analyze a random object
     */
    function analyzeRandomObject(callback) {
        // Get a random image
        const imagePath = getRandomImage();
        analyzeSpecificImage(imagePath, null, callback);
    }
    
    /**
     * Analyze a specific image
     */
    function analyzeSpecificImage(imagePath, filename, callback) {
        // Reset and show processing status
        currentObject.classList.add('processing');
        
        // Set the image
        currentObject.src = imagePath;
        
        // Update results to show processing
        resultsDisplay.innerHTML = `<p>Analyzing image${filename ? ` "${filename}"` : ''}...</p>`;
        
        // Process the object after loading the image
        imageAnalyzer.analyze(imagePath, function(analysisResult) {
            // Determine the object type based on analysis
            let objectType = analysisResult.type;
            
            setTimeout(() => {
                try {
                    // direct routing by analysisResult.type
                    const beltMap = { black: 'A', transparent: 'B', colorful: 'C' };
                    const conveyorBelt = beltMap[analysisResult.type] || 'A';

                    displayResults({ objectType: analysisResult.type, conveyorBelt }, analysisResult);
                    moveObjectToConveyor(conveyorBelt, analysisResult.type);
                    currentObject.classList.remove('processing');
                    
                    // Call the callback if provided
                    if (typeof callback === 'function') {
                        callback();
                    }
                } catch (error) {
                    resultsDisplay.innerHTML = `<p class="error">Error: ${error.message}</p>`;
                    currentObject.classList.remove('processing');
                    
                    // Call the callback even on error
                    if (typeof callback === 'function') {
                        callback();
                    }
                }
            }, 1000);
        });
    }
    
    /**
     * Display processing results with analysis data
     */
    function displayResults(result, analysisData) {
        // Format the confidence as a percentage
        const confidencePercentage = analysisData.confidenceScore + '%';
        
        resultsDisplay.innerHTML = `
            <p><strong>Classification:</strong> ${result.objectType} plastic</p>
            <p><strong>Conveyor Belt:</strong> ${result.conveyorBelt}</p>
            <p><strong>Confidence:</strong> ${confidencePercentage}</p>
            <p><strong>Classification Criteria:</strong> ${analysisData.classificationReason}</p>
            <p><strong>Analysis Details:</strong></p>
            <ul>
                <li>Average Brightness: ${Math.round(analysisData.avgBrightness)}/255</li>
                <li>Dark Pixel Percentage: ${Math.round(analysisData.darkPixelPercentage)}%</li>
                <li>Bright Pixel Percentage: ${Math.round(analysisData.brightPixelPercentage)}%</li>
                <li>Color Saturation: ${Math.round(analysisData.avgSaturation)}/255</li>
                <li>Color Variety: ${analysisData.distinctColors} distinct colors</li>
                <li>Top 5 Colors Coverage: ${analysisData.top5ColorPercentage}%</li>
                <li>Brightness Variance: ${Math.round(analysisData.brightnessVariance)}</li>
            </ul>
            <p class="success">Object successfully sorted!</p>
        `;
    }
    
    /**
     * Move the object to the appropriate conveyor belt
     */
    function moveObjectToConveyor(belt, objectType) {
        const newItem = document.createElement('div');
        newItem.className = 'belt-item';
        
        // Create image element for the belt item
        const img = document.createElement('img');
        img.src = currentObject.src; // Use the same image that was displayed
        img.alt = `${objectType} plastic`;
        img.className = 'belt-item-img';
        newItem.appendChild(img);
        
        // Add a label showing the object type
        const label = document.createElement('div');
        label.className = 'belt-item-label';
        label.textContent = objectType;
        newItem.appendChild(label);
        
        // Add to the appropriate belt
        switch (belt) {
            case ConveyorBelt.A:
                beltAItems.appendChild(newItem);
                break;
            case ConveyorBelt.B:
                beltBItems.appendChild(newItem);
                break;
            case ConveyorBelt.C:
                beltCItems.appendChild(newItem);
                break;
        }
        
        // Limit the number of items on each belt to prevent overflow
        const maxItems = 4;
        limitItems(beltAItems, maxItems);
        limitItems(beltBItems, maxItems);
        limitItems(beltCItems, maxItems);
    }
    
    // Limit the number of items on a conveyor belt
    function limitItems(beltElement, maxItems) {
        while (beltElement.children.length > maxItems) {
            beltElement.removeChild(beltElement.firstChild);
        }
    }
    
    // Start with a random object when page loads
    analyzeRandomObject();
});
