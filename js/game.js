"use strict";
 
import Player from "./car.js";

class SgGame {
    constructor ( target, playerName1, playerName2, raceTrack) {
        this.game;
        this.dt = 0;
        this.gameTime = Date.now();
        this.DOM = document.querySelector(target);
        this.DOMground;
        this.screenSize = {
            width: 1536,
            height: 640
        }
        this.player1 = new Player(0, playerName1, 'black', '1', 'leftCenter', this.screenSize);
        this.player2 = new Player(1, playerName2, 'blue', '5', 'rightCenter', this.screenSize);
        this.track = new Player(2, raceTrack, 0, 0, 0, 0);

        this.raceTrack = raceTrack || 'grass';

        this.init();
    }

    init() {
        this.DOM.classList.add('game');
        this.DOM.innerHTML = `
            <div class="info player-0"></div>
            <div class="info player-1"></div>
            <div class="tribuneTop"></div>
            <div class="tribuneBottom"></div>
            <div class="treeOne"></div>
            <div class="treeThree"></div>
            <div class="treeFour"></div>
            <div class="grassLeft"></div>
            <div class="grassCorner"></div>
            <div class="parking2"></div>
            <div class="parking3"></div>
            <div class="parking4"></div>
            <div class="parking5"></div>
            <div class="parking6"></div>
            <div class="parking7"></div>
            <div class="person1"></div>
            <div class="person2"></div>
            <div class="person3"></div>
            <div class="person4"></div>
            <div class="person5"></div>
            <div class="person6"></div>
            <div class="tent"></div>
            <div class="ground"></div>`;
        this.DOMground = this.DOM.querySelector('.ground');
        this.DOMplayer0info = this.DOM.querySelector('.info.player-0');
        this.DOMplayer1info = this.DOM.querySelector('.info.player-1');
        this.DOMground.style.width = this.screenSize.width + 'px';
        this.DOMground.style.height = this.screenSize.height + 'px';
        this.DOMground.classList.add(this.raceTrack);
        this.player1.carRender( this.DOMground, this.DOMplayer0info );
        this.player2.carRender( this.DOMground, this.DOMplayer1info );
        this.track.trackRender( this.DOMground, track);

        this.game = window.requestAnimationFrame(() => {
            this.start()
        })
    }

    start(){
        const now = Date.now();
        this.dt = (now - this.gameTime) / 800;             //standard 1000
        this.gameTime = now;
        
        // Car movement
        this.player1.move( this.dt );
        this.player2.move( this.dt );
        
        window.requestAnimationFrame(() => {
            this.start()
        })
    }
}

export default SgGame;