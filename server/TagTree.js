import { Tags } from '../imports/collections/Tags';

Meteor.publish("tags", function () {
    return Tags.find({});  
 });


let getChilds = function (id, childsArray) {
    _.each(Tags.find({ parent: id }).fetch(), function (item) {
        childsArray.push(item); 
        getChilds(item._id, childsArray);
    }); 
}

Meteor.methods({
    tag_insert(parentId, text) {
        console.log("Insert:" + parentId + "-->" + text);
        if (!Tags.findOne({_id: parentId})) parentId = null; 
        
        Tags.insert({ text, parent: parentId});  
    }, 
    
    tag_rename(id, text) {
        Tags.update( { _id : id }, { $set: {text: text }});
        
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