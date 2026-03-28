// js/about-artifact.js

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('about-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    
    // Theme Colors: Code (Cyan) to Design (Magenta)
    const colorCode = { r: 45, g: 212, b: 191 };   // left side / strand 1
    const colorDesign = { r: 236, g: 72, b: 153 }; // right side / strand 2

    // Typographic symbols: Fusion of DNA bases (A, T, G, C) and Code/Design
    const symbols = ['A', 'T', 'G', 'C', '{ }', '</>', 'UI', 'UX', '+', '∞'];
    let floatingElements = [];

    let time = 0;

    // Mouse interaction for "Micro-interactions" & "UI/UX" themes
    let mouse = { x: -1000, y: -1000, active: false };

    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
        mouse.active = true;
    });

    canvas.addEventListener('mouseleave', () => {
        mouse.active = false;
        // Glide mouse away slowly instead of snapping
        mouse.x = -1000;
        mouse.y = -1000;
    });

    // Prevent context menu on long press
    canvas.addEventListener('contextmenu', e => e.preventDefault());

    // Mobile touch support for micro-interactions & menu prevention
    canvas.addEventListener('touchstart', (e) => {
        if (e.cancelable) e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.touches[0].clientX - rect.left;
        mouse.y = e.touches[0].clientY - rect.top;
        mouse.active = true;
    }, {passive: false});

    canvas.addEventListener('touchmove', (e) => {
        if (e.cancelable) e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.touches[0].clientX - rect.left;
        mouse.y = e.touches[0].clientY - rect.top;
    }, {passive: false});

    canvas.addEventListener('touchend', (e) => {
        mouse.active = false;
        mouse.x = -1000;
        mouse.y = -1000;
    }, {passive: false});

    function resize() {
        const dpr = window.devicePixelRatio || 1;
        
        // Reset purely to CSS 100% first to let it fit inside the padded container organically
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        
        // Measure the perfectly fit CSS layout dimensions
        const rect = canvas.getBoundingClientRect();
        width = rect.width;
        height = rect.height || 400; 
        
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
        
        initElements();
    }

    class FloatingElement {
        constructor() {
            this.reset(true);
        }
        reset(initial = false) {
            this.text = symbols[Math.floor(Math.random() * symbols.length)];
            this.x = Math.random() * width;
            this.y = initial ? Math.random() * height : height + 30;
            this.speed = -(Math.random() * 0.5 + 0.2); // floating upwards
            this.baseAlpha = Math.random() * 0.15 + 0.05; 
            this.alpha = this.baseAlpha;
            this.scale = Math.random() * 0.6 + 0.6;
            this.ratio = this.x / width; // Left(code) vs Right(design)
        }
        update() {
            this.y += this.speed;
            
            // Mouse repel & highlight (Micro-interaction)
            if (mouse.active) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                
                if (dist < 100) {
                    // Push away
                    this.x -= (dx / dist) * 1.5;
                    this.y -= (dy / dist) * 1.5;
                    // Illuminate
                    this.alpha = Math.min(this.alpha + 0.05, 0.7);
                } else {
                    this.alpha = Math.max(this.alpha - 0.02, this.baseAlpha);
                }
            } else {
                this.alpha = Math.max(this.alpha - 0.02, this.baseAlpha);
            }
            
            // Reset if out of bounds
            if (this.y < -30) this.reset();
            // Gentle bounds wrap for X
            if (this.x < -20) this.x = width + 20;
            if (this.x > width + 20) this.x = -20;
        }
        draw() {
            // Color based on horizontal position (Cyan -> Magenta)
            const r = Math.floor(colorCode.r * (1 - this.ratio) + colorDesign.r * this.ratio);
            const g = Math.floor(colorCode.g * (1 - this.ratio) + colorDesign.g * this.ratio);
            const b = Math.floor(colorCode.b * (1 - this.ratio) + colorDesign.b * this.ratio);
            
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${this.alpha})`;
            ctx.font = `500 ${14 * this.scale}px "Inter", monospace`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.text, this.x, this.y);
        }
    }

    function initElements() {
        floatingElements = [];
        for (let i = 0; i < 25; i++) {
            floatingElements.push(new FloatingElement());
        }
    }

    window.addEventListener('resize', resize);
    resize();

    // The DNA Helix Network
    function drawDNAHelix() {
        const cx = width / 2;
        const cy = height / 2;
        
        const nodes = 100; // Total nodes per strand for high fidelity
        const helixRadius = width < 600 ? 60 : 100;
        const helixHeight = height * 0.8; // 80% of canvas height
        const twists = 2.5; // Number of full rotations
        
        let renderQueue = [];
        
        // Arrays to hold history so we can draw connecting lines
        let prevP1 = null;
        let prevP2 = null;
        
        // Slow global 3D rotation angles to change the viewing angle over time
        const globalRotX = Math.sin(time * 0.3) * 0.4; // Slowly tilt forward/back
        const globalRotY = time * 0.2; // Slowly continuous orbit rotation
        const globalRotZ = Math.cos(time * 0.25) * 0.2; // Slight diagonal tilt
        
        function rotate3D(x, y, z) {
            // Y axis rotation
            let nx = x * Math.cos(globalRotY) + z * Math.sin(globalRotY);
            let nz = -x * Math.sin(globalRotY) + z * Math.cos(globalRotY);
            x = nx; z = nz;
            // X axis rotation
            let ny = y * Math.cos(globalRotX) - z * Math.sin(globalRotX);
            nz = y * Math.sin(globalRotX) + z * Math.cos(globalRotX);
            y = ny; z = nz;
            // Z axis rotation
            nx = x * Math.cos(globalRotZ) - y * Math.sin(globalRotZ);
            ny = x * Math.sin(globalRotZ) + y * Math.cos(globalRotZ);
            return { x: nx, y: ny, z: nz };
        }
        
        // Calculate physics/positions for nodes
        for (let i = 0; i < nodes; i++) {
            // Normalized height: -0.5 to 0.5
            const ny = (i / (nodes - 1)) - 0.5; 
            const localY = ny * helixHeight;
            
            // Base rotation over time, flowing upwards
            const baseAngle = ny * Math.PI * 2 * twists - time * 1.5;
            
            // DNA Major/Minor Groove: offset the second strand asymmetrically
            const grooveOffset = Math.PI * 0.75; 
            
            // Local coordinates before global rotation (centered at 0,0,0)
            let lx1 = Math.sin(baseAngle) * helixRadius;
            let lz1 = Math.cos(baseAngle) * helixRadius;
            
            let lx2 = Math.sin(baseAngle + grooveOffset) * helixRadius;
            let lz2 = Math.cos(baseAngle + grooveOffset) * helixRadius;
            
            // Apply global 3D rotation
            const p1 = rotate3D(lx1, localY, lz1);
            const p2 = rotate3D(lx2, localY, lz2);
            
            // Translate to screen center
            let bx1 = cx + p1.x;
            let by1 = cy + p1.y;
            let bz1 = p1.z;
            
            let bx2 = cx + p2.x;
            let by2 = cy + p2.y;
            let bz2 = p2.z;
            
            // Final coordinates (Mouse repel removed from DNA)
            const x1 = bx1;
            const y1 = by1;
            const z1 = bz1;
            
            const x2 = bx2;
            const y2 = by2;
            const z2 = bz2;
            
            // Queue Strand 1 Node (Code)
            renderQueue.push({ type: 'node', color: colorCode, x: x1, y: y1, z: z1 });
            // Queue Strand 2 Node (Design)
            renderQueue.push({ type: 'node', color: colorDesign, x: x2, y: y2, z: z2 });
            
            // Draw backbone lines connecting to previous node organically
            if (prevP1 && prevP2) {
                const midZ1 = (z1 + prevP1.z) / 2;
                renderQueue.push({ type: 'backbone', color: colorCode, x1: prevP1.x, y1: prevP1.y, x2: x1, y2: y1, z: midZ1 });
                
                const midZ2 = (z2 + prevP2.z) / 2;
                renderQueue.push({ type: 'backbone', color: colorDesign, x1: prevP2.x, y1: prevP2.y, x2: x2, y2: y2, z: midZ2 });
            }
            
            prevP1 = {x: x1, y: y1, z: z1};
            prevP2 = {x: x2, y: y2, z: z2};
            
            // Rungs connecting the two strands (base pairs)
            // Draw every 5th step
            if (i % 5 === 0) {
                const midZ = (z1 + z2) / 2;
                renderQueue.push({ type: 'rung', x1: x1, y1: y1, z1: z1, x2: x2, y2: y2, z2: z2, z: midZ });
            }
        }
        
        // Sort by depth (Z axis) for fake 3D rendering
        renderQueue.sort((a, b) => a.z - b.z); // Negative (away) to Positive (close)
        
        // Render
        ctx.lineWidth = 1.5;
        
        for (let j = 0; j < renderQueue.length; j++) {
            const item = renderQueue[j];
            
            // Focal length for perspective scaling (must support deep Y tilts)
            const focalLength = 800;
            // Cap Z to avoid division by zero or negative infinity
            const scale = Math.max(0.05, focalLength / (focalLength + item.z));
            
            // Normalize alpha depth based on roughly the maximum Z possible from tilting
            const depthRange = helixRadius + 200; 
            let alpha = 0.2 + (item.z + depthRange) / (depthRange * 2) * 0.8;
            alpha = Math.min(Math.max(alpha, 0.1), 1);
            
            if (item.type === 'node') {
                ctx.fillStyle = `rgba(${item.color.r}, ${item.color.g}, ${item.color.b}, ${alpha})`;
                ctx.beginPath();
                
                const drawSize = 4.5 * scale;
                // Draw nodes as sharp shapes or dots based on color
                if (item.color === colorCode) {
                    // Code = Square
                    ctx.rect(item.x - drawSize/2, item.y - drawSize/2, drawSize, drawSize);
                } else {
                    // Design = Circle
                    ctx.arc(item.x, item.y, drawSize/2, 0, Math.PI * 2);
                }
                ctx.fill();
            } 
            else if (item.type === 'backbone') {
                ctx.strokeStyle = `rgba(${item.color.r}, ${item.color.g}, ${item.color.b}, ${alpha * 0.8})`;
                ctx.lineWidth = 1.5 * scale;
                ctx.beginPath();
                ctx.moveTo(item.x1, item.y1);
                ctx.lineTo(item.x2, item.y2);
                ctx.stroke();
            }
            else if (item.type === 'rung') {
                // Gradient line between the two nodes
                const grad = ctx.createLinearGradient(item.x1, item.y1, item.x2, item.y2);
                grad.addColorStop(0, `rgba(${colorCode.r}, ${colorCode.g}, ${colorCode.b}, ${alpha * 0.5})`);
                grad.addColorStop(1, `rgba(${colorDesign.r}, ${colorDesign.g}, ${colorDesign.b}, ${alpha * 0.5})`);
                
                ctx.strokeStyle = grad;
                ctx.lineWidth = 1.0 * scale;
                ctx.beginPath();
                ctx.moveTo(item.x1, item.y1);
                ctx.lineTo(item.x2, item.y2);
                ctx.stroke();
            }
        }
        
    }

    function animate() {
        requestAnimationFrame(animate);
        time += 0.015;
        
        // Clear frame (Solid color for sharp performance rendering)
        ctx.fillStyle = 'rgba(15, 17, 26, 1)';
        ctx.fillRect(0, 0, width, height);

        // Render Background Typography
        floatingElements.forEach(el => {
            el.update();
            el.draw();
        });

        // Render The DNA Helix
        drawDNAHelix();
    }

    // Start animation loop
    animate();
});
