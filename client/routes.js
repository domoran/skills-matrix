FlowRouter.route('/', {
	name: 'Skills.Edit',
	action(params, queryParams) {
		console.log(Meteor.user); 
		console.log(Meteor.user())
		if (Meteor.user()) {
			console.log("SkillsView");
			BlazeLayout.render('Application', { main: 'SkillsView' });
		} else {
			BlazeLayout.render('Application', { main: 'PleaseLogin' });
		}
		
	}
});

FlowRouter.route('/SkillMatrix', {
  name: 'Lists.show',
  action(params, queryParams) {
			 BlazeLayout.render('Application', { main: 'SkillMatrix' });
  }
});

