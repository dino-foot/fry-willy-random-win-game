import { Scene, Cameras, Display, GameObjects, Scale, Actions, Math } from 'phaser';
import { PhaserHelpers } from '../helpers';
import { ImageButton } from '../helpers/ImageButton';
import { EventsController } from '../controllers/eventsController';
import { tweenPosition } from '../helpers/TweenHelper';

export class Game extends Scene {
    camera: Cameras.Scene2D.Camera;
    background: GameObjects.Image;
    logo: GameObjects.Image;
    // targetFrier: GameObjects.Image;

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
    WIN_INDEX: number;

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

        this.input.setDefaultCursor('url(/assets/hand.cur), pointer');
        // const sprite = this.add.sprite(400, 300, 'eye').setInteractive({ cursor: 'url(assets/input/cursors/pen.cur), pointer' });
    }

    create() {
        this.camera = this.cameras.main;
        this.addLogo();
        this.createBackground();

        const rectConfig = { x: this.camera.centerX / 2 - 200, y: this.camera.centerY / 2 - (this.gameHeight / 10), width: 1400, height: 800, radius: 20, color: 0xffffff, stroke: 5, strokeColor: 0x000000 };
        PhaserHelpers.addRoundedRectangle(rectConfig, this);

        this.createFriers()

        // create chicken
        this.createChicken();
        this.createLevel();

        this.creditText = this.addText(`Total Credit: ${this.totalCredit}`, 180, 50);
        this.scoreText = this.addText(`Current Score: ${this.currentScore}`, 180, 100);

    }

    private createLevel() {
        let maskRect = this.add.rectangle(this.camera.centerX / 2 + 500, this.camera.centerY / 2 + 130, 1370, 440, 0x000000);
        maskRect.setStrokeStyle(20, 0x000000);
        maskRect.setVisible(true);
        let mask = maskRect.createGeometryMask();

        const bg = this.add.image(this.camera.centerX, this.camera.centerY - 130, 'bg-desktop').setOrigin(0.5).setDepth(1);
        bg.setScale(1.4);
        bg.setMask(mask);

        maskRect = this.add.rectangle(this.camera.centerX / 2 + 500, this.camera.centerY / 2 + 525, 1370, 340, 0x000000);
        maskRect.setStrokeStyle(20, 0x000000);
        maskRect.setVisible(false);
        mask = maskRect.createGeometryMask();

        const pattern = this.add.image(this.camera.centerX, this.camera.centerY - 70, 'pattern-desktop').setOrigin(0.5).setDepth(1);
        pattern.setScale(1.25);
        pattern.setMask(mask);
    }

    private createChicken() {
        this.chicken = this.add.image(450, 450, 'chicken_willy').setDepth(6).setOrigin(0.5);
        this.chicken.setInteractive();
        this.chicken.setScale(0.12);
        this.chicken.setName('chicken');
        this.input.setDraggable(this.chicken);


        this.input.on('dragstart', (pointer, gameObject, dragX, dragY) => {
            gameObject.x = pointer.x;
            gameObject.y = pointer.y;
            // console.log('#dragstart');
        });

        this.input.on('dragend', (pointer, gameObject, dragX, dragY) => {
            // Define a variable to store the index of the overlapped frier
            let overlappedIndex = -1;

            // Loop through the frierList array
            for (var i = 0; i < this.frierList.length; i++) {
                // Check if the gameObject overlaps with the current frier
                if (Phaser.Geom.Rectangle.Contains(this.frierList[i].getBounds(), gameObject.x, gameObject.y)) {
                    overlappedIndex = i;
                    break;
                }
            }

            if (overlappedIndex !== -1) {
                // Move the chicken to the position of the overlapped frier
                this.chicken.x = this.frierList[overlappedIndex].x;
                this.chicken.y = this.frierList[overlappedIndex].y;
                this.handleChickenDrop(overlappedIndex);
            } else {
                // If no overlapped frier was found, reset the position of the gameObject
                gameObject.x = gameObject.input.dragStartX;
                gameObject.y = gameObject.input.dragStartY;
            }
            // console.log('#dragend', gameObject.name);
        });

        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            gameObject.x = pointer.x;
            gameObject.y = pointer.y;
            // console.log('#ondrag');
        });
    }

    handleChickenDrop(dropIndex) {

        console.log('win-index ', this.WIN_INDEX, ':: drop-index ', dropIndex);

        // if loss then return
        if (this.WIN_INDEX !== dropIndex) {
            this.totalCredit -= 1;
            // wrong frier reset it 
            const frier = this.frierList[Phaser.Math.Between(0, 2)];
            this.chicken.setPosition(frier.x, this.chicken.y - 300);

            this.applyRandomWinOnFrier();
            this.updateCreditNScore();

            return;
        }

        this.chicken.setVisible(false);
        const wingsKeys = ['chicken-wings', 'nuggets_1', 'nuggets_2', 'chicken-wings', 'nuggets_1'];

        // drop nugget on the plate
        for (let i = 0; i < 5; i++) {
            const wings = this.add.image(this.chicken.x, -200, wingsKeys[i]).setOrigin(0.5);
            wings.setDepth(10).setScale(0.75);

            const randomPos = PhaserHelpers.getRandomPointAt({ x: this.plate.x, y: this.plate.y }, 50);
            tweenPosition(this, wings, { x: randomPos.x, y: randomPos.y }, { duration: 600, delay: 100 * i });
        }

        const winText = this.addText('5 Willy nuggets', 0, 0, '#fecb37', 70);
        winText.setDepth(10);
        winText.setStroke('#000000', 10);
        Display.Align.In.BottomCenter(winText, this.plate, 0, -200);
        this.applyRandomWinOnFrier();

        this.updateCreditNScore()
        console.log('win: drop nugget chicken');
    }

    private updateCreditNScore(){
        this.creditText.setText(`Total Credit: ${this.totalCredit}`);
        this.scoreText.setText(`Current Score: ${this.currentScore}`);
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

        let offsetX = 400;
        for (let i = 0; i < 3; i++) {
            const text = this.addText((i + 1).toString(), offsetX * i + 600, 680, '#fecb37', 60).setDepth(6);
            text.setStroke('#000000', 15);
            const frier = this.add.image(offsetX * i + 550, 750, 'frier').setOrigin(0.5).setDepth(4).setScale(0.35);
            frier.setInteractive();
            frier.setName(`frier_${i}`);
            this.frierList.push(frier);
        }

        this.plate = this.add.image(0, 0, 'plate').setDepth(4).setScale(0.3);
        Display.Align.In.BottomCenter(this.plate, this.frierList[1], 0, 120);

        // Actions.AlignTo(this.frierList, Display.Align.RIGHT_CENTER);
    }

    applyRandomWinOnFrier() {
        this.WIN_INDEX = Phaser.Math.Between(0, 2);
        console.log('win index ', this.WIN_INDEX);
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
