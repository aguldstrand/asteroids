define(['handlebars'], function(Handlebars) {

this["Bifrost"] = this["Bifrost"] || {};
this["Bifrost"]["templates"] = this["Bifrost"]["templates"] || {};

this["Bifrost"]["templates"]["ui/main.tpl"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div><h1>";
  if (stack1 = helpers.hello) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.hello; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " </h1></div>";
  return buffer;
  });

return this["Bifrost"]["templates"];

});