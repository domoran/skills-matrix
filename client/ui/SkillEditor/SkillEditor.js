Template.SkillEditor.onCreated(function () {
    this.skill = this.data.skill; 
    this.id = "rating_" + this.skill._id; 
});

Template.SkillEditor.onRendered(function () {
    var self = this; 
    
    this.$("#" + this.id).on('change', function (event) {
        console.log("CHANGE!"); 
        var rating = $(event.currentTarget).data("userrating");
        Meteor.call('update_skill_level', self.skill._id, rating); 
    });
});

Template.SkillEditor.helpers ({
    selectedCategory () { return 'unknown'; },
    
    userSkill () {
        var skill = 0; 
        var skillId = Template.instance().skill._id;
        var skillItem = Skills.findOne({_id: skillId});
        if (skillItem && skillItem.user_ratings) {
            var rating = skillItem.user_ratings[Meteor.userId()];
            if (rating) skill = rating; 
        }
         
        return skill; 
    },
    
    widgetId (skill) {
        return Template.instance().id; 
    },
});