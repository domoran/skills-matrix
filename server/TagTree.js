import { Skills, Tags } from '../imports/collections/Tags';

Meteor.publish("tags", function () {
    return Tags.find({});  
 });


Meteor.methods({
    tag_insert(parentId, text) {
        if (!Tags.findOne({_id: parentId})) parentId = null; 
        
        return Tags.insert({ text, parent: parentId});  
    }, 
    
    tag_rename(id, text) {
        Tags.update( { _id : id }, { $set: {text: text }});
        Skills.update( { _id : id }, { $set: {text: text }});
    },

    tag_remove(id) {
        var Tag = Tags.findOne({_id : id});
        console.log("Remove : " + id); 
        console.log(Tag);
        if (Tag) Tag.remove(); 
    },
    
    tag_move(id, parentId) {
        if (parentId == "#") parentId = null;
        if (parentId == null || Tags.findOne({_id: parentId })) {
            Tags.update( { _id : id }, { $set: {parent: parentId }});
        }
    },
    
});

Meteor.startup(function () {
    if (!Tags.findOne({parent: null})) Tags.insert({ text: "First Node", parent: null });
});