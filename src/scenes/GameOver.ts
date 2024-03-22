import { Scene, Display, GameObjects, Scale } from 'phaser';

export class GameOver extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    logo: Phaser.GameObjects.Image;
    playAgain: GameObjects.Image;
    youWin: GameObjects.Image;

    gameWidth: number;
    gameHeight: number;
    isDeskTop: boolean;
    isLandscape: boolean;
    currentOrienation: Scale.Orientation;

    constructor() {
        super('GameOver');
    }

    create() {
        this.gameWidth = Number(this.game.config.width);
        this.gameHeight = Number(this.game.config.height);

        this.isDeskTop = this.sys.game.device.os.desktop;
        this.isLandscape = this.scale.orientation === Scale.Orientation.LANDSCAPE;
        this.currentOrienation = this.scale.orientation;
        this.scale.on('orientationchange', this.checkOrientation, this);


        this.camera = this.cameras.main
        this.createLevel();
    }

    private createLevel() {
        const key = this.isLandscape ? 'sky_desktop' : 'sky_mobile';
        this.background = this.add.image(this.camera.centerX, this.camera.centerY, key);
        this.background.setOrigin(0.5);

        this.logo = this.add.image(0, 0, 'logo');
        this.logo.setScale(0.5).setDepth(2);
        Display.Align.In.TopCenter(this.logo, this.add.zone(this.camera.centerX, this.camera.centerY, this.gameWidth, this.gameHeight), 0, 200);

        this.playAgain = this.add.image(0, 0, 'play-again');
        this.playAgain.setScale(0.8).setDepth(1);
        this.playAgain.setInteractive();

        this.playAgain.on('pointerdown', () => {
            console.log('restart');
            this.scene.start('MainMenu');
        });

        Display.Align.In.BottomCenter(this.playAgain, this.logo, 0, 250);

        this.youWin = this.add.image(0, 0, 'you-win');
        this.youWin.setScale(0.5).setDepth(1);
        Display.Align.In.BottomCenter(this.youWin, this.logo, 50, 200);
    }

    checkOrientation(orientation) {
        this.isLandscape = orientation === Scale.Orientation.LANDSCAPE;

        if (this.currentOrienation !== orientation) {
            this.currentOrienation = this.scale.orientation;
            this.updateGameSize();

            //cleanup and redraw 
            this.logo?.destroy();
            this.background?.destroy();
            this.playAgain?.destroy();
            this.youWin?.destroy();
            this.cameras?.main?.fadeIn(800, 0, 0, 0);
        }

        if (!this.isDeskTop && this.currentOrienation === Scale.Orientation.LANDSCAPE) {
            // console.log('landscape');
           this.createLevel()

        } else if (!this.isDeskTop && this.currentOrienation === Scale.Orientation.PORTRAIT) {
            // console.log('portrait');
            this.createLevel()
        }
        else {
            // desktop
            this.createLevel()
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
}
