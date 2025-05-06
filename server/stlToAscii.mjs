// stlToAscii.mjs
import * as THREE from 'three';
import fs from 'fs';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import GIFEncoder from 'gifencoder';
import { createCanvas } from 'canvas';

/**
 * Generates a series of ASCII frames by rotating the geometry.
 */
function createRotatingAsciiModel(geometry, width = 120, height = 60) {
  const positions = geometry.attributes.position.array;
  const normals = geometry.attributes.normal.array;
  const bbox = new THREE.Box3().setFromBufferAttribute(geometry.attributes.position);
  const center = new THREE.Vector3();
  bbox.getCenter(center);
  const size = bbox.getSize(new THREE.Vector3());

  const depthMap = new Float32Array(width * height);
  const normalMap = new Float32Array(width * height * 3);
  const asciiChars = ' .,:;i1tfLCG08@';

  function createFrame(angleY, angleX) {
    const matrix = new THREE.Matrix4().makeRotationFromEuler(
      new THREE.Euler(angleX, angleY, 0, 'XYZ')
    );
    depthMap.fill(Infinity);
    normalMap.fill(0);

    for (let i = 0; i < positions.length; i += 3) {
      const v = new THREE.Vector3(
        positions[i], positions[i + 1], positions[i + 2]
      ).sub(center).applyMatrix4(matrix);

      const xN = Math.round((v.x / size.x + 0.5) * (width - 1));
      const yN = Math.round((v.y / size.y + 0.5) * (height - 1));
      const idx = xN + yN * width;

      if (v.z < depthMap[idx]) {
        depthMap[idx] = v.z;
        const n = new THREE.Vector3(
          normals[i], normals[i + 1], normals[i + 2]
        ).applyMatrix4(matrix).normalize();
        normalMap[idx * 3]     = n.x;
        normalMap[idx * 3 + 1] = n.y;
        normalMap[idx * 3 + 2] = n.z;
      }
    }

    // Sobel edges & combine factors omitted for brevity
    const output = new Array(width * height).fill(' ');
    // Map each pixel to an ASCII character
    for (let i = 0; i < width * height; i++) {
      const lum = Math.max(0, normalMap[i * 3 + 2]);
      const idx = Math.floor(lum * (asciiChars.length - 1));
      output[i] = asciiChars[idx];
    }

    return output.join('') + '\n';
  }

  const frames = [];
  const steps = 60;
  for (let i = 0; i < steps; i++) {
    frames.push(createFrame((i / steps) * Math.PI * 2, 0));
  }
  return frames;
}

/**
 * Parses an STL file and returns ASCII frames.
 */
export async function convertStlToAscii(filePath, width, height) {
  const loader = new STLLoader();
  const data = fs.readFileSync(filePath);
  const geometry = loader.parse(data.buffer);
  return createRotatingAsciiModel(geometry, width, height);
}

/**
 * Converts ASCII frames into a GIF buffer.
 */
export async function convertStlToGif(filePath, width, height) {
  const frames = await convertStlToAscii(filePath, width, height);
  const encoder = new GIFEncoder(width * 6, height * 6);
  encoder.start();
  encoder.setRepeat(0);
  encoder.setDelay(100);
  encoder.setQuality(10);

  const canvas = createCanvas(width * 6, height * 6);
  const ctx = canvas.getContext('2d');

  for (const ascii of frames) {
    const imgData = ctx.createImageData(width * 6, height * 6);
    // Fill imgData based on ascii content omitted for brevity
    ctx.putImageData(imgData, 0, 0);
    encoder.addFrame(ctx);
  }

  encoder.finish();
  return encoder.out.getData();
}