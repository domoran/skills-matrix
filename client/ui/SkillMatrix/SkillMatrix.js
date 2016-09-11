import { Tags, Skills, Ratings} from '/imports/collections/Tags';

Template.SkillMatrix.onCreated(function () {
	this.subscribe('skillsmatrix');
	
	var self = this; 
	
	self.skills = new ReactiveVar(); 
	self.ratings = new ReactiveVar(); 
	self.tags  = new ReactiveVar(); 
	self.users   = new ReactiveVar(); 
	
	
	this.autorun(function (c) {
		self.skills.set(Skills.find({}).fetch());
		console.log("Fetched skills!"); 
	});
	this.autorun(function (c) {
		self.ratings.set(Ratings.find({}).fetch());
		console.log("Fetched ratings!"); 
	});
	this.autorun(function (c) {
		self.tags.set(Tags.find({}).fetch());
		console.log("Fetched tags!"); 
	});
	this.autorun(function (c) {
		self.users.set(Meteor.users.find({}).fetch());
		console.log("Fetched users!"); 
	});
});

Template.SkillMatrix.helpers({
	userCount () {
		return Template.instance().users.get().length;
	},
});