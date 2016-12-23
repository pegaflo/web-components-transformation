// Polyfill for older browsers
if (typeof Object.create !== 'function') {
    Object.create = function (obj) {
        "use strict";

        function F() {}
        F.prototype = obj;
        return new F();
    };
}

(function ($, window, document, undefined) {
    "use strict";

    var MetCast = {

        init: function (options, container) {

            var self = this;
            self.container = container,
            self.$container = $(container),
            self.options = $.extend({}, $.fn.metCast.options, options),
            self.endpoint = 'http://api.worldweatheronline.com/free/v1/weather.ashx';

            self.createWidget(); // Create the widget

        },

        createWidget: function () {
            var self = this;
            this.setData().done(function () {
                self.$container.append('<div class="metCast-wrapper"><div id="metCast-text"><p class="Temp">' + self.temp + '</p><p class="Wind">' + self.wind + '</p><p class="Pressure">' + self.pressure + '</p></div><div id="metCast-icon"></div></div>');
                self.setImage();
            });
        },

        fetch: function () {
            //fetch data from the weather api - courtesy of http://worldweatheronline.com
            return $.ajax({
                url: this.endpoint,
                data: {
                    key: this.options.key,
                    q: this.options.location,
                    format: 'json'
                },
                dataType: 'jsonp',
                type: 'GET'
            });
        },

        setData: function () {

            var self = this;

            return this.fetch().done(function (results) {

                var weatherData = results.data.current_condition[0];

                self.temp = weatherData.temp_C + '&#176; C';
                self.wind = weatherData.winddir16Point + ', ' + weatherData.windspeedMiles + 'mph';
                self.pressure = weatherData.pressure + 'mb';
                self.icon = weatherData.weatherCode;

            });

        },

        setImage: function () {

            var icon = $('#metCast-icon'),
                code = this.icon;

            // Change the icon depending on the weather

            if (code == 113) {
                icon.addClass('sunny');
            } else if (code == 356) {
                icon.addClass('rain');
            } else if (code == 119) {
                icon.addClass('cloudy');
            } else if (code == 389) {
                icon.addClass('thunder');
            } else if (code == 116) {
                icon.addClass('partlycloudy');
            } else if (code == 371) {
                icon.addClass('snow');
            } else {
                icon.addClass('cloudy');
            }

        }

    };

    $.fn.metCast = function (options) {
        return this.each(function () {
            var metCast = Object.create(MetCast);
            metCast.init(options, this);
            $.data(this, 'metCast', metCast);
        });
    };

    /*----------------------------------------------------------------
        Default Options
    ----------------------------------------------------------------*/

    $.fn.metCast.options = {
        key: null,
        location: 'London'
    };

})(jQuery, window, document, undefined);
