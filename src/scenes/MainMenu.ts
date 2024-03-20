import { Scene, GameObjects, Cameras, Display } from 'phaser';
import { PhaserHelpers } from '../helpers';

export class MainMenu extends Scene {
    background: GameObjects.Image;
    logo: GameObjects.Image;
    camera: Cameras.Scene2D.Camera;
    gameWidth: number;
    gameHeight: number;
    text: GameObjects.Text;
    title: GameObjects.Text;

    constructor() {
        super('MainMenu');
    }

    init() {
        this.gameWidth = Number(this.game.config.width);
        this.gameHeight = Number(this.game.config.height);
        this.cameras.main.setBackgroundColor(0x00defc);
    }

    create() {
        this.camera = this.cameras.main;

        // const cloud = this.add.image(200, 300, 'cloud').setOrigin(0.5).setDepth(0);
        // this.background = this.add.image(this.camera.centerX, this.camera.centerY, 'background');
        // this.background.setOrigin(0.5);

        this.logo = this.add.image(0, 0, 'logo');
        this.logo.setScale(0.5).setDepth(1);
        Display.Align.In.TopCenter(this.logo, this.add.zone(this.camera.centerX, this.camera.centerY, this.gameWidth, this.gameHeight), 0, 200);

        const rectConfig = { x: this.camera.centerX/2 - 200, y: this.camera.centerY/2 - ( this.gameHeight/10), width: 950, height: 1400, radius: 20, color: 0xffffff, stroke: 8, strokeColor: 0x000000 };
        PhaserHelpers.addRoundedRectangle(rectConfig, this);
        
        this.title =  this.addText('How To Play?', this.camera.centerX, this.camera.centerY - 350, '#000000', 60);

        const t = "Cattura Willy e buttalo in una delle friggitrici,hai 3 tentativi per aggiungere 10 pezzi di pollo nel piatto. XXXXXXX \nXXXXXXX \nXXXXXXX"
        this.text =  this.addText(t, this.camera.centerX, this.camera.centerY - 100, '#000000', 40);
        this.text.setOrigin(0.5);
        this.text.setStyle({wordWrap: { width: 500 }, align: 'center'});
        

        this.text =  this.addText('click anywhere to start ', this.camera.centerX, this.camera.centerY + 300, '#000000', 30);
        // this.scene.start('Game');
        // this.input.once('pointerdown', () => {
        //     this.scene.start('Game');
        // });
    }

    private addText(text: string, x: number, y: number, color: string, size: number) {
        return this.add.text(x, y, text, {
            fontFamily: 'Roboto-Medium',
            fontSize: size,
            color: color,
        }).setOrigin(0.5).setDepth(2).setInteractive();
    }
}
