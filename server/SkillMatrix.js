import { Skills, Tags, Ratings} from '../imports/collections/Tags';

Meteor.publish("userlist", function () {
    return Meteor.users.find({}, {fields: { username: 1}}); 
});
