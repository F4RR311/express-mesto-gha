const Cards = require('../models/card');

module.exports.getCard = (req, res) => {
    Cards.find({})
        .then((cards) => res.send({ data: cards }))
        .catch((err) => res.status(500).send({ message: 'Ошибка по-умолчанию', err }));
};

module.exports.createCard = (req, res) => {
    const { name, link } = req.body;
    const ownerId = req.user._id;
    Cards.create({ name, link, owner: ownerId })
        .then((card) => res.status(200).send({ data: card }))
        .catch((err) => {
            if (err.name === 'ValidationError') {
                return res.status(400).send({ message: 'Переданы некорректные данные' });
            }
            return res.status(500).send({ message: 'Ошибка по-умолчанию' });
        });
};

module.exports.likeCard = (req, res) => {
    Cards.findByIdAndUpdate(
        req.params.cardId,
        { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
        { new: true },
    )

        .then((card) => res.status(200).send({ data: card }))
        .catch((err) => {
            if (err.name === 'CastError') {
                return res.status(400).send({ message: 'Переданы некорректные данные' });
            }
            if (err.statusCode === 404) {
                return res.status(404).send({ message: 'Карточка не найдена' });
            }
            return res.status(500).send({ message: 'Ошибка по-умолчанию' });
        });
};

module.exports.dislikeCard = (req, res) => {

    Cards.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })

        .then((card) => res.status(200).send({ data: card }))
        .catch((err) => {
            if (err.name === 'CastError') {
                return res.status(400).send({ message: 'Переданы некорректные данные' });
            }
            if (err.statusCode === 404) {
                return res.status(404).send({ message: 'Карточка не найдена' });
            }
            return res.status(500).send({ message: 'Ошибка по-умолчанию' });
        });
};

module.exports.deleteCard = (req, res) => {
    Cards.findByIdAndRemove(req.params.cardId)

        .then((card) => res.status(200).send({ data: card }))
        .catch((err) => {
            if (err.name === 'CastError') {
                return res.status(400).send({ message: 'Переданы некорректные данные' });
            }
            if (err.statusCode === 404) {
                return res.status(404).send({ message: err.errorMessage });
            }
            return res.status(500).send({ message: 'Ошибка по-умолчанию' });
        });
};
