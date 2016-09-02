import { Tags } from '/imports/collections/Tags';

Template.SkillsView.events ({
    'submit js-task-create' : function (event, instance) {
        console.log("Submit!"); 
        event.preventDefault();
        return false;
    },
});

Template.SkillsView.onCreated(function () {
    Meteor.subscribe('tags'); 
    this.selectedTag = new ReactiveVar();  
});

Template.SkillsView.helpers ({
    currentCategory () {
        var selectedId = Template.instance().selectedTag.get(); 
        return Tags.findOne({_id :  selectedId});
    },
    
    log() { 
        var instance = Template.instance(); 
        return function (item) { instance.selectedTag.set(item); };
    },
    
    mySkills() {
        return [];
    },
});