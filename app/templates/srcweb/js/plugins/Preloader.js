define(['Plugin'], function (Plugin) {
    var Preloader = Plugin.extend({
        execute: function (dfd) {
            var me = this;

            me.$element.remove();
        }
    });

    return Preloader;
});
