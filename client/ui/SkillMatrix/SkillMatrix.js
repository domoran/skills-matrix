import { Tags, Skills, Ratings, SkillMatrixRows } from '/imports/collections/Tags';
import { TabularTables } from '/imports/collections/Tables';
import { Session } from 'meteor/session';


Template.SkillMatrix.onCreated(function () {
    var self = this; 
    
    this.autorun(function () {
        self.subscribe("userlist"); 
        self.subscribe("tags");
        self.subscribe("skills");
        self.subscribe("ratings");
    });
});


Template.SkillMatrix.helpers({
    users () { 
        return Meteor.users.find();
    },
    
    categories() { 
        return [{_id: null, text: "Uncategorized Skills"}]
               .concat( Tags.find().fetch() ); 
    },
    
    skills(category) { 
        if (!category._id) {
            return Skills.getUncategorized(); 
        } else {
            return category.getSkills(); 
        }
    },
    
    getRatings(user, skill) {
        var rating = Ratings.findOne({ user: user._id, skill: skill._id });
        if (rating) return rating.level; 
        return "x"; 
    },
});