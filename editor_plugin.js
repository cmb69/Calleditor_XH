/**
 * CallEditor_XH plugin for tinyMCE.
 *
 * @author Christoph Becker <cmbecker69@gmx.de>
 */

(function() {
    //Load the language file.
    tinymce.PluginManager.requireLangPack("calleditor");

    tinymce.create("tinymce.plugins.CallEditor", {
        /**
         * Initializes the plugin, this will be executed after the plugin has been created.
         * This call is done before the editor instance has finished it's initialization so use the onInit event
         * of the editor instance to intercept that event.
         *
         * @param {tinymce.Editor} ed Editor instance that the plugin is initialized in.
         * @param {string} url Absolute URL to where the plugin is located.
         */
        init: function(ed, url) {
            function insertOrEdit() {
                if (isPluginCall(tinyMCE.activeEditor.selection.getNode())) {
                    var currentNode = ed.selection.getNode();
                    ed.selection.select(currentNode, currentNode.nodeName);
                    var params = getParameters(currentNode);
                    var dialogParameters = {
                        plugin_url: url,
                        replace_content: true,
                        call: params.call,
                        params: params.params
                    };
                } else {
                    var dialogParameters = {
                        plugin_url: url,
                        replace_content: false
                    };
                }
                ed.windowManager.open(dialogSettings, dialogParameters);
            }
            var dialogSettings = {
                file : url + "/dialog.htm",
                width : 300 + parseInt(ed.getLang("calleditor.delta_width", 0)),
                height : 250 + parseInt(ed.getLang("calleditor.delta_height", 0)),
                inline : 1
            };

            // Register the command so that it can be invoked by using tinyMCE.activeEditor.execCommand('mceExample');
            ed.addCommand("mceCallEditor", insertOrEdit);

            // Register example button
            ed.addButton("calleditor", {
                title: "calleditor.desc",
                cmd: "mceCallEditor",
                image: url + "/img/calleditor.png"
            });

            // Add a node change handler, selects the button in the UI when a video call is selected
            ed.onNodeChange.add(function(ed, cm, n) {
                cm.setActive("calleditor", isPluginCall(n));
            });

            // add edit snipped option to context menu
            if (ed.plugins.contextmenu != undefined) {
                ed.plugins.contextmenu.onContextMenu.add(function(sender, menu) {
                    menu.add({
                        title: "calleditor.desc",
                        onclick: insertOrEdit
                    });
                });
            }
        },


        /**
         * Returns information about the plugin as a name/value array.
         *
         * @returns {Object} Name/value array containing information about the plugin.
         */
        getInfo: function() {
            return {
                longname: "CallEditor4tinyMCE",
                author: "Christoph M. Becker",
                authorurl: "http://3-magi.net//",
                //infourl: "http://3-magi.net/?CMSimple_XH/CallEditor4tinyMCE",
                version: "1dev1"
            };
        }
    });

    /**
     * Returns whether a node is a Video_XH plugin call.
     *
     * @param {HTMLElement} node The node to be checked.
     *
     * @returns boolean
     */
    function isPluginCall(node) {
        return /{{{PLUGIN:[^(]+\([^)]*\);}}}/.test(node.innerHTML)
    }

    /**
     * @return array
     */
    function getParameters(node) {
        var matches = /{{{PLUGIN:([^(]+)\(([^)]*)\);}}}/.exec(node.innerHTML);
        var call = matches[1];
        var params = matches[2];
        params = params.split(",");
        return {call: call, params: params}
    }

    // Register plugin
    tinymce.PluginManager.add('calleditor', tinymce.plugins.CallEditor);
})();
