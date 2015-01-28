export class Circle extends PIXI.Graphics {
    constructor(x, y, radius, line=false, color=0x000000) {
        super();

        this.beginFill(color, 1.0);
        this.lineStyle(2, 0x000000, 0.4);
        this.drawCircle(0, 0, radius);
        this.endFill();

        if(line) {
            this.moveTo(0,0);
            this.lineTo(radius, 0);
        }

        this.x = x;
        this.y = y;

    }
}