import { Tags, Skills } from '/imports/collections/Tags';

Template.TagTree.onCreated(function () {
    Meteor.subscribe('tags');
    Meteor.subscribe('skills'); 
});

Template.TagTree.helpers({
    treeArgs: function () {
        var instance = (Template.instance()); 
        var context  = this; 

        var plugins = [ "sort" , "state", "types", "search" ];
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
            
                    var skills = [];
                    if (parentTag && parentTag.skills) {
                        skills = parentTag.getSkills().fetch();
                    } else if (parent == null) {
                    	skills = Skills.find({ categories: { $exists: true, $size: 0 } }).fetch();
                    }
                    
                    _.each(skills, function(skill) {
                        skill.category = parent;
                        skill.dbId = skill._id; 
                        skill._id = skill.category + "::" + skill.dbId;
                        skill.type = 'skill'; 
                    });
                    tags = tags.concat(skills);                    
            
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
                    defaults: {
                    	search: {
                    		show_only_matches: true, 
                    	}
                    }
                },
                "events": {
                    "changed": function (e, item, data) {
                        if (data.item_data && data.item_data.type == "tag") {
                            if (context && context.selectTag) context.selectTag(data.item_data._id);
                            if (context && context.selectedSkill) context.selectedSkill(null);
                        } else if (data.item_data && data.item_data.type == "skill") {
                        	if (context && context.selectedSkill) context.selectedSkill(data.item_data.dbId);
                        	if (context && context.selectTag) context.selectTag(null); 
                        } else {
                        	if (context && context.selectedSkill) context.selectedSkill(null);
                        	if (context && context.selectTag) context.selectTag(null); 
                        }
                    },
                    "create": function(e, item, data) { 
                        // we allow only the creation of tags 
                        if (data.parent_data && data.parent_data.type == "tag") {
                            Meteor.call("tag_insert", data.parent, "New Category"); 
                        } else {

                        }
                        return false;
                    },
                    "rename": function(e, item, data) {
                        var id = item; 
                        if (data.item_data && data.item_data.type == "skill") id = data.item_data.dbId; 
                        Meteor.call("tag_rename", id, data.text);
                        return false;
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
                        return false;
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
                        return false;
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