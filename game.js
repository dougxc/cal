const { Engine, Render, Runner, Bodies, Composite, Events, World, Body } = Matter;

let engine, render, runner, ball;
let siblingMode = false;
// 1. Reversed positions: Start at bottom center, Goal at top center
const startPos = { x: window.innerWidth / 2, y: window.innerHeight - 80 };
const holes = [];
let goal;

const config = {
    width: window.innerWidth,
    height: window.innerHeight,
    ballRadius: 15,
    gravityScale: 0.0015,
    friction: 0.02,
    restitution: 0.6
};

// Asset Paths
const assets = {
    sounds: {
        bounce: 'assets/sounds/bounce.mp3',
        fall: 'assets/sounds/fall.mp3',
        win: 'assets/sounds/win.mp3',
        start: 'assets/sounds/start.mp3'
    },
    photos: [
        'assets/photos/sibling1.png',
        'assets/photos/sibling2.png',
        'assets/photos/sibling3.png'
    ],
    gift: 'assets/photos/gift.jpg',
    goal: 'assets/photos/handsome-man.png' // 3. Custom goal photo
};

// Sound helper
function playSound(name) {
    const audio = new Audio(assets.sounds[name]);
    audio.volume = 0.5;
    audio.play().catch(e => console.log("Audio play blocked", e));
}

function initGame() {
    engine = Engine.create();
    engine.gravity.y = 0;

    render = Render.create({
        element: document.getElementById('game-container'),
        engine: engine,
        options: {
            width: config.width,
            height: config.height,
            wireframes: false,
            background: 'transparent'
        }
    });

    createLevel();

    ball = Bodies.circle(startPos.x, startPos.y, config.ballRadius, {
        restitution: config.restitution,
        friction: config.friction,
        render: {
            fillStyle: '#ffffff',
            strokeStyle: '#00ffff',
            lineWidth: 3
        }
    });
    Composite.add(engine.world, ball);

    runner = Runner.create();
    Runner.run(runner, engine);
    Render.run(render);

    Events.on(engine, 'collisionStart', (event) => {
        event.pairs.forEach((pair) => {
            const { bodyA, bodyB } = pair;
            
            if ((bodyA === ball && holes.includes(bodyB)) || (bodyB === ball && holes.includes(bodyA))) {
                playSound('fall');
                resetBall();
            }
            
            if ((bodyA === ball && bodyB === goal) || (bodyB === ball && bodyA === goal)) {
                playSound('win');
                winGame();
            }

            if (bodyA === ball || bodyB === ball) {
                if (!holes.includes(bodyA) && !holes.includes(bodyB) && bodyA !== goal && bodyB !== goal) {
                    playSound('bounce');
                }
            }
        });
    });

    setInterval(() => {
        if (siblingMode && runner.enabled) {
            createSiblingTrail(ball.position.x, ball.position.y);
        }
    }, 400);
}

function createLevel() {
    const w = config.width;
    const h = config.height;
    const wallStyle = { fillStyle: '#bc13fe', strokeStyle: '#ff00ff', lineWidth: 2 };
    const holeStyle = { fillStyle: '#000000', strokeStyle: '#333', lineWidth: 2 };

    const bounds = [
        Bodies.rectangle(w/2, 0, w, 20, { isStatic: true, render: wallStyle }),
        Bodies.rectangle(w/2, h, w, 20, { isStatic: true, render: wallStyle }),
        Bodies.rectangle(0, h/2, 20, h, { isStatic: true, render: wallStyle }),
        Bodies.rectangle(w, h/2, 20, h, { isStatic: true, render: wallStyle })
    ];
    Composite.add(engine.world, bounds);

    const unitX = w / 10;
    const unitY = h / 10;

    // Adjusted "40" layout for bottom-to-top flow
    const num4 = [
        Bodies.rectangle(unitX * 3, unitY * 6, 20, unitY * 3, { isStatic: true, render: wallStyle }), // left
        Bodies.rectangle(unitX * 4, unitY * 7.5, unitX * 2, 20, { isStatic: true, render: wallStyle }), // cross
        Bodies.rectangle(unitX * 5, unitY * 6, 20, unitY * 5, { isStatic: true, render: wallStyle })  // right
    ];

    const num0 = [
        Bodies.rectangle(unitX * 7, unitY * 4, 20, unitY * 3, { isStatic: true, render: wallStyle }),
        Bodies.rectangle(unitX * 9, unitY * 4, 20, unitY * 3, { isStatic: true, render: wallStyle }),
        Bodies.rectangle(unitX * 8, unitY * 2.5, unitX * 2, 20, { isStatic: true, render: wallStyle }),
        Bodies.rectangle(unitX * 8, unitY * 5.5, unitX * 2, 20, { isStatic: true, render: wallStyle })
    ];

    const holePositions = [
        { x: unitX * 2, y: h/2 },
        { x: unitX * 8, y: unitY * 7 },
        { x: unitX * 5, y: unitY * 2 }
    ];

    holePositions.forEach(pos => {
        const hBody = Bodies.circle(pos.x, pos.y, 25, { isStatic: true, isSensor: true, render: holeStyle });
        holes.push(hBody);
        Composite.add(engine.world, hBody);
    });

    // 3. Goal as photo (Doubled size)
    goal = Bodies.circle(unitX * 8, unitY * 1.5, 80, { 
        isStatic: true, 
        isSensor: true, 
        render: { 
            sprite: {
                texture: assets.goal,
                xScale: 0.3, 
                yScale: 0.3
            }
        } 
    });

    Composite.add(engine.world, [...num4, ...num0, goal]);
}

