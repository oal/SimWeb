var simulation = {
    data: {},

    init: function() {
        var texture = PIXI.Texture.fromImage("./assets/img/bunny.png");
        // create a new Sprite using the texture
        this.data.bunnies = [];

        for(var i = 0; i < 50; i++) {
            var bunny = new PIXI.Sprite(texture);
            bunny.anchor.x = 0.5;
            bunny.anchor.y = 0.5;
            bunny.position.x = i*10;
            bunny.position.y = 150;

            this.data.bunnies.push(bunny);
            this.stage.addChild(bunny);
        }
    },

    update: function(t) {
        for(var i = 0; i < this.data.bunnies.length; i++) {
            this.data.bunnies[i].rotation = t*5;
        }
    }
};