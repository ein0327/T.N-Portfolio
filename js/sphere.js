// js/sphere.js

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('sphere-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;

    // Overlay elements
    const codeOverlay = document.getElementById('sphere-code-overlay');
    const codeTitle = document.getElementById('sphere-code-title');
    const codeContent = document.getElementById('sphere-code-content');
    
    // HUD Elements
    const hudPattern = document.getElementById('hud-pattern');
    const hudParticles = document.getElementById('hud-particles');
    const hudRotX = document.getElementById('hud-rotx');
    const hudRotY = document.getElementById('hud-roty');
    const hudMorph = document.getElementById('hud-morph');
    const hudTime = document.getElementById('hud-time');
    const hudVel = document.getElementById('hud-vel');
    const hudRadius = document.getElementById('hud-radius');
    
    // Sphere settings
    let numParticles = 800;
    let particles = [];
    let baseRadius = 250;
    let rotationX = 0;
    let rotationY = 0;
    
    // Interaction states
    let state = 'NORMAL';
    let stateProgress = 0;
    let isHovering = false;
    let targetRotationSpeed = 0.002;
    let currentRotationSpeed = 0.002;
    
    // Theme colors (Purple to Pink gradient palette)
    const colors = [
        'rgba(79, 70, 229, 0.8)',   // Indigo/Purple
        'rgba(124, 58, 237, 0.8)',  // Violet
        'rgba(168, 85, 247, 0.8)',  // Purple
        'rgba(217, 70, 239, 0.8)',  // Fuchsia
        'rgba(236, 72, 153, 0.8)'   // Pink
    ];

    const patterns = [
        'EXPLODE', 'SPIKY', 'WAVE', 'RING', 'VORTEX', 'EXPAND',
        'CUBE', 'TORNADO', 'FLATTEN', 'PULSATE', 'TWIST'
    ];

    const patternCodes = {
        'EXPLODE': `<span class="syntax-keyword">const</span> noise <span class="syntax-keyword">=</span> \n  <span class="syntax-math">Math</span>.<span class="syntax-func">sin</span>(nx*<span class="syntax-var">10</span> + t*<span class="syntax-var">5</span>) * \n  <span class="syntax-math">Math</span>.<span class="syntax-func">cos</span>(ny*<span class="syntax-var">10</span> - t*<span class="syntax-var">5</span>);\nr <span class="syntax-keyword">=</span> baseRadius + (noise * <span class="syntax-var">150</span> + <span class="syntax-var">50</span>) * easeProgress;`,
        'SPIKY': `<span class="syntax-keyword">const</span> spike <span class="syntax-keyword">=</span> <span class="syntax-math">Math</span>.<span class="syntax-func">abs</span>(\n  <span class="syntax-math">Math</span>.<span class="syntax-func">sin</span>(nx*<span class="syntax-var">8</span>) * <span class="syntax-math">Math</span>.<span class="syntax-func">cos</span>(ny*<span class="syntax-var">8</span>) * \n  <span class="syntax-math">Math</span>.<span class="syntax-func">sin</span>(nz*<span class="syntax-var">8</span>)\n);\nr <span class="syntax-keyword">=</span> baseRadius + (spike * <span class="syntax-var">150</span>) * easeProgress;`,
        'WAVE': `<span class="syntax-keyword">const</span> wave <span class="syntax-keyword">=</span> \n  <span class="syntax-math">Math</span>.<span class="syntax-func">sin</span>(ny * <span class="syntax-var">5</span> + t * <span class="syntax-var">3</span>) * <span class="syntax-var">50</span>;\nr <span class="syntax-keyword">=</span> baseRadius + wave * easeProgress;`,
        'RING': `py <span class="syntax-keyword">=</span> ny * r * (<span class="syntax-var">1</span> - easeProgress);\n<span class="syntax-keyword">const</span> ringR <span class="syntax-keyword">=</span> baseRadius * <span class="syntax-var">1.5</span>;\npx <span class="syntax-keyword">=</span> nx * (r + (ringR - r) * ease); \npz <span class="syntax-keyword">=</span> nz * (r + (ringR - r) * ease);`,
        'VORTEX': `// Vortex rotation logic is global\ncurrentRotationSpeed <span class="syntax-keyword">+=</span> \n  (<span class="syntax-var">0.02</span> - currentRotationSpeed) * <span class="syntax-var">0.1</span>;`,
        'EXPAND': `r <span class="syntax-keyword">=</span> baseRadius * (<span class="syntax-var">1</span> + <span class="syntax-var">0.4</span> * easeProgress);`,
        'CUBE': `<span class="syntax-keyword">let</span> max <span class="syntax-keyword">=</span> <span class="syntax-math">Math</span>.<span class="syntax-func">max</span>(\n  <span class="syntax-math">Math</span>.<span class="syntax-func">abs</span>(cx), <span class="syntax-math">Math</span>.<span class="syntax-func">abs</span>(cy), <span class="syntax-math">Math</span>.<span class="syntax-func">abs</span>(cz)\n);\n<span class="syntax-keyword">let</span> f <span class="syntax-keyword">=</span> r / max;\npx <span class="syntax-keyword">=</span> cx * (<span class="syntax-var">1</span> + (f - <span class="syntax-var">1</span>) * easeProgress);\npy <span class="syntax-keyword">=</span> cy * (<span class="syntax-var">1</span> + (f - <span class="syntax-var">1</span>) * easeProgress);\npz <span class="syntax-keyword">=</span> cz * (<span class="syntax-var">1</span> + (f - <span class="syntax-var">1</span>) * easeProgress);`,
        'TORNADO': `<span class="syntax-keyword">let</span> factor <span class="syntax-keyword">=</span> (ny + <span class="syntax-var">1</span>) / <span class="syntax-var">2</span>;\n<span class="syntax-keyword">let</span> tR <span class="syntax-keyword">=</span> baseRadius * (factor * <span class="syntax-var">1.5</span> + <span class="syntax-var">0.2</span>);\npx <span class="syntax-keyword">=</span> nx * (r + (tR - r) * easeProgress);\npz <span class="syntax-keyword">=</span> nz * (r + (tR - r) * easeProgress);`,
        'FLATTEN': `pz <span class="syntax-keyword">=</span> nz * r * (<span class="syntax-var">1</span> - easeProgress);\npx <span class="syntax-keyword">=</span> nx * r * (<span class="syntax-var">1</span> + <span class="syntax-var">0.5</span> * easeProgress);\npy <span class="syntax-keyword">=</span> ny * r * (<span class="syntax-var">1</span> + <span class="syntax-var">0.5</span> * easeProgress);`,
        'PULSATE': `<span class="syntax-keyword">let</span> beat <span class="syntax-keyword">=</span> <span class="syntax-math">Math</span>.<span class="syntax-func">abs</span>(<span class="syntax-math">Math</span>.<span class="syntax-func">sin</span>(t * <span class="syntax-var">15</span>)) * <span class="syntax-var">0.5</span>;\nr <span class="syntax-keyword">=</span> baseRadius * (<span class="syntax-var">1</span> + beat * easeProgress);`,
        'TWIST': `<span class="syntax-keyword">let</span> angle <span class="syntax-keyword">=</span> ny * <span class="syntax-var">6</span> * easeProgress;\npx <span class="syntax-keyword">=</span> cx * <span class="syntax-math">Math</span>.<span class="syntax-func">cos</span>(angle) - cz * <span class="syntax-math">Math</span>.<span class="syntax-func">sin</span>(angle);\npz <span class="syntax-keyword">=</span> cx * <span class="syntax-math">Math</span>.<span class="syntax-func">sin</span>(angle) + cz * <span class="syntax-math">Math</span>.<span class="syntax-func">cos</span>(angle);`
    };

    // Resize handling
    function resize() {
        const dpr = window.devicePixelRatio || 1;
        width = canvas.parentElement.clientWidth;
        height = canvas.parentElement.clientHeight || 500;
        
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        
        baseRadius = Math.min(width, height) * 0.35;
    }
    window.addEventListener('resize', resize);
    resize();

    // Init particles using Fibonacci sphere distribution
    function initParticles() {
        particles = [];
        for (let i = 0; i < numParticles; i++) {
            const phi = Math.acos(1 - 2 * (i + 0.5) / numParticles);
            const theta = Math.PI * (1 + Math.sqrt(5)) * i;
            
            const nx = Math.cos(theta) * Math.sin(phi);
            const ny = Math.sin(theta) * Math.sin(phi);
            const nz = Math.cos(phi);
            
            particles.push({
                nx, ny, nz, // Normal vector
                x: nx * baseRadius,
                y: ny * baseRadius,
                z: nz * baseRadius,
                baseColor: colors[Math.floor(Math.random() * colors.length)],
                size: Math.random() * 1.5 + 1
            });
        }
    }
    initParticles();
    
    // Slider Interactivity
    const particleSlider = document.getElementById('particle-slider');
    if (particleSlider) {
        particleSlider.addEventListener('input', (e) => {
            numParticles = parseInt(e.target.value);
            initParticles();
        });
        
        // Prevent sphere hover effects when dragging the slider
        particleSlider.addEventListener('mouseenter', () => isHovering = false);
    }

    canvas.addEventListener('mouseenter', () => {
        isHovering = true;
        canvas.style.cursor = 'pointer';
        // Pick a random pattern only if we are fully back to normal to avoid snapping
        if (stateProgress === 0 || state === 'NORMAL') {
            state = patterns[Math.floor(Math.random() * patterns.length)];
            
            // Update overlay
            if(codeOverlay && codeTitle && codeContent) {
                codeTitle.innerText = `${state.toLowerCase()}_pattern.js`;
                codeContent.innerHTML = patternCodes[state];
                codeOverlay.classList.add('is-active');
            }
        }
    });

    canvas.addEventListener('mouseleave', () => {
        isHovering = false;
        // We no longer instantly reset state or stateProgress. Let animate() handle the smooth return.
    });
    
    // For mobile touch
    canvas.addEventListener('touchstart', (e) => {
        // Prevent default to stop touch-and-hold menus (like Save Image/Copy)
        if (e.cancelable) e.preventDefault();
        
        if (!isHovering) {
            isHovering = true;
            if (stateProgress === 0 || state === 'NORMAL') {
                state = patterns[Math.floor(Math.random() * patterns.length)];
                
                // Update overlay for touch users too
                if(codeOverlay && codeTitle && codeContent) {
                    codeTitle.innerText = `${state.toLowerCase()}_pattern.js`;
                    codeContent.innerHTML = patternCodes[state];
                    codeOverlay.classList.add('is-active');
                }
            }
        }
    }, {passive: false});

    canvas.addEventListener('touchend', (e) => {
        isHovering = false;
    }, {passive: false});

    // 3D Rotation matrices
    function rotateX(y, z, angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return { y: y * cos - z * sin, z: y * sin + z * cos };
    }

    function rotateY(x, z, angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return { x: x * cos + z * sin, z: -x * sin + z * cos };
    }

    // Main animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        ctx.clearRect(0, 0, width, height);

        // Update speeds and progress smoothly based on hover state
        if (isHovering && stateProgress < 1) {
            stateProgress += 0.03; // Smooth ease in
        } else if (!isHovering && stateProgress > 0) {
            stateProgress -= 0.03; // Smooth ease out
        }
        
        // Clamp progress
        stateProgress = Math.max(0, Math.min(1, stateProgress));

        // When fully returned to sphere, we can reset state internally
        if (stateProgress === 0 && !isHovering) {
            state = 'NORMAL';
            if(codeOverlay) codeOverlay.classList.remove('is-active');
        }

        // Ease function (easeInOutQuad)
        const easeProgress = stateProgress < 0.5 ? 2 * stateProgress * stateProgress : -1 + (4 - 2 * stateProgress) * stateProgress;

        // Base rotation
        rotationY += currentRotationSpeed;
        rotationX += currentRotationSpeed * 0.5;
        
        if (state === 'VORTEX') {
            currentRotationSpeed += (0.02 - currentRotationSpeed) * 0.1;
        } else {
            currentRotationSpeed += (targetRotationSpeed - currentRotationSpeed) * 0.1;
        }

        const focalLength = 800;
        const centerX = width / 2;
        const centerY = height / 2;
        
        let t = Date.now() * 0.001; // Time for animations

        // Draw particles
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            
            // Calculate target position based on current state
            let r = baseRadius;
            let px = p.nx * r;
            let py = p.ny * r;
            let pz = p.nz * r;
            
            if (easeProgress > 0) {
                if (state === 'EXPLODE') {
                    // Random noise burst
                    const noise = Math.sin(p.nx * 10 + t * 5) * Math.cos(p.ny * 10 - t * 5);
                    r = baseRadius + (noise * 150 + 50) * easeProgress;
                    px = p.nx * r; py = p.ny * r; pz = p.nz * r;
                } 
                else if (state === 'SPIKY') {
                    // Spikes based on sine waves across the sphere
                    const spike = Math.abs(Math.sin(p.nx * 8) * Math.cos(p.ny * 8) * Math.sin(p.nz * 8));
                    r = baseRadius + (spike * 150) * easeProgress;
                    px = p.nx * r; py = p.ny * r; pz = p.nz * r;
                }
                else if (state === 'WAVE') {
                    // Breathing wave effect
                    const wave = Math.sin(p.ny * 5 + t * 3) * 50;
                    r = baseRadius + wave * easeProgress;
                    px = p.nx * r; py = p.ny * r; pz = p.nz * r;
                }
                else if (state === 'RING') {
                    // Flatten Y axis to form a ring, push X and Z outward
                    py = p.ny * r * (1 - easeProgress); 
                    const ringRadius = baseRadius * 1.5;
                    // Push outwards slightly
                    px = p.nx * (r + (ringRadius - r) * easeProgress);
                    pz = p.nz * (r + (ringRadius - r) * easeProgress);
                }
                else if (state === 'EXPAND') {
                    r = baseRadius * (1 + 0.4 * easeProgress);
                    px = p.nx * r; py = p.ny * r; pz = p.nz * r;
                }
                else if (state === 'CUBE') {
                    // Morph sphere into a cube shape
                    let cx = p.nx * r; let cy = p.ny * r; let cz = p.nz * r;
                    let maxDist = Math.max(Math.abs(cx), Math.abs(cy), Math.abs(cz));
                    let cubeFactor = r / maxDist; // The scaling factor to push it to the bounding box
                    px = cx * (1 + (cubeFactor - 1) * easeProgress);
                    py = cy * (1 + (cubeFactor - 1) * easeProgress);
                    pz = cz * (1 + (cubeFactor - 1) * easeProgress);
                }
                else if (state === 'TORNADO') {
                    // Funnel shape
                    let factor = (p.ny + 1) / 2; // Map Y from -1..1 to 0..1
                    let tornadoR = baseRadius * (factor * 1.5 + 0.2); // Wider at top, narrow at bottom
                    px = p.nx * (r + (tornadoR - r) * easeProgress);
                    pz = p.nz * (r + (tornadoR - r) * easeProgress);
                }
                else if (state === 'FLATTEN') {
                    // Compress into a 2D galaxy disk
                    pz = p.nz * r * (1 - easeProgress); 
                    px = p.nx * r * (1 + 0.5 * easeProgress);
                    py = p.ny * r * (1 + 0.5 * easeProgress);
                }
                else if (state === 'PULSATE') {
                    // Fast beating heart effect
                    let beat = Math.abs(Math.sin(t * 15)) * 0.5;
                    r = baseRadius * (1 + beat * easeProgress);
                    px = p.nx * r; py = p.ny * r; pz = p.nz * r;
                }
                else if (state === 'TWIST') {
                    // Twist the sphere along the Y axis
                    let twistAngle = p.ny * 6 * easeProgress;
                    let cx = p.nx * r; let cz = p.nz * r;
                    px = cx * Math.cos(twistAngle) - cz * Math.sin(twistAngle);
                    pz = cx * Math.sin(twistAngle) + cz * Math.cos(twistAngle);
                }
            }

            // Apply global rotations
            let rx = rotateX(py, pz, rotationX);
            py = rx.y;
            pz = rx.z;
            
            let ry = rotateY(px, pz, rotationY);
            px = ry.x;
            pz = ry.z;

            // 3D to 2D Projection
            const scale = focalLength / (focalLength + pz);
            const x2d = centerX + px * scale;
            const y2d = centerY + py * scale;
            
            // Depth fading (far particles are smaller and less opaque)
            const depthAlpha = Math.max(0.1, (pz + baseRadius) / (baseRadius * 2));
            const size = Math.max(0.1, p.size * scale * (1 + easeProgress * 0.5)); // Slightly larger when active

            // Optimization and visual sorting (don't draw things totally behind or too small)
            if (scale > 0 && x2d > 0 && x2d < width && y2d > 0 && y2d < height) {
                // Color variation based on depth and time
                const colorBase = p.baseColor.replace(/[\d\.]+\)$/g, `${depthAlpha * 0.8})`);
                
                ctx.beginPath();
                ctx.arc(x2d, y2d, size, 0, Math.PI * 2);
                ctx.fillStyle = colorBase;
                ctx.fill();
                
                // Add a glowing effect to some particles
                if (i % 10 === 0 && pz < 0) { // Only front particles glow
                     ctx.shadowBlur = 10;
                     ctx.shadowColor = p.baseColor;
                     ctx.fill();
                     ctx.shadowBlur = 0; // reset
                }
            }
        }
        
        // Update Status HUD
        if (hudPattern && hudParticles && hudRotX && hudRotY && hudMorph) {
            hudPattern.innerText = state;
            hudParticles.innerText = particles.length;
            hudRotX.innerText = rotationX.toFixed(3);
            hudRotY.innerText = rotationY.toFixed(3);
            hudMorph.innerText = Math.round(stateProgress * 100) + '%';
            if(hudTime) hudTime.innerText = t.toFixed(3);
            if(hudVel) hudVel.innerText = (currentRotationSpeed * 1000).toFixed(2);
            if(hudRadius) hudRadius.innerText = Math.round(baseRadius) + 'px';
        }
    }

    animate();
});
