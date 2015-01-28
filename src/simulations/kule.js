var simulation = {
    data: {},

    init: function() {
        var c = new this.actors.Circle(150, 150, 50, true, 0x4B6477);
        this.data.circle = c;
        this.stage.addChild(c);

        var l = new this.actors.Line(150, 0, 150, 100);
        this.data.line = l;
        this.stage.addChild(l);
    },

    update: function(t) {
        this.data.circle.rotation = t*5;
    }
};