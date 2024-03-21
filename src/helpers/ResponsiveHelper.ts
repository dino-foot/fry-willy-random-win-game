import { Scene, Scale } from "phaser";
import { vector2 } from "../types";

let scene: Scene;
let isDeskTop: boolean;
let isLandscape: boolean;
let currentOrienation: Scale.Orientation;
// let gamewidth: number;
// let gameHeight: number;
let resolution: vector2;

interface responsiveHelperInterface {
  init: (sceneObj: Scene, targetRes: vector2) => void;
  updateGameSize: () => void;
  // handleOrientationChange: (currentOrientation: Scale.Orientation, onCleanup?: () => void, onPortrait?: () => void, onLandscape?: () => void) => void;
}

const init = (sceneObj: Scene, targetRes: vector2): void => {
  scene = sceneObj;
  resolution = targetRes;
  isDeskTop = scene.game.device.os.desktop;
  isLandscape = scene.scale.orientation === Scale.Orientation.LANDSCAPE;
  currentOrienation = scene.scale.orientation;
  updateGameSize();
};

const updateGameSize = (): void => {
  if (!isLandscape) {
    scene.scale.setGameSize(720, 1600);
  } else {
    scene.scale.setGameSize(1920, 1080);
  }
  scene.scale.refresh();
};

// const handleOrientationChange = (currentOrientation: Scale.Orientation, onCleanup?: () => void, onPortrait?: () => void, onLandscape?: () => void) => {
//   const isLandscape = scene.scale.orientation === Scale.Orientation.LANDSCAPE;

//   if (currentOrientation !== scene.scale.orientation) {
//     currentOrientation = scene.scale.orientation;
//     console.log('cleanupsfff', this);
//     // Update game size
//     updateGameSize();

//     // Cleanup
//     onCleanup();

//     // Transition
//     scene.cameras.main.fadeIn(800, 0, 0, 0);

//     // Handle orientation-specific logic
//     if (!isDeskTop && currentOrientation === Scale.Orientation.LANDSCAPE) {
//       onLandscape?.();
//     } else if (!isDeskTop && currentOrientation === Scale.Orientation.PORTRAIT) {
//       onPortrait?.();
//     } else {
//       onLandscape?.();
//     }

//   }
// };

export const ResponsiveHelper: responsiveHelperInterface = {
  init,
  updateGameSize,
  // handleOrientationChange,
};
