
const jwt = require('jsonwebtoken');

const CheckAuthUser = async (req, res, next) => {
 

  try {
    const token = req.cookies.usertoken|| req.headers['x-access-token'];
    if (token) {
        const decoded = await jwt.verify(token, "ghjgfhwmhfvvfgvuser");
        req.user = decoded; 
        console.log("Decoded User:", req.user)
    }else {
        req.user = null; // No token found
      }
} catch (err) {
    console.error('Token verification failed:', err.message);  
    req.user = null; // Set user to null on error
}
next(); // Call next middleware


};

//------------------------------------------ 

// Middleware to authenticate admin
const CheckAuthAdmin = (req, res, next) => {
  const token = req.cookies.admintoken|| req.headers['x-access-token'];

  if (!token) {
      console.log('token is missing');
      return res.redirect('/admin/');  // Redirect to signin or error page
  }

  jwt.verify(token, 'ghcghvchgvhvvmjhadmin', (err, decoded) => {
      if (err) {
          console.error('Error verifying admin token:', err);
          return res.redirect('/admin/');  // Redirect to signin or error page
      }

      req.admin = decoded;
      next();
  });
};

 


// Middleware to authenticate employee
const CheckAuthMerchant = (req, res, next) => {
  const token = req.cookies.merchanttoken|| req.headers['x-access-token'];

  if (!token) {
      console.log('token is missing');
      return res.redirect('/merchant/');  // Redirect to signin or error page
  }

  jwt.verify(token, 'ghcghvjyfyfmerchant', (err, decoded) => {
      if (err) {
          console.error('Error verifying employee token:', err);
          return res.redirect('/merchant/');  // Redirect to signin or error page
      }

      req.merchant = decoded;
      next();
  });
};


Authadmin = (req, res, next) => {
  if (req.admin){
      console.log('after login user',req.admin);
      return next()
  } else {
      console.log( 'Error While Auth');
      res.redirect('/admin/') 
  }
}

Authmerchant = (req, res, next) => {
  if (req.merchant){
      console.log('after login user',req.merchant);
      return next()
  } else {
      console.log( 'Error While Auth');
      res.redirect('/') 
  }
}


AuthUser = (req, res, next) => {
  if (req.user){
      console.log('after login user',req.user);
      return next()
  } else {
      console.log( 'Error While Auth');
      res.redirect('/login') 
  }
}




module.exports={
    CheckAuthUser,
    CheckAuthAdmin,
    CheckAuthMerchant,
    Authadmin,
    Authmerchant,
    AuthUser
}
