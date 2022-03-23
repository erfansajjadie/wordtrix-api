function methodNotAllowedHandler(req, res) {
    res.sendStatus(405)
}

exports.methodsHandler = methodNotAllowedHandler;