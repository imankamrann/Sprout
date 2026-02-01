import Phaser from "phaser";

const WORLD_WIDTH = 600;
const WORLD_HEIGHT = 680;

const DIRS = ["down", "left", "right", "up"] as const;
type Direction = (typeof DIRS)[number];

type SheetInfo = {
  key: string;
  isSheet: boolean;
  frameWidth: number;
  frameHeight: number;
  rowStart: Record<Direction, number>;
};

export class StoreScene extends Phaser.Scene {
  private playerBody!: Phaser.Physics.Arcade.Sprite;
  private playerSprite!: Phaser.GameObjects.Sprite;
  private playerShadow!: Phaser.GameObjects.Image;
  private npcSprite!: Phaser.GameObjects.Sprite;
  private npcShadow!: Phaser.GameObjects.Image;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keys!: { [key: string]: Phaser.Input.Keyboard.Key };
  private spaceKey!: Phaser.Input.Keyboard.Key;
  private pressBubble!: Phaser.GameObjects.Container;
  private obstacles!: Phaser.Physics.Arcade.StaticGroup;
  private queueSpot!: Phaser.GameObjects.Image;
  private queuePoint = new Phaser.Math.Vector2(195, 520);
  private questMarker!: Phaser.GameObjects.Image;
  private onNpcInteract: () => void;
  private playerSheet?: SheetInfo;
  private npcSheet?: SheetInfo;
  private currentDir: Direction = "down";
  private mapWidth = WORLD_WIDTH;
  private mapHeight = WORLD_HEIGHT;

  constructor(onNpcInteract: () => void) {
    super("StoreScene");
    this.onNpcInteract = onNpcInteract;
  }

  preload() {
    this.load.image("floor", "assets/tiles/floor.png");
    this.load.image("grass", "assets/tiles/grass.png");
    this.load.image("hedge", "assets/tiles/hedge.png");
    this.load.image("counter", "assets/props/counter.png");
    this.load.image("shelf", "assets/props/shelf.png");
    this.load.image("freezer", "assets/props/freezer.png");
    this.load.image("door", "assets/props/door.png");
    this.load.image("register", "assets/props/register.png");
    this.load.image("poster", "assets/props/poster.png");
    this.load.image("mat", "assets/props/mat.png");
    this.load.image("queue", "assets/props/queue.png");
    this.load.image("plant", "assets/props/plant.png");
    this.load.image("sign", "assets/props/sign.png");
    this.load.image("wall", "assets/props/wall.png");
    this.load.image("baseboard", "assets/props/baseboard.png");
    this.load.image("player", "assets/chars/player.png");
    this.load.image("player_down", "assets/bearFront.png");
    this.load.image("player_up", "assets/bearBack.png");
    this.load.image("player_left", "assets/bearLeft.png");
    this.load.image("player_right", "assets/bearRight.png");
    this.load.image("npc", "assets/chars/npc.png");
  }

