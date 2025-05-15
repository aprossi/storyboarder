# Multi-Style Image Generator

This tool generates a series of images from text prompts using the mflux-generate tool, creating visual narratives in multiple artistic styles. The output is presented as an interactive web gallery that can be exported to PDF.

## Features

- Generate images from narrative prompts in multiple artistic styles
- Create a responsive HTML gallery showcasing all styles
- Support for PDF export with optimized layout
- Automatic detection of narrative setting for visual consistency
- Custom consistency boosters via command line arguments
- Simple chapter-based organization

## Installation

1. Ensure you have Node.js installed on your system
2. Download the script file:
   ```
   curl -O https://raw.githubusercontent.com/aprossi/storyboarder/main/generate-images.js
   ```
3. Make the script executable:
   ```
   chmod +x generate_images.js
   ```
4. Ensure you have the mflux-generate tool installed and configured

## Usage

### Basic Usage

```bash
./generate-images.js dore ghibli
```

This will generate images in both Gustave Doré and Studio Ghibli styles.

### Available Styles

The script includes the following pre-configured artistic styles:

| Style Key | Description |
|-----------|-------------|
| dore | Black and white realistic, detailed engraving in the style of Gustave Doré |
| ukiyo-e | Traditional Japanese ukiyo-e woodblock print style |
| pixel | Retro 16-bit pixel art style with limited color palette |
| watercolor | Soft watercolor painting with gentle washes of color |
| art-nouveau | Elegant Art Nouveau style with ornate flowing curves |
| ghibli | Whimsical Studio Ghibli animation style |
| cartoon | Colorful modern cartoon style with bold outlines |
| claymation | Stop-motion claymation style with textured surfaces |

### Custom Consistency Booster

By default, the script analyzes your prompts to determine the appropriate setting and applies a consistency booster to maintain visual continuity across images. To override this with a custom booster:

```bash
./generate-images.js dore watercolor --booster "consistent magical forest with glowing mushrooms and misty atmosphere"
```

Or using the short form:

```bash
./generate-images.js ghibli cartoon -b "consistent steampunk city with brass machinery and clock towers"
```

## Prompts File

Create a file named `prompts.txt` in the same directory as the script. Each prompt should be separated by a blank line:

```
two hedgehogs arriving in a small spacecraft on the surface of Mars, with a domed habitat visible in the distance

hedgehogs building their habitat dome on Mars, arranging strange crystalline structures while wearing tiny space suits

hedgehogs planting alien vegetation in a greenhouse attachment to their Mars habitat dome

hedgehogs repairing an old computer outside their space habitat on Mars, tools scattered around them

hedgehogs discovering a mysterious ancient Martian artifact half-buried in the dust near their habitat

hedgehogs celebrating under Martian night sky with both Phobos and Deimos visible, hosting a gathering with other small animals
```

## Output

The script creates:

1. A `generated_images` directory containing:
   - Subdirectories for each style (e.g., `dore`, `ghibli`)
   - Numbered images in each style directory
   - An HTML gallery file (`gallery.html`)

2. A responsive web gallery that:
   - Shows all generated images organized by style
   - Provides navigation between styles
   - Includes a floating PDF export button
   - Is optimized for both screen viewing and PDF printing

## PDF Export

To export the gallery as a PDF:

1. Open the generated `gallery.html` file in a web browser
2. Click the floating PDF button in the bottom-right corner
3. In the print dialog:
   - Select "Save as PDF" as the destination
   - Ensure "Background Graphics" is enabled
   - Choose "A4" paper size

The resulting PDF will have each style section starting on a new page, with proper page breaks between images and automatic page numbering.

## Customization

### Adding New Styles

Edit the `STYLE_PRESETS` object in the script to add new artistic styles:

```javascript
"your-style-key": {
    name: "Display Name",
    description: "detailed description of the style characteristics",
    model: "schnell"
}
```

### Modifying Image Parameters

Adjust the default image generation parameters at the top of the script:

```javascript
const HEIGHT = 600;
const WIDTH = 600;
const STEPS = 1;
const QUALITY = 8;
const SEED = 4;
```

## Examples

### Narrative in Different Settings

Fantasy castle adventure:
```bash
./generate-images.js dore ghibli -b "consistent medieval castle with stone towers and mystical surroundings"
```

Underwater exploration:
```bash
./generate-images.js watercolor cartoon -b "consistent underwater seascape with coral reefs and sunbeams filtering through water"
```

Futuristic city:
```bash
./generate-images.js dore pixel -b "consistent futuristic cyberpunk cityscape with neon lights and tall buildings"
```

## Troubleshooting

- **No images generated**: Ensure mflux-generate is properly installed and works when run directly
- **Missing style**: Check that the style name matches one of the available presets (case-sensitive)
- **Gallery displays broken images**: Verify that the image paths in the gallery HTML match your actual directory structure

## License

MIT License
