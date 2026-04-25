const handleControllerError = (res, error, fallbackMessage = 'Internal server error') => {
  if (error?.statusCode) {
    return res.status(error.statusCode).json({ message: error.message });
  }

  return res.status(500).json({ message: error?.message || fallbackMessage });
};

module.exports = { handleControllerError };