  create() {
    this.ensureTextures();

    this.mapWidth = this.scale.width || WORLD_WIDTH;
    this.mapHeight = this.scale.height || WORLD_HEIGHT;

    this.add.tileSprite(0, 0, this.mapWidth, this.mapHeight, "grass").setOrigin(0, 0).setDepth(0);
    this.add
      .tileSprite(18, 70, this.mapWidth - 36, this.mapHeight - 120, "floor")
      .setOrigin(0, 0)
      .setDepth(1);

    this.add.tileSprite(this.mapWidth / 2, 58, this.mapWidth - 24, 18, "wall").setDepth(2);
    this.add.tileSprite(this.mapWidth / 2, this.mapHeight - 58, this.mapWidth - 24, 18, "wall").setDepth(2);
    this.add.tileSprite(18, this.mapHeight / 2, 18, this.mapHeight - 110, "wall").setDepth(2);
    this.add.tileSprite(this.mapWidth - 18, this.mapHeight / 2, 18, this.mapHeight - 110, "wall").setDepth(2);
    this.add.tileSprite(this.mapWidth / 2, 82, this.mapWidth - 36, 8, "baseboard").setDepth(2);
    this.add.tileSprite(this.mapWidth / 2, this.mapHeight - 78, this.mapWidth - 36, 8, "baseboard").setDepth(2);
    
    this.obstacles = this.physics.add.staticGroup();

    const centerX = this.mapWidth / 2;
    const rightX = this.mapWidth - 60;
    const leftX = 60;
    const bottomY = this.mapHeight - 50;

    const props = [
      { type: "counter", x: centerX, y: 130, w: 260, h: 60 },
      { type: "register", x: centerX + 35, y: 110, w: 36, h: 28 },
      { type: "shelf", x: leftX, y: 210, w: 70, h: 80 },
      { type: "shelf", x: leftX, y: 320, w: 70, h: 80 },
      { type: "shelf", x: rightX, y: 210, w: 70, h: 80 },
      { type: "shelf", x: rightX, y: 320, w: 70, h: 80 },
      { type: "shelf", x: rightX, y: 430, w: 70, h: 80 },
      { type: "freezer", x: this.mapWidth - 90, y: 90, w: 80, h: 90 },
      { type: "poster", x: 80, y: 90, w: 60, h: 60 },
      { type: "sign", x: this.mapWidth - 80, y: 90, w: 50, h: 50 },
      { type: "door", x: centerX, y: bottomY - 20, w: 90, h: 70 },
      { type: "mat", x: centerX, y: bottomY, w: 90, h: 24 },
      { type: "plant", x: 110, y: 420, w: 36, h: 48 },
    ];

    props.forEach((prop) => {
      const image = this.add.image(prop.x, prop.y, prop.type).setDepth(prop.y + prop.h / 2);
      if (prop.type !== "register" && prop.type !== "poster" && prop.type !== "sign" && prop.type !== "mat") {
        this.obstacles.create(prop.x, prop.y, prop.type).setSize(prop.w, prop.h).setOffset(-prop.w / 2, -prop.h / 2);
      }
      if (prop.type === "counter") {
        this.queuePoint = new Phaser.Math.Vector2(prop.x, prop.y + 70);
      }
      image.setDisplaySize(prop.w, prop.h);
    });

    this.queueSpot = this.add.image(this.queuePoint.x, this.queuePoint.y, "queue").setDepth(this.queuePoint.y - 2);
    this.queueSpot.setDisplaySize(50, 16);

    this.npcSheet = this.resolveSheet("npc");
    this.npcShadow = this.add.image(centerX + 25, 110, "shadow");
    this.npcSprite = this.add.sprite(centerX + 25, 95, this.npcSheet.key);
    this.setStaticNpcFrame();

    this.questMarker = this.add.image(this.npcSprite.x, this.npcSprite.y - 40, "quest_marker");
    this.questMarker.setDepth(1000);

    this.playerSheet = this.resolveSheet("player");
    this.playerBody = this.physics.add.sprite(centerX, 360, "player_down");
    this.playerBody.setVisible(false);
    this.playerBody.setCollideWorldBounds(true);
    this.playerBody.setSize(18, 18);

    this.playerShadow = this.add.image(centerX, 376, "shadow");
    
    // Always use the bear character
    this.playerSprite = this.add.sprite(centerX, 360, "player_down");
    this.playerSprite.setScale(0.15); // Scale to match original character size

    if (this.playerSheet.isSheet) {
      this.createAnimations(this.playerSheet);
    }

    if (this.npcSheet.isSheet) {
      this.npcSprite.setFrame(this.npcSheet.rowStart.down + 1);
    }

    this.cursors = this.input.keyboard!.createCursorKeys();
    this.keys = this.input.keyboard!.addKeys("W,A,S,D") as {
      [key: string]: Phaser.Input.Keyboard.Key;
    };
    this.spaceKey = this.input.keyboard!.addKey("SPACE");

    this.pressBubble = this.createPressBubble();
    this.pressBubble.setVisible(false);

    this.cameras.main.setBounds(0, 0, this.mapWidth, this.mapHeight);
    this.physics.world.setBounds(0, 0, this.mapWidth, this.mapHeight);

    this.physics.add.collider(this.playerBody, this.obstacles);
  }

