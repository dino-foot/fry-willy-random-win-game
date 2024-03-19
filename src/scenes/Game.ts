import { Scene, Cameras, Display, GameObjects, Scale } from 'phaser';
import { PhaserHelpers } from '../helpers';
import { ImageButton } from '../helpers/ImageButton';
import { EventsController } from '../controllers/eventsController';

export class Game extends Scene {
    camera: Cameras.Scene2D.Camera;
    background: GameObjects.Image;
    
    isDeskTop: boolean;
    isLandscape: boolean;
    currentOrienation: Scale.Orientation;
    gameWidth: number;
    gameHeight: number;

    totalCredit: number;
    currentScore: number;
    creditText: GameObjects.Text;
    scoreText: GameObjects.Text;

    constructor() {
        super('Game');
    }

    init() {
        this.isDeskTop = this.sys.game.device.os.desktop;
        this.isLandscape = this.scale.orientation === Scale.Orientation.LANDSCAPE;
        this.currentOrienation = this.scale.orientation;
        // this.scale.on('orientationchange', this.checkOrientation, this); 
        this.gameWidth = Number(this.game.config.width);
        this.gameHeight = Number(this.game.config.height);

        this.totalCredit = 10;
        this.currentScore = 0;
        this.cameras.main.setBackgroundColor(0x00defc);
    }

    create() {
        this.camera = this.cameras.main;
        this.addLogo();
        // this.createBackground();

        const rectConfig = { x: this.camera.centerX/2 - 200, y: this.camera.centerY/2 - ( this.gameHeight/10), width: 950, height: 1400, radius: 20, color: 0xffffff, stroke: 8, strokeColor: 0x000000 };
        PhaserHelpers.addRoundedRectangle(rectConfig, this);

        this.creditText = this.addText(`Total Credit: ${this.totalCredit}`, 180, 50);
        this.scoreText = this.addText(`Current Score: ${this.currentScore}`, 180, 100);
    }

    private addLogo(){
        const logo = this.add.image(0, 0, 'logo');
        logo.setScale(0.5).setDepth(1);
        Display.Align.In.TopCenter(logo, this.add.zone(this.camera.centerX, this.camera.centerY, this.gameWidth, this.gameHeight), 0, 200);

    }

    private createBackground() {
        this.background = this.add.image(this.camera.centerX, this.camera.centerY, 'background').setOrigin(0.5).setDepth(0);
        Display.Align.In.Center(this.background, this.add.zone(this.camera.centerX, this.camera.centerY, this.gameWidth, this.gameHeight));
    }

    checkOrientation(orientation) {
        this.isLandscape = orientation === Scale.Orientation.LANDSCAPE;

        if (this.currentOrienation !== orientation) {
            this.currentOrienation = this.scale.orientation;
            // this.updateGameSize();
            // this.scale.refresh();
            // redraw 
            // this.cleanupLayout();
            // this.cameras.main.fadeIn(800, 0, 0, 0);
        }

        this.scale.refresh();
    }

    private updateGameSize() {
        if (!this.isLandscape) {
            this.scale.setGameSize(720, 1600);
        }
        else {
            this.scale.setGameSize(1920, 1080);
        }
        this.scale.refresh();
    }

    private addText(text: string, x: number, y: number, color = '#000000', size = 40) {
        return this.add.text(x, y, text, {
            fontFamily: 'Roboto-Medium',
            fontSize: size,
            color: color,
        }).setOrigin(0.5).setDepth(2).setInteractive();
    }
}
