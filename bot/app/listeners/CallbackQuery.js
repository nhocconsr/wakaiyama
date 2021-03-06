import Base from '../Base.js'
import UserModel from '../models/User.js'
import WordModel from '../models/Word.js'

export default class CallbackQuery extends Base {
  static async init (ctx) {
    CallbackQuery[ctx.update.callback_query.data](ctx)
  }

  static async getWordInfo (ctx) {
    const telegramUserID = ctx.update.callback_query.from.id
    const { study: { element_hash } } = await UserModel.findOne({ user_id: telegramUserID })
    const { en, ru } = await WordModel.findById(element_hash)
    ctx.reply(`${ru} - ${en}`)
  }
}
