import detect from "@jam3/detect";
import settings from "../settings";

/**
 * @class Folder
 */
class Folder {
  add() {
    return this;
  }
  listen() {
    return this;
  }
  name() {
    return this;
  }
  open() {
    return this;
  }
  close() {
    return this;
  }
  onChange() {
    return this;
  }
  addFolder() {
    return this;
  }
  addColor() {
    return this;
  }
  removeFolder() {
    return this;
  }
  remove() {
    return this;
  }
  step() {
    return this;
  }
}

/**
 * @class GUIWrapper
 */
class GUIWrapper {
  static toggleHide() {
    return this;
  }
  add() {
    return this;
  }
  addFolder() {
    return new Folder();
  }
  removeFolder() {
    return this;
  }
  addColor() {
    return this;
  }
  listen() {
    return this;
  }
  name() {
    return this;
  }
  close() {
    return this;
  }
  step() {
    return this;
  }
  onChange() {
    return this;
  }
  setValue() {
    return this;
  }
  remove() {
    return this;
  }
  open() {
    return this;
  }
}

let Cls = GUIWrapper;

if (process.env.NODE_ENV !== "production" && settings.datGui) {
  Cls = require("dat.gui").GUI;

  Cls.prototype.removeFolder = function(name) {
    var folder = this.__folders[name];
    if (!folder) {
      return;
    }
    folder.close();
    this.__ul.removeChild(folder.domElement.parentNode);
    delete this.__folders[name];
    this.onResize();
  };
}

export const gui = new Cls();
export { GUIWrapper };

if (!detect.device.isDesktop) {
  Cls.toggleHide();
}
