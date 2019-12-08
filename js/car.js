class Player {
    constructor ( index, name, carColor, carNumber, position, screenSize ) {
        this.index = index;
        this.DOMcar;
        this.DOMinfo;
        this.DOMspeed;
        this.DOMlife;
        this.DOMdirection;
        this.DOMturn;
        this.screenSize = screenSize;
        this.name = name;
        this.carColor = carColor || 'black';
        this.carNumber = carNumber || '4';
        this.carSize = { width: 38, height: 70 }                // Max speed backword
        this.position;
        this.speed = 0;
        this.accelaration = 0;
        this.maxBwSpeed = 55;                                    // Max speed backword
        this.maxFwSpeed = 200;                                   // Max speed forward
        this.breakingSpeed = 40;                                 // Brake speed
        this.frictionSpeed = 60;                                 // Uncontroled speed decrise
        this.direction = 0;                                      // Car rotation angle
        this.wheelAngle = 0;                                     // Wheel angle
        this.wheelTurnSpeed = 60;                                // Car rotation speed
        this.keyboard;
        this.keyboardPressed = {
            up: false,
            down: false,
            right: false,
            left: false
        };
        
        this.init( position, screenSize );
    }

    init( position, screenSize ) {
        this.setInitialPosition( position, screenSize );
        this.setInitialDirection( position );
        this.setKeybind();
    }

    setInitialPosition( position, screenSize ) {
        const positions = {
            topCenter: {
                top: 0,
                left: (screenSize.width - this.carSize.width) / 2
            },
            bottomCenter: {
                top: screenSize.height - this.carSize.height,
                left:  (screenSize.width - this.carSize.width) / 2
            },
            leftCenter: {
                top: (screenSize.height - this.carSize.height) / 2,
                left: 20
            },
            rightCenter: {
                top: (screenSize.height - this.carSize.height) / 2,
                left: screenSize.width - this.carSize.width -20
            },
        }
        this.position = positions[position];
    }

    setInitialDirection( position ) {
        const positions = {
            topCenter: 0,
            bottomCenter: 0,
            leftCenter: 0,
            rightCenter: 180
        }
        this.direction = positions[position];
    }

    setKeybind() {
        // Keyboard keys kodes
        const sets = [
            { up: 83, down: 87, right: 68, left: 65},
            { up: 40, down: 38, right: 39, left: 37}
        ];

        this.keyboard = sets[this.index];
    }

    carRender = ( DOM, infoDOM ) => {
        this.DOMinfo = infoDOM;
        this.DOMinfo.innerHTML = `
            <div class="speed"><span>50</span>km/h</div>
            <div class="direction">Direction: <span>forward || backward</span></div>
            <div class="turn">Turn: <span>-20deg || 20deg</span></div>
        `;
        this.DOMspeed = this.DOMinfo.querySelector('.speed > span');
        this.DOMdirection = this.DOMinfo.querySelector('.direction > span');
        this.DOMturn = this.DOMinfo.querySelector('.turn > span');

        const car = `<img class="car"
                        src="./img/cars/car_${this.carColor}_small_${this.carNumber}.png"
                        data-index="${this.index}"
                        style="width: ${this.carSize.width}px;
                            height: ${this.carSize.height}px;
                            top: ${this.position.top}px;
                            left: ${this.position.left}px;
                            transform: rotate(${this.direction}deg);">`;
        DOM.insertAdjacentHTML('beforeend', car);
        this.DOMcar = DOM.querySelector(`.car[data-index="${this.index}"]`);

        window.addEventListener('keydown', (e) => {
            switch (e.keyCode) {
                case this.keyboard.up:
                    this.keyboardPressed.up = true;
                    break;
                case this.keyboard.left:
                    this.keyboardPressed.left = true;
                    break;
                case this.keyboard.down:
                    this.keyboardPressed.down = true;
                    break;
                case this.keyboard.right:
                    this.keyboardPressed.right = true;
                    break;
               
                default:
                    break;
            }
        })

        window.addEventListener('keyup', (e) => {
            switch (e.keyCode) {
                case this.keyboard.up:
                    this.keyboardPressed.up = false;
                    break;
                case this.keyboard.left:
                    this.keyboardPressed.left = false;
                    break;
                case this.keyboard.down:
                    this.keyboardPressed.down = false;
                    break;
                case this.keyboard.right:
                    this.keyboardPressed.right = false;
                    break;
               
                default:
                    break;
            }
        })
    }

    trackRender = (DOM) => {

        // 0 - sand
        // 1 - road north/south
        // 2 - road east/west
        // 3 - right turn (top)
        // 4 - left turn (top)
        // 5 - right turn (bottom)
        // 6 - left turn (bottom)
        // 7 - start/finish
        // 8 - tree

        const track = [
            [3, 2, 2, 4, 0, 3, 2, 2, 2, 4, 0, 0],
            [1, 0, 0, 6, 4, 1, 8, 0, 0, 6, 2, 4],
            [7, 3, 4, 0, 6, 5, 0, 0, 0, 0, 8, 7],
            [6, 5, 1, 0, 0, 8, 3, 2, 2, 4, 0, 1],
            [0, 8, 6, 2, 2, 2, 5, 0, 0, 6, 2, 5]
        ];

        // Automaticaly generating tarck                
        this.trackSurface;
        this.trackSurfaceElement;
        this.rowHeight = 0;
        this.rowHeightCounter = 0;
        this.rowCounter = 0;
        for (let i = 0; i < track.length; i++) {
            const trackElement = track[i];    
            for (let j = 0; j < trackElement.length; j++) {
                let element = trackElement[j];
                this.rowHeightCounter++;
                //Track elements to .png
                //Sand element
                if (element === 0) {
                    this.trackSurface = 'Sand_road';
                    this.trackSurfaceElement = 'road_sand18';
                }
                //Asphalt road north/south
                if (element === 1) {
                    this.trackSurface = 'Asphalt_road';
                    this.trackSurfaceElement = 'road_asphalt01';
                }
                //Asphalt road east/west
                if (element === 2) {
                    this.trackSurface = 'Asphalt_road';
                    this.trackSurfaceElement = 'road_asphalt02';
                }
                //Right turn (top)
                if (element === 3) {
                    this.trackSurface = 'Asphalt_road';
                    this.trackSurfaceElement = 'road_asphalt03';
                }
                 //Left turn (top)
                 if (element === 4) {
                    this.trackSurface = 'Asphalt_road';
                    this.trackSurfaceElement = 'road_asphalt05';
                }
                  //Right turn (bottom)
                  if (element === 5) {
                    this.trackSurface = 'Asphalt_road';
                    this.trackSurfaceElement = 'road_asphalt41';
                }
                  //Left turn (bottom)
                  if (element === 6) {
                    this.trackSurface = 'Asphalt_road';
                    this.trackSurfaceElement = 'road_asphalt39';
                }
                  //Start/finish
                  if (element === 7) {
                    this.trackSurface = 'Asphalt_road';
                    this.trackSurfaceElement = 'road_asphalt42';
                }
                  //Tree
                  if (element === 8) {
                    this.trackSurface = 'Sand_road';
                    this.trackSurfaceElement = 'tree_small';
                }

           
                if (this.rowHeightCounter < 12) {
                    this.rowHeight = 0;
                }
                if (this.rowHeightCounter > 12) {
                    this.rowHeight = 128 * this.rowCounter;  
                }
                if (this.rowHeightCounter > 24) {
                    this.rowHeight = 128 * this.rowCounter;  
                }
                
                console.log( this.rowHeight);

        const raceTrack = `
            <img class="track"
                src="./img/tiles/${this.trackSurface}/${this.trackSurfaceElement}.png"
                
                style="width: 128px;
                    height: 128px;
                    top: ${this.rowHeight}px;
                    left: ${j * 128}px;
                    z-index: -5;
                    transform: rotate(0deg);">`;
        DOM.insertAdjacentHTML('beforeend', raceTrack);
        this.DOMcar = DOM.querySelector(`.raceTrack[data-index="${this.index}"]`);
        }
        this.rowCounter++;
        console.log(this.rowCounter);
    }
}
 
    positionInfo = () => {
        return [ this.index, this.position.top, this.position.left, this.direction ];
    }

    move = ( dt ) => {
        if ( this.keyboardPressed.up ) {
            this.speed += this.maxBwSpeed * dt;
        }
        if ( this.keyboardPressed.down ) {
            this.speed -= this.maxFwSpeed * dt;
        }
        // Max speed limit
        if ( this.speed > this.maxBwSpeed ) {
            this.speed = this.maxBwSpeed;
        }
        if ( this.speed < -this.maxFwSpeed ) {
            this.speed = -this.maxFwSpeed;
        }
                    if (!this.keyboardPressed.down) {
                        this.speed = 0;
                    }

        if ( this.keyboardPressed.left ) {
            this.direction -= this.wheelTurnSpeed * dt;
        }
        if ( this.keyboardPressed.right ) {
            this.direction += this.wheelTurnSpeed * dt;
        }

        this.DOMspeed.textContent = Math.round(Math.abs(this.speed));
        if ( this.speed > 0 ) {
            this.DOMdirection.textContent = 'forward';
        } else if ( this.speed < 0 ) {
            this.DOMdirection.textContent = 'backward';
        } else {
            this.DOMdirection.textContent = 'stopped';
        }
        this.DOMdirection.textContent = this.direction;

        this.position.top += Math.sin((this.direction + 90) / 180 * Math.PI) * this.speed * dt;
        this.position.left += Math.cos((this.direction + 90) / 180 * Math.PI) * this.speed * dt;

        // Game area limits
        if ( this.position.top < 0 ) this.position.top = 0;
        if ( this.position.top > this.screenSize.height - this.carSize.height ) this.position.top = this.screenSize.height - this.carSize.height;
        if ( this.position.left < 0 ) this.position.left = 0;
        if ( this.position.left > this.screenSize.width - this.carSize.width ) this.position.left = this.screenSize.width - this.carSize.width;

        this.DOMcar.style.top = this.position.top + 'px';
        this.DOMcar.style.left = this.position.left + 'px';
        this.DOMcar.style.transform = `rotate(${this.direction}deg)`;
    }
}


export default Player;