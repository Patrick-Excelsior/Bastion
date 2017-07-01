/**
 * @file profile command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');

exports.run = (Bastion, message, args) => {
  if (!(args = message.mentions.users.first())) {
    args = message.author;
  }
  Bastion.db.get(`SELECT p1.*, (SELECT COUNT(*) FROM profiles AS p2 WHERE p2.xp>p1.xp) AS rank FROM profiles as p1 WHERE p1.userID=${args.id}`).then(profile => {
    if (!profile) {
      if (args === message.author) {
        return message.channel.send({
          embed: {
            color: Bastion.colors.green,
            description: `Your profile is now created, <@${args.id}>`
          }
        }).catch(e => {
          Bastion.log.error(e);
        });
      }

      /**
       * Error condition is encountered.
       * @fires error
       */
      return Bastion.emit('error', string('notFound', 'errors'), string('profileNotCreated', 'errorMessage', `<@${args.id}>`), message.channel);
    }

    message.channel.send({
      embed: {
        color: Bastion.colors.blue,
        title: args.tag,
        description: profile.bio || `No bio has been set. ${args.id === message.author.id ? 'Set your bio using `setBio` command.' : ''}`,
        fields: [
          {
            name: 'Bastion Currency',
            value: profile.bastionCurrencies,
            inline: true
          },
          {
            name: 'Rank',
            value: profile.rank + 1,
            inline: true
          },
          {
            name: 'Experience Points',
            value: profile.xp,
            inline: true
          },
          {
            name: 'Level',
            value: profile.level,
            inline: true
          }
        ],
        thumbnail: {
          url: args.displayAvatarURL
        }
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'profile',
  description: string('profile', 'commandDescription'),
  botPermission: '',
  userPermission: '',
  usage: 'profile [@user-mention]',
  example: [ 'profle', 'profile @user#0001' ]
};