// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  Address,
  DataSourceTemplate,
  DataSourceContext
} from "@graphprotocol/graph-ts";

export class UniswapV2Pair extends DataSourceTemplate {
  static create(address: Address): void {
    DataSourceTemplate.create("UniswapV2Pair", [address.toHex()]);
  }

  static createWithContext(address: Address, context: DataSourceContext): void {
    DataSourceTemplate.createWithContext(
      "UniswapV2Pair",
      [address.toHex()],
      context
    );
  }
}

export class UniswapV3Pair extends DataSourceTemplate {
  static create(address: Address): void {
    DataSourceTemplate.create("UniswapV3Pair", [address.toHex()]);
  }

  static createWithContext(address: Address, context: DataSourceContext): void {
    DataSourceTemplate.createWithContext(
      "UniswapV3Pair",
      [address.toHex()],
      context
    );
  }
}
