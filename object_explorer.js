/*
 * THIS FILE IS AUTO GENERATED from 'lib/object_explorer.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "knockout-2.2.1", "atum/compute", "sheut/debug", "sheut/run", "sheut/fun", "sheut/operations/object", "sheut/operations/reference"], (function(require, exports, ko, __o, debug, run, __o0, object, reference) {
    "use strict";
    var AtumObject, updateAccordions, create, createForKey;
    var ko = ko,
        __o = __o,
        just = __o["just"],
        debug = debug,
        run = run,
        __o0 = __o0,
        map = __o0["map"],
        object = object,
        reference = reference;;
    var noop = (function() {});
    (updateAccordions = (function(target) {
        return target.each((function() {
            return ($(this).hasClass("ui-accordion") ? $(this) : $(this).accordion(({
                "collapsible": true,
                "animate": 100,
                "heightStyle": "content",
                "active": false
            })));
        }));
    }));
    var AtumChild = (function(key, value) {
        var self = this;
        (self.key = ko.observable(key));
        (self.value = ko.observable(value));
    });
    (AtumObject = (function(d, x) {
        var self = this;
        var value = run.extract(d, reference.getValue(x), null);
        (self.value = ko.observable(value));
        (self.children = ko.observableArray());
        (self.type = ko.observable((value ? value.type : null)));
        (self.isObject = ko.observable((value && (value.type === "object"))));
        (self.displayValue = run.extract(d, object.displayName(x), "ERROR"));
        (self.getChildren = (function(data, event) {
            var self = this;
            var value = self.value();
            if (!self.isObject()) return;

            if (!this.children().length) {
                run.extract(d, object.getOwnPropertyNames(x), null, map.bind(null, (function(key) {
                    return run.extract(d, object.get(x, key), null, (function(value) {
                        return self.children.push(new(AtumChild)(key, new(AtumObject)(d, value)));
                    }));
                })));
            }

        }));
        (self.afterRender = (function(elements, data) {
            updateAccordions($(elements).find(".object-browser").add(".object-browser"));
        }));
    }));
    (create = (function(value, ctx) {
        var obj = new(AtumObject)(debug.debug(just(value), ctx, noop, noop), value);
        obj.getChildren();
        return obj;
    }));
    (createForKey = (function(key, value, ctx) {
        return new(AtumChild)(key, create(value, ctx));
    }));
    (exports.AtumObject = AtumObject);
    (exports.updateAccordions = updateAccordions);
    (exports.create = create);
    (exports.createForKey = createForKey);
}))