class Player {
    constructor ( index, name, carColor, carNumber, position, screenSize ) {
        this.index = index;
        this.DOMcar;
        this.DOMinfo;
        this.DOMGameOver;
        this.GameOver;
        this.DOMspeed;
        this.DOMlap;
        this.DOMdirection;
        this.DOMwinner;
        this.screenSize = screenSize;
        this.carColor = carColor || 'black';
        this.carNumber = carNumber || '4';
        this.carSize = { width: 38, height: 70 }               
        this.position;
        this.speed = 0;
        this.maxBwSpeed = 55;                                    // Max speed backword
        this.breakingSpeed = 40;                                 // Brake speed
        this.frictionSpeed = 100;                                 // Uncontroled speed decrise
        this.direction = 0;                                      // Car rotation angle
        this.wheelAngle = 0;                                     // Wheel angle
        this.wheelTurnSpeed = 90;                                // Car rotation speed
        this.carPositionX;
        this.carPositionY;
        this.xDistance;
        this.yDistance
        this.tileSize = 128;
        this.lap = 0;
        this.rounding = 0;
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
                top: (screenSize.height - this.carSize.height + 140) / 2,
                left: 50
            },
            rightCenter: {
                top: (screenSize.height - this.carSize.height - 140) / 2,
                left: screenSize.width - this.carSize.width -50
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
            { up: 87, down: 83, right: 68, left: 65},
            { up: 38, down: 40, right: 39, left: 37}
        ];

