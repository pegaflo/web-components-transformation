(function( $, undefined ) {

$.widget( "mobile.carousel", $.extend( {

	options: {
		enhanced: false,
		handles: true,
		barrel: null,
		bullets: true,
		bulletsPos: "bottom",
		transition: "slide"
	},

	_create: function () {
		this.refresh( true );
	},

	refresh: function ( create ) {
		var $inputs, $items, i,
			el = this.element,
			o = this.options;

		if ( !o.thumbnails ) {
			if ( !o.enhanced ) {

				// clear barrel on refesh
				if ( !create ) {
					$( "#ui-carousel-barrel-" + this.uuid ).remove();
				}
				this._enhance( el, o );
				el.parent()[ o.bulletsPos === "top" ? "prepend" : "append" ]( this._barrel );
			} else {
				this._barrel = $( "#" + o.barrel );
			}

			$inputs =  this._barrel.find( "input" );
			$items = this._items = this._getItems( "li" );
			this._len = $items.length;
			this._direction = "";

			// set reference on radio buttons
			for (i = 0; i < this._len; i += 1) {
				$inputs.eq( i ).data( "reference", $items.eq( i ) );
			}

			this._on( $inputs, {
				"click": "_change"
			});

			this._on( el, {
				"keydown": "_onKeyPress",
				"swipeleft": function () { this.jump( 1 ); },
				"swiperight": function () { this.jump( -1 ); }
			});
		} else {
			this._enhance( el, o );
		}

		if ( o.handles ) {
			this._on( el.parent().find( "a.ui-carousel-handle" ), {
				"click": function ( event ) {
					this.jump( $( event.target ).is( "ui-carousel-handle-left" ) ? -1 : 1 );
				}
			});
		}
	},

	_onKeyPress: function ( e ) {
		switch (e.keyCode) {
			case $.mobile.keyCode.LEFT: this.jump( -1 ); break;
			case $.mobile.keyCode.RIGHT: this.jump( 1 ); break;
		}
	},

	_change: function ( e ) {
		var el = this.element,
			kids = el.children(),
			current = kids.filter( ".ui-carousel-active" ),
			next = $( e.target ).data( "reference" );

		// click on active
		if ( next.hasClass( "ui-carousel-active" ) ) {
			el.focus();
			return;
		}
		this._direction = kids.index( current ) > kids.index( next ) ? " reverse " : "";
		this._transition( current, next );
		el.focus();
	},

	_getItems: function ( selector ) {
		return this.element.find( selector );
	},

	jump: function ( increment ) {
		var len = this._len,
			go = this._items.index( this._getItems( "li.ui-carousel-active" ) ) + increment;

		// allow rotation
		switch ( true ) {
			case go < 0: go = len - 1; break;
			case go > len - 1: go = 0; break;
		}
		this._direction = increment > 0 ? "" : " reverse ";

		// provide hook to modify slide
		if ( this._trigger( "beforejump" ) === false ) {
			return false;
		}

		this._barrel.find( "input" ).eq( go ).trigger( "click" ).checkboxradio( "refresh" );
	},

	_transition: function ( currentActive, nextActive ) {
		var transition = $.mobile._maybeDegradeTransition( this.options.transition ),
			bound = transition + this._direction;

		currentActive.addClass( bound + " out " );
		nextActive
			.addClass( bound + " in ui-carousel-active" )
			.animationComplete( function () {
				currentActive.removeClass( bound + " ui-carousel-active out" );
				nextActive.removeClass( bound + " in ");
			});
	}
}, $.mobile.behaviors.addFirstLastClasses ) );

})( jQuery );

(function( $, undefined ) {

$.widget( "mobile.carousel", $.mobile.carousel, {
	options: {
		corners: false,
		captions: false,
		captionpos: "top",
		captiontheme: "a",
		heading: "h1,h2,h3,h4,h5,h6,legend",
		inset: false,
		shadow: false,
		thumbnails: false
	},

	_addButton: function ( inset, left ) {
		var arr = left ? ["Left", "left", "l"] : ["Right", "right", "r"];

		return $( '<a class="ui-carousel-handle ui-carousel-handle-' + arr[1] +
			' ui-btn ui-btn-icon-notext ui-corner-all ui-icon-carat-' + arr[2] +
					' ui-shadow ' + ( inset ? 'ui-carousel-handle-inset' : '' ) +
					'" href="#">' + arr[0] + '</a>');
	},

	_enhance: function ( el, o ) {
		var i, item, radio, label, barrel, containsLink, $selector,
			id = this.uuid,
			items = el.children(),
			len = items.length,
			carouselClasses = "ui-carousel ",
			fragment = document.createDocumentFragment(),
			prefix = 'radio-' + id,
			emptyString = "";

		// handlers
		if ( o.handles && len > 0 ) {
			carouselClasses += " ui-carousel-handles";
			el.after( this._addButton( o.inset ) )
				.after( this._addButton( o.inset, true ) );
		}

		// thumbnails
		if ( o.thumbnails ) {
			carouselClasses += " ui-carousel-thumbnails";
		} else {
			for ( i = 0; i < len; i += 1 ) {
				item = items[i];

				// captions
				if ( o.captions ) {
					containsLink = item.children[ 0 ].tagName === "A";
					$selector = containsLink ? $( item ).find( "a" )  : $( item );

					$selector
						.addClass( "ui-carousel-selector" )
						.children()
						.not( "img" )
						.wrap( "<p class='ui-carousel-captions-content ui-bar-" +
								o.captiontheme + " ui-carousel-captions-" +
										o.captionpos + "'></p>")
						.parent()
						.prependTo( $selector )
							.find( o.heading )
							.addClass( "ui-carousel-captions-heading" );
				}

				// radios bullets
				if ( o.bullets ) {
					label = $( "<label data-" + $.mobile.ns + "iconpos='notext'></label>" );
					radio = $( "<input type='radio' name='" + prefix + "' id='" +
							prefix + "-" + i + "' value='" + i + "'/>" );

					if ( i === 0 ) {
						radio.attr( "checked", true );
						$( item ).addClass( "ui-carousel-active" );
					}
					label.append( radio );
					fragment.appendChild( label[0] );
				}
			}
		}

		carouselClasses += o.captions ? " ui-carousel-captions" : emptyString;
		carouselClasses += o.inset ? " ui-carousel-inset" : emptyString;

		if ( !!o.inset ) {
			carouselClasses += o.corners ? " ui-corner-all" : emptyString;
			carouselClasses += o.shadow ? " ui-shadow" : emptyString;
		}

		if ( o.bullets && !o.thumbnails ) {
			carouselClasses += " ui-carousel-bullets";
			barrel = $( "<div id='ui-carousel-barrel-" + id + "' class='" +
					"ui-carousel-controls ui-carousel-controls-" + o.bulletsPos +
							"'></div>");
			this._barrel = barrel.append( fragment ).enhanceWithin();
		}
		// setting tabindex -1 allows to focus programmatically
		el.addClass( carouselClasses ).attr("tabindex", -1);
	}
});

})( jQuery );
