/**
 * @external res
 * @see {@link https://expressjs.com/en/api.html#res}
 */

/**
 * Class representing an HTTP Response object.
 * This tool makes it easy create and send readable (!) HTTP
 * responses with a JSON payload and custom headers.
 */
module.exports = class Response {
    /**
     * Instantiate a new HTTP Response object
     * @param {number} statusCode - HTTP status code
     * @param {Object} headers - HTTP headers
     * @param {Object} payload - Payload data
     */
    constructor(statusCode, headers, payload) {
        if (typeof statusCode !== 'number') {
            throw new TypeError(`statusCode must be a number but was ${typeof statusCode}`);
        }
        if (headers === null) {
            throw new TypeError('headers cannot be null');
        }
        if (typeof headers !== 'object') {
            throw new TypeError(`headers must be an object but was ${typeof headers}`);
        }
        this.statusCode = statusCode;
        this.headers = headers;
        this.payload = payload;
    }

    /**
     * Send the response on the wire
     * @function send
     * @param {res} res Express response object
     */
    send(res) {
        const response = this.payload;
        res.statusCode = this.statusCode;
        for (const key in this.headers) {
            res.set(key.toLowerCase(), this.headers[key]);
        }
        return res.send(response);
    }

    // 2XX  SUCCESS

    /**
     * Create a new Response instance with HTTP status code 200
     * @param {Object} payload - Payload data
     * @returns {Response}
     */
    static OK(payload) {
        return new Response(200, { 'Content-Type': 'application/json' }, payload);
    }
    /**
     * Create a new Response instance with HTTP status code 201
     * @param {Object} payload - Payload data
     * @returns {Response}
     */
    static Created(payload) {
        return new Response(201, { 'Content-Type': 'application/json' }, payload);
    }

    // 3XX  REDIRECTION

    /**
     * Create a new Response instance with HTTP status code 301
     * @param {Object} payload - Payload data
     * @returns {Response}
     */
    static MovedPermanently(payload) {
        return new Response(301, { 'Content-Type': 'application/json' }, payload);
    }

    // 4XX  CLIENT ERROR

    /**
     * Create a new Response instance with HTTP status code 400
     * @param {Object} payload - Payload data
     * @returns {Response}
     */
    static BadRequest(payload) {
        return new Response(400, { 'Content-Type': 'application/json' }, payload);
    }
    /**
     * Create a new Response instance with HTTP status code 401
     * @param {Object} payload - Payload data
     * @returns {Response}
     */
    static Unauthorized(payload) {
        return new Response(401, { 'Content-Type': 'application/json' }, payload);
    }
    /**
     * Create a new Response instance with HTTP status code 403
     * @param {Object} payload - Payload data
     * @returns {Response}
     */
    static Forbidden(payload) {
        return new Response(403, { 'Content-Type': 'application/json' }, payload);
    }
    /**
     * Create a new Response instance with HTTP status code 404
     * @param {Object} payload - Payload data
     * @returns {Response}
     */
    static NotFound(payload) {
        return new Response(404, { 'Content-Type': 'application/json' }, payload);
    }
    /**
     * Create a new Response instance with HTTP status code 405
     * @param {Object} payload - Payload data
     * @returns {Response}
     */
    static MethodNotAllowed(payload) {
        return new Response(405, { 'Content-Type': 'application/json' }, payload);
    }
    /**
     * Create a new Response instance with HTTP status code 415
     * @param {Object} payload - Payload data
     * @returns {Response}
     */
    static UnsupportedMediaType(payload) {
        return new Response(415, { 'Content-Type': 'application/json' }, payload);
    }
    /**
     * Create a new Response instance with HTTP status code 429
     * @param {Object} payload - Payload data
     * @returns {Response}
     */
    static TooManyRequests(payload) {
        return new Response(429, { 'Content-Type': 'application/json' }, payload);
    }

    // 5XX SERVER ERROR

    /**
     * Create a new Response instance with HTTP status code 500
     * @param {Object} payload - Payload data
     * @returns {Response}
     */
    static InternalServerError(payload) {
        return new Response(500, { 'Content-Type': 'application/json' }, payload);
    }
    /**
     * Create a new Response instance with HTTP status code 501
     * @param {Object} payload - Payload data
     * @returns {Response}
     */
    static NotImplemented(payload) {
        return new Response(501, { 'Content-Type': 'application/json' }, payload);
    }
    /**
     * Create a new Response instance with HTTP status code 502
     * @param {Object} payload - Payload data
     * @returns {Response}
     */
    static BadGateway(payload) {
        return new Response(502, { 'Content-Type': 'application/json' }, payload);
    }
    /**
     * Create a new Response instance with HTTP status code 503
     * @param {Object} payload - Payload data
     * @returns {Response}
     */
    static ServiceUnavailable(payload) {
        return new Response(503, { 'Content-Type': 'application/json' }, payload);
    }
};
