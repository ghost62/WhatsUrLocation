const {AuthenticationError} = require('apollo-server')

const user = {
    _id:'1',
    name:'Bijit',
    email:'test@mail.com',
    picture:''
}

const authenticated = next => (root,args,ctx,info) =>{
    if(!ctx.currentUser){
        throw new AuthenticationError('You must login');
    }
    return next(root,args,ctx,info);
}

module.exports = {
    Query: {
        me: authenticated((root,args,ctx,info)=>ctx.currentUser)
    }
}