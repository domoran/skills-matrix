import { Ratings } from '/imports/collections/Tags';

Template.SkillEditor.onCreated(function () {
    this.subscribe("user_ratings");
    this.id =  this.data.skill._id;
    this.widgetId = "rating_" + this.id; 
    
    this.updating = false; 
    this.level = new ReactiveVar();
    
    var self = this; 
    
    this.autorun(function (c) {
        var rating = Ratings.findOne({ user: Meteor.userId(), skill: self.id });

        // Ignore change events that happen to to the update of the DB
        self.updating = true; 
        if (rating && rating.level) {
            self.level.set(rating.level); 
        } else {
            self.level.set(0);
        }
        
        // Ensure that we block change events until after the Screen has been updated!
        Tracker.afterFlush(function () { self.updating = false; });
    });
});

Template.SkillEditor.onRendered(function () {
    var self = this; 
    
    this.$("#" + this.widgetId).on('change', function (event) {
        var level = $(event.currentTarget).data("userrating");
        if (self.updating || typeof level == "undefined") return;

        Meteor.call('update_skill_level', self.id, level);
    });
});

Template.SkillEditor.events({
    "click .js-remove-skill-level": function (event, instance) {
        Meteor.call('remove_skill_level', instance.id); 
    } 
});

Template.SkillEditor.helpers ({
    level () { return Template.instance().level.get() },
    widgetId (skill) { return Template.instance().widgetId; },
});