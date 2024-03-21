import { Scene, GameObjects, Scale } from 'phaser';
import { ResponsiveHelper } from '../helpers/ResponsiveHelper';

export class Preloader extends Scene {
    logo: GameObjects.Image;
    loadingText: GameObjects.Text;
    progressBox: GameObjects.Graphics;
    progressBar: GameObjects.Graphics;

    isDeskTop: boolean;
    isLandscape: boolean;
    currentOrienation: Scale.Orientation;

    constructor() {
        super('Preloader');
    }

    init() {
        this.load.on('complete', () => { this.scene.start('MainMenu') }, this);

        this.isDeskTop = this.sys.game.device.os.desktop;
        this.isLandscape = this.scale.orientation === Scale.Orientation.LANDSCAPE;
        this.currentOrienation = this.scale.orientation;
        this.scale.on('orientationchange', this.checkOrientation, this);
        // update game size for portrait mode
        this.updateGameSize();

        this.addLoadingBar();
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

    addLoadingBar() {
        if(!this.cameras.main) return;

        this.logo = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY - 200, 'logo');
        this.logo.setScale(0.4)
        this.logo.setOrigin(0.5);

        const { width } = this.cameras.main;
        const { height } = this.cameras.main;

        this.progressBar = this.add.graphics();
        this.progressBar.fillStyle(0xEEEEEE, 0.5);
        this.progressBar.fillRect(width / 2 - 200, height / 2 + 50, 400, 15);

        this.progressBox = this.add.graphics();
        this.progressBox.fillStyle(0x4CCD99, 1);
        this.progressBox.fillRect(width / 2 - 200, height / 2 + 50, 400, 15);

        this.loadingText = this.make.text({
            x: this.cameras.main.centerX,
            y: this.cameras.main.centerY + 100,
            text: "Loading...",
            style: {
                fontSize: "24px",
                fontFamily: "Roboto-Black",
                color: "white",
            },
        }).setOrigin(0.5);

        this.load.on('progress',
            (value: any) => {
                // console.log('loading ... ', value);
                this.loadingText.setText(`Loading ... ${Math.round(value * 100)}%`);
                this.progressBox.clear();
                this.progressBox.fillStyle(0x4CCD99, 1);
                this.progressBox.fillRect(width / 2 - 200, height / 2 + 50, 400 * value, 15);
            },
            this,
        );
    }

    preload() {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('assets');

        this.load.image('bg-mobile', 'bg-mobile.png');
        this.load.image('bg-desktop', 'bg-desktop.png');
        this.load.image('chicken-wings', 'chicken-wings.png');
        this.load.image('connect-wallet', 'connect-wallet.png');
        this.load.image('nuggets_1', 'nuggets_1.png');
        this.load.image('nuggets_2', 'nuggets_2.png');
        this.load.image('pattern-desktop', 'pattern-desktop.png');
        this.load.image('pattern-mobile', 'pattern-mobile.png');
        this.load.image('play-again', 'play-again.png');
        this.load.image('sky_desktop', 'sky_desktop.png');
        this.load.image('sky_mobile', 'sky_mobile.png');
        this.load.image('you-win', 'you-win.png');

        this.load.image('chicken_willy', 'chicken_willy.png');
        this.load.image('frier', 'frier.png');
        // this.load.image('hand', 'hand.png');
        // this.load.image('like', 'like.png');
        this.load.image('plate', 'plate.png');
        this.load.image('strangled-chicken', 'strangled-chicken.png');
        this.load.image('willy-strangled-2', 'willy-strangled-2.png');
        this.load.image('willy-strangled-3', 'willy-strangled-3.png');
        this.load.image('willy-strangled-4', 'willy-strangled-4.png');
        this.load.image('willy-strangled', 'willy-strangled.png');
    }

    checkOrientation(orientation: Scale.Orientation) {
        this.isLandscape = orientation === Scale.Orientation.LANDSCAPE;

        if (this.currentOrienation !== orientation) {
            this.currentOrienation = this.scale.orientation;
            this.updateGameSize();

            // redraw 
            this.cleanupLayout();
            this.cameras?.main?.fadeIn(800, 0, 0, 0);

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
        }

        this.scale.refresh();
    }

    cleanupLayout() {
        this.logo?.destroy();
        this.loadingText?.destroy();
        this.progressBox?.destroy();
        this.progressBar?.destroy();
        // console.log('cleanup', this);
    }

    portraitLayout() {
        this.addLoadingBar();
    }

    landscapeLayout() {
        this.addLoadingBar();
    }

    create() { }
}
