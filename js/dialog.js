tinyMCEPopup.requireLangPack();

var CallBuilderDialog = {
    init: function() {
        var form = document.forms["callbuilder"];
        for (var call in calls) {
            var option = document.createElement("option");
            option.value = call;
            option.appendChild(document.createTextNode(call));
            form.elements["call"].appendChild(option);
        }
        var call = tinyMCEPopup.getWindowArg("call");
        form.elements["call"].value = call;
        this.rebuildParams();
    },

    rebuildParams: function() {
        var form = document.forms["callbuilder"];
        var call = form.elements.call.value;
        var args = tinyMCEPopup.getWindowArg("params");
        var paramDiv = document.getElementById("params");
        while (paramDiv.firstChild) {
            paramDiv.removeChild(paramDiv.lastChild)
        }
        var params = calls[call] || [];
        for (var i = 0; i < params.length; i++) {
            var param = params[i];
            var label = document.createElement("label");
            label.appendChild(document.createTextNode(param.name));
            paramDiv.appendChild(label);
            switch (param.type) {
            case "string":
                var el = document.createElement("input");
                el.type = "text";
                el.name = param.name;
                el.id = param.name;
                if (args && args[i]) {
                    var arg = /\s*'([^']*)'\s*/.exec(args[i])[1];
                    el.value = arg;
                }
                break;
            case "image":
            case "media":
                var el = document.createElement("input");
                el.type = "text";
                el.name = param.name;
                el.id = param.name;
                if (args && args[i]) {
                    var arg = /\s*'([^']*)'\s*/.exec(args[i])[1];
                    el.value = arg;
                }
                paramDiv.appendChild(el);
                el = document.createElement("div");
                el.style.cssFloat = "left";
                var span = document.createElement("span");
                var type = param.type == "image" ? "image" : "file";
                span.innerHTML = getBrowserHTML(param.name + "_browser", param.name, type, "theme_advanced_image");
                el.appendChild(span);
                break;
            case "integer":
                var el = document.createElement("input");
                el.type = "text";
                el.name = param.name;
                el.id = param.name;
                if (args && args[i]) {
                    var arg = /\s*(\d+)\s*/.exec(args[i])[1];
                    el.value = arg;
                }
                break;
            case "boolean":
                var el = document.createElement("input");
                el.type = "checkbox";
                el.name = param.name;
                el.id = param.name;
                if (args && args[i]) {
                    var arg = /\s*(.*)\s*/.exec(args[i])[1];
                    el.checked = arg == "true" || arg == "1";
                }
                break;
            case "enum":
                var el = document.createElement("select");
                el.name = param.name;
                el.id = param.name;
                for (k in param.values) {
                    if (param.values instanceof Array) {
                        var value = display = param.values[k];
                    } else {
                        var value = k;
                        var display = param.values[k];
                    }
                    var option = document.createElement("option");
                    option.value = value;
                    option.appendChild(document.createTextNode(display));
                    el.appendChild(option);
                }
                if (args && args[i]) {
                    var arg = /\s*'([^']*)'\s*/.exec(args[i])[1];
                    el.value = arg;
                }
                break;
            default:
                var el = null;
            }
            if (el) paramDiv.appendChild(el)
            paramDiv.appendChild(document.createElement("br"));
        }
    },

    insert: function() {
        var form = document.forms["callbuilder"];
        var call = form.elements.call.value;
        var params = calls[call];
        var args = [];
        for (var i = 0; i < params.length; i++) {
            var param = params[i];
            switch (param.type) {
            case "string":
            case "image":
            case "media":
                var arg = form.elements[param.name].value;
                arg = "'" + arg + "'";
                args.push(arg);
                break;
            case "integer":
                var arg = form.elements[param.name].value;
                args.push(arg)
                break;
            case "enum":
                var arg = form.elements[param.name].value;
                arg = "'" + arg + "'";
                args.push(arg);
                break;
            case "boolean":
                var arg = form.elements[param.name].checked;
                arg = arg ? "true" : "false";
                args.push(arg);
                break;
            }
        }
        var replace = tinyMCEPopup.getWindowArg("replace_content");
        output = (replace ? "" : "<div>")
            + "{{{PLUGIN:"
            + call
            + "("
            + args.join(", ")
            + ");}}}"
            + (replace ? "" : "</div>");

        if (tinyMCEPopup.getWindowArg('replace_content')) {
            tinyMCEPopup.editor.execCommand('mceReplaceContent', false, output);
        } else {
            tinyMCEPopup.editor.execCommand('mceInsertContent', false, output);
        }
        tinyMCEPopup.close();
    }
}

tinyMCEPopup.onInit.add(CallBuilderDialog.init, CallBuilderDialog);
