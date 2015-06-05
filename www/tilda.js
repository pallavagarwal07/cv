$.fn.tilda = function(eval, options) {
    if ($('body').data('tilda')) {
        return $('body').data('tilda').terminal;
    }
    this.addClass('tilda');
    options = options || {};
    eval = eval || function(command, term) {
        term.echo("you don't set eval for tilda");
    };
    var settings = {
        prompt: (getPtr().name + " $ ").replace(/#/g, ''),
        name: 'tilda',
        height: 500,
        enabled: false,
        greetings: 'Quake like console',
        keypress: function(e) {
            if (e.which == 96 || e.which == 126) {
                return false;
            }
        }
    };
    if (options) {
        $.extend(settings, options);
    }
    this.append('<div class="td"></div>');
    var self = this;
    self.terminal = this.find('.td').terminal(eval, settings);
    var focus = false;
    $(document.documentElement).keypress(function(e) {
        if (e.which == 96 || e.which == 126) {
            self.slideToggle('fast');
            self.terminal.focus(focus = !focus);
            self.terminal.attr({
                scrollTop: self.terminal.attr("scrollHeight")
            });
        }
    });
    $('body').data('tilda', this);
    this.hide();
    return self;
};

$(function() {
    $('#tilda').tilda($.interpret);
});


