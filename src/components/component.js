export class Component {
    constructor() {
        this.twoWay = false;
    }

    toComponent() {
        return {
            twoWay: this.twoWay,
            template: this.template(),
            data: this.data,
            computed: this.computed(),
            methods: this.methods()
        }
    }

    template() {
        return '';
    }

    data() {
        return {};
    }

    computed() {
        return {};
    }

    methods() {
        return {};
    }
}