import { Scene, GameObjects, Cameras, Display } from 'phaser';
import { PhaserHelpers } from '../helpers';

export class MainMenu extends Scene {
    background: GameObjects.Image;
    logo: GameObjects.Image;
    connectWalletBtn: GameObjects.Image;
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

        this.background = this.add.image(this.camera.centerX, this.camera.centerY, 'sky_desktop');
        this.background.setOrigin(0.5);

        this.logo = this.add.image(0, 0, 'logo');
        this.logo.setScale(0.3).setDepth(1);
        Display.Align.In.TopCenter(this.logo, this.add.zone(this.camera.centerX, this.camera.centerY, this.gameWidth, this.gameHeight), 0, 0);
        this.logo.y = 160

        const rectConfig = { x: this.camera.centerX / 2 - 200, y: this.camera.centerY / 2 - (this.gameHeight / 10), width: 1400, height: 800, radius: 20, color: 0xffffff, stroke: 5, strokeColor: 0x000000 };
        PhaserHelpers.addRoundedRectangle(rectConfig, this);

        this.connectWalletBtn = this.add.image(0, 0, 'connect-wallet').setOrigin(0.5).setScale(0.75);
        this.connectWalletBtn.setInteractive();
        this.connectWalletBtn.on('pointerdown', this.handleConnectWallet, this);
        Display.Align.In.BottomCenter(this.connectWalletBtn, this.add.zone(this.camera.centerX, this.camera.centerY, this.gameWidth, this.gameHeight), 0, -120);

        this.title = this.addText('How To Play?', 0, 0, '#fecb37', 100).setDepth(3);
        this.title.setStroke('#000000', 15);
        Display.Align.In.TopCenter(this.title, this.add.zone(this.camera.centerX, this.camera.centerY, this.gameWidth, this.gameHeight), 0, -350)

        const howtoPlay = "Cattura Willy e buttalo in una delle friggitrici,hai 3 tentativi per aggiungere 10 pezzi di pollo nel piatto. \nXXXXXXX \nXXXXXXX \nxxxxxxxx"
        this.text = this.addText(howtoPlay, this.camera.centerX, this.camera.centerY + 90, '#000000', 40);
        this.text.setOrigin(0.5);
        this.text.setStyle({ wordWrap: { width: 800 }, align: 'center' });

        // debug
        this.scene.start('Game');
    }

    handleConnectWallet() {
        console.log('connect-wallet-button');
        this.scene.start('Game');
    }

    private addText(text: string, x: number, y: number, color: string, size: number) {
        return this.add.text(x, y, text, {
            fontFamily: 'NerkoOne-Regular',
            fontSize: size,
            color: color,
        }).setOrigin(0.5).setDepth(2).setInteractive();
    }
}
