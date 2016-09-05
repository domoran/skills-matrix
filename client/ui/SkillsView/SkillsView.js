import { Tags, Skills} from '/imports/collections/Tags';

Template.SkillsView.events ({
    'submit .js-skill-create' : function (event, instance) {
        event.preventDefault();
        var skillTitle = event.target.skillTitle.value;
        var category   = instance.selectedTag.get(); 
        
        Meteor.call('skill_create', skillTitle, category); 
        event.target.skillTitle.value = ""; 
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
    
    allSkills() {
        return Skills.find({});
    },
});