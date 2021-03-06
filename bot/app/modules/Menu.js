import TelegrafInlineMenu from 'telegraf-inline-menu'
import langs from '../../langs.js'
import UserHelper from '../helpers/User.js'
import AlfabetJPWorker from '../topics/jp/AlfabetWorker.js'

const langMenu = new TelegrafInlineMenu('Выберите язык для изучения:')

// this is for guide
// langMenu.urlButton('Инструкция', 'https://edjopato.de')

for (const lang of langs) {
  const topicsMenu = new TelegrafInlineMenu('Выберите тему:')

  langMenu.submenu(lang.name, `selected_lang_${lang.key}`, topicsMenu)

  for (const topic of lang.topics) {

    if (topic.levels && topic.levels.length > 0) {

      const levelsMenu = new TelegrafInlineMenu('Выберите уровень сложности:')
      topicsMenu.submenu(topic.name, `selected_topic_${topic.key}`, levelsMenu)

      for (const level of topic.levels) {

        levelsMenu.button(level.name, `selected_level_${level.key}`, {
          doFunc: async ctx => {
            const tlgUserId = ctx.update.callback_query.from.id
            const user = await UserHelper.getUserByTlgID(tlgUserId)
            console.log(`selected_level_${level.key}`)
            await UserHelper.saveProperties(user._id, {
              study: {
                lang: lang.key,
                topic: topic.key,
                level: level.key
              }
            })
            const alphJPObj = new AlfabetJPWorker(topic.key)
            await alphJPObj.sendNewElement(tlgUserId, ctx)
          }
        })

      }

    } else {

      topicsMenu.button(topic.name, `choose_topic_${topic.key}`, {
        doFunc: async ctx => {
          const tlgUserId = ctx.update.callback_query.from.id
          const user = await UserHelper.getUserByTlgID(tlgUserId)
          await UserHelper.saveProperties(user._id, {
            study: {
              lang: lang.key,
              topic: topic.key
            }
          })
          await UserHelper.sendNewWord(tlgUserId, ctx)
        }
      })

    }
  }

}

langMenu.setCommand('menu')

export const Menu = langMenu
