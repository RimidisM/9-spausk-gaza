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
        const raceTrack = `
            <img class="track"
                src="./img/tiles/Asphalt_road/road_asphalt07.png"
                data-index="${this.index}"
                style="width: 128px;
                    height: 128px;
                    top: 0px;
                    left: 0px;
                    z-index: -10;
                    transform: rotate(270deg);">`;
        DOM.insertAdjacentHTML('beforeend', raceTrack);
        this.DOMcar = DOM.querySelector(`.raceTrack[data-index="${this.index}"]`);
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