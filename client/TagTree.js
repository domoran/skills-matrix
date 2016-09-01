import { Tags } from '../imports/collections/Tags';

Template.TagView.onCreated(function () {
    Meteor.subscribe('tags');
});

Template.TagView.helpers({
    treeArgs: {
        "collection": Tags,
        "subscription": "tags",
        "openAll": false,
        "mapping": {
            "text": "text",
          },
          "jstree": {
              "plugins": [
                "contextmenu",
                "dnd",
                "sort",
                "state"
              ]
            },
        "events": {
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
});