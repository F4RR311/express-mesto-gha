const Users = require('../models/user');

module.exports.getUser = (req, res) => {
    Users.find({})
        .then((users) => res.send({ data: users }))
        .catch((err) => res.status(500).send({ message: 'Произошла ошибка', err }));
};

module.exports.getUserId = (req, res) => {
    Users.findById(req.params.userId)
        .then((user)=>{
            res.status(200).send({data: user})
        })
        .catch((err) => {
            if (err.name === 'CastError') {
                return res.status(400).send({ message: 'Переданы некорректные данные' });
            }
            if (err.statusCode === 404) {
                return res.status(404).send({ message: err.errorMessage });
            }
            return res.status(500).send({ message: 'Ошибка по-умолчанию' });
        });
}

module.exports.updateUserInfo = (req, res) =>{
    const {name, about} = req.body;
    Users.findByIdAndUpdate(req.user._id, {name, about}, {new: true, runValidators: true})
        .then(user => res.status(200).send({data: user}))
        .catch((err) => {
            if (err.name === 'ValidationError') {
                return res.status(400).send({ message: 'Переданы некорректные данные' });
            }
            if (err.statusCode === 404) {
                return res.status(404).send({ message: err.errorMessage });
            }
            return res.status(500).send({ message: 'Ошибка по-умолчанию' });
        });
}
module.exports.createUser = (req, res) => {
    const { name, about, avatar } = req.body;
    Users.create({ name, about, avatar })
        .then((user) => res.status(200).send({ data: user }))
        .catch((err) => {
            if (err.name === 'ValidationError') {
                return res.status(400).send({ message: 'Переданы некорректные данные' });
            }
            return res.status(500).send({ message: 'Ошибка по-умолчанию' });
        });
};
module.exports.updateAvatar = (req, res) => {
    const { avatar } = req.body;
    Users.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })

        .then((user) => res.status(200).send({ data: user }))
        .catch((err) => {
            if (err.name === 'ValidationError') {
                return res.status(400).send({ message: 'Переданы некорректные данные' });
            }
            if (err.statusCode === 404) {
                return res.status(404).send({ message: err.errorMessage });
            }
            return res.status(500).send({ message: 'Ошибка по-умолчанию' });
        });
};