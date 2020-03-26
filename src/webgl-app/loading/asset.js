/**
 *
 *
 * @interface AssetConfig
 */
export interface AssetConfig {
  id: string;
  src: string;
  type: string;
  args?: Object;
  data?: mixed;
}

/**
 *
 *
 * @export
 * @class Asset
 */
export default class Asset {
  id: string;
  src: string;
  type: string;
  args: Object;
  data: mixed;
  constructor(config: AssetConfig) {
    Object.assign(this, config);
  }
}
