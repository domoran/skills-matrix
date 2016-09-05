import { Skills, Tags} from '../imports/collections/Tags';

Meteor.publish("skills", function () {
    return Skills.find({});  
 });


Meteor.methods({
    skill_create(text, category) {
        var skillId = Skills.insert({ text });
        Tags.update( {_id: category}, { $addToSet: { skills: skillId} });
    }, 
    
});

Meteor.startup(function () {
    if (!Tags.findOne({parent: null})) Tags.insert({ text: "First Node", parent: null });
});