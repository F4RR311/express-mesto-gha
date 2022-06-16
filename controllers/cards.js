const Cards = require('../models/card');

const BAD_REQ = 400;
const NOT_FOUND = 404;
const CAST_ERR = 500;


module.exports.getCard = (req, res) => {
    Cards.find({})
        .then((cards) => res.send({data: cards}))
        .catch((err) => {
            if (err.name === 'ValidationError' || err.name === 'CastError') {
                res.status(BAD_REQ).send({ message: 'Переданы некорректные данные при создании карточки.' });
                return;
            }
            res.status(CAST_ERR).send({ message: 'Ошибка по умолчанию.' });
        });
};

module.exports.createCard = (req, res) => {
    const {name, link} = req.body;
    const ownerId = req.user._id;
    Cards.create({name, link, owner: ownerId})
        .then((card) => res.status(200).send({data: card}))
        .catch((err) => {
            if (err.name === 'ValidationError' || err.name === 'CastError') {
                res.status(BAD_REQ).send({ message: 'Переданы некорректные данные при создании карточки.' });
                return;
            }
            res.status(CAST_ERR).send({ message: 'Ошибка по умолчанию.' });
        });
};

module.exports.likeCard = (req, res) => {
    Cards.findByIdAndUpdate(
        req.params.cardId,
        {$addToSet: {likes: req.user._id}}, // добавить _id в массив, если его там нет
        {new: true},
    )
        .orFail(() => new Error('Not Found'))
        .then((card) => res.status(20).send({data: card}))
        .catch((err) => {
            console.log(err.name);
            if (err.name === 'ValidationError' || err.name === 'CastError') {
                res.status(BAD_REQ).send({ message: 'Переданы некорректные данные для постановки лайка.' });
                return;
            }
            if (err.message === 'Not Found') {
                res.status(NOT_FOUND).send({ message: 'Передан несуществующий _id карточки.' });
                return;
            }
            res.status(CAST_ERR).send({ message: 'Ошибка по умолчанию.' });
        });
};

module.exports.dislikeCard = (req, res) => {
    Cards.findByIdAndUpdate(req.params.cardId, {$pull: {likes: req.user._id}}, {new: true})
        .orFail(() => new Error('Not Found'))
        .then((card) => res.status(200).send({data: card}))
        .catch((err) => {
            if (err.name === 'ValidationError' || err.name === 'CastError') {
                res.status(BAD_REQ).send({message: 'Переданы некорректные данные для снятия лайка.'});
                return;
            }
            if (err.message === 'Not Found') {
                res.status(NOT_FOUND).send({message: 'Передан несуществующий _id карточки.'});
                return;
            }
            res.status(CAST_ERR).send({message: 'Ошибка по умолчанию.'});
        });
};

module.exports.deleteCard = (req, res) => {
    Cards.findByIdAndRemove(req.params.cardId)
        .orFail(() => new Error('Not Found'))
        .then((card) => res.status(200).send({data: card}))
        .catch((err) => {
            if (err.name === 'ValidationError' || err.name === 'CastError') {
                res.status(BAD_REQ).send({message: 'Переданы некорректные данные для постановки лайка.'});
                return;
            }
            if (err.message === 'Not Found') {
                res.status(NOT_FOUND).send({message: 'Карточка с указанным _id не найдена.'});
                return;
            }
            res.status(CAST_ERR).send({message: 'Ошибка по умолчанию.'});
        });
};
