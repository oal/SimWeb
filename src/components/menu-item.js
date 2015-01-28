import {Component} from "./component.js";

export class MenuItemComponent extends Component {
    constructor() {
        super();
        this.twoWay = false;
    }

    template() {
        return `
            <li class="list-group-item">
                <span v-on="click: open"><span class="label label-info pull-right" v-if="isFolder">{{isOpen ? '-' : '+'}}</span> {{ model.name }}</span>

                <ul v-show="isOpen" v-if="isFolder">
                    <div v-repeat="model: model.children" v-component="menu-item"></div>
                </ul>
            </li>
        `
    }

    data() {
        return {
            isOpen: false
        }
    }

    computed() {
        return {
            isFolder: function () {
                return this.model.children != undefined && this.model.children.length > 0
            }
        }
    }

    methods() {
        return {
            open: function () {
                if (this.isFolder) {
                    this.isOpen = !this.isOpen
                } else {
                    this.$root.setSimulationFromFile(this.model.file);
                }
            }
        }
    }
}