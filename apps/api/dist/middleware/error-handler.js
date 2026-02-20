export function registerErrorHandler(app) {
  app.setErrorHandler(async (err, req, reply) => {
    app.log.error(
      {
        requestId: req.requestId,
        url: req.url,
        method: req.method,
        err,
      },
      'request error',
    );
    const statusCode = err.statusCode && err.statusCode >= 400 ? err.statusCode : 500;
    const safeMessage = statusCode >= 500 ? 'Internal server error' : err.message;
    return reply.status(statusCode).send({
      ok: false,
      error: safeMessage,
      requestId: req.requestId,
    });
  });
}
