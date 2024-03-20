import { Scene, Cameras, Display, GameObjects, Scale, Actions } from 'phaser';
import { PhaserHelpers } from '../helpers';
import { ImageButton } from '../helpers/ImageButton';
import { EventsController } from '../controllers/eventsController';

export class Game extends Scene {
    camera: Cameras.Scene2D.Camera;
    background: GameObjects.Image;
    logo: GameObjects.Image;

    isDeskTop: boolean;
    isLandscape: boolean;
    currentOrienation: Scale.Orientation;
    gameWidth: number;
    gameHeight: number;

    totalCredit: number;
    currentScore: number;
    creditText: GameObjects.Text;
    scoreText: GameObjects.Text;

    plate: GameObjects.Image;
    frierList: GameObjects.Image[];
    hand: GameObjects.Image;
    chicken: GameObjects.Image;

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
        this.frierList = []
        this.cameras.main.setBackgroundColor(0x00defc);

        // this.input.setDefaultCursor('url(assets/input/cursors/blue.cur), pointer');
        // const sprite = this.add.sprite(400, 300, 'eye').setInteractive({ cursor: 'url(assets/input/cursors/pen.cur), pointer' });

    }

    create() {
        this.camera = this.cameras.main;
        this.addLogo();
        this.createBackground();

        const rectConfig = { x: this.camera.centerX / 2 - 200, y: this.camera.centerY / 2 - (this.gameHeight / 10), width: 1400, height: 800, radius: 20, color: 0xffffff, stroke: 5, strokeColor: 0x000000 };
        PhaserHelpers.addRoundedRectangle(rectConfig, this);

        // this.createFriers()

        // create chicken
        // this.createChicken();
        
        // this.plate = this.add.image(0, 0, 'plate').setDepth(4).setScale(0.5);
        // Display.Align.In.BottomCenter(this.plate, this.frierList[1], 0, 300);

        let maskRect = this.add.rectangle(this.camera.centerX / 2 + 500, this.camera.centerY / 2 + 130, 1370, 440, 0x000000);
        maskRect.setStrokeStyle(20, 0x000000);
        maskRect.setVisible(true);
        let mask = maskRect.createGeometryMask();

        const bg = this.add.image(this.camera.centerX, this.camera.centerY - 130, 'bg-desktop').setOrigin(0.5).setDepth(1);
        bg.setScale(1.4)
        bg.setMask(mask);

        maskRect = this.add.rectangle(this.camera.centerX / 2 + 500, this.camera.centerY / 2 + 525, 1370, 340, 0x000000);
        maskRect.setStrokeStyle(20, 0x000000);
        maskRect.setVisible(false);
        mask = maskRect.createGeometryMask();

        const pattern = this.add.image(this.camera.centerX, this.camera.centerY - 70, 'pattern-desktop').setOrigin(0.5).setDepth(1);
        pattern.setScale(1.25);
        pattern.setMask(mask);

        this.creditText = this.addText(`Total Credit: ${this.totalCredit}`, 180, 50);
        this.scoreText = this.addText(`Current Score: ${this.currentScore}`, 180, 100);

    }

    private createChicken() {
        this.chicken = this.add.image(200, 700, 'chicken_willy').setDepth(6).setOrigin(0.5).setInteractive();
        this.chicken.setScale(0.125);
        this.input.setDraggable(this.chicken);


        this.input.on('dragstart', (pointer, gameObject, dragX, dragY) =>
        {
            gameObject.x = pointer.x;
            gameObject.y = pointer.y;
            console.log('#dragstart');
        });

        this.input.on('dragend', (pointer, gameObject, dragX, dragY) =>
        {
            gameObject.x = gameObject.input.dragStartX;
            gameObject.y = gameObject.input.dragStartY;
            console.log('#dragend');
        });

        this.input.on('drag', (pointer, gameObject, dragX, dragY) =>
        {
            gameObject.x = pointer.x;
            gameObject.y = pointer.y;
            console.log('#drag');
        });
    }

    private addLogo() {
        this.logo = this.add.image(0, 0, 'logo');
        this.logo.setScale(0.3).setDepth(2);
        Display.Align.In.TopCenter(this.logo, this.add.zone(this.camera.centerX, this.camera.centerY, this.gameWidth, this.gameHeight), 0, 0);
        this.logo.y = 160
    }

    private createBackground() {
        this.background = this.add.image(this.camera.centerX, this.camera.centerY, 'sky_desktop');
        this.background.setOrigin(0.5);
    }

    private createFriers() {

        let offsetX = 320;
        for (let i = 0; i < 3; i++) {
            const text = this.addText((i + 1).toString(), offsetX * i + 200, 960).setDepth(5);
            const frier = this.add.image(offsetX * i + 200, 1100, 'frier').setOrigin(0.5).setDepth(4).setScale(0.5);
            frier.setInteractive();
            this.frierList.push(frier);
        }
        // Actions.AlignTo(this.frierList, Display.Align.RIGHT_CENTER);
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
            fontFamily: 'NerkoOne-Regular',
            fontSize: size,
            color: color,
            align: 'left'
        }).setOrigin(0.5).setDepth(2).setInteractive();
    }
}
