# Ponz.io
Building Ponz.io, with its endearingly upside-down-triangle-shaped business model.
MArk and Nicolas


######################################
CHANGES TO SCHEMA TO UPDATE POINTS ON USER CREATION

const UserSchema = new Schema(
  {
    username: {type: String, required: true, unique: true},
    passwordHash: {type: String},
    children: [
      {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    level: {type: Number},
    parentId: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    points: {type: Number},
  },
  {timestamps: true}
);

This allows us to traverse up any time we add a user, updating the score for each ancestor depending on the level difference.

######################################
DISPLAYING NESTED TREE OF CHILDREN

We can use mongoose to populate all the children.
Problem: How to populate and show an unknown depth?

- We could have one extra field in the UserSchema where we save the "depth of furthest child"
- With this in mongoose we could do something like: "for i=0 to i=6, populate children"
- In Handlebars I still don't see how to display a variable depth in one template,
maybe with a custom helper.



