import { PayloadBuilder } from '@xyo-network/payload-builder'

import { reportDivinerResult } from '../reportDivinerResult'

describe('reportDivinerResult', () => {
  it('reports diviner results', async () => {
    const payload = new PayloadBuilder({ schema: 'network.xyo.test' }).build()
    expect(await reportDivinerResult(payload)).toBeArray()
  })
})