  update(time: number) {
    const speed = 110;
    const body = this.playerBody.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(0, 0);

    const up = this.cursors.up?.isDown || this.keys.W.isDown;
    const down = this.cursors.down?.isDown || this.keys.S.isDown;
    const left = this.cursors.left?.isDown || this.keys.A.isDown;
    const right = this.cursors.right?.isDown || this.keys.D.isDown;

    if (up) body.setVelocityY(-speed);
    if (down) body.setVelocityY(speed);
    if (left) body.setVelocityX(-speed);
    if (right) body.setVelocityX(speed);

    body.velocity.normalize().scale(speed);

    const moving = body.velocity.length() > 0.1;
    if (moving) {
      if (Math.abs(body.velocity.x) > Math.abs(body.velocity.y)) {
        this.currentDir = body.velocity.x > 0 ? "right" : "left";
      } else {
        this.currentDir = body.velocity.y > 0 ? "down" : "up";
      }
    }

    const bob = moving ? Math.sin(time / 120) * 2 : 0;

    this.playerSprite.setPosition(this.playerBody.x, this.playerBody.y + bob);
    this.playerShadow.setPosition(this.playerBody.x, this.playerBody.y + 14);
    this.playerShadow.setDepth(this.playerBody.y - 1);
    this.playerSprite.setDepth(this.playerBody.y);

    if (this.playerSheet?.isSheet) {
      if (moving) {
        const animKey = `player_${this.currentDir}`;
        if (this.playerSprite.anims.currentAnim?.key !== animKey) {
          this.playerSprite.play(animKey);
        }
      } else {
        this.playerSprite.stop();
        this.playerSprite.setFrame(this.playerSheet.rowStart[this.currentDir] + 1);
      }
    }
    
    // Always update bear direction texture
    const textureKey = `player_${this.currentDir}`;
    if (this.playerSprite.texture.key !== textureKey) {
      this.playerSprite.setTexture(textureKey);
    }

    this.npcShadow.setDepth(this.npcSprite.y - 1);
    this.npcSprite.setDepth(this.npcSprite.y);

    const dx = this.playerBody.x - this.queuePoint.x;
    const dy = this.playerBody.y - this.queuePoint.y;
    const nearNpc = Math.sqrt(dx * dx + dy * dy) < 40;

    this.pressBubble.setVisible(nearNpc);
    this.pressBubble.setPosition(this.queuePoint.x, this.queuePoint.y - 26);
    this.questMarker.setPosition(this.npcSprite.x, this.npcSprite.y - 42 + Math.sin(time / 250) * 4);
    
    if (nearNpc && Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      this.onNpcInteract();
    }
  }

  private createPressBubble() {
    const container = this.add.container(0, 0).setDepth(1000);
    const bg = this.add.graphics();
    bg.fillStyle(0xffffff, 1);
    bg.lineStyle(2, 0x000000, 0.15);
    bg.fillRoundedRect(-60, -18, 120, 36, 10);
    bg.strokeRoundedRect(-60, -18, 120, 36, 10);

    const text = this.add.text(-52, -12, "Press Space", {
      fontFamily: "Trebuchet MS",
      fontSize: "18px",
      color: "#2D2D2D",
      fontStyle: "bold",
    });

    container.add([bg, text]);
    return container;
  }

  private resolveSheet(key: "player" | "npc"): SheetInfo {
    const texture = this.textures.get(key);
    const image = texture.getSourceImage() as HTMLImageElement | undefined;
    if (!image) {
      return { key, isSheet: false, frameWidth: 32, frameHeight: 32, rowStart: this.sheetRows() };
    }

    const width = image.width;
    const height = image.height;
    if (width % 3 === 0 && height % 4 === 0) {
      const frameWidth = width / 3;
      const frameHeight = height / 4;
      const sheetKey = `${key}_sheet`;
      if (!this.textures.exists(sheetKey)) {
        this.textures.addSpriteSheet(sheetKey, image, { frameWidth, frameHeight });
      }
      return { key: sheetKey, isSheet: true, frameWidth, frameHeight, rowStart: this.sheetRows() };
    }

    return { key, isSheet: false, frameWidth: width, frameHeight: height, rowStart: this.sheetRows() };
  }

  private sheetRows() {
    return { down: 0, left: 3, right: 6, up: 9 };
  }

  private createAnimations(sheet: SheetInfo) {
    if (!sheet.isSheet) return;
    DIRS.forEach((dir) => {
      const start = sheet.rowStart[dir];
      this.anims.create({
        key: `player_${dir}`,
        frames: this.anims.generateFrameNumbers(sheet.key, { start, end: start + 2 }),
        frameRate: 8,
        repeat: -1,
      });
    });
  }

  private setStaticNpcFrame() {
    if (!this.npcSheet?.isSheet) return;
    this.npcSprite.setFrame(this.npcSheet.rowStart.down + 1);
  }

