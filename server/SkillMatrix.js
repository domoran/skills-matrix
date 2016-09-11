Meteor.publish("skillmatrix", function () {
    return [
            Meteor.users.find({}, { fields : {'username' : 1 }}),
            Skills.find({}, {fields: { text: 1}}),
            Tags.find({}, {fields: {text: 1}}),
            Ratings.find({}),
    ];	
 });