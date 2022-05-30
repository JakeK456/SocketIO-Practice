export default class Player {
  constructor(x, y) {
    this.spriteCache = getSprites();
    this.sprites = this.spriteCache.facingRight;
    this.x = x;
    this.y = y;
    this.facingRight = true;
    this.frameX = 0;
    this.frameY = 0;
    this.gameFrame = 0;
    this.SPRITE_WIDTH = 256;
    this.SPRITE_HEIGHT = 256;
    this.NUM_SPRITE_FRAMES = 8;
    this.STAGGER_FRAMES = 15;
  }

  draw(context) {
    for (const sprite in this.sprites) {
      context.drawImage(
        this.sprites[sprite],
        this.frameX * this.SPRITE_WIDTH,
        this.frameY * this.SPRITE_HEIGHT,
        this.SPRITE_WIDTH,
        this.SPRITE_HEIGHT,
        this.x - this.SPRITE_WIDTH / 2,
        this.y - this.SPRITE_HEIGHT / 2,
        this.SPRITE_WIDTH,
        this.SPRITE_HEIGHT
      );
    }
    if (this.gameFrame % this.STAGGER_FRAMES === 0) {
      this.frameX < this.NUM_SPRITE_FRAMES - 1
        ? this.frameX++
        : (this.frameX = 0);
    }
    this.gameFrame++;
  }

  flipSprites(facingRight) {
    if (facingRight) {
      this.sprites = this.spriteCache.facingRight;
    } else {
      this.sprites = this.spriteCache.facingLeft;
    }
    this.facingRight = facingRight;
  }
}

const getSprites = () => {
  const bodyPlayerImage = new Image();
  bodyPlayerImage.src = "images/256px/8frames/body.webp";

  const bodyLPlayerImage = new Image();
  bodyLPlayerImage.src = "images/256px/8frames/body_l.webp";

  const clothesPlayerImage = new Image();
  clothesPlayerImage.src = "images/256px/8frames/clothes_1.webp";

  const clothesLPlayerImage = new Image();
  clothesLPlayerImage.src = "images/256px/8frames/clothes_1_l.webp";

  const headPlayerImage = new Image();
  headPlayerImage.src = "images/256px/8frames/head.webp";

  const headLPlayerImage = new Image();
  headLPlayerImage.src = "images/256px/8frames/head_l.webp";

  const hairPlayerImage = new Image();
  hairPlayerImage.src = "images/256px/8frames/hair_1.webp";

  const hairLPlayerImage = new Image();
  hairLPlayerImage.src = "images/256px/8frames/hair_1_l.webp";

  const eyesPlayerImage = new Image();
  eyesPlayerImage.src = "images/256px/8frames/eyes_1.webp";

  const eyesLPlayerImage = new Image();
  eyesLPlayerImage.src = "images/256px/8frames/eyes_1_l.webp";

  const mouthPlayerImage = new Image();
  mouthPlayerImage.src = "images/256px/8frames/mouth.webp";

  const mouthLPlayerImage = new Image();
  mouthLPlayerImage.src = "images/256px/8frames/mouth_l.png";

  const weaponPlayerImage = new Image();
  weaponPlayerImage.src = "images/256px/8frames/weapon_1.png";

  const weaponLPlayerImage = new Image();
  weaponLPlayerImage.src = "images/256px/8frames/weapon_1_l.webp";

  return {
    facingRight: {
      body: bodyPlayerImage,
      clothes: clothesPlayerImage,
      head: headPlayerImage,
      hair: hairPlayerImage,
      eyes: eyesPlayerImage,
      mouth: mouthPlayerImage,
      weapon: weaponPlayerImage,
    },
    facingLeft: {
      body: bodyLPlayerImage,
      clothes: clothesLPlayerImage,
      head: headLPlayerImage,
      hair: hairLPlayerImage,
      eyes: eyesLPlayerImage,
      mouth: mouthLPlayerImage,
      weapon: weaponLPlayerImage,
    },
  };
};
