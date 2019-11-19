# Errors

The Membership API uses the following error codes:

### Error Code

Error Code | Meaning
---------- | -------
400 | Bad Request -- Your request is invalid.
401 | Unauthorized -- Your access token is invalid.
403 | Forbidden -- The requested resources is not accessible.
404 | Not Found -- The specified resources could not be found.
405 | Method Not Allowed -- You tried to access a resource with an invalid method.
406 | Not Acceptable -- You requested a format that isn't supported.
500 | Internal Server Error -- We had a problem with our server. Try again later.
503 | Service Unavailable -- We're temporarily offline for maintenance. Please try again later.

### Response Body
Parameter | Type | Description
--------- | ---- | -----------
error | string | Error type.
error_description | string | Human-readable error description.