function resetBall() {
    Body.setPosition(ball, startPos);
    Body.setVelocity(ball, { x: 0, y: 0 });
    document.body.style.backgroundColor = '#200';
    setTimeout(() => document.body.style.backgroundColor = '#050505', 100);
}

function winGame() {
    Runner.stop(runner);
    document.getElementById('win-screen').classList.remove('hidden');
    
    const giftImg = document.getElementById('gift-img');
    if (giftImg) giftImg.src = assets.gift;

    const duration = 5 * 1000;
    const end = Date.now() + duration;

    (function frame() {
        confetti({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#ff00ff', '#00ffff']
        });
        confetti({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#ff00ff', '#00ffff']
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());
}

function createSiblingTrail(x, y) {
    const container = document.createElement('div');
    container.className = 'sibling-photo-container';
    container.style.left = (x - 30) + 'px';
    container.style.top = (y - 30) + 'px';
    
    const img = document.createElement('img');
    const randomPhoto = assets.photos[Math.floor(Math.random() * assets.photos.length)];
    img.src = randomPhoto;
    img.onerror = () => {
        container.innerHTML = '❤️';
        container.style.fontSize = '30px';
    };
    
    container.appendChild(img);
    container.style.transition = 'all 2s ease-out';
    container.style.opacity = '1';
    document.body.appendChild(container);

    setTimeout(() => {
        container.style.transform = `scale(0.2) rotate(${Math.random() * 360}deg)`;
        container.style.opacity = '0';
    }, 50);

    setTimeout(() => container.remove(), 2000);
}

// Controls
document.getElementById('start-btn').addEventListener('click', async () => {
    siblingMode = document.getElementById('sibling-mode').checked;
    playSound('start');

    // 2. Lock Orientation (Standard API)
    if (screen.orientation && screen.orientation.lock) {
        try {
            // Requesting fullscreen is often required for orientation lock
            await document.documentElement.requestFullscreen();
            await screen.orientation.lock('portrait');
        } catch (e) {
            console.log("Orientation lock not supported or failed", e);
        }
    }

    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        try {
            const permission = await DeviceOrientationEvent.requestPermission();
            if (permission === 'granted') {
                enableSensor();
            } else {
                alert("Permission denied. Use arrow keys to play.");
            }
        } catch (e) { console.error(e); }
    } else {
        enableSensor();
    }

    document.getElementById('start-screen').classList.add('hidden');
    initGame();
});

function enableSensor() {
    window.addEventListener('deviceorientation', (event) => {
        if (!ball) return;
        engine.gravity.x = event.gamma * config.gravityScale;
        engine.gravity.y = event.beta * config.gravityScale;
    });
}

window.addEventListener('keydown', (e) => {
    if (!ball) return;
    const force = 0.005;
    if (e.key === 'ArrowUp') Body.applyForce(ball, ball.position, { x: 0, y: -force });
    if (e.key === 'ArrowDown') Body.applyForce(ball, ball.position, { x: 0, y: force });
    if (e.key === 'ArrowLeft') Body.applyForce(ball, ball.position, { x: -force, y: 0 });
    if (e.key === 'ArrowRight') Body.applyForce(ball, ball.position, { x: force, y: 0 });
});
