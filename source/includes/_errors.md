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
422 | Unprocessable Entity -- Your request contain semantic errors.
500 | Internal Server Error -- We had a problem with our server. Try again later.

### Error Response Body
Parameter | Type | Description
--------- | ---- | -----------
error | string | Error type.
error_description | string | Human-readable error description.
message | string | Response message.
