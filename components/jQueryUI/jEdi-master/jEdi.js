$.widget("dl.jEdi", {
    options: {
        editorCSS : null,
        buttonSelector: null,
        initialHTML : '<!doctype html><head><title>jEdi-document</title><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /></head><body contenteditable="true">###CONTENT###</body></html>',
        styleWithCSS: true, // doesn't work for ie
        initialContent: '<br />'
    },
    editorFrame : null,
    _create: function() {
        var _self = this;
        var content = _self.options.initialHTML.replace('###CONTENT###', ($.trim(_self.element.html()) || _self.options.initialContent));
        _self.editorFrame = $('<iframe src="about:blank" />').css({
            'width'  : this.element.innerWidth(), 
            'height' : this.element.innerHeight(),
            'border' : 0, 
            'margin' : 0, 
            'padding' : 0, 
            'position' : 'absolute', 
            'top' : 0, 
            'left' : 0
        }).load(function(e){
            $(this).unbind('load');
            $(this).contents().get(0).open();
            $(this).contents().get(0).write(content);
            $(this).contents().get(0).close();
            $(this).contents().find('body').bind('keyup cut drop paste', function(){
                _self.element.trigger('change', [_self.getContent()]);
            });
            _self._refresh(nochange = true);
        });
        if (this.element.css('position')=='static') {
            $(this.element).css('position','relative');
        }
        $(_self.element).html(_self.editorFrame);
    },
    _refresh: function(nochange) {
        this.setEditorCSS(this.options.editorCSS);
        this._bindButtons(this.options.buttonSelector);
        this.cmd('styleWithCSS',this.options.styleWithCSS);
        if (nochange=='undefined' || !nochange) {
            this.element.trigger('change', [this.getContent()]);
        }
    },
    _bindButtons: function(buttonSelector) {
        var _self = this;
        $(buttonSelector).each(function(){
            if (!$.isEmptyObject(buttonSelector.data()) && buttonSelector.data('cmd').length) {
                _self.bindCmd($(this), $(this).data('cmd'), ($(this).data('value') || null));
            }
        });
    },
    _setOptions: function() {
        this._superApply( arguments );
        this._refresh();
    },
    _setOption: function( key, value ) {
        this._super( key, value );
    },
    bindCmd: function(buttonSelector, aCommandName, aParam) {
        _self = this;
        buttonSelector.attr('unselectable','on').children().attr('unselectable','on');
        buttonSelector.unbind('click');                        
        buttonSelector.bind('click',function(e){
            _self.cmd(aCommandName, (aParam || null));
            return false;
        });
    },            
    cmd: function(aCommandName, aParam) {
        var contentBeforeCmd = this.getContent();                    
        try {
            $(this.editorFrame).contents().get(0).execCommand(aCommandName, false, aParam);
        } catch (e) {
            if (aCommandName == 'insertHTML') {
                try {
                    var selection = $(this.editorFrame).contents().get(0).selection;
                    if (selection !=null) {
                        var range = selection.createRange();
                        if (range != null) {
                            range.pasteHTML(aParam);
                        }
                    }    
                } catch(e) {
                    alert(aCommandName + ': browser not supported');
                }    
            } else {
                //console.log(e);  // browser not supported!
            }
        }                
        if (contentBeforeCmd != this.getContent()) { 
            this.element.trigger('change', [this.getContent()]); 

        }
    },
    setEditorCSS: function(css) {
        if (css != undefined) this.options.editorCSS = css;
        if (this.options.editorCSS) {
            $(this.editorFrame).contents().find('head link[type="text/css"]').remove();
            var css = '<link type="text/css" rel="stylesheet" href="' + this.options.editorCSS + '" />';
            $(this.editorFrame).contents().find('head').append(css);
        } 
    },
    setContent: function(content) {
        $(this.editorFrame).contents().find('body').html(content);
        this.trigger('change', [this.getContent()]);
    },
    getContent: function() {
        return $.trim($(this.editorFrame).contents().find('body').html());
    },
});
