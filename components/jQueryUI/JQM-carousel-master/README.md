JQM Carousel
========================================

A jQuery Mobile Carousel/Gallery widget.

Simple demo can be found here: [JSBIN](http://jsbin.com/ofuhaw/1290/)


Another Carousel Plugin?
-------------
Yep. This one fully based on jQuery Mobile, so you can use all the goodness
provided by JQM and don't need to add any other 3rd party plugins.


How to use?
-------------
Drop in the CSS and JS file after JQM and you are good to go.

A gallery is made as a list element. Just add a `data-role` and you have your
gallery. The gallery is not limited to images - drop in anything you want.


     <ul data-role="carousel">
       <li><img alt="" src="img/a.png"/></li>
       <li><img alt="" src="img/b.png"/></li>
       <li><img alt="" src="img/c.png"/></li>
     </ul>


Beware this is a responsive carousel. By default the carousel will stretch to
its containers dimensions (= width). This way there is no need to hardcode any
parameter on the list. Just provide the image in the way you need and it will 
expand to its parents width.


Documentation
-------------

### Attributes/Features

  * **data-role=carousel** - required to initialize the carousel
  * **data-bullets=true** - required radio controls (unless using thumbnail mode)
  * **[data-barrel=#id**] - radio container id, required when pre-enhancing
  * **[data-inset=true]** - add rounded corners (default _false_)
  * **[data-shadow=true]** - add shadow (default _false_)
  * **[data-transition=slide]** - JQM transition to transition between images (default _slide_)
  * **[data-captions=true]** - add caption (default _false_)
  * **[data-captionspos=top]** - position of caption (default _top_)
  * **[data-thumbnail=true]** - create a thumbnail gallery of all images
  * **[data-handles=true]** - add left/right buttons (default _false_)
  * **[data-enhanced=true]** - provide a pre-enhanced version of the gallery

There are two modes to view a carousel, **thumbnail** and **regular**. To create
a thumbnail list of all images in your carousel, add the `data-thumbnail` attribute.
Please note that thumbnail carousels have no functionalities. 

### Extensions

The carousel widget provides the enhancement method as an extension. So if you
provide pre-enhanced markup, no need for the enhancer.

### Events

The plugin currently emits a `beforejump` event before changing images/slides, so
to hook into the carousel, just bind to this event like this:


     $(selector).on("beforejump", function (e) {
       // your custom code here
     });



### Examples

The demos can be found in the `demos/` folder.


Tests
-------------
(coming up)


Version
-------------
 *	0.1.0 		initial release


License
-------

Released under the [MIT](LICENSE?raw=1) license.
