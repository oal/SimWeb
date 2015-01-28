import {MenuItemComponent} from './components/menu-item.js';
import {Simulation as Example} from './simulations/example.js';
import {Simulation as Example2} from './simulations/example2.js';
import {Simulation as Kule} from './simulations/kule.js';
import {Circle} from './actors/circle.js';
import {Line} from './actors/line.js';

class App {
    constructor() {
        var container = document.getElementById('canvas');
        var styles = window.getComputedStyle(container);
        this.renderer = new PIXI.autoDetectRenderer(container.clientWidth - parseInt(styles.paddingLeft) - parseInt(styles.paddingRight), 400, {antialias: true});
        container.appendChild(this.renderer.view);

        this.setupEditor();
        this.setupUI();

        this.ui.setSimulation(Example);
        this.lastSimTime = 0;
        this.simulate(0);

        console.log(new Circle());
    }

    addComponent(name, component) {
        Vue.component(name, component.toComponent());
    }

    setupUI() {
        Vue.config.debug = true;
        this.addComponent('menu-item', new MenuItemComponent());

        Vue.filter('floatformat', function(value) {
            return value.toFixed(2);
        });

        var renderer = this.renderer;
        var editor = this.editor;
        this.ui = new Vue({
            el: '#app',
            data: {
                menu: [
                    {
                        name: 'Mathematics',
                        children: [
                            {name: 'Eksempel 1', simulation: Example},
                            {name: 'Eksempel 2', simulation: Example2},
                            {name: 'Kule', simulation: Kule}
                        ]
                    },
                    {
                        name: 'Physics',
                        children: [
                        ]
                    }
                ],
                isRunning: false,
                time: 0.0,
                simulation: null
            },
            methods: {
                startStop: function() {
                    this.isRunning = !this.isRunning;

                    // Round to nearest hundredth:
                    this.time = parseFloat(this.time.toFixed(2));
                },

                reset: function() {
                    this.time = 0.0;
                },

                stepBackward: function() {
                    this.time -= 0.01;
                },

                stepForward: function() {
                    this.time += 0.01;
                },

                setSimulation: function(simulation) {
                    this.simulation = simulation;
                    this.simulation.stage = new PIXI.Stage(0xffffff);
                    this.simulation.actors = {
                        Circle: Circle,
                        Line: Line
                    };
                    this.simulation.init();
                    console.log('SIm set', './src/simulations/'+this.simulation.file, $.get, simulation);

                    $.ajax({
                        url: './src/simulations/' + this.simulation.file,
                        type: 'GET',
                        complete: function (data) {
                            editor.getDoc().setValue(data.responseText);
                            var code = data.responseText;
                        }
                    });
                }
            }
        });
    }

    simulate(t) {
        requestAnimFrame(this.simulate.bind(this));
        var dt = (t-this.lastSimTime) / 1000;
        if(this.ui.isRunning) this.ui.time += dt;

        this.update();
        this.lastSimTime = t;
    }

    update() {
        this.ui.simulation.update(this.ui.time);
        this.renderer.render(this.ui.simulation.stage);
        //console.log(this.ui.simulation)
    }

    setupEditor() {
        this.editor = CodeMirror.fromTextArea(document.getElementById("code"), {
            lineNumbers: true,
            styleActiveLine: true,
            matchBrackets: true
        });
    }

}

global.app = function () {
    new App();
};