interface IApiError extends Error {
  response?: {
    data?: {
      error?: {
        message: string;
      };
    };
  };
  error?: {
    error?: {
      message: string;
    };
    message?: string;
  };
}

export function handleApiError(
  error: IApiError,
  defaultMessage: string = "Something went wrong"
) {
  if (!error) return defaultMessage;

  // Strapi formatted error
  if (error?.response?.data?.error?.message) {
    return error.response.data.error.message;
  }

  // Strapi new error format
  if (error?.error?.message) {
    return error.error.message;
  }

  // Axios network error
  if (error?.message) {
    return error.message;
  }

  return defaultMessage;
}
