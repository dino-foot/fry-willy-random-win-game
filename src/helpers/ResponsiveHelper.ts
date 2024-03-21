import { Scene, Scale } from "phaser";

export class ResponsiveHelper {
  scene: Scene;
  isDeskTop: boolean;
  isLandscape: boolean;
  currentOrienation: Scale.Orientation;
  gamewidth: number;
  gameHeight: number;

  constructor(sceneObj: Scene) {
    this.scene = sceneObj;

    this.isDeskTop = this.scene.game.device.os.desktop;
    this.isLandscape = this.scene.scale.orientation === Scale.Orientation.LANDSCAPE;
    this.currentOrienation = this.scene.scale.orientation;

    // this.scale.on('resize', this.onResize, this);
  }

  // private updateGameSize() {
  //   if (!this.isLandscape) {
  //     this.scale.setGameSize(720, 1600);
  //   }
  //   else {
  //     this.scale.setGameSize(1920, 1080);
  //   }
  //   this.scale.refresh();
  // }

  private checkOrientation(orientation: Scale.Orientation) {
    this.isLandscape = orientation === Scale.Orientation.LANDSCAPE;

    if (this.currentOrienation !== orientation) {
      this.currentOrienation = this.scene.scale.orientation;
    }

    if (!this.isDeskTop && this.currentOrienation === Scale.Orientation.LANDSCAPE) {
      // handleLandscape
    }
    else if(!this.isDeskTop && this.currentOrienation === Scale.Orientation.PORTRAIT){
      // handle portrait
    }
    else {
      // handle desktop
    }
  }

  private cleanupLayout() { }

  private redrawLayout() { }
}
