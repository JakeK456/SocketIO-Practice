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
    case "1":
      return ["changeAnim", "idle", 0];
    case "2":
      return ["changeAnim", "walk", 1];
    case "3":
      return ["changeAnim", "run", 2];
    case "4":
      return ["changeAnim", "slash", 3];
    case "5":
      return ["changeAnim", "jab", 4];
    case "6":
      return ["changeAnim", "bowshot", 5];
    case "7":
      return ["changeAnim", "fallback", 6];
    case "8":
      return ["changeAnim", "fallforward", 7];
    default:
      return [];
  }
};
