export const Tags = new Mongo.Collection("Tags");



Tags.helpers({
    childs () {
        return Tags.find({parent: this._id });
    },
    
    getSkills () {
        var skills = this.skills || []; 
        return Skills.find({ _id: {$in: skills} }, { user_ratings: 0, sort: {text: 1}}); 
    },
    
    remove () {
        _.each(this.childs().fetch(), function (child) {
            child.remove(); 
        });
        
        Tags.remove( {_id : this._id });
        Skills.update ( {}, { $pull: { categories: this._id }}, {multi: true});
        
        if (Tags.find().count() < 1) Tags.insert({ text: 'New Category', parent: null, skills: []});
    },
});



export const Skills = new Mongo.Collection("Skills");

Skills.getUncategorized = function () {
    return Skills.find({ categories: { $exists: true, $size: 0 } });
}

export const Ratings = new Mongo.Collection("Ratings");

export const SkillMatrixRows = new Mongo.Collection("SkillMatrixRows"); 
