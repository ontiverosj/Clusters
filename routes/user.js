const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')

// user model 
const User = require('../models/User')

router.get('/login', (req, res) => res.render('login')); 

router.get('/register', (req, res) => res.render('register')); 

//res hand
router.post('/register', (req, res) => { 
   const { name, email, password, password2  } = req.body
   let errors = []; 
   
   // check fields 
   if(!name || !email || !password || !password2) { 
       errors.push({ msg: 'please fill in '})
   }
   if(password !== password2) { 
       errors.push({msg: 'PW does not match'})
   }

   //check password length 
   if(password.length < 6) { 
       errors.push({msg: 'password should be at least 6 characters'})
   }
   if(errors.length > 0) {
    res.render('register', { 
        errors, 
        name,
        email, 
        password,
        password2

    });
   } else {
       // Val
    User.findOne({ email: email})
    .then(user => {
    if(user) { 
        // User is here 
        errors.push({ msg: 'Email already exists' });
        res.render('register', { 
            errors, 
            name,
            email, 
            password,
            password2
         });
    } else { 
        const newUser = new User({ 
            name, 
            email, 
            password
        });
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser
                .save()
                .then(user => {
                  req.flash(
                    'success_msg',
                    'You are now registered and can log in'
                  );
                  res.redirect('/user/login');
                })
                .catch(err => console.log(err));
            });
          });
    

    }
   });
}
});
module.exports = router;  