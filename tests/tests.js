function setField(fieldName, value){
  $$("[name="+fieldName+']').first().setValue(value);
}

var ValidationTest = Evidence.TestCase.extend('ValidationTest', {
  setUp: function(){
    this.instance = new FBF.Validate('formContainer');
  },
  tearDown: function(){
    delete this.instance;
  },
  testProperties: function(){
    this.assertIn('internalRules', this.instance);
  },
  testNotEmpty: function(){
    console.info('Starting testNotEmpty');

    setField('textTest', '');
    this.assertFalse(this.instance.internalRules.notEmpty.test('textTest'), "[Testing notEmpty with blank value]");

    setField('textTest', 'not empty');
    this.assertTrue(this.instance.internalRules.notEmpty.test('textTest'), "[Testing notEmpty with a value]");
  },
  testEmail: function(){
    console.info('Starting testEmail');

    setField('textTest', '');
    this.assertFalse(this.instance.internalRules.email.test('textTest'), "[Testing email with blank value]");

    setField('textTest', 'not an email address');
    this.assertFalse(this.instance.internalRules.email.test('textTest'), "[Testing email with a non email address]");

    setField('textTest', 'an@invalid-email-address');
    this.assertFalse(this.instance.internalRules.email.test('textTest'), "[Testing email with an invalid email address]");

    setField('textTest', 'a.valid@email-address.com');
    this.assertTrue(this.instance.internalRules.email.test('textTest'), "[Testing email with an valid email address]");
  },
  testNumeric: function(){
    console.info('Starting testNumeric');

    setField('textTest', '');
    this.assertFalse(this.instance.internalRules.numeric.test('textTest'), "[Testing numeric with blank value]");

    setField('textTest', 'not alphanumeric 123');
    this.assertFalse(this.instance.internalRules.numeric.test('textTest'), "[Testing numeric with a non numeric value]");

    setField('textTest', "1213234");
    this.assertTrue(this.instance.internalRules.numeric.test('textTest'), "[Testing numeric with an numeric value]");
  },
  testMinLength: function(){
    console.info('Starting minLength of 5');

    setField('textTest', '');
    this.assertFalse(this.instance.internalRules.minLength.test('textTest', {len: 5}), "[Testing minLength with blank value]");

    setField('textTest', '1234');
    this.assertFalse(this.instance.internalRules.minLength.test('textTest', {len: 5}), "[Testing minLength with a value less than 5 chars in length]");

    setField('textTest', '12345');
    this.assertTrue(this.instance.internalRules.minLength.test('textTest', {len: 5}), "[Testing minLength with a value exactly 5 chars in length]");

    setField('textTest', '123456');
    this.assertTrue(this.instance.internalRules.minLength.test('textTest', {len: 5}), "[Testing minLength with a value more 5 chars in length]");
  },
  testMaxLength: function(){
    console.info('Starting maxLength of 5');

    setField('textTest', '');
    this.assertTrue(this.instance.internalRules.maxLength.test('textTest', {len: 5}), "[Testing maxLength with blank value]");

    setField('textTest', '1234');
    this.assertTrue(this.instance.internalRules.maxLength.test('textTest', {len: 5}), "[Testing maxLength with a value less than 5 chars in length]");

    setField('textTest', '12345');
    this.assertTrue(this.instance.internalRules.maxLength.test('textTest', {len: 5}), "[Testing maxLength with a value exactly 5 chars in length]");

    setField('textTest', '123456');
    this.assertFalse(this.instance.internalRules.maxLength.test('textTest', {len: 5}), "[Testing maxLength with a value more 5 chars in length]");
  },
  testMustMatch: function(){
    console.info('Starting mustMatch');

    setField('passwordTest', '');
    setField('passwordTest2', '');
    this.assertTrue(this.instance.internalRules.mustMatch.test('passwordTest', {match: 'passwordTest2'}), "[Testing mustMatch with both fields blank]");

    setField('passwordTest', '1234');
    setField('passwordTest2', '');
    this.assertFalse(this.instance.internalRules.mustMatch.test('passwordTest', {match: 'passwordTest2'}), "[Testing mustMatch with field 1 blank]");

    setField('passwordTest', '');
    setField('passwordTest2', '1234');
    this.assertFalse(this.instance.internalRules.mustMatch.test('passwordTest', {match: 'passwordTest2'}), "[Testing mustMatch with field 2 blank]");

    setField('passwordTest', '1234');
    setField('passwordTest2', '1234');
    this.assertTrue(this.instance.internalRules.mustMatch.test('passwordTest', {match: 'passwordTest2'}), "[Testing mustMatch with a identical values in both fields]");
  },
  testTime: function(){
    console.info('Starting time');

    setField('textTest', '');
    this.assertFalse(this.instance.internalRules.time.test('textTest'), "[Testing time with blank value]");

    setField('textTest', '15ddcc234234');
    this.assertFalse(this.instance.internalRules.time.test('textTest'), "[Testing with an unformated value]");

    setField('textTest', '24:61:61');
    this.assertFalse(this.instance.internalRules.time.test('textTest'), "[Testing with an valid but properly formatted value]");

    setField('textTest', '23:59:59');
    this.assertTrue(this.instance.internalRules.time.test('textTest'), "[Testing with a valid, properly formatted value]");
  }
});