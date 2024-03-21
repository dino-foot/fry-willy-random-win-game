import { Scene, GameObjects } from "phaser";
import { vector2 } from "../types";

export const tweenPosition = (context: Scene, target: GameObjects.GameObject, pos: vector2, data?: any, completeCallback?: any) => {
    context.tweens.add({
      targets: target,
      x: pos.x,
      y: pos.y,
      delay: data?.delay != null ? data.delay : 0,
      duration: data?.duration != null ? data.duration : 200,
      angle: data?.angle != null ? data.angle : 0,
      scale: data?.scale != null ? data.scale: 1,
      alpha: data?.alpha != null ? data.alpha: 1,
      ease: Phaser.Math.Easing.Sine.Out,
      onComplete: () => {
        completeCallback?.();
      }
    });
  };