        this.keyboard = sets[this.index];
    }

    carRender = ( DOM, infoDOM, DOMthisGameOver ) => {
        this.DOMinfo = infoDOM;
        this.DOMendGame = DOMthisGameOver;

        this.DOMinfo.innerHTML = `
            <div class="speed"><span>50</span>km/h</div>
            <div class="lap">Lap: <span>0</span></div>
            <div class="winner"><span></span></div>
        `;

        this.DOMendGame.innerHTML = `
            <span class="gameOver"></span>
        `;

        this.DOMspeed = this.DOMinfo.querySelector('.speed > span');
        this.DOMdirection = this.DOMinfo.querySelector('.direction > span');
        this.DOMwinner = this.DOMinfo.querySelector('.winner > span');
        this.DOMlap = this.DOMinfo.querySelector('.lap > span');
        this.DOMgameOver = this.DOMendGame.querySelector('.gameOver');
    
        const car = `
            <img class="car"
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

    trackRender = (DOM, track) => {
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
                    this.trackSurface = 'Sand';
                    this.trackSurfaceElement = 'land_sand05';
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
                 //Check point 
                 if (element === 9) {
                    this.trackSurface = 'Asphalt_road';
                    this.trackSurfaceElement = 'road_asphalt43';
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
        }
    }
    
    move = ( dt ) => {

        //Forward speed
        if ( this.keyboardPressed.up ) {
            this.speed -= this.maxFwSpeed * dt;
        }
        //Forward speed decrease if no speed added
        if (this.keyboardPressed.down === false && this.keyboardPressed.up === false &&  this.speed !==0 ) {
            
            if ( this.speed > 0) {
                this.speed = -2;
            }
            this.speed += this.frictionSpeed * dt;
        }
        //Backward speed
        if ( this.keyboardPressed.down ) {
            this.speed += this.maxBwSpeed * dt;
        }

        // Max speed limit
        if ( this.speed > this.maxBwSpeed ) {
            this.speed = this.maxBwSpeed;
        }
        if ( this.speed < -this.maxFwSpeed ) {
            this.speed = -this.maxFwSpeed;
        }
       
        if ( this.keyboardPressed.left ) {
            this.direction -= this.wheelTurnSpeed * dt;
        }
        if ( this.keyboardPressed.right ) {
            this.direction += this.wheelTurnSpeed * dt;
        }

        this.DOMspeed.textContent = Math.round(this.speed * (-1));
        
        this.position.top += Math.sin((this.direction + 90) / 180 * Math.PI) * this.speed * dt;  
        this.position.left += Math.cos((this.direction + 90) / 180 * Math.PI) * this.speed * dt;
  
        // Game area limits
        if ( this.position.top < 0 ) {
            this.position.top = 0;
            if ( this.keyboardPressed.down ) {
                this.speed += 500 * dt;
            }
        }

        if ( this.position.top > this.screenSize.height - this.carSize.height ) {
            this.position.top = this.screenSize.height - this.carSize.height;
            if ( this.keyboardPressed.down ) {
                this.speed += 500 * dt;
            }
        }
        if ( this.position.left < 0 ) {
            this.position.left = 0;
            if ( this.keyboardPressed.down ) {
                this.speed += 500 * dt;
            }
        }
        if ( this.position.left > this.screenSize.width - this.carSize.width ) {
            this.position.left = this.screenSize.width - this.carSize.width;
            if ( this.keyboardPressed.down ) {
                this.speed += 500 * dt;
            }
        
        }

        this.DOMcar.style.top = this.position.top + 'px';
        this.DOMcar.style.left = this.position.left + 'px';
        this.DOMcar.style.transform = `rotate(${this.direction}deg)`;

        this.getDirection(track, this.position.top,  this.position.left  );
    }

    //Car tree distance calculation
    getDirection = (track, carY, carX) => {
        // Automaticaly generating tarck                

        this.rowHeight = 0;
        this.rowHeightCounter = 0;
        this.rowCounter = 0;
        this.maxFwSpeed = 200;
       

        for (let i = 0; i < track.length; i++) {
            const trackElement = track[i];  

            for (let j = 0; j < trackElement.length; j++) {
                let element = trackElement[j];
                this.rowHeightCounter++;
               
                if (this.rowHeightCounter < 12) {
                    this.rowHeight = 0;
                }
                if (this.rowHeightCounter > 12) {
                    this.rowHeight = this.tileSize * this.rowCounter;  
                }
                if (this.rowHeightCounter > 24) {
                    this.rowHeight = this.tileSize * this.rowCounter;  
                }

                //Tree and sand position in the map
                this.carPositionX = carX;
                this.carPositionY = carY;
                this.tilePositionX = j * this.tileSize;
                this.tilePositionY = this.rowHeight;
                this.xDistance = (j * this.tileSize) - carX;
                this.yDistance = this.rowHeight - carY;
               
                if (element === 8) {
                    // Slow speed on crasch
                    if (this.tilePositionX < this.carPositionX + 10 && 
                        this.tilePositionX + this.tileSize -50 > this.carPositionX && 
                        this.tilePositionY < this.carPositionY + 10 && 
                        this.tilePositionY + this.tileSize -50 > this.carPositionY ) {
                            return this.maxFwSpeed = 20;
                        }
                    }
                     //Sand speed 
                if (element === 0) {
                    // Slow speed on crasch
                    if (this.tilePositionX < this.carPositionX + 15 && 
                        this.tilePositionX + this.tileSize > this.carPositionX && 
                        this.tilePositionY < this.carPositionY + 15 && 
                        this.tilePositionY + this.tileSize > this.carPositionY ) {
                            return this.maxFwSpeed = 100;
                    }
                }
                 //Lap counter
                
                if (element === 7 || element === 9 ) {
                    if (this.tilePositionX < this.carPositionX + 15 && 
                        this.tilePositionX + this.tileSize > this.carPositionX && 
                        this.tilePositionY < this.carPositionY + 3 && 
                        this.tilePositionY + 1 > this.carPositionY ) {

                        if (element === 7) {
                            this.checkpoint = j;
                            this.pointTime = new Date() -1;
                            
                            this.lapCount();
                        }
                    }
                }
                if (element === 9 ) {
                    if (this.tilePositionX < this.carPositionX + 3 && 
                        this.tilePositionX + 1 > this.carPositionX && 
                        this.tilePositionY < this.carPositionY + 15 && 
                        this.tilePositionY + this.tileSize > this.carPositionY ) {

                        if (element === 9) {
                            this.checkpoint = j;
                            this.pointTime = new Date() -1;
                            
                            this.lapCount();
                        }
                    }
                }
            }
            this.rowCounter++;       
        }
    }

    lapCount = () => {
        this.lap = 0;

        if (this.checkpoint === 11) {
            this.checkOne = 'a';
           
            // console.log('check  1');
            
        }
        if (this.checkpoint === 4) {
            // console.log('check  2');
            this.checkTwo = 'b';
        }
        if (this.checkpoint === 0) {
            // console.log('check  3');
            this.checkThree = 'c';
        }
        if (this.checkpoint === 7) {
            // console.log('check  4');
            this.checkFour = 'd';
        }

        this.lap = this.checkTwo + this.checkThree + this.checkFour + this.checkOne;

        // console.log(this.lap);

        if (this.lap === 'bcda') {
            this.lap = 0;
            this.checkOne = 0;
            this.checkTwo = 0;
            this.checkThree = 0; 
            this.checkFour = 0;

            this.rounding = this.rounding + 1 ;
            this.DOMlap.textContent = this.rounding;
        }
        if (this.rounding === 3) {
            this.DOMwinner.textContent = 'WINNER';

            this.DOMgameOver.textContent = 'We have a winner!!! If you want to play again refresh the page (ctrl + r).';
            this.color = 'black';
            this.DOMgameOver.style.background = this.color;
        }
    }  
}

export default Player;