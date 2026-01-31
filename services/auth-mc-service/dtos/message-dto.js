const Joi = require('joi'); 
  
const messageDto  = Joi.object({
  value: Joi.string().required(),
  name: Joi.string().required(), 
});
 
module.exports = {
    messageDto, 
};
