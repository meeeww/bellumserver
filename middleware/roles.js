const forbidden = ((res) => {
    return res.status(403).send({
        status: 403,
        success: false,
        error: "Acceso denegado.",
    });
})

function admin(req, res, next) {
    if (req.user.permisos < 3) return forbidden(res);
    next();
}

function coach(req, res, next) {
    if (req.user.permisos < 2) return forbidden(res);
    next();
}

function viewer(req, res, next) {
    if (!req.user.permisos && req.user.permisos != 0) return forbidden(res);
    next();
}

function self(req, res, next) {
    if (req.body.id_usuario != req.user.id) return forbidden(res);
    next();
}

module.exports = { admin, coach, viewer, self };
