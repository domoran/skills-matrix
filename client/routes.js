FlowRouter.route('/', {
	name: 'Skills.Edit',
	action(params, queryParams) {
	    Tracker.autorun (function () {
	        if (Meteor.user()) {
	            BlazeLayout.render('Application', { main: 'SkillsView' });
	        } else {
	            BlazeLayout.render('Application', { main: 'PleaseLogin' });
	        }
	    });
	}
});

Accounts.onLogin(function() {
    var path = FlowRouter.current().path;
    // we only do it if the user is in the login page
      FlowRouter.go("/");
  });

FlowRouter.route('/SkillMatrix', {
  name: 'Lists.show',
  action(params, queryParams) {
			 BlazeLayout.render('Application', { main: 'SkillMatrix' });
  }
});

