var FBF = window.FBF||{};

/**
 *  class FBF.Rule
 **/
FBF.Rule = Class.create({
  initialize : function(rule, errorMessage){
    this.errorMsg = errorMessage;
    this.test = Object.prototype.toString.call(rule).match('RegExp') ? function(field){ return rule.test($F(field)); } : rule;
    this.type = Object.isFunction(rule) ? 'function' : 'regex';
  }
});

/**
 *  class FBF.Validate
 **/
FBF.Validate = Class.create({
  /**
   *  Validate#initialize(el, validators, options)
   *  - el(String): ID of the element containing the form to validate
   *  -
   **/
  initialize: function(el, validators, options){
    // rules return TRUE if the test passes
    this.internalRules = {
      date: new FBF.Rule(function(field, options){
        var regex = {
          dmy: new RegExp("%^(?:(?:31(\\/|-|\\.|\\x20)(?:0?[13578]|1[02]))\\1|(?:(?:29|30)(\\/|-|\\.|\\x20)(?:0?[1,3-9]|1[0-2])\\2))(?:(?:1[6-9]|[2-9]\\d)?\\d{2})$|^(?:29(\\/|-|\\.|\\x20)0?2\\3(?:(?:(?:1[6-9]|[2-9]\\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\\d|2[0-8])(\\/|-|\\.|\\x20)(?:(?:0?[1-9])|(?:1[0-2]))\\4(?:(?:1[6-9]|[2-9]\\d)?\\d{2})$%"),
          mdy: new RegExp("%^(?:(?:(?:0?[13578]|1[02])(\\/|-|\\.|\\x20)31)\\1|(?:(?:0?[13-9]|1[0-2])(\\/|-|\\.|\\x20)(?:29|30)\\2))(?:(?:1[6-9]|[2-9]\\d)?\\d{2})$|^(?:0?2(\\/|-|\\.|\\x20)29\\3(?:(?:(?:1[6-9]|[2-9]\\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:(?:0?[1-9])|(?:1[0-2]))(\\/|-|\\.|\\x20)(?:0?[1-9]|1\\d|2[0-8])\\4(?:(?:1[6-9]|[2-9]\\d)?\\d{2})$%"),
          ymd: new RegExp("%^(?:(?:(?:(?:(?:1[6-9]|[2-9]\\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00)))(\\/|-|\\.|\\x20)(?:0?2\\1(?:29)))|(?:(?:(?:1[6-9]|[2-9]\\d)?\\d{2})(\\/|-|\\.|\\x20)(?:(?:(?:0?[13578]|1[02])\\2(?:31))|(?:(?:0?[1,3-9]|1[0-2])\\2(29|30))|(?:(?:0?[1-9])|(?:1[0-2]))\\2(?:0?[1-9]|1\\d|2[0-8]))))$%"),
          dMy: new RegExp("/^((31(?!\\ (Feb(ruary)?|Apr(il)?|June?|(Sep(?=\\b|t)t?|Nov)(ember)?)))|((30|29)(?!\\ Feb(ruary)?))|(29(?=\\ Feb(ruary)?\\ (((1[6-9]|[2-9]\\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00)))))|(0?[1-9])|1\\d|2[0-8])\\ (Jan(uary)?|Feb(ruary)?|Ma(r(ch)?|y)|Apr(il)?|Ju((ly?)|(ne?))|Aug(ust)?|Oct(ober)?|(Sep(?=\\b|t)t?|Nov|Dec)(ember)?)\\ ((1[6-9]|[2-9]\\d)\\d{2})$/"),
          Mdy: new RegExp("/^(?:(((Jan(uary)?|Ma(r(ch)?|y)|Jul(y)?|Aug(ust)?|Oct(ober)?|Dec(ember)?)\\ 31)|((Jan(uary)?|Ma(r(ch)?|y)|Apr(il)?|Ju((ly?)|(ne?))|Aug(ust)?|Oct(ober)?|(Sept|Nov|Dec)(ember)?)\\ (0?[1-9]|([12]\\d)|30))|(Feb(ruary)?\\ (0?[1-9]|1\\d|2[0-8]|(29(?=,?\\ ((1[6-9]|[2-9]\\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00)))))))\\,?\\ ((1[6-9]|[2-9]\\d)\\d{2}))$/"),
          My: new RegExp("%^(Jan(uary)?|Feb(ruary)?|Ma(r(ch)?|y)|Apr(il)?|Ju((ly?)|(ne?))|Aug(ust)?|Oct(ober)?|(Sep(?=\\b|t)t?|Nov|Dec)(ember)?)[ /]((1[6-9]|[2-9]\\d)\\d{2})$%"),
          my: new RegExp("%^(((0[123456789]|10|11|12)([- /.])(([1][9][0-9][0-9])|([2][0-9][0-9][0-9]))))$%")
        };

        if(regex[options.format] === 'custom') {
          return options.customRegex.test($F(field));
        }else if(typeof regex[options.format] !== 'undefined'){
          return regex[options.format].test($F(field));
        }else{
          return false;
        }
      }, 'Please enter a date in the correct format.'),
      email: new FBF.Rule(new RegExp("^[A-Z0-9\\._%\\+\\-]+@[A-Z0-9\\.\\-]+\\.[A-Z]{2,4}$", "i"), 'Must be a valid email address.'),
      numeric: new FBF.Rule(new RegExp("^[0-9]+\\.*[0-9]*$"), 'Must contain only numbers (and an optional decimal point).'),
      notEmpty: new FBF.Rule(function(field){ return ( ($F(field) !== null) && ($F(field).length !== 0) );  }, 'This is a required field.'),
      minLength: new FBF.Rule(function(field, options){ return $F(field).length >= options.len; }, 'Value is not long enough.'),
      maxLength: new FBF.Rule(function(field, options){ return $F(field).length <= options.len; }, 'Value is too long.'),
      mustMatch: new FBF.Rule(function(field, options){ return $F(field) === $F(options.match); }, 'Fields do not match.'),
      time: new FBF.Rule(/^((0?[1-9]|1[012])(:[0-5]\d){0,2}([AP]M|[ap]m))$|^([01]\d|2[0-3])(:[0-5]\d){0,2}$/, 'Please enter a time in the correct format.'),
      requiredGroup: new FBF.Rule(function(fieldGroupName, options){ return $$('input[name='+fieldGroupName+']:checked').length === options.numRequired; }, 'Please select the required number of options')
    };

    this.element = $(el);
    this.form = this.element.down('form');

    this.options = Object.extend({
      customRules : false,
      debug: false,
      validateOnBlur: false
    }, options||{});

    this.validators = $H(validators); this.rules = $H(); this.errors = $H();

    try {
      if(typeof this.validators !== 'undefined'){
        this.build();
      } else {
        throw('no_validators'); // no validators - abort abort abort!
      }
    }catch(err){
      if(err === 'no_validators'){
        this.logMsg('No validators to process, aborting.', 'error');
      }
    }
  },
  /**
   *  Validate#addListeners()
   **/
  addListeners: function(){
    this.onSubmitListener = this.onSubmit.bind(this);
    this.element.observe('submit', this.onSubmitListener);

    if(this.options.validateOnBlur){
      this.onBlurListener = this.onBlur.bind(this);
      this.element.select('input, select, textarea').invoke('observe', 'blur', this.onBlurListener);
    }
  },
  /**
   *  Validate#addRule(ruleName, rule)
   *  - ruleName (String): The name of the rule. duh.
   *  - rule (Object): a Rule object containing the rule test details
   **/
  addRule: function(ruleName, rule){
    this.rules.set(ruleName, rule);
  },
  /**
   *  Validate#addRules()
   **/
  addRules: function(){
    for(var ruleName in this.internalRules){
      if(this.internalRules.hasOwnProperty(ruleName)){
        this.addRule(ruleName, this.internalRules[ruleName]);
      }
    }

    if(typeof this.options.customRules === 'object'){
      for(var customRuleName in this.options.customRules){
        if(this.options.customRules.hasOwnProperty(customRuleName)){
          var cr = this.options.customRules[customRuleName];
          this.addRule(customRuleName, new FBF.Rule(cr.test, cr.defaultErrorMsg));
        }
      }
    }
  },
  /**
   *  Validate#build()
   **/
  build: function(){
    this.addRules();
    this.addListeners();
  },
  /**
   *  Validate#clearErrors()
   **/
  clearErrors: function(){
    this.element.select('div.error-msg').invoke('remove');
    this.element.select('.error').invoke('removeClassName', 'error');
  },
  /**
   *  Validate#displayError()
   *  - error(String): error message text
   *  - container(Object): the element to insert the message into
   **/
  displayError: function(error, container){
    var errorDiv = new Element('div').addClassName('error-msg').update(error);
    container.addClassName('error').insert(errorDiv);
  },
  /**
   *  Validate#displayErrors()
   **/
  displayErrors: function(){
    if(this.element.hasClassName('invalid')){
      this.clearErrors();
    }else{
      this.element.addClassName('invalid');
    }

    var fields = this.errors.keys();

    fields.each(function(field){
      var container = this.element.down('[name='+field+']').up('.input');

      this.errors.get(field).each(function(error){
        this.displayError(error, container);
      }, this);
    }, this);
  },
  /**
   *  Validate#logMsg(msg, type)
   *  - msg(String): the message to log
   *  - type(String): the type of message to log
   **/
  logMsg: function(msg, type){
    if(this.options.debug){
      if(typeof console !== 'undefined' && console !== null){
        console[type](msg);
      }else{
        alert(msg);
      }
    }
  },
  /**
   *  Validate#onBlur(e)
   *  - e (Object): standard event object
   **/
  onBlur: function(e){
    this.logMsg('onBlur fired', 'info');

    var fieldRules = this.validators.get(e.target.name),
        container = this.element.down('[name='+e.target.name+']').up('.input');

    container.removeClassName('error')
             .select('.error-msg').invoke('remove');

    for(var ruleName in fieldRules){
      if(fieldRules.hasOwnProperty(ruleName)){
        var rule = this.rules.get(ruleName);

        try {
          if(typeof rule !== 'undefined'){
            var error = this.validateField(e.target.name, rule, fieldRules[ruleName]);
            if(error){
              this.displayError(error, container);
            }
          }else{
            throw('undef_rule');
          }
        } catch(err) {
          if(err === 'undef_rule') {
            this.logMsg('Undefined rule type: '+ruleName+'. Continuing from next rule.', 'warn');
          }
        }
      }
    }
  },
  /**
   *  Validate#onSubmit(e)
   *  - e (Object): standard event object
   **/
  onSubmit: function(e){
    this.logMsg('onSubmit fired', 'info');

    e.stop();
    this.errors = $H(); // clear out previous errors
    this.validateFields();

    if(this.errors.length === 0){
      if(!this.options.debug) {
        this.form.submit();
      }
    } else {
      this.displayErrors();
      this.element.down('div.error').down('input, select, textarea').focus(); // apply focus to first element in error
    }
  },
  /**
   *  Validate#validateField(field, rule, options, errorMsg)
   *  - field (String): the name attribute of the field or group to validate
   *  - rule (Object): a Rule object
   *  - options (Object): validation rule options
   **/
  validateField: function(field, rule, options){
    try {
      if(typeof rule !== 'undefined'){
        if(rule.test(field, options)) {
          return null;
        }else{
          return options.message || rule.errorMsg;
        }
      }else{
        throw('undef_rule');
      }
    } catch(err) {
      if(err === 'undef_rule') {
        this.logMsg('Undefined rule type: '+key+'. Continuing from next rule.', 'warn');
        return null;
      }
    }
  },
  /**
   *  Validate#validateFields()
   **/
  validateFields: function(){
    this.validators.keys().each(function(field){
      var fieldRules = $H(this.validators.get(field)),
          fieldErrors = $A(),
          keys = fieldRules.keys();

      keys.each(function(key){
        var rule = this.rules.get(key);

        try {
          if(typeof rule !== 'undefined'){
            fieldErrors.push(this.validateField(field, rule, fieldRules.get(key)));
          }else{
            throw('undef_rule');
          }
        } catch(err) {
          if(err === 'undef_rule') {
            this.logMsg('Undefined rule type: '+key+'. Continuing from next rule.', 'warn');
          }
        }
      }, this);

      this.errors.set(field, fieldErrors.compact());
    }, this);
  }
});