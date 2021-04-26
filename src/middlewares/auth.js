module.exports = (req, res, next) => {
   if (!req.session.usuario) {
      return res.redirect('/login');
   }

   return next();
}