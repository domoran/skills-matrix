export const Tags = new Mongo.Collection("Tags");


Tags.helpers({
    childs () {
        return Tags.find({parent: this._id });
    },
    
    getSkills () {
        return Skills.find({ _id: {$in: this.skills} });
    },
});



export const Skills = new Mongo.Collection("Skills");

if (!Meteor.isServer) {
    window.Tags = Tags;
}