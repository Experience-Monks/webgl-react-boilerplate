/**
 *
 *
 * @interface AssetConfig
 */
interface AssetConfig {
  id: String;
  src: String;
  type: String;
  args?: Object;
  data?: any;
}

/**
 *
 *
 * @export
 * @class Asset
 */
export default class Asset {
  id: String;
  src: String;
  type: String;
  args: Object;
  data: any;
  constructor(config: AssetConfig) {
    Object.assign(this, config);
  }
}
