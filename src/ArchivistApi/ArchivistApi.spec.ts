/* eslint-disable sort-keys-fix/sort-keys-fix */
/* eslint-disable sort-keys */
import { XyoAddress } from '../Address'
import { XyoBoundWitnessBuilder } from '../BoundWitnessBuilder'
import { TestPayload } from '../Test'
import ArchivistApi from './ArchivistApi'
import ArchivistApiConfig from './ArchivistApiConfig'

test('checking happy path', async () => {
  const payload: TestPayload = {
    timestamp: 1618603439107,
    number_field: 1,
    object_field: {
      number_value: 2,
      string_value: 'yo',
    },
    string_field: 'there',
  }

  const config: ArchivistApiConfig = {
    archive: 'test',
    apiDomain: 'http://localhost:3030/dev',
  }

  const address = XyoAddress.random()

  let builder = new XyoBoundWitnessBuilder()
  expect(builder).toBeDefined()
  builder = builder.witness(address, null)
  expect(builder).toBeDefined()

  builder = builder.payload('network.xyo.test', payload)
  expect(builder).toBeDefined()

  const json = builder.build()
  expect(json).toBeDefined()

  const api = ArchivistApi.get(config)
  expect(api).toBeDefined()
  expect(api.authenticated).toEqual(false)
  try {
    const postBoundWitnessResult = await api.postBoundWitness(json)
    expect(postBoundWitnessResult.boundWitnesses).toEqual(1)
  } catch (ex) {
    console.log(JSON.stringify(ex.response?.data, null, 2))
    throw ex
  }
  try {
    const postBoundWitnessesResult = await api.postBoundWitnesses([json, json])
    expect(postBoundWitnessesResult.boundWitnesses).toEqual(2)
  } catch (ex) {
    console.log(JSON.stringify(ex.response?.data, null, 2))
    throw ex
  }
}, 40000)
