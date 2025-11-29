const router = require('express').Router();
const {create, login, verify} = require('../../controllers/auth.controller'); 

router.post('/new-user', create);
router.post('/login', login);
router.get('/verify', verify);


module.exports = router;