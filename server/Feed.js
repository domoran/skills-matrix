import { Skills, Tags, Ratings} from '../imports/collections/Tags';

let escapeXml = (unsafe) => {
    if (!unsafe) return ""; 
    if (!unsafe.replace) return unsafe; 
    return unsafe.replace(/[<>&'"]/g, function (c) {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
        }
    });
}

let makeNode = (name, val) => {
    return "<" + name + ">" + escapeXml(val) + "</" + name + ">"; 
}

let makeEntry = (user, category, skill, level) => {
    return "<entry>" + makeNode("user", user) + makeNode("category", category) + makeNode("skill", skill) + makeNode("level", level) + "</entry>"; 
}

// Listen to incoming HTTP requests, can only be used on the server
WebApp.connectHandlers.use("/feed", function(req, res, next) {

  var items = []; 
  
  var Categories = Tags.find({}).fetch();
  
  let getFullName = function (category) {
      var parent = null; 
      if (category.parent) parent = _.findWhere(Categories, {_id: category.parent}); 
      return (!parent ? "" :  getFullName(parent)) + "/" + category.text;  
  }
  
  _.each(Categories, function (category) {
      category.fullname = getFullName(category); 
  });
  
  
  Categories = _.indexBy(Categories, "_id");  
  
  var rates = Ratings.aggregate([
       { $lookup: { from: "Skills", localField: "skill", as: "skill", foreignField: "_id"} },
       { $lookup: { from: "users" , localField: "user", as: "user"  , foreignField: "_id"} },
       { $unwind: "$skill"},
       { $unwind: "$user"},
       { $project: { username: "$user.username", level: "$level", skill: "$skill.text", categories: "$skill.categories" }  },
       { $unwind: "$categories"},
       { $lookup: { from: "Tags" , localField: "categories", as: "category" , foreignField: "_id"} },
       { $project: {username: 1, level: 1, skill: 1, category: "$category._id" }},
       { $unwind: "$category"},
  ]); 

  var skillsWithoutRatings = Skills.aggregate( [
            { $lookup: {from: "Ratings", localField: "_id", as: "ratings", foreignField: "skill"} },
            { $match: { ratings : {$size: 0} } },
            { $unwind: "$categories" },
  ]);
  
  _.each(rates, function (rating) {
      var user = rating.username; 
      var category = Categories[rating.category].fullname; 
      var skill    = rating.skill; 
      var level = rating.level; 
      items.push(makeEntry(user, category, skill, level)); 
  });

  _.each(skillsWithoutRatings, function (skill) {
      var user = ""; 
      var category = Categories[skill.categories].fullname; 
      var skillname = skill.text; 
      var level = null; 
      items.push(makeEntry(user, category, skillname, level)); 
  });
  
    
  res.writeHead(200, "", { "Content-Type" : "text/xml" });
  res.write("<data>"); 
  res.write(items.join(""));
  res.end("</data>");
});