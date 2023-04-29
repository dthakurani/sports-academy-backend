const BOOKING_TYPE = {
  SINGLE: 'single',
  MULTIPLE: 'multiple'
};

const STATUS = {
  SUCCESSFUL: 'successful',
  PENDING: 'pending',
  REJECT: 'reject',
  CANCEL: 'cancel'
};

const responseMessages = {
  USERNAME_IS_REQUIRED: 'username is required field.',
  USERNAME_MUST_BE_STRING: 'username must be a valid string.',
  EMAIL_IS_REQUIRED: 'email is a required field.',
  INVALID_EMAIL: 'email must be valid string.',
  PASSWORD_IS_REQUIRED: 'password is required field.',
  INVALID_PASSWORD: 'password must be a valid field.',
  TOKEN_IS_REQUIRED: 'link is not valid.',
  COURT_NAME_MUST_BE_STRING: 'court name must be a valid string.',
  COURT_NAME_IS_REQUIRED: 'court name is a required field.',
  INVALID_VALUE_FOR_BOOKING_TYPE: `booking type must be one of ${Object.values(BOOKING_TYPE)}`,
  INVALID_VALUE_FOR_POSITIVE_INTEGER: 'value must be a positive integer.',
  INVALID_VALUE_FOR_NUMBER: 'The number is required',
  ID_VALIDATION: 'Invalid ID',
  ID_REQUIRED: 'ID is a required field.',
  DATE_TIME_VALIDATION: 'a valid date time format is required.',
  VALID_END_TIME: 'end time must be more than strt time',
  INVALID_VALUE_FOR_STATUS: `status must be one of ${Object.values(STATUS)}`,
  VALID_PAGE_NUMBER_IS_REQUIRED: 'page number is a required field.'
};

module.exports = {
  responseMessages,
  STATUS
};
