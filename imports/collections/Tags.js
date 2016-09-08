export const Tags = new Mongo.Collection("Tags");

Tags.helpers({
    childs () {
        return Tags.find({parent: this._id });
    },
    
    getSkills () {
        var skills = Skills.find({ _id: {$in: this.skills} }, { user_ratings: 0 });
        return skills; 
    },
});



export const Skills = new Mongo.Collection("Skills");

export const Ratings = new Mongo.Collection("Ratings");