  private ensureTextures() {
    if (!this.textures.exists("floor")) {
      const g = this.add.graphics();
      g.fillStyle(0xeaf6ff, 1);
      g.fillRect(0, 0, 64, 64);
      g.fillStyle(0xffffff, 1);
      g.fillRect(0, 0, 32, 32);
      g.fillRect(32, 32, 32, 32);
      g.generateTexture("floor", 64, 64);
      g.destroy();
    }
    if (!this.textures.exists("grass")) {
      const g = this.add.graphics();
      g.fillStyle(0xc8f5a2, 1);
      g.fillRect(0, 0, 64, 64);
      g.fillStyle(0xb7ec8d, 1);
      g.fillRect(0, 0, 32, 32);
      g.fillRect(32, 32, 32, 32);
      g.generateTexture("grass", 64, 64);
      g.destroy();
    }

    const createRectTexture = (key: string, w: number, h: number, fill: number, stroke: number) => {
      if (this.textures.exists(key)) return;
      const g = this.add.graphics();
      g.fillStyle(fill, 1);
      g.fillRoundedRect(0, 0, w, h, 10);
      g.lineStyle(3, stroke, 1);
      g.strokeRoundedRect(0, 0, w, h, 10);
      g.fillStyle(0x000000, 0.12);
      g.fillRoundedRect(4, h - 10, w - 8, 6, 6);
      g.generateTexture(key, w, h);
      g.destroy();
    };

    this.createCounterTexture();
    this.createShelfTexture();
    this.createFreezerTexture();
    this.createDoorTexture();
    this.createRegisterTexture();
    this.createPosterTexture();
    this.createMatTexture();
    this.createQueueTexture();
    createRectTexture("bench", 90, 34, 0xffd180, 0x9c6b32);
    createRectTexture("fence", 220, 24, 0xffe0b2, 0x8d6e63);
    this.createFountainTexture();
    this.createPlantTexture();
    this.createSignTexture();
    this.createWallTexture();
    this.createBaseboardTexture();

    if (!this.textures.exists("shadow")) {
      const g = this.add.graphics();
      g.fillStyle(0x000000, 0.25);
      g.fillEllipse(20, 10, 36, 12);
      g.generateTexture("shadow", 40, 20);
      g.destroy();
    }

    if (!this.textures.exists("player")) {
      this.createChibiSheet("player", 0x81d4fa, 0x5d4037, 0xffccbc);
    }

    if (!this.textures.exists("npc")) {
      this.createChibiSheet("npc", 0xffd54f, 0x6d4c41, 0xffe0b2);
    }

    if (!this.textures.exists("quest_marker")) {
      const g = this.add.graphics();
      g.fillStyle(0xffd54f, 1);
      g.fillCircle(12, 12, 10);
      g.lineStyle(3, 0xf57c00, 1);
      g.strokeCircle(12, 12, 10);
      g.generateTexture("quest_marker", 24, 24);
      g.destroy();
    }
  }

