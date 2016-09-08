import { Skills, Tags, Ratings} from '../imports/collections/Tags';

Meteor.publish("skills", function () {
    return Skills.find({});  
 });

Meteor.publish("user_ratings", function () {
    return Ratings.find({ user: this.userId });
})

Meteor.methods({
    skill_create(text, category) {
        var skillId = Skills.insert({ text });
        Tags.update( {_id: category}, { $addToSet: { skills: skillId} });
    }, 
    
    update_skill_level(skillId, level) {
        Ratings.update({ user: this.userId, skill: skillId }, { $set: { user:this.userId, skill: skillId, level: level }}, { upsert: true });
    },
    
    remove_skill_level(skillId) {
       Ratings.remove({ user: this.userId, skill: skillId });
    },
    
});

Meteor.startup(function () {
    if (!Tags.findOne({parent: null})) Tags.insert({ text: "First Node", parent: null });
});