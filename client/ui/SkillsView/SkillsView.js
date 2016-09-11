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
    this.selectedSkill = new ReactiveVar();  
});

Template.SkillsView.helpers ({
    currentCategory () {
        var selectedId = Template.instance().selectedTag.get(); 
        return Tags.findOne({_id :  selectedId});
    },
    
    currentSkill () { 
    	var skill = Template.instance().selectedSkill.get();
    	return Skills.findOne({ _id : skill});
    },
    
    selectCallback() { 
        var instance = Template.instance(); 
        return function (item) { instance.selectedTag.set(item); };
    },
    
    selectSkillCallback () {
    	var instance = Template.instance(); 
    	return function (item) { instance.selectedSkill.set(item); };
    },
    
    skillGroups() {
        var items = Tags.find({ skills: { $exists: true, $not: {$size: 0} } }).fetch();
        var uncategorizedSkills = Skills.find({ categories: { $size: 0 }  }).fetch();
        if (uncategorizedSkills.length > 0) {
        	items.unshift({
        		text: "Uncategorized Skills",
        		getSkills: function () { return uncategorizedSkills},
        	});         	
        }
        return items; 
    },
});
