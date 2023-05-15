const STATUS = {
  SUCCESSFUL: 'successful',
  PENDING: 'pending',
  REJECT: 'reject',
  CANCEL: 'cancel'
};

const responseMessages = {
  INVALID_USERNAME: 'Please enter valid name.',
  INVALID_PASSWORD: 'Password Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character.',
  TOKEN_IS_REQUIRED: 'Link is not valid.',
  DATE_TIME_VALIDATION: 'A valid date time format is required.',
  VALID_END_TIME: 'End time must be more than start time.',
  ID_VALIDATION: 'Valid id is required.'
};

module.exports = {
  responseMessages,
  STATUS
};
