# HBD Project Animation Design Document

**Version**: 1.0  
**Date**: 2026-02-05  
**Core Theme**: "Youthful Uncertainty & Physical Warmth"

## 1. Design Philosophy

The animation system moves beyond standard UI transitions to express emotional depth. We avoid linear, mechanical movements in favor of:
- **Organic Randomness**: Simulating the "uncertainty" and "palpitation" of youth.
- **Physical Realism**: Using 3D depth and spring physics to create tangible interactions.
- **Cinematic Narrative**: Treating transitions (like opening a letter) as storytelling beats, not just state changes.

## 2. Key Implementations

### A. The "Drifting Memories" (SceneTimeline)
*   **Concept**: Memories are not static; they float like thoughts or bubbles.
*   **Implementation**:
    *   **Entrance**: High-stiffness spring (`type: "spring", stiffness: 200`) for a nervous/energetic pop-in.
    *   **Idle**: Randomized continuous floating animation (`y` and `rotate` interpolation) with unique phases for every card, preventing artificial synchronization.
    *   **Interaction**: Cards tilt and lift physically on hover, simulating picking up a photo.

### B. The "Heartbeat" Gift (SceneGift)
*   **Concept**: The anticipation before opening a surprise.
*   **Implementation**:
    *   Replaced standard shaking with a **double-pulse scale animation** (simulating a heartbeat pattern: thump-thump... pause).
    *   Creates psychological tension and excitement before the click.

### C. The "Cinematic Letter" (SceneLetter)
*   **Concept**: A ritualistic opening of a secret message.
*   **Sequence**:
    1.  **Open**: Envelope flap flips open (`rotateX: 180deg`) with bouncy spring physics.
    2.  **Extract (The "Z-Axis" Maneuver)**:
        *   Letter moves **Up** (`y: -250`) and **Forward** (`z: 200`) toward the camera.
        *   Envelope moves **Down** (`y: 100`) and **Backward** (`z: -300`) into the blur.
        *   *Result*: A collision-free, physically accurate extraction without clipping.
    3.  **Unfold**:
        *   A 3-part 3D structure (Top, Middle, Bottom folds).
        *   Top flips up, Bottom flips down, accompanied by simulated shadow layers (`bg-black/20`) that fade as the paper flattens.

## 3. Technical Standards

*   **Library**: `framer-motion`
*   **Physics**: exclusively `type: "spring"` for all interactive elements to ensure non-linear motion.
*   **Performance**: Animations restricted to distinct layers (`z-index`) and transform properties (`x`, `y`, `z`, `rotate`, `scale`, `opacity`) to maintain 60FPS.
