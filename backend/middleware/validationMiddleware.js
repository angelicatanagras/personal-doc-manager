const HttpError = require('../errors/HttpError');

const validateRequiredString = (value, fieldName) => {
  if (typeof value !== 'string' || !value.trim()) {
    throw new HttpError(400, `${fieldName} is required`);
  }
};

const handleValidationError = (res, error) => {
  if (error?.statusCode) {
    return res.status(error.statusCode).json({ message: error.message });
  }

  return res.status(400).json({ message: error.message || 'Invalid request' });
};

const validateRegisterPayload = (req, res, next) => {
  try {
    validateRequiredString(req.body.name, 'Name');
    validateRequiredString(req.body.email, 'Email');
    validateRequiredString(req.body.password, 'Password');
    next();
  } catch (error) {
    handleValidationError(res, error);
  }
};

const validateLoginPayload = (req, res, next) => {
  try {
    validateRequiredString(req.body.email, 'Email');
    validateRequiredString(req.body.password, 'Password');
    next();
  } catch (error) {
    handleValidationError(res, error);
  }
};

const validateProfileUpdatePayload = (req, res, next) => {
  try {
    if (req.body.name !== undefined) validateRequiredString(req.body.name, 'Name');
    if (req.body.email !== undefined) validateRequiredString(req.body.email, 'Email');
    next();
  } catch (error) {
    handleValidationError(res, error);
  }
};

const validateDocumentUpdatePayload = (req, res, next) => {
  try {
    if (req.body.name !== undefined) validateRequiredString(req.body.name, 'Document name');
    next();
  } catch (error) {
    handleValidationError(res, error);
  }
};

const validateFolderPayload = (req, res, next) => {
  try {
    validateRequiredString(req.body.name, 'Folder name');
    next();
  } catch (error) {
    handleValidationError(res, error);
  }
};

const validateMoveDocumentPayload = (req, res, next) => {
  try {
    validateRequiredString(req.body.documentId, 'Document ID');
    next();
  } catch (error) {
    handleValidationError(res, error);
  }
};

const validateAdminUserPayload = (req, res, next) => {
  try {
    validateRequiredString(req.body.name, 'Name');
    validateRequiredString(req.body.email, 'Email');
    validateRequiredString(req.body.password, 'Password');
    next();
  } catch (error) {
    handleValidationError(res, error);
  }
};

module.exports = {
  validateRegisterPayload,
  validateLoginPayload,
  validateProfileUpdatePayload,
  validateDocumentUpdatePayload,
  validateFolderPayload,
  validateMoveDocumentPayload,
  validateAdminUserPayload,
};
