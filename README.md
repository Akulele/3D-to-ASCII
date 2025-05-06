# 3D to ASCII Art Converter

A web-based tool that converts 3D models into ASCII art representations in real-time. Users can upload 3D models, preview them interactively, and export static or animated ASCII art graphics.

## Features

* **Real-time ASCII Preview**: Render uploaded 3D models as ASCII art in the browser instantly.
* **Multiple File Formats**: Supports STL, OBJ, FBX, and GLTF/GLB.
* **Interactive Controls**:

  * Mouse/touch rotation and zoom
  * Auto-rotation toggle
  * Light/Dark mode switch
  * ASCII text color customization
* **Export Options**:

  * PNG screenshot capture
  * Animated SVG export
  * Animated GIF generation

## Tech Stack

* **Frontend**:

  * Three.js for 3D rendering
  * AsciiEffect for real-time ASCII conversion
  * gif.js for client-side GIF generation
  * Vanilla HTML, CSS, and JavaScript (ES modules)
* **Backend**:

  * Node.js with Express
  * Multer for file uploads
  * Custom `stlToAscii.js` and `stlToGif.js` modules
  * CORS for cross-origin support

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/3D-to-ASCII.git
   cd 3D-to-ASCII
   ```
2. Install server dependencies:

   ```bash
   cd server
   npm install
   ```
3. Start the server:

   ```bash
   npm start
   ```
4. Open `public/index.html` in your browser or navigate to `http://localhost:3000` if using the server.

## Usage

1. Click **Choose 3D Model** and select a supported file.
2. Rotate and zoom the ASCII-rendered model via mouse/touch.
3. Toggle auto-rotation and light/dark mode using control buttons.
4. Change ASCII text color with **Change Text Color**.
5. Export options:

   * **Take Screenshot**: Download view as PNG.
   * **Download Animated SVG**: Export rotating animation as SVG.
   * **Download GIF**: Export rotating animation as GIF.

## Project Structure

```
3D-to-ASCII/
├── server/
│   ├── server.mjs          # Express server entrypoint
│   ├── stlToAscii.js       # Headless conversion logic
│   ├── stlToGif.js         # GIF conversion logic
│   ├── package.json
│   └── uploads/            # Temp upload directory (gitignored)
├── public/
│   ├── index.html
│   ├── style.css
│   └── client.js
├── public/js/
│   ├── gif.js
│   └── gif.worker.js
├── .gitignore
└── README.md
```

## Customization

* Adjust the ASCII character set in `public/client.js`.
* Modify resolution and effect parameters in the `createEffect` function.
* Configure default width/height settings in `stlToAscii.js`.

## License

This project is licensed under the BSD-3-Clause License. See the [LICENSE](LICENSE) file for details.