var validators = {
  'required-text': {
    notEmpty: true
  },
  'required-select': {
    notEmpty: true
  },
  'numeric-only': {
    numeric: true
  },
  'email-address': {
    email: {
      allowEmpty: false
    },
    notEmpty: true
  },
  'date-ddmmyy': {
    date: {
      format: 'mdy'
    },
    notEmpty: true
  },
  'min-max-length': {
    minLength: {
      len: 4,
      message: 'Value must be at least 4 characters long.'
    },
    maxLength: {
      len: 10,
      message:  'Value must be at most 10 characters long.'
    }
  },
  'select-one': {
    requiredGroup: {
      numRequired: 1,
      message: 'Please select an option'
    }
  },
  'select-three': {
    requiredGroup: {
      numRequired: 3,
      message: 'Please select 3 options'
    }
  },
  'password1': {
    notEmpty: true
  },
  'password2': {
    mustMatch: {
      match: 'password1'
    },
    notEmpty: true
  },
  'credit-card': {
    notEmpty: true,
    creditCard: true

  },
  'required-checkbox': {
    notEmpty: true
  }
};

var customRules = {
  'creditCard': {
    test: /^[0-9]{16}$/,
    defaultErrorMsg: 'Please enter a validate credit card number.'
  }//,
  // 'ddmmyyyy': {
  //   test: /^([123]0|[012][1-9]|31)\/(0[1-9]|1[012])\/(19[0-9]{2}|2[0-9]{3})$/g,
  //   defaultErrorMsg: 'Please enter a date in the following format: dd/mm/yyyy.'
  // }
};

document.observe("dom:loaded", function() {
  var v = new FBF.Validate($$('form.validate').first(), validators, { customRules: customRules, debug: true, validateOnBlur: true });
});