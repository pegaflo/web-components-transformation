import React, {Component} from 'react';
//import ReactFileInput from './react-file-input/react-file-input';

require("../components/jquery-colorpicker/jquery-colorpicker.html");
require("../components/jquery-timepicker/jquery-timepicker.html");
//require("../components/react-image-gallery/react-image-gallery.js");
//require("../components/react-bootstrap-table/react-bootstrap-table.js");

//require("../transformation/transformation.js");

export default class App extends Component {
  render() {
    return (
      // Add your component markup and other subcomponent references here.
      <div>
          <jquery-colorpicker-v2></jquery-colorpicker-v2>
          <jquery-timepicker></jquery-timepicker>
      </div>
    );
  }
}
