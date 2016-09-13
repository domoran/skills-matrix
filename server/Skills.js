import { Skills, Tags, Ratings} from '../imports/collections/Tags';

Meteor.publish("skills", function () {
    return Skills.find({});  
 });

Meteor.publish("user_ratings", function () {
    return Ratings.find({ user: this.userId });
})

Meteor.publish("ratings", function () {
    return Ratings.find(); 
});


Meteor.methods({
    skill_create(text, category) {
    	var categories = category ? [category] : []; 
        var skillId = Skills.insert({ text , categories: categories});
        if (category) Tags.update( {_id: category}, { $addToSet: { skills: skillId} });
        
    }, 
    
    skill_add_category (id, category) {
    	if (category) Tags.update( {_id: category}, { $addToSet: { skills: id} });
        if (category) Skills.update ({_id: id }, { $addToSet: { categories: category }});
    },

    skill_unsassign (id, category) {
        Tags.update( {_id: category}, { $pull: { skills: id} });
        Skills.update ( { _id: id }, { $pull: {categories: category }}); 
        
        var skill = Skills.findOne({_id: id});
        var ratings = Ratings.find({skill: id }).fetch();
        console.log(ratings); 
        if (ratings.length == 0) Skills.remove({_id: id}); 
    },
    
    skill_move_category (id, old_category, category) {
    	if (category) Tags.update( {_id: category    }, { $addToSet: { skills: id} });
        if (category) Skills.update ({_id: id }, { $addToSet: { categories: category }});
        
        Tags.update( {_id: old_category}, { $pull    : { skills: id} });
        Skills.update ( { _id: id }, { $pull: {categories: old_category }}); 
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