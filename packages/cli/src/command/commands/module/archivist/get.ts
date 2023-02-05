import { ArgumentsCamelCase, CommandBuilder, CommandModule } from 'yargs'

// eslint-disable-next-line @typescript-eslint/ban-types
type Arguments = {}

export const aliases: ReadonlyArray<string> = []
export const builder: CommandBuilder = {
  banana: {
    default: 'cool',
  },
  batman: {
    default: 'sad',
  },
}
export const command = 'start'
export const deprecated = false
export const describe = 'start the node'
export const handler = function (_argv: ArgumentsCamelCase<Arguments>) {
  // do something with argv.
  console.log('handler')
  process.stdout.write('handler')
}

const mod: CommandModule = {
  aliases,
  command,
  deprecated,
  describe,
  handler,
}

// eslint-disable-next-line import/no-default-export
export default mod
