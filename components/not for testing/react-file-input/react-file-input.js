import ReactiveElement from "reactive-elements";

var FileInput = require('react-file-input');

class ReactFileInput extends FileInput {
    constructor(props) {
        super(props);
        console.log(this.state.styles);
    };

    handleChange(event) {
    console.log('Selected file:', event.target.files[0]);
    };

    ready() {
        console.log("ready!!!");
    }

    attached() {
        console.log("attached!!!");
    }
}

document.registerReact('react-file-input', ReactFileInput);
