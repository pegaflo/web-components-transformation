import ReactiveElement from "reactive-elements";
import ImageGallery from 'react-image-gallery';

class ReactImageGallery extends ImageGallery {

    attached() {
        console.log(this);
    }
}

document.registerReact('react-image-gallery', ReactImageGallery);
