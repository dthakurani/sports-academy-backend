const STATUS = {
  SUCCESSFUL: 'successful',
  PENDING: 'pending',
  REJECT: 'reject',
  CANCEL: 'cancel'
};

const responseMessages = {
  INVALID_USERNAME: 'please enter valid name',
  INVALID_PASSWORD: 'Password Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character',
  TOKEN_IS_REQUIRED: 'link is not valid.',
  DATE_TIME_VALIDATION: 'a valid date time format is required.',
  VALID_END_TIME: 'end time must be more than start time',
  INVALID_VALUE_FOR_STATUS: `status must be one of ${Object.values(STATUS)}`
};

module.exports = {
  responseMessages,
  STATUS
};
