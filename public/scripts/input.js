const chatInput = document.getElementById("chat-input");

export default class InputHandler {
  constructor() {
    this.keys = [];

    window.addEventListener("keydown", (e) => {
      if (document.activeElement !== chatInput) {
        e.preventDefault();
        if (this.keys.indexOf(e.key) === -1) {
          this.keys.push(e.key);
        }
      }
    });

    window.addEventListener("keyup", (e) => {
      if (document.activeElement !== chatInput) {
        e.preventDefault();
        this.keys.splice(this.keys.indexOf(e.key), 1);
      }
    });
  }

  // this method should probably be separated from this class. Maybe incorporate into state machine.
  generateEmits = (keys) => {
    const emits = keys.map((key) => keyToEmit(key));
    return emits;
  };

  getInputs = () => {
    return this.keys;
  };
}

const keyToEmit = (key) => {
  switch (key) {
    case "ArrowLeft":
      return ["move", -1, 0];
    case "ArrowRight":
      return ["move", 1, 0];
    case "ArrowUp":
      return ["move", 0, -1];
    case "ArrowDown":
      return ["move", 0, 1];
  }
};
