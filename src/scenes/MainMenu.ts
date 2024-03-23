import { Scene, GameObjects, Cameras, Display, Scale } from 'phaser';
import { PhaserHelpers } from '../helpers';
export class MainMenu extends Scene {
    background: GameObjects.Image;
    logo: GameObjects.Image;
    connectWalletBtn: GameObjects.Image;
    camera: Cameras.Scene2D.Camera;

    gameWidth: number;
    gameHeight: number;
    isDeskTop: boolean;
    isLandscape: boolean;
    currentOrienation: Scale.Orientation;

    rect: GameObjects.Graphics;
    text: GameObjects.Text;
    title: GameObjects.Text;
    howtoPlay: string;

    constructor() {
        super('MainMenu');
    }

    init() {
        this.gameWidth = Number(this.game.config.width);
        this.gameHeight = Number(this.game.config.height);

        this.isDeskTop = this.sys.game.device.os.desktop;
        this.isLandscape = this.scale.orientation === Scale.Orientation.LANDSCAPE;
        this.currentOrienation = this.scale.orientation;
        this.scale.on('orientationchange', this.checkOrientation, this);
        
        this.input.setDefaultCursor('url(/assets/hand.cur), pointer');
    }

    create() {
        this.camera = this.cameras.main;
        this.drawLayout();

        // debug
        // this.scene.start('Game');
    }



    private drawLayout() {
        let offsetY = 0;

        const key = this.isLandscape ? 'sky_desktop' : 'sky_mobile';
        this.background = this.add.image(this.camera.centerX, this.camera.centerY, key);
        this.background.setOrigin(0.5);

        this.logo = this.add.image(0, 0, 'logo');
        this.logo.setScale(this.isLandscape ? 0.3 : 0.5).setDepth(1);
        offsetY = this.isLandscape ? 300 : 450;
        Display.Align.In.TopCenter(this.logo, this.add.zone(this.camera.centerX, this.camera.centerY, this.gameWidth, this.gameHeight), 0, offsetY);

        if (this.isLandscape) this.landscapeRect();
        else this.portraitRect();

        this.connectWalletBtn = this.add.image(0, 0, 'connect-wallet').setOrigin(0.5).setScale(0.75);
        this.connectWalletBtn.setInteractive();
        this.connectWalletBtn.on('pointerdown', this.handleConnectWallet, this);
        offsetY = this.isLandscape ? -120 : 100;
        Display.Align.In.BottomCenter(this.connectWalletBtn, this.add.zone(this.camera.centerX, this.camera.centerY, this.gameWidth, this.gameHeight), 0, offsetY);

        this.title = this.addText('How To Play?', 0, 0, '#fecb37', 100).setDepth(3);
        this.title.setStroke('#000000', 15);
        Display.Align.In.TopCenter(this.title, this.add.zone(this.camera.centerX, this.camera.centerY, this.gameWidth, this.gameHeight), 0, -350);

        this.howtoPlay = "Cattura Willy e buttalo in una delle friggitrici,hai 3 tentativi per aggiungere 10 pezzi di pollo nel piatto. \nXXXXXXX \nXXXXXXX \nxxxxxxxx";
        this.text = this.addText(this.howtoPlay, this.camera.centerX, this.camera.centerY + 90, '#000000', 40);
        this.text.setOrigin(0.5);
        this.text.setStyle({ wordWrap: { width: this.isLandscape ? 800 : 500 }, align: 'center' });
    }

    private landscapeRect() {
        const rectConfig = { x: this.camera.centerX / 2 - 200, y: this.camera.centerY / 2 - (this.gameHeight / 10), width: 1400, height: 800, radius: 20, color: 0xffffff, stroke: 5, strokeColor: 0x000000 };
        this.rect = PhaserHelpers.addRoundedRectangle(rectConfig, this);
    }

    private portraitRect() {
        const rectConfig = { x: this.camera.centerX / 2 - 145, y: this.camera.centerY / 2 - (this.gameHeight / 10), width: 650, height: 1080, radius: 20, color: 0xffffff, stroke: 5, strokeColor: 0x000000 };
        this.rect = PhaserHelpers.addRoundedRectangle(rectConfig, this);
    }

    handleConnectWallet() {
        console.log('connect-wallet-button');
        this.scene.start('Game');
    }

    checkOrientation(orientation: Scale.Orientation) {
        this.isLandscape = orientation === Scale.Orientation.LANDSCAPE;

        if (this.currentOrienation !== orientation) {
            this.currentOrienation = this.scale.orientation;
            this.updateGameSize();

            // redraw 
            this.cleanupLayout();
            this.cameras?.main?.fadeIn(800, 0, 0, 0);
        }

        if (!this.isDeskTop && this.currentOrienation === Scale.Orientation.LANDSCAPE) {
            // console.log('landscape');
            this.landscapeLayout();

        } else if (!this.isDeskTop && this.currentOrienation === Scale.Orientation.PORTRAIT) {
            // console.log('portrait');
            this.portraitLayout();
        }
        else {
            // desktop
            this.landscapeLayout();
        }

        this.scale.refresh();
    }

    cleanupLayout() {
        this.background?.destroy();
        this.logo?.destroy();
        this.connectWalletBtn?.destroy();
        this.text?.destroy();
        this.title?.destroy();
        this.rect?.destroy();
    }

    portraitLayout() {
        this.drawLayout()
    }

    landscapeLayout() {
        this.drawLayout()
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

    private addText(text: string, x: number, y: number, color: string, size: number) {
        return this.add.text(x, y, text, {
            fontFamily: 'NerkoOne-Regular',
            fontSize: size,
            color: color,
        }).setOrigin(0.5).setDepth(2).setInteractive();
    }
}