  private createChibiSheet(key: string, shirt: number, hair: number, skin: number) {
    const width = 96;
    const height = 128;
    const canvas = this.textures.createCanvas(key, width, height)!.getSourceImage() as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    const drawChibi = (x: number, y: number, frame: number, dir: Direction) => {
      const baseX = x + 16;
      const baseY = y + 14;

      ctx.fillStyle = "rgba(0,0,0,0.15)";
      ctx.beginPath();
      ctx.ellipse(baseX, y + 30, 10, 4, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = `#${skin.toString(16).padStart(6, "0")}`;
      ctx.strokeStyle = "rgba(0,0,0,0.2)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(baseX, baseY, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = `#${hair.toString(16).padStart(6, "0")}`;
      ctx.beginPath();
      ctx.arc(baseX, baseY - 2, 9, Math.PI, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#2D2D2D";
      const eyeOffset = dir === "left" ? -2 : dir === "right" ? 2 : 0;
      ctx.beginPath();
      ctx.arc(baseX - 3 + eyeOffset, baseY, 1.2, 0, Math.PI * 2);
      ctx.arc(baseX + 3 + eyeOffset, baseY, 1.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = `#${shirt.toString(16).padStart(6, "0")}`;
      ctx.strokeStyle = "rgba(0,0,0,0.2)";
      ctx.lineWidth = 2;
      ctx.fillRect(baseX - 8, baseY + 8, 16, 10);
      ctx.strokeRect(baseX - 8, baseY + 8, 16, 10);

      ctx.fillStyle = "#546E7A";
      ctx.fillRect(baseX - 8, baseY + 18, 7, 8);
      ctx.fillRect(baseX + 1, baseY + 18, 7, 8);

      const armShift = frame === 1 ? 1 : frame === 2 ? -1 : 0;
      ctx.fillStyle = `#${skin.toString(16).padStart(6, "0")}`;
      ctx.fillRect(baseX - 12 + armShift, baseY + 10, 4, 6);
      ctx.fillRect(baseX + 8 - armShift, baseY + 10, 4, 6);
    };

    DIRS.forEach((dir, row) => {
      for (let col = 0; col < 3; col += 1) {
        drawChibi(col * 32, row * 32, col, dir);
      }
    });

    this.textures.get(key).refresh();
  }

  private createWallTexture() {
    if (this.textures.exists("wall")) return;
    const g = this.add.graphics();
    g.fillStyle(0xf1f1f1, 1);
    g.fillRoundedRect(0, 0, 120, 20, 8);
    g.lineStyle(3, 0xcfd8dc, 1);
    g.strokeRoundedRect(0, 0, 120, 20, 8);
    g.generateTexture("wall", 120, 20);
    g.destroy();
  }

  private createBaseboardTexture() {
    if (this.textures.exists("baseboard")) return;
    const g = this.add.graphics();
    g.fillStyle(0xd7ccc8, 1);
    g.fillRoundedRect(0, 0, 120, 8, 4);
    g.generateTexture("baseboard", 120, 8);
    g.destroy();
  }

  private createCounterTexture() {
    if (this.textures.exists("counter")) return;
    const g = this.add.graphics();
    g.fillStyle(0xffe0b2, 1);
    g.fillRoundedRect(0, 0, 260, 60, 16);
    g.lineStyle(4, 0x8d6e63, 1);
    g.strokeRoundedRect(0, 0, 260, 60, 16);
    g.fillStyle(0xffcc80, 1);
    g.fillRoundedRect(10, 10, 240, 20, 12);
    g.fillStyle(0x000000, 0.12);
    g.fillRoundedRect(6, 48, 248, 8, 8);
    g.generateTexture("counter", 260, 60);
    g.destroy();
  }

  private createShelfTexture() {
    if (this.textures.exists("shelf")) return;
    const g = this.add.graphics();
    g.fillStyle(0xffd180, 1);
    g.fillRoundedRect(0, 0, 70, 80, 12);
    g.lineStyle(3, 0x9c6b32, 1);
    g.strokeRoundedRect(0, 0, 70, 80, 12);
    g.fillStyle(0xffffff, 1);
    g.fillRoundedRect(8, 10, 20, 16, 6);
    g.fillStyle(0xffab91, 1);
    g.fillRoundedRect(36, 10, 22, 16, 6);
    g.fillStyle(0xc5e1a5, 1);
    g.fillRoundedRect(8, 34, 20, 16, 6);
    g.fillStyle(0xbbdefb, 1);
    g.fillRoundedRect(36, 34, 22, 16, 6);
    g.fillStyle(0xfff59d, 1);
    g.fillRoundedRect(8, 58, 20, 12, 6);
    g.fillStyle(0xb39ddb, 1);
    g.fillRoundedRect(36, 58, 22, 12, 6);
    g.generateTexture("shelf", 70, 80);
    g.destroy();
  }

  private createFreezerTexture() {
    if (this.textures.exists("freezer")) return;
    const g = this.add.graphics();
    g.fillStyle(0xb3e5fc, 1);
    g.fillRoundedRect(0, 0, 80, 90, 12);
    g.lineStyle(3, 0x1cb0f6, 1);
    g.strokeRoundedRect(0, 0, 80, 90, 12);
    g.fillStyle(0xffffff, 0.4);
    g.fillRoundedRect(8, 10, 64, 70, 10);
    g.fillStyle(0x81d4fa, 1);
    g.fillRoundedRect(16, 20, 16, 10, 4);
    g.fillRoundedRect(46, 20, 16, 10, 4);
    g.fillRoundedRect(16, 40, 16, 10, 4);
    g.fillRoundedRect(46, 40, 16, 10, 4);
    g.generateTexture("freezer", 80, 90);
    g.destroy();
  }

  private createDoorTexture() {
    if (this.textures.exists("door")) return;
    const g = this.add.graphics();
    g.fillStyle(0xffecb3, 1);
    g.fillRoundedRect(0, 0, 90, 70, 12);
    g.lineStyle(3, 0x8d6e63, 1);
    g.strokeRoundedRect(0, 0, 90, 70, 12);
    g.fillStyle(0xffffff, 1);
    g.fillRoundedRect(18, 12, 54, 36, 8);
    g.fillStyle(0xffa000, 1);
    g.fillCircle(72, 38, 5);
    g.generateTexture("door", 90, 70);
    g.destroy();
  }

  private createRegisterTexture() {
    if (this.textures.exists("register")) return;
    const g = this.add.graphics();
    g.fillStyle(0xb0bec5, 1);
    g.fillRoundedRect(0, 0, 36, 28, 6);
    g.lineStyle(2, 0x546e7a, 1);
    g.strokeRoundedRect(0, 0, 36, 28, 6);
    g.fillStyle(0x90caf9, 1);
    g.fillRoundedRect(6, 6, 14, 10, 4);
    g.fillStyle(0xffffff, 1);
    g.fillRoundedRect(22, 6, 8, 4, 2);
    g.fillRoundedRect(22, 12, 8, 4, 2);
    g.generateTexture("register", 36, 28);
    g.destroy();
  }

  private createPosterTexture() {
    if (this.textures.exists("poster")) return;
    const g = this.add.graphics();
    g.fillStyle(0xbbdefb, 1);
    g.fillRoundedRect(0, 0, 60, 60, 10);
    g.lineStyle(3, 0x1cb0f6, 1);
    g.strokeRoundedRect(0, 0, 60, 60, 10);
    g.fillStyle(0xffffff, 1);
    g.fillRoundedRect(8, 10, 44, 16, 6);
    g.fillRoundedRect(8, 32, 44, 10, 6);
    g.generateTexture("poster", 60, 60);
    g.destroy();
  }

  private createMatTexture() {
    if (this.textures.exists("mat")) return;
    const g = this.add.graphics();
    g.fillStyle(0xffcc80, 1);
    g.fillRoundedRect(0, 0, 90, 24, 10);
    g.lineStyle(2, 0xf57c00, 1);
    g.strokeRoundedRect(0, 0, 90, 24, 10);
    g.generateTexture("mat", 90, 24);
    g.destroy();
  }

  private createQueueTexture() {
    if (this.textures.exists("queue")) return;
    const g = this.add.graphics();
    g.fillStyle(0xffffff, 1);
    g.fillRoundedRect(0, 0, 50, 16, 8);
    g.lineStyle(2, 0x90caf9, 1);
    g.strokeRoundedRect(0, 0, 50, 16, 8);
    g.fillStyle(0x1cb0f6, 1);
    g.fillRoundedRect(6, 6, 38, 4, 2);
    g.generateTexture("queue", 50, 16);
    g.destroy();
  }

  private createFountainTexture() {
    if (this.textures.exists("fountain")) return;
    const g = this.add.graphics();
    g.fillStyle(0xb3e5fc, 1);
    g.fillRoundedRect(0, 0, 70, 70, 18);
    g.lineStyle(3, 0x1cb0f6, 1);
    g.strokeRoundedRect(0, 0, 70, 70, 18);
    g.fillStyle(0x81d4fa, 1);
    g.fillCircle(35, 35, 18);
    g.generateTexture("fountain", 70, 70);
    g.destroy();
  }

  private createPlantTexture() {
    if (this.textures.exists("plant")) return;
    const g = this.add.graphics();
    g.fillStyle(0x8d6e63, 1);
    g.fillRoundedRect(8, 26, 20, 16, 6);
    g.fillStyle(0xc8e6c9, 1);
    g.fillCircle(18, 16, 12);
    g.lineStyle(2, 0x2e7d32, 1);
    g.strokeCircle(18, 16, 12);
    g.generateTexture("plant", 36, 48);
    g.destroy();
  }

  private createSignTexture() {
    if (this.textures.exists("sign")) return;
    const g = this.add.graphics();
    g.fillStyle(0xbbdefb, 1);
    g.fillRoundedRect(0, 0, 50, 50, 10);
    g.lineStyle(3, 0x1cb0f6, 1);
    g.strokeRoundedRect(0, 0, 50, 50, 10);
    g.fillStyle(0xffffff, 1);
    g.fillRoundedRect(6, 12, 38, 8, 5);
    g.fillRoundedRect(6, 26, 38, 8, 5);
    g.generateTexture("sign", 50, 50);
    g.destroy();
  }
}
