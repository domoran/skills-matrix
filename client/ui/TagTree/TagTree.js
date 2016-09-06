import { Tags, Skills } from '/imports/collections/Tags';

Template.TagTree.onCreated(function () {
    Meteor.subscribe('tags');
    Meteor.subscribe('skills'); 
});

window.Skills = Skills; 

Template.TagTree.helpers({
    treeArgs: function () {
        var instance = (Template.instance()); 
        var context  = this; 

        var plugins = [ "sort" , "state", "types" ];
        if (context.enableEdit) { 
            plugins.push("contextmenu"); 
            plugins.push("dnd"); 
        } 
        
        var context = {
                "collection": Tags,
                "subscription": "tags",
                "getNodes": function (parent) {
                    var tags = Tags.find( {parent: parent} ).fetch();
                    // _.each(tags, function(tag) { tag.type = 'tag' });
            
                    var parentTag = Tags.findOne({_id: parent});
            
                    if (parentTag && parentTag.skills) {
                        var skills = parentTag.getSkills().fetch();
                        _.each(skills, function(skill) { skill.type = 'skill'; });
                        tags = _.extend(tags, skills);
                    }
            
                    return tags; 
                },
        
                processNode (node, item)  {
                    node.type = item.type; 
                },
        
                "openAll": false,
                "mapping": {
                    "text": "text",
                },
                "jstree": {
                    plugins: plugins,
                    types : {
                        "skill" : {
                            "icon" : "glyphicon glyphicon-briefcase",
                        },
                    },
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
                        console.log(arguments);  
                        return false; 
                        Meteor.call("tag_move", item, data.parent);
                    },
                }
        };
        
        return context; 
    }
});