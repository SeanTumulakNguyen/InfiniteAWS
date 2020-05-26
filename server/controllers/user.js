exports.read = (req, res) => {
    req.profile.hased_password = undefined
    req.profile.salt = undefined
    return res.json(req.profile)
}

