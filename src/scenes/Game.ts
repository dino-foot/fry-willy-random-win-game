import { Scene, Cameras, Display, GameObjects, Scale, Actions, Math } from 'phaser';
import { PhaserHelpers } from '../helpers';
import { tweenPosition } from '../helpers/TweenHelper';

export class Game extends Scene {
    camera: Cameras.Scene2D.Camera;
    background: GameObjects.Image;
    logo: GameObjects.Image;
    pattern: GameObjects.Image;
    rect: GameObjects.Graphics;

    gameWidth: number;
    gameHeight: number;
    isDeskTop: boolean;
    isLandscape: boolean;
    currentOrienation: Scale.Orientation;

    totalCredit: number;
    currentScore: number;
    creditText: GameObjects.Text;
    scoreText: GameObjects.Text; // nugget count
    winText: GameObjects.Text;

    plate: GameObjects.Image;
    frierList: GameObjects.Image[];
    objectList: any; // loop through 
    hand: GameObjects.Image;
    chicken: GameObjects.Image;
    WIN_INDEX: number;

    constructor() {
        super('Game');
    }

    init() {
        this.gameWidth = Number(this.game.config.width);
        this.gameHeight = Number(this.game.config.height);

        this.isDeskTop = this.sys.game.device.os.desktop;
        this.isLandscape = this.scale.orientation === Scale.Orientation.LANDSCAPE;
        this.currentOrienation = this.scale.orientation;
        this.scale.on('orientationchange', this.checkOrientation, this);

        this.input.setDefaultCursor('url(/assets/hand.cur), pointer');

        // this.scene.start('GameOver');
        // const sprite = this.add.sprite(400, 300, 'eye').setInteractive({ cursor: 'url(assets/input/cursors/pen.cur), pointer' });
    }

    create() {
        this.totalCredit = 5;
        this.currentScore = 0;
        this.frierList = []
        this.camera = this.cameras.main;

        this.addLogo();
        this.createBackground();
        if (this.isLandscape) this.landscapeRect();
        else this.portraitRect();

        this.createFriers()

        // create chicken
        this.createChicken();
        this.createLevel();

        this.creditText = this.addText(`Total Credit: ${this.totalCredit}`, 180, 50);
        this.scoreText = this.addText(`Current Score: ${this.currentScore}`, 180, 100);

    }

    private landscapeRect() {
        const rectConfig = { x: this.camera.centerX / 2 - 200, y: this.camera.centerY / 2 - (this.gameHeight / 10), width: 1400, height: 800, radius: 20, color: 0xffffff, stroke: 5, strokeColor: 0x000000 };
        this.rect = PhaserHelpers.addRoundedRectangle(rectConfig, this);

    }

    private portraitRect() {
        const rectConfig = { x: this.camera.centerX / 2 - 170, y: this.camera.centerY / 2 - (this.gameHeight / 10), width: 700, height: 1100, radius: 20, color: 0xffffff, stroke: 5, strokeColor: 0x000000 };
        this.rect = PhaserHelpers.addRoundedRectangle(rectConfig, this);
    }

    private createLevel() {
        let width = this.isLandscape ? 1370 : 660;
        let height = this.isLandscape ? 440 : 730;
        let offsetX = this.isLandscape ? 500 : 180;
        let offsetY = this.isLandscape ? 130 : 280;

        let maskRect = this.add.rectangle(this.camera.centerX / 2 + offsetX, this.camera.centerY / 2 + offsetY, width, height, 0x000000);
        maskRect.setStrokeStyle(20, 0x000000);
        maskRect.setVisible(false);
        let mask = maskRect.createGeometryMask();

        offsetY = this.isLandscape ? 130 : 250;
        let key = this.isLandscape ? 'bg-desktop' : 'bg-mobile';
        const bg = this.add.image(this.camera.centerX, this.camera.centerY - offsetY, key).setOrigin(0.5).setDepth(1);
        bg.setScale(this.isLandscape ? 1.25 : 1);
        bg.setMask(mask);

        offsetY = this.isLandscape ? 525 : 780;
        height = this.isLandscape ? 340 : 380;
        maskRect = this.add.rectangle(this.camera.centerX / 2 + offsetX, this.camera.centerY / 2 + offsetY, width, height, 0x000000);
        maskRect.setStrokeStyle(20, 0x000000);
        maskRect.setVisible(false);
        mask = maskRect.createGeometryMask();

        key = this.isLandscape ? 'pattern-desktop' : 'pattern-mobile';
        offsetY = this.isLandscape ? 70 : -140;
        this.pattern = this.add.image(this.camera.centerX, this.camera.centerY - offsetY, key).setOrigin(0.5).setDepth(1);
        this.pattern.setScale(this.isLandscape ? 1.25 : 1);
        this.pattern.setMask(mask);
        // this.pattern.setDepth(1);
    }

    private createChicken() {
        let posX = this.isLandscape ? 450 : 100;
        let posY = this.isLandscape ? 450 : 800;

        this.chicken = this.add.image(posX, posY, 'chicken_willy').setDepth(6).setOrigin(0.5);
        // Display.Align.In.TopCenter(this.chicken, this.frierList[0], 0, -800);
        this.chicken.setInteractive();
        this.chicken.setScale(0.12);
        this.chicken.setName('chicken');
        this.input.setDraggable(this.chicken);


        this.input.on('dragstart', (pointer, gameObject, dragX, dragY) => {
            this.chicken.setTexture('willy-strangled-2');
            this.chicken.setScale(0.15);
            gameObject.x = pointer.x;
            gameObject.y = pointer.y;
            this.input.setDefaultCursor('url(/assets/like.cur), pointer');
            // console.log('#dragstart');
        });

        this.input.on('dragend', (pointer, gameObject, dragX, dragY) => {
            this.input.setDefaultCursor('url(/assets/hand.cur), pointer');
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
                this.chicken.setScale(0.12);
                this.chicken.setTexture('chicken_willy');
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

        this.totalCredit -= 1;

        this.chicken.setVisible(false);
        const wingsKeys = ['chicken-wings', 'nuggets_1', 'nuggets_2', 'chicken-wings', 'nuggets_1'];

        // drop nugget on the plate
        const randomNuggets = Phaser.Math.Between(0, 5);
        console.log('random nugget ', randomNuggets)
        this.currentScore += randomNuggets;

        for (let i = 0; i < randomNuggets; i++) {
            const wings = this.add.image(this.chicken.x, -200, wingsKeys[i]).setOrigin(0.5);
            wings.setDepth(10).setScale(0.75);

            const randomPos = PhaserHelpers.getRandomPointAt({ x: this.plate.x, y: this.plate.y }, 50);
            tweenPosition(this, wings, { x: randomPos.x, y: randomPos.y }, { duration: 600, delay: 100 * i });
        }

        // empty plate animation
        if(randomNuggets === 0) {
            const emptyPlate = this.add.image(this.chicken.x,  -400, 'plate').setDepth(4);
            emptyPlate.setOrigin(0.5);
            emptyPlate.setScale(0.3);
            tweenPosition(this, emptyPlate, { x: this.plate.x, y: this.plate.y }, { duration: 600, delay: 100, scale: 0.3 });
        }

        this.winText?.setText(`${this.currentScore} Willy nuggets`);
        this.updateCreditNScore()

        if (this.totalCredit <= 0) {
            // all credit finished
            this.scene.start('GameOver');
            return;
        }

        setTimeout(() => {
            const frier = this.frierList[Phaser.Math.Between(0, 2)];
            this.chicken?.setPosition(frier.x, this.chicken.y - 300);
            this.chicken?.setVisible(true);
        }, 1200)

        console.log('drop nuggets');
    }

    private updateCreditNScore() {
        this.creditText.setText(`Total Credit: ${this.totalCredit}`);
        this.scoreText.setText(`Current Score: ${this.currentScore}`);
    }

    private addLogo() {
        this.logo = this.add.image(0, 0, 'logo');
        this.logo.setScale(0.3).setDepth(2);
        let offsetY = this.isLandscape ? 300 : 450;
        Display.Align.In.TopCenter(this.logo, this.add.zone(this.camera.centerX, this.camera.centerY, this.gameWidth, this.gameHeight), 0, offsetY);
    }

    private createBackground() {
        const key = this.isLandscape ? 'sky_desktop' : 'sky_mobile';
        this.background = this.add.image(this.camera.centerX, this.camera.centerY, key);
        this.background.setOrigin(0.5);
    }

    private createFriers() {

        let offsetX = this.isLandscape ? 400 : -200;
        let offsetY = this.isLandscape ? 750 : 1100;
        for (let i = 0; i < 3; i++) {
            const frier = this.add.image(offsetX * i + 550, offsetY, 'frier').setOrigin(0.5).setDepth(4).setScale(0.35);
            frier.setInteractive();
            // frier.setDepth(101);
            frier.setName(`frier_${i}`);
            this.frierList.push(frier);
            let textOffsetX = this.isLandscape ? 400 : 200;
            const text = this.addText((i + 1).toString(), textOffsetX * i + (this.isLandscape ? 600 : 180), this.isLandscape ? 680 : 1000, '#fecb37', 60)
            text.setStroke('#000000', 15);
        }

        this.plate = this.add.image(0, 0, 'plate').setDepth(4).setScale(0.3);
        Display.Align.In.BottomCenter(this.plate, this.frierList[1], 0, this.isLandscape ? 120 : 100);

        this.winText = this.addText('', 0, 0, '#fecb37', 70);
        this.winText.setDepth(100);
        this.winText.setStroke('#000000', 10);
        Display.Align.In.BottomCenter(this.winText, this.plate, 0, -200);
        // Actions.AlignTo(this.frierList, Display.Align.RIGHT_CENTER);
    }

    checkOrientation(orientation) {
        this.isLandscape = orientation === Scale.Orientation.LANDSCAPE;

        if (this.currentOrienation !== orientation) {
            this.currentOrienation = this.scale.orientation;
            this.updateGameSize();

            //cleanup and redraw 
            this.children.getAll().forEach(item => {
                item.destroy()
            });
            this.frierList = [];
            this.cameras?.main?.fadeIn(800, 0, 0, 0);
        }

        if (!this.isDeskTop && this.currentOrienation === Scale.Orientation.LANDSCAPE) {
            // console.log('landscape');
            this.addLogo();
            this.createBackground();
            this.landscapeRect();
            this.createFriers()
            this.createChicken();
            this.createLevel();

        } else if (!this.isDeskTop && this.currentOrienation === Scale.Orientation.PORTRAIT) {
            // console.log('portrait');
            this.addLogo();
            this.createBackground();
            this.portraitRect();
            this.createFriers()
            this.createChicken();
            this.createLevel();
        }
        else {
            // desktop
            this.addLogo();
            this.createBackground();
            this.landscapeRect();
            this.createFriers()
            this.createChicken();
            this.createLevel();
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
