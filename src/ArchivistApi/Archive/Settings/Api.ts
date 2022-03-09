import { XyoArchivistApiBase } from '../../Base'
import { XyoArchivistArchiveSettingsKeysApi } from './Keys'

export class XyoArchivistArchiveSettingsApi extends XyoArchivistApiBase {
  private _keys?: XyoArchivistArchiveSettingsKeysApi
  public get keys(): XyoArchivistArchiveSettingsKeysApi {
    this._keys = this._keys ?? new XyoArchivistArchiveSettingsKeysApi(this.config)
    return this._keys
  }
}
