var simulation = {
    data: {},

    init: function(stage) {
        var texture = PIXI.Texture.fromImage("./assets/img/bunny.png");
        // create a new Sprite using the texture
        this.data.bunny = new PIXI.Sprite(texture);

        // center the sprites anchor point
        this.data.bunny.anchor.x = 0.5;
        this.data.bunny.anchor.y = 0.5;

        // move the sprite t the center of the screen
        this.data.bunny.position.x = 200;
        this.data.bunny.position.y = 150;

        stage.addChild(this.data.bunny);
    },

    update: function(t) {
        this.data.bunny.rotation = t*5;
    }
};