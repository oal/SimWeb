import {MenuItemComponent} from './components/menu-item.js';
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

        this.stage = new PIXI.Stage(0xcccccc);
        this.lastSimTime = 0;
        this.setSimulationFromFile('example.js');
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

        this.ui = new Vue({
            el: '#app',
            data: {
                menu: [
                    {
                        name: 'Mathematics',
                        children: [
                            {name: 'Eksempel 1', file: 'example.js'},
                            {name: 'Eksempel 2', file: 'example2.js'},
                            {name: 'Kule', file: 'kule.js'}
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
                simulation: ''
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

                chooseSimulation: (file) => {
                    this.setSimulationFromFile(file);
                },

                updateSimulation: _ => {
                    this.setSimulationFromEditor()
                }

            },
            watch: {
                simulation: _ => {
                    console.log('Sim changed')
                }
            }
        });
    }

    setSimulationFromFile(file) {
        $.ajax({
            url: './src/simulations/' + file,
            type: 'GET',
            complete: (data) => {
                this.editor.getDoc().setValue(data.responseText);
                this.setSimulationFromCode(data.responseText);
                this.ui.simulation = file;
            }
        });
    }

    setSimulationFromCode(code) {
        console.log(code);
        eval(code);
        console.log('coooode', simulation);

        this.sim = simulation;
        this.stage = new PIXI.Stage(0xffffff*Math.random());
        this.sim.actors = {
            Circle: Circle,
            Line: Line
        };
        this.sim.init(this.stage);
    }

    setSimulationFromEditor() {
        var code = this.editor.getDoc().getValue();
        console.log(code)
        this.setSimulationFromCode(code);
        this.ui.simulation = Math.random();
    }

    simulate(t) {
        requestAnimFrame(this.simulate.bind(this));
        if(!this.ui.simulation) {
            console.log('No simulation set!');
            return
        }

        var dt = (t-this.lastSimTime) / 1000;
        if(this.ui.isRunning) this.ui.time += dt;

        this.update();
        this.lastSimTime = t;
    }

    update() {
        this.sim.update(this.ui.time);
        this.renderer.render(this.stage);
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