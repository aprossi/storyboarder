#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const PROMPT_FILE = 'prompts.txt';
const OUTPUT_DIR = 'generated_images';
const HEIGHT = 600;
const WIDTH = 600;
const STEPS = 1;
const QUALITY = 8;
const SEED = 4; // Using consistent seed for better consistency

// Style presets - can be expanded with more options
const STYLE_PRESETS = {
    "dore": {
        name: "Gustave Doré",
        description: "black and white realistic, detailed engraving in the style of Gustave Dore",
        model: "schnell"
    },
    "ukiyo-e": {
        name: "Ukiyo-e",
        description: "traditional Japanese ukiyo-e woodblock print style, vibrant colors, flat perspective",
        model: "schnell"
    },
    "pixel": {
        name: "Pixel Art",
        description: "retro 16-bit pixel art style, limited color palette, nostalgic game aesthetic",
        model: "schnell"
    },
    "watercolor": {
        name: "Watercolor",
        description: "soft watercolor painting with gentle washes of color, loose brushwork, and natural textures",
        model: "schnell"
    },
    "art-nouveau": {
        name: "Art Nouveau",
        description: "elegant Art Nouveau style with ornate flowing curves, natural forms, and decorative elements",
        model: "schnell"
    },
    "ghibli": {
        name: "Studio Ghibli",
        description: "whimsical Studio Ghibli animation style with soft colors, expressive characters, and magical atmosphere",
        model: "schnell"
    },
    "cartoon": {
        name: "Modern Cartoon",
        description: "colorful modern cartoon style with bold outlines, vibrant colors, and exaggerated proportions",
        model: "schnell"
    },
    "claymation": {
        name: "Claymation",
        description: "stop-motion claymation style with textured surfaces and distinctive modeling clay appearance",
        model: "schnell"
    },
    "caravaggio": {
        name: "Caravaggio",
        description: "dramatic chiaroscuro style with realistic figures, intense shadows, and theatrical lighting",
        model: "schnell"
    },
    "rembrandt": {
        name: "Rembrandt",
        description: "baroque style with warm tones, soft lighting, and introspective realism",
        model: "schnell"
    },
    "impressionist": {
        name: "Impressionist",
        description: "loose brushwork with vibrant colors and soft lighting capturing fleeting outdoor scenes",
        model: "schnell"
    },
    "van-gogh": {
        name: "Van Gogh",
        description: "expressive post-impressionist style with bold colors, swirling brushstrokes, and emotional intensity",
        model: "schnell"
    },
    "quick-sketch": {
        name: "Quick Sketch",
        description: "loose, spontaneous line work like a pencil or ink sketch on a napkin; rough and gestural",
        model: "schnell"
    },
    "technical-drawing": {
        name: "Technical Drawing",
        description: "precise, schematic line art with clean geometry, measurements, and architectural clarity",
        model: "schnell"
    },
    "medieval": {
        name: "Medieval",
        description: "illuminated manuscript style with flat perspective, gold accents, and ornate decorative borders",
        model: "schnell"
    },
    "anime": {
        name: "Anime",
        description: "stylized characters with clean lines, expressive faces, and cel-shaded color",
        model: "schnell"
    },
    "dark-fantasy": {
        name: "Dark Fantasy",
        description: "moody, gothic environments with dramatic lighting and ominous visual tone",
        model: "schnell"
    },
    "engraving": {
        name: "Engraving",
        description: "fine-line monochrome textures mimicking traditional etching or printmaking",
        model: "schnell"
    },
    "collage": {
        name: "Collage",
        description: "mixed media with cut-out textures, layered materials, and eclectic visuals",
        model: "schnell"
    },
    "infographic": {
        name: "Infographic",
        description: "colorful, data-driven visuals with icons, graphs, and labeled diagrams",
        model: "schnell"
    },
    "storyboard": {
        name: "Storyboard",
        description: "sequential sketch panels with framing and motion notes, like a film draft",
        model: "schnell"
    },
    "blueprint": {
        name: "Blueprint",
        description: "technical architectural drawings with monochrome lines and precise dimensions",
        model: "schnell"
    },
    "cubist": {
        name: "Cubist",
        description: "fragmented geometric shapes with multiple perspectives and abstract composition",
        model: "schnell"
    },
    "surrealist": {
        name: "Surrealist",
        description: "dreamlike and irrational imagery with symbolic and unexpected juxtapositions",
        model: "schnell"
    },
    "minimalist": {
        name: "Minimalist",
        description: "clean, reduced design with limited color and emphasis on space and form",
        model: "schnell"
    },
    "byzantine": {
        name: "Byzantine",
        description: "iconic religious art with flat gold backgrounds, stylized figures, and symbolic forms",
        model: "schnell"
    },
    "renaissance": {
        name: "Renaissance",
        description: "realistic composition with balanced proportions, sfumato, and classical themes",
        model: "schnell"
    },
    "art-nouveau": {
        name: "Art Nouveau",
        description: "elegant organic lines, floral patterns, and decorative flowing forms",
        model: "schnell"
    }
};

// Create output directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
}

// Read and parse the narrative prompts file (without style information)
function readPrompts(filename) {
    const content = fs.readFileSync(filename, 'utf8');
    return content.split('\n\n').map(prompt => prompt.trim()).filter(prompt => prompt.length > 0);
}

// Detect setting from prompts and create appropriate consistency booster
function getConsistencyBooster(prompts) {
    // Check if prompts contain common keywords to determine setting
    const allPromptsText = prompts.join(' ').toLowerCase();
    
    if (allPromptsText.includes('mars') || allPromptsText.includes('martian')) {
        return "consistent Martian landscape with same rock formations and dome habitat, same artistic style throughout the series";
    } 
    else if (allPromptsText.includes('ocean') || allPromptsText.includes('sea') || allPromptsText.includes('underwater')) {
        return "consistent underwater environment with same coral formations and seafloor features, same artistic style throughout the series";
    }
    else if (allPromptsText.includes('forest') || allPromptsText.includes('woods') || allPromptsText.includes('jungle')) {
        return "consistent forest landscape with same trees and natural features, same artistic style throughout the series";
    }
    else if (allPromptsText.includes('city') || allPromptsText.includes('urban')) {
        return "consistent cityscape with same buildings and urban features, same artistic style throughout the series";
    }
    else if (allPromptsText.includes('space') || allPromptsText.includes('star') || allPromptsText.includes('galaxy')) {
        return "consistent space environment with same celestial features, same artistic style throughout the series";
    }
    else if (allPromptsText.includes('castle') || allPromptsText.includes('medieval') || allPromptsText.includes('fantasy')) {
        return "consistent fantasy realm with same landscape features and architecture, same artistic style throughout the series";
    }
    else {
        // Generic consistency booster if no specific setting is detected
        return "consistent environment and setting, same artistic style throughout the series";
    }
}

// Generate an image for a prompt with selected style
function generateImage(prompt, index, style, consistencyBooster) {
    const styleDir = path.join(OUTPUT_DIR, style);
    if (!fs.existsSync(styleDir)) {
        fs.mkdirSync(styleDir, { recursive: true });
    }
    
    const outputFilename = path.join(styleDir, `image_${index.toString().padStart(3, '0')}.png`);
    
    console.log(`Generating image ${index + 1} in ${STYLE_PRESETS[style].name} style:`);
    
    // Combine style prefix with narrative prompt
    const stylePrefix = STYLE_PRESETS[style].description;
    const enhancedPrompt = `${stylePrefix} of ${prompt}, ${consistencyBooster}`;
    console.log(`Prompt: ${enhancedPrompt}`);
    
    // Execute mflux-generate with the default output
    const command = `mflux-generate --model ${STYLE_PRESETS[style].model} --prompt "${enhancedPrompt}" --height ${HEIGHT} --width ${WIDTH} --steps ${STEPS} --seed ${SEED} -q ${QUALITY}`;
    
    try {
        execSync(command, { stdio: 'inherit' });
        
        // Check if the default output file exists
        if (fs.existsSync('image.png')) {
            // Move and rename the file
            fs.renameSync('image.png', outputFilename);
            console.log(`Image saved to ${outputFilename}`);
            return outputFilename;
        } else {
            console.error('Default output file "image.png" not found after generation');
            return null;
        }
    } catch (error) {
        console.error(`Error generating image: ${error.message}`);
        return null;
    }
}

// Create a comprehensive HTML gallery that shows all styles
function createMasterGallery(stylesGenerated) {
    const promptsArray = readPrompts(PROMPT_FILE);
    
    let styleNavigation = '';
    let stylesContent = '';
    
    // Create navigation and content sections for each style
    for (const styleKey of stylesGenerated) {
        const styleName = STYLE_PRESETS[styleKey].name;
        styleNavigation += `<a href="#${styleKey}" class="style-nav-item">${styleName}</a>`;
        
        stylesContent += `
        <div id="${styleKey}" class="style-section">
            <h2 class="style-title">${styleName}</h2>
            <p class="style-description">${STYLE_PRESETS[styleKey].description}</p>
            
            <div class="gallery">
                ${promptsArray.map((prompt, index) => {
        const imagePath = `./${styleKey}/image_${index.toString().padStart(3, '0')}.png`;
        
        return `
                    <div class="image-container">
                        <div class="image-number">Chapter ${index + 1}</div>
                        <img src="${imagePath}" alt="${styleName} - Chapter ${index + 1}">
                        <div class="image-caption">${prompt}</div>
                    </div>`;
    }).join('')}
            </div>
        </div>`;
}

const galleryHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Visual Story in Multiple Styles</title>
    <style>
        body {
            font-family: 'Bookman Old Style', Georgia, serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
            color: #333;
        }
        h1 {
            text-align: center;
            margin-bottom: 10px;
            font-family: 'Palatino Linotype', serif;
        }
        h2 {
            text-align: center;
            margin-bottom: 20px;
            font-weight: normal;
            color: #555;
        }
        .style-title {
            font-size: 28px;
            border-bottom: 1px solid #ddd;
            padding-bottom: 10px;
            margin-top: 60px;
        }
        .introduction {
            text-align: center;
            margin-bottom: 40px;
            font-style: italic;
            line-height: 1.6;
        }
        .style-nav {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 15px;
            margin-bottom: 50px;
            position: sticky;
            top: 0;
            background-color: rgba(245, 245, 245, 0.95);
            padding: 15px;
            z-index: 100;
            border-bottom: 1px solid #ddd;
        }
        .style-nav-item {
            padding: 8px 16px;
            background-color: #fff;
            border: 1px solid #ddd;
            border-radius: 20px;
            text-decoration: none;
            color: #444;
            font-weight: bold;
            transition: all 0.2s ease;
        }
        .style-nav-item:hover {
            background-color: #444;
            color: #fff;
        }
        .style-description {
            text-align: center;
            margin-bottom: 30px;
            font-style: italic;
            color: #666;
        }
        .gallery {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            grid-gap: 30px;
            margin-bottom: 50px;
        }
        .image-container {
            border: 1px solid #ddd;
            border-radius: 4px;
            padding: 15px;
            background-color: white;
            box-shadow: 0 3px 10px rgba(0,0,0,0.15);
        }
        .image-container img {
            width: 100%;
            height: auto;
            display: block;
            margin-bottom: 12px;
        }
        .image-number {
            font-weight: bold;
            margin-bottom: 5px;
            color: #444;
        }
        .image-caption {
            font-size: 15px;
            line-height: 1.5;
            color: #444;
        }
        .story-conclusion {
            margin-top: 50px;
            margin-bottom: 50px;
            text-align: center;
            font-style: italic;
            line-height: 1.6;
        }
        @media (max-width: 700px) {
            .gallery {
                grid-template-columns: 1fr;
            }
        }
        
        /* PDF-specific styles */
        @media print {
            body {
                background-color: white;
                margin: 0;
                padding: 0;
                max-width: none;
                color: black;
            }
            
            h1 {
                font-size: 24pt;
                margin-top: 20pt;
            }
            
            h2 {
                font-size: 18pt;
            }
            
            .style-nav {
                display: none; /* Hide navigation in PDF */
            }
            
            .style-section {
                page-break-before: always; /* Each style starts on a new page */
                margin-top: 20pt;
            }
            
            .style-title {
                font-size: 20pt;
                margin-top: 0;
                border-bottom: 2pt solid black;
            }
            
            .style-description {
                margin-bottom: 20pt;
            }
            
            .gallery {
                display: block; /* Change from grid to block for print */
            }
            
            .image-container {
                page-break-inside: avoid; /* Prevent images from breaking across pages */
                margin-bottom: 30pt;
                break-inside: avoid;
                border: 1pt solid #999;
                box-shadow: none;
            }
            
            .image-container img {
                max-height: 500pt; /* Control image height for print */
                width: auto;
                max-width: 100%;
                margin: 0 auto 10pt;
                display: block;
            }
            
            .story-conclusion {
                page-break-before: always;
                margin-top: 30pt;
            }
            
            /* Add page numbers */
            @page {
                size: A4;
                margin: 1cm;
                @bottom-center {
                    content: "Page " counter(page) " of " counter(pages);
                    font-family: 'Bookman Old Style', Georgia, serif;
                    font-size: 9pt;
                }
            }
        }
        
        /* Create PDF export button */
        .pdf-button {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #3a559f;
            color: white;
            border: none;
            border-radius: 50%;
            width: 60px;
            height: 60px;
            font-size: 30px;
            cursor: pointer;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
            z-index: 1000;
        }
        .pdf-button:hover {
            background-color: #273b6e;
            transform: scale(1.05);
        }
        .pdf-button span {
            margin-top: -2px;
        }
        .pdf-button-text {
            position: fixed;
            bottom: 20px;
            right: 90px;
            background-color: #444;
            color: white;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 14px;
            opacity: 0;
            transition: opacity 0.2s ease;
        }
        .pdf-button:hover + .pdf-button-text {
            opacity: 1;
        }
        @media print {
            .pdf-button, .pdf-button-text {
                display: none;
            }
        }
    </style>
</head>
<body>
    <h1>Visual Story</h1>
    <h2>A Tale in Multiple Artistic Styles</h2>
    
    <div class="introduction">
        Follow this journey visualized across different artistic interpretations,<br>
        each offering a unique perspective on the narrative.
    </div>
    
    <div class="style-nav">
        ${styleNavigation}
    </div>
    
    ${stylesContent}
    
    <div class="story-conclusion">
        The end of our visual journey, but perhaps just the beginning of many more.<br>
        Which artistic style did you find most compelling for this narrative?
    </div>
    
    <!-- PDF Export button -->
    <button class="pdf-button" onclick="window.print()"><span>📄</span></button>
    <div class="pdf-button-text">Export to PDF</div>
    
    <script>
        // Add page title to PDF metadata
        document.title = "Visual Story - Multiple Styles";
        
        // Optional: Auto-scroll animation to each style section when clicking nav buttons
        document.querySelectorAll('.style-nav-item').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            });
        });
    </script>
</body>
</html>
`;

fs.writeFileSync(path.join(OUTPUT_DIR, 'gallery.html'), galleryHTML);
console.log(`Master gallery created at ${path.join(OUTPUT_DIR, 'gallery.html')}`);
}

// Command line argument parsing
const args = process.argv.slice(2);
let selectedStyles = [];
let customBooster = null;

// Parse command line arguments
for (let i = 0; i < args.length; i++) {
    // Check for booster flag
    if (args[i] === '--booster' || args[i] === '-b') {
        // The next argument should be the custom booster text
        if (i + 1 < args.length) {
            customBooster = args[i + 1];
            i++; // Skip the next argument since we've used it
        } else {
            console.error('Error: --booster flag requires a value');
            process.exit(1);
        }
    } 
    // Otherwise, it's a style name
    else if (STYLE_PRESETS[args[i]]) {
        selectedStyles.push(args[i]);
    } 
    else {
        console.log(`Warning: Argument "${args[i]}" not recognized. Available styles: ${Object.keys(STYLE_PRESETS).join(', ')}`);
    }
}

// If no valid styles specified, use default style
if (selectedStyles.length === 0) {
    selectedStyles = ['dore']; // Default to Gustave Doré
    console.log(`No valid styles specified. Using default style: ${STYLE_PRESETS['dore'].name}`);
}

// Main execution
try {
    const prompts = readPrompts(PROMPT_FILE);
    console.log(`Found ${prompts.length} narrative prompts in ${PROMPT_FILE}`);
    
    // Determine consistency booster - use custom if provided
    let consistencyBooster;
    if (customBooster !== null) {
        consistencyBooster = customBooster;
        console.log(`Using custom consistency booster: "${consistencyBooster}"`);
    } else {
        consistencyBooster = getConsistencyBooster(prompts);
        console.log(`Using auto-detected consistency booster: "${consistencyBooster}"`);
    }
    
    console.log(`Generating images in ${selectedStyles.length} styles: ${selectedStyles.map(s => STYLE_PRESETS[s].name).join(', ')}`);
    
    const generatedFiles = {};
    
    // For each selected style
    for (const style of selectedStyles) {
        console.log(`\n===== Processing style: ${STYLE_PRESETS[style].name} =====`);
        generatedFiles[style] = [];
        
        // Generate all images for this style
        for (let i = 0; i < prompts.length; i++) {
            const imageFile = generateImage(prompts[i], i, style, consistencyBooster);
            if (imageFile) {
                generatedFiles[style].push(imageFile);
            }
        }
    }
    
    // Create the master gallery
    createMasterGallery(selectedStyles);
    console.log('\nImage generation complete!');
    
} catch (error) {
    console.error(`Error: ${error.message}`);
}
