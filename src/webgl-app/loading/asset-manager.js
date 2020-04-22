import Asset from './asset';

/**
 * Asset manager's purpose is to store loaded assets by the AssetLoader
 * Assets can be retrived by using the get() function
 *
 * @class AssetManager
 */
class AssetManager {
  assets: Object;

  constructor() {
    this.assets = {};
  }

  /**
   * Add an asset group
   *
   * @param {String} group
   * @param {Asset[]} assets
   * @memberof AssetManager
   */
  add(group: String, assets: Asset[]) {
    this.assets[group] = this.assets[group] || [];
    this.assets[group].push(...assets);
  }

  /**
   * Retrieve an asset by id
   *
   * @param {String} groupId
   * @param {String} id
   * @param {Boolean} [all=false]
   * @returns
   * @memberof AssetManager
   */
  get(groupId: string, id: string, all: boolean = false): boolean | mixed {
    // console.log('groupId', groupId, 'id', id);
    const asset = this.find(this.assets[groupId], id);
    if (asset && asset instanceof Asset) {
      return all ? asset : asset.data;
    }
    return false;
  }

  /**
   * Find an asset by id
   *
   * @param {Asset[]} assets
   * @param {String} id
   * @returns
   * @memberof AssetManager
   */
  find(assets: Asset[], id: string): boolean | Asset {
    return assets.find(asset => asset.id === id) || false;
  }
}

export default new AssetManager();
