const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema(
  {
    id: { type: Number, required: true, trim: true },
    is_bot: { type: Boolean, required: true },
    first_name: { type: String, required: true, trim: true },
    last_name: { type: String, required: true, trim: true },
    username: { type: String, required: true, trim: true },
    language_code: { type: String, required: true, trim: true },
    added_date: { type: Date, default: Date.now }
  },
  {
    versionKey: false
  }
)

UserSchema.pre('save', function (next) {
  const post = this
  if (!post.createdAt) {
    post.createdAt = new Date()
  }
  next()
})

module.exports = mongoose.model('users', UserSchema)
