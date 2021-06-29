const {Router} = require('express');
const router = Router();
const admin = require ('firebase-admin');

var serviceAccount = require('../../node-firebase-example-a0781-firebase-adminsdk-7q2iw-29fae3c31b.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://node-firebase-example-a0781-default-rtdb.firebaseio.com/'
})

const db = admin.database();

router.get('/', (req, res) =>{
    db.ref('contacts').once('value', (snapshot) =>{
        const data = snapshot.val();
        res.render('index', {contacts: data});
    });
    
});

//crear contacto
router.post('/new-contact', (req, res) =>{
    const newContact = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        phone: req.body.phone
    };
    db.ref('contacts').push(newContact);
    res.redirect('/');
});

//Eliminar contacto
router.get('/delete-contact/:id', (req, res) =>{
    db.ref('contacts/' + req.params.id).remove();
    res.redirect('/')
});

//editar contacto
router.get('/edit-contact/:id', (req, res) =>{
    db.ref('contacts/'+ req.params.id).once('value', (snapshot) =>{
        const data = snapshot.val();
        res.render('edit-contact', {cont: data, id: req.params.id});
    });
});

router.post('/edit/:id', (req, res) => {
    db.ref('contacts/'+ req.params.id).update({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        phone: req.body.phone
    });
    res.redirect('/');
});



module.exports = router;
