const Joi = require('joi'); 
 
// Schema data khusus BANK
const messageDto  = Joi.object({
  value: Joi.string().required(),
  name: Joi.string().required(), 
});
 
module.exports = {
    messageDto, 
};
