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
        
        var args = {
                "collection": Tags,
                "subscription": "tags",
                "getNodes": function (parent) {
                    var tags = Tags.find( {parent: parent} ).fetch();
                    _.each(tags, function(tag) { tag.type = 'tag' });
            
                    var parentTag = Tags.findOne({_id: parent});
            
                    if (parentTag && parentTag.skills) {
                        var skills = parentTag.getSkills().fetch();
                        _.each(skills, function(skill) {
                            skill.category = parent;
                            skill.dbId = skill._id; 
                            skill._id = skill.category + "::" + skill.dbId;
                            skill.type = 'skill'; 
                        });
                        tags = _.extend(tags, skills);
                    }
            
                    return tags; 
                },
                
                openAll: true,
        
                processNode (node, item)  {
                    node.type = item.type; 
//                    node.text = node.text + "(" + node.id + ")"; 
                },
        
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
                        if (data.item_data && data.item_data.type == "tag") {
                            if (context && context.selectTag) context.selectTag(data.item_data._id);
                        }
                    },
                    "create": function(e, item, data) { 
                        // we allow only the creation of tags 
                        if (data.parent_data && data.parent_data.type == "tag") {
                            Meteor.call("tag_insert", data.parent, "New Category"); 
                        } else {

                        }
                    },
                    "rename": function(e, item, data) {
                        var id = item; 
                        if (data.item_data && data.item_data.type == "skill") id = data.item_data.dbId; 
                        Meteor.call("tag_rename", id, data.text);
                    },
                    "delete": function (e, item, data) {
                        if (data.item_data) {
                            if (data.item_data.type == "tag") {
                                Meteor.call("tag_remove", data.item_data._id)
                            } else if (data.item_data.type == "skill" ) {
                                Meteor.call("skill_unsassign", data.item_data.dbId, data.item_data.category);
                            } else {
                                // invalid type? 
                            }
                            
                        }
                    },
                    "copy": function(e, item, data) {
                        if (data.item_data) {
                            // fix stuff for root node
                            if (data.parent == "#") {
                                data.parent_data = { type: "tag" };
                                data.parent = null; 
                            }
                            
                            if (data.parent_data && data.parent_data.type == "tag") {
                                if (data.item_data.type == "tag") {
                                    Meteor.call("tag_insert", data.parent, data.parent_data.text); 
                                } else {
                                    Meteor.call("skill_add_category", data.item_data.dbId, data.parent);
                                }
                            }
                        }
                    },
                    "move": function(e, item, data) { 
                        // fix stuff for root node
                        if (data.parent == "#") {
                            data.parent_data = { type: "tag" };
                            data.parent = null; 
                        }
                        
                        if (data.parent_data && data.parent_data.type == "tag") {
                            if (data.item_data && data.item_data.type == "tag") {
                                Meteor.call("tag_move", item, data.parent);
                            } else if (data.item_data && data.item_data.type == "skill") {
                                Meteor.call("skill_move_category", data.item_data.dbId, data.item_data.category, data.parent);
                            } else {
                                // invalid type
                            }
                        } else {
                            // invalid parent type
                        }
                        return false; 
                    },
                }
        };
        
        return args; 
    }
});