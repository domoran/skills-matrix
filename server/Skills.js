import { Skills, Tags} from '../imports/collections/Tags';

Meteor.publish("skills", function () {
    return Skills.find({});  
 });

Meteor.methods({
    skill_create(text, category) {
        var skillId = Skills.insert({ text });
        Tags.update( {_id: category}, { $addToSet: { skills: skillId} });
    }, 
    
    update_skill_level(skillId, level) {
        var rating = {};
        rating[this.userId] = level; 
        Skills.update({_id:skillId}, { $set: { user_ratings: rating } });
    },
    
});

Meteor.startup(function () {
    if (!Tags.findOne({parent: null})) Tags.insert({ text: "First Node", parent: null });
});