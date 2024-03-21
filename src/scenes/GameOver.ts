import { Scene, Display, GameObjects } from 'phaser';

export class GameOver extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    logo: Phaser.GameObjects.Image;
    playAgain: GameObjects.Image;
    youWin: GameObjects.Image;

    constructor() {
        super('GameOver');
    }

    create() {
        const gameWidth = Number(this.game.config.width);
        const gameHeight = Number(this.game.config.height);

        this.camera = this.cameras.main
        this.background = this.add.image(this.camera.centerX, this.camera.centerY, 'sky_desktop');
        this.background.setOrigin(0.5);

        this.logo = this.add.image(0, 0, 'logo');
        this.logo.setScale(0.5).setDepth(2);
        Display.Align.In.TopCenter(this.logo, this.add.zone(this.camera.centerX, this.camera.centerY, gameWidth, gameHeight), 0, 200);

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
}
