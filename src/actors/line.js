export class Line extends PIXI.Graphics {
    constructor(x1, y1, x2, y2, color=0x000000) {
        super();

        this.lineStyle(2, color, 1);
        this.moveTo(x1, y1);
        this.lineTo(x2, y2);
    }
}