/*
 * THIS FILE IS AUTO GENERATED from 'lib/model.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "knockout-2.2.1", "amulet/record", "atum/compute", "atum/operations/object", "sheut/debug", "sheut/run", "sheut/step", "sheut/operations/context", "sheut/operations/reference", "object_explorer"], (function(require, exports, ko, record, compute, object, debug, run, step, context, reference, object_explorer) {
    "use strict";
    var Result, Input, ConsoleViewModel;
    var ko = ko,
        record = record,
        compute = compute,
        object = object,
        debug = debug,
        run = run,
        step = step,
        context = context,
        reference = reference,
        object_explorer = object_explorer,
        AtumObject = object_explorer["AtumObject"];;
    var map = (function(f, a) {
        return Array.prototype.map.call(a, f);
    });
    var noop = (function(x) {
        return x;
    });
    (Result = record.declare(null, ["value", "error"]));
    (Result.prototype.type = "result");
    (Input = record.declare(null, ["input"]));
    (Input.prototype.type = "input");
    var Environment = (function(bindings) {
        (this.bindings = ko.observableArray(bindings));
    });
    var Binding = (function(name, value) {
        (this.name = name);
        (this.value = value);
    });
    var printBindings = (function(d, environment) {
        return (function() {
            {
                var bindings = run.extract(d, context.getEnvironmentBindings(environment), []);
                return bindings.reduce((function(p, c) {
                    p.push(new(Binding)(c, run.extract(d, context.getEnvironmentBinding(environment, c), null, (function(x, ctx) {
                        return object_explorer.createForKey(c, x, ctx);
                    }))));
                    return p;
                }), []);
            }
        })();
    });
    var printFrame = (function(d, lex) {
        return new(Environment)(printBindings(d, lex));
    });
    var printEnvironments = (function(d) {
        var environments = [];
        var environment = run.extract(d, context.environment, null);
        do {
            environments.push(printFrame(d, environment));
            (environment = run.extract(d, context.getEnvironmentOuter(environment), null));
        }
        while (environment);
        return environments;
    });
    var StackFrame = (function(name) {
        (this.name = name);
    });
    var createStackFrame = (function(d, frame) {
        return new(StackFrame)(run.extract(d, context.getStackFrameName(frame), "", (function(x) {
            return x.value;
        })));
    });
    var printStack = (function(d) {
        return run.extract(d, context.stack, [], map.bind(null, createStackFrame.bind(null, d)));
    });
    (ConsoleViewModel = (function() {
        var self = this;
        
        (self.debug = ko.observable());
        (self.output = ko.observableArray());
        
        (self.location = ko.computed((function() {
            return (self.debug() ? run.extract(self.debug(), context.location, null) : []);
        })));
        (self.environments = ko.computed((function() {
            return (self.debug() ? printEnvironments(self.debug()) : []);
        })));
        (self.stack = ko.computed((function() {
            return (self.debug() ? printStack(self.debug()) : []);
        })));
        
    }));
        var StateArray = new Array();
        var arrayLength = 9;
        var i = 0;
        var j;
        
    (ConsoleViewModel.prototype.finish = (function() {
        return this.debug(step.finish(this.debug()));
    }));
    (ConsoleViewModel.prototype.run = (function() {
        return this.debug(step.run(this.debug()));
    }));
    (ConsoleViewModel.prototype.stepOver = (function() {
        if(i < arrayLength && !StateArray[i]) {
            StateArray[i] = this.debug;
            i++;
        } else if(i == arrayLength) {
            if(!StateArray[i]) {
                StateArray[i] = this.debug;
            } else if(StateArray[i]) {
                StateArray.shift();
                StateArray[i] = this.debug;
            }
        }
        return this.debug(step.stepOver(this.debug()));
    }));
    (ConsoleViewModel.prototype.stepInto = (function() {
        if(i < arrayLength && !StateArray[i]) {
            StateArray[i] = this.debug;
            i++;
        } else if(i == arrayLength) {
            if(!StateArray[i]) {
                StateArray[i] = this.debug;
            } else if(StateArray[i]) {
                StateArray.shift();
                StateArray[i] = this.debug;
            }
        }
        return this.debug(step.step(this.debug()));
    }));
    (ConsoleViewModel.prototype.stepOut = (function() {
        if(i < arrayLength && !StateArray[i]) {
            StateArray[i] = this.debug;
            i++;
        } else if(i == arrayLength) {
            if(!StateArray[i]) {
                StateArray[i] = this.debug;
            } else if(StateArray[i]) {
                StateArray.shift();
                StateArray[i] = this.debug;
            }
        }
        return this.debug(step.stepOut(this.debug()));
    }));
    (ConsoleViewModel.prototype.stop = (function() {
        return this.debug(null);
    }));
    (ConsoleViewModel.prototype.stepBack = (function() {
        j = i;
        i--;
        return this.debug(StateArray[j]);
    }));
    (ConsoleViewModel.prototype.pushResult = (function(value, ctx, error) {
        return this.output.push(Result.create(object_explorer.create(value, ctx), error));
    }));
    (ConsoleViewModel.prototype.pushInput = (function(input) {
        return this.output.push(Input.create(input));
    }));
    (ConsoleViewModel.prototype.selectFrame = (function(item) {
        this.environment();
    }));
    (exports.Result = Result);
    (exports.Input = Input);
    (exports.ConsoleViewModel = ConsoleViewModel);
}));