var express = require('express');
var router = express.Router();
var idschema = require('./idSchema');

router.get('/', (req, res, next) => {
    idschema.find()
    .exec(function(err, list_id) {
        if (err) {return next(err);}
        res.json(list_id);
    });
});

router.post('/create', (req, res, next) => {
    var id = new idschema({
        name: req.body.name,
        count: req.body.count
    });
    id.save()
        .then(id => {
            res.status(200).json(id);
        })
        .catch(err => {
            res.status(400).send('creating failed');
        });
});

router.post('/delete/:id', (req, res, next) => {
    idschema.findByIdAndRemove(req.params.id, function deleteID(err) {
        if (err) {return next(err);}
        res.status(200).json("Success");
    });
})

// Do NOT use this EVER.
// router.post('/set', (req, res, next) => {
//     idschema.find({name:req.body.name})
//     .exec(function(err, counter) {
//         if (!counter) {
//             res.status(404).send("Counter not found.");
//         } else {
//             counter[0].count = req.body.count;
//             counter[0].save()
//                 .then(counter => {
//                     res.status(200).json(counter);
//                 })
//                 .catch(err => {
//                     res.status(400).send('Updating failed');
//                 });
//         }
//     });
// });

// router.post('/add', (req, res, next) => {
//     idschema.find({name:req.body.name})
//     .exec(function(err, counter) {
//         if (!counter) {
//             res.status(404).send("Counter not found.");
//         } else {
//             counter[0].count += 1;
//             counter[0].save()
//                 .then(counter => {
//                     res.status(200).json(counter);
//                 })
//                 .catch(err => {
//                     res.status(400).send('Updating failed');
//                 });
//         }
//     });
// });


module.exports = router;