
export const Tags = new Mongo.Collection("Tags");


Tags.helpers({
    childs () {
        return Tags.find({parent: this._id });
    }
});



export const Skills = new Mongo.Collection("Skills");
