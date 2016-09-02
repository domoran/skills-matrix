import { Tags } from '/imports/collections/Tags';

Template.TagTree.onCreated(function () {
    Meteor.subscribe('tags');
});

Template.TagTree.helpers({
    treeArgs: function () {
        var instance = (Template.instance()); 
        var context  = this; 

        var plugins = [ "sort", "state" ];
        if (context.enableEdit) { plugins.push("contextmenu"); plugins.push("dnd"); } 
        
        return {
        "collection": Tags,
        "subscription": "tags",
        "openAll": false,
        "mapping": {
            "text": "text",
        },
        "jstree": {
            plugins: plugins,
        },
        "events": {
          "changed": function (e, item, data) {
              if (item && item[0]) {
                  if (context && context.selectTag) context.selectTag(item[0]);
              }
          },
          "create": function(e, item, data) { 
              Meteor.call("tag_insert", data.parent, "New Tag"); 
          },
          "rename": function(e, item, data) { 
              Meteor.call("tag_rename", item, data.text); 
          },
          "move": function(e, item, data) { 
              Meteor.call("tag_move", item, data.parent);
          },
        }
      }  
    }
});