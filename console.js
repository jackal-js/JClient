/**
 */
require(["knockout-2.2.1", 
         "sheut/debug", 
         "sheut/step", 
         "sheut/run", 
         "sheut/operations/evaluation", 
         "sheut/breakpoint",
         "sheut/state",
         "model", 
         "object_explorer"],
function(ko, 
         debug, 
         step, 
         run, 
         evaluate, 
         breakpoint,
         state,
         atum_debug_model, 
         object_explorer) {

var id = (function(x) {
        return x;
    });
    var model;
    var out = ({
        "write": (function(x, ctx) {
            model.pushResult(x, ctx, false);
            $("#output > ul").scrollTop($("#output > ul")[0].scrollHeight);
        })
    });
    var errorOut = ({
        "write": (function(x, ctx) {
            model.pushResult(x, ctx, true);
            $("#output > ul").scrollTop($("#output > ul")[0].scrollHeight);
        })
    });
    
    var debuggerState = state.Debugger.initial;
    var bpArray = [];
    
    var cm = CodeMirror(document.getElementById("input"), ({
        "mode": "javascript",
        "lineNumbers": true,
        "gutters": ["breakpoints", "CodeMirror-linenumbers"]
    }));
    cm.on("gutterClick", function(codeMirror, n){
       var info = codeMirror.lineInfo(n);
       codeMirror.setGutterMarker(n, "breakpoints", info.gutterMarkers ? clearMarker(n) : makeMarker(n));
    });
    
    function makeMarker(n) {
        var marker  = document.createElement("div");
        marker.style.color = "#822";
        marker.innerHTML = "&#149;";
        marker.style.fontSize = "1.5em";
        var bp = breakpoint.create(breakpoint.unconditional(n+1));
        var bid = Math.random().toString(36).substr(2,9);
        var record = {id: bid, linenumber: n+1};
        bpArray.push(record);
        debuggerState = state.addBreakpoint(debuggerState, bid, bp);
        //debuggerState = debug.beginInput(debuggerState, "PROGRAM");
        return marker;
    }
    
    function clearMarker(n){
        for(var x in bpArray){
            if(n==bpArray[x].linenumber){
                debuggerState = state.removeBreakpoint(debuggerState, bpArray[x].id);
                var index = bpArray.indexOf(bpArray[x]);
                bpArray.splice(index, 1);
            }
        }
        return null;
    }
    
    var doc = cm.doc;
    var interactive = CodeMirror(document.getElementById("output-interactive-textarea"), ({
        "mode": "javascript",
        "lineNumbers": false
    }));
    var interactiveDoc = interactive.doc;
    interactive.setSize(null, 20);
    interactive.on("beforeChange", (function(instance, change) {
        change.update(change.from, change.to, [change.text.join("").replace(/\n/g, "")]);
        return true;
    }));
    interactive.on("keyHandled", (function(instance, name, event) {
        if ((name === "Enter")) {
            var input = interactiveDoc.getValue(); {
                var writeOut = (function(x, ctx) {
                    interactive.setValue("");
                    model.pushInput(input);
                    out.write(x, ctx);
                }),
                    writeError = (function(x, ctx) {
                        interactive.setValue("");
                        model.pushInput(input);
                        errorOut.write(x, ctx);
                    });
                if (model.debug()) {
                    run.evaluate(model.debug(), evaluate.evaluateInput(input), writeOut, writeError);
                } else {
                    step.finish(debug.beginInitialInput(input, writeOut, writeError));
                }

            }
        }

    }));
    (model = new(atum_debug_model.ConsoleViewModel)());
    ko.applyBindings(model);
    model.location.subscribe((function(current) {
        if ((current && current.start)) cm.removeLineClass((current.start.line - 1), "background", "active-line");

    }), null, "beforeChange");
    model.location.subscribe((function(x) {
        if ((x && x.start)) cm.addLineClass((x.start.line - 1), "background", "active-line");

    }));
    $((function() {
        var stopButton = $("button#stop-button"),
            runButton = $("button#run-button"),
            stepBackButton = $("button#step-back-button"),
            stepOutButton = $("button#step-out-button"),
            stepIntoButton = $("button#step-into-button"),
            stepOverButton = $("button#step-over-button");
        $("#container").layout();
        
        /***
         *   Client functions
         */
        $('#refresh-button').click(function(){
            doc.setValue(codeMirrorText); 
        });
    
        $('#save-button').click(function(){
            $('#saveModal').modal('show');
            $('#saveText').text(doc.getValue());
            if($('#saveTitle').val() == ''){
                $('#sessionFlag').text('New');
            }else{
                $('#sessionFlag').text('Save');
            }
        });
        
        $('#share-button')
        .click(function(){
            var url = window.location.href.split('?');
            $('#shareLink').val(url[0].concat("?").concat(url[1]).concat("?").concat(url[2]));
            $('#shareModal').modal('show');
        });
        /*
         * ****************************************
         */
        
        model.debug.subscribe((function(x) {
            var disable = (!x || x.debug.complete);
            stopButton.button("option", "disabled", disable);
            runButton.button("option", "disabled", disable);
            stepBackButton.button("option", "disabled", disable);
            stepOverButton.button("option", "disabled", disable);
            stepIntoButton.button("option", "disabled", disable);
            stepOutButton.button("option", "disabled", disable);
        }));
        $("#output > ul").on("accordionactivate", ".object-browser", (function(event, ui) {
            return $("#output > ul").scrollTop($(this).offset().top);
        }));
//        $("button#run-button").button().click((function(e) {
//            var input = doc.getValue();
//            model.debug(debug.beginInitialInput(input, out.write, errorOut.write));
//            model.finish();
//        }));
        $("button#debug-button").button().click((function(e) {
            var input = doc.getValue();
            //debuggerState = state.addBreakpoint(debuggerState, Math.random().toString(36).substr(2,9), breakpoint.create(breakpoint.unconditional(doc.lastLine())));
            //model.debug(debug.beginInitialInput(input, out.write, errorOut.write));
            model.debug(debug.beginInput(debuggerState, input, out.write, errorOut.write));
            
        }));
        stopButton.button(({
            "disabled": true
        })).click((function(e) {
            model.stop();
        }));
        runButton.button(({
            "disabled": true
        })).click((function(e) {
            model.run();
        }));
        stepOverButton.button(({
            "disabled": true
        })).click((function(e) {
            model.stepOver();
        }));
        stepIntoButton.button(({
            "disabled": true
        })).click((function(e) {
            model.stepInto();
        }));
        stepOutButton.button(({
            "disabled": true
        })).click((function(e) {
            model.stepOut();
        }));
        stepBackButton.button(({
            "disabled": true
        })).click((function(e) {
            model.stepBack();
        }));
    }));
});
