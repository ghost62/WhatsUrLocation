const {AuthenticationError} = require('apollo-server')
const Pin = require('./models/Pin')


const authenticated = next => (root,args,ctx,info) =>{
    if(!ctx.currentUser){
        throw new AuthenticationError('You must login');
    }
    return next(root,args,ctx,info);
}

module.exports = {
  Query: {
    me: authenticated((root, args, ctx, info) => ctx.currentUser),
    getPins: async (root, args, ctx) => {
      const pins = await Pin.find({})
        .populate("author")
        .populate("comments.author");
      return pins;
    }
  },
  Mutation: {
    createPin: authenticated(async (root, args, ctx, info) => {
      const newPin = await new Pin({
        ...args.input,
        author: ctx.currentUser._id
      }).save();
      const pinAdded = await Pin.populate(newPin,'author')
      return pinAdded;
    }),
    deletePin: authenticated(async (root, args, ctx) => {
      const pinDeleted = await Pin.findOneAndDelete({ _id: args.pinId }).exec();
      // pubsub.publish(PIN_DELETED, { pinDeleted });
      return pinDeleted;
    }),
    createComment: authenticated(async (root, args, ctx) => {
      const newComment = { text: args.text, author: ctx.currentUser._id };
      const pinUpdated = await Pin.findOneAndUpdate(
        { _id: args.pinId },
        { $push: { comments: newComment } },
        { new: true }
      )
        .populate("author")
        .populate("comments.author");
      // pubsub.publish(PIN_UPDATED, { pinUpdated });
      return pinUpdated;
    })
  },
};