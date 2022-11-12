[@scoby/analytics-ts](../README.md) / Client

# Class: Client

## Table of contents

### Constructors

- [constructor](Client.md#constructor)

### Properties

- [apiHost](Client.md#apihost)

### Methods

- [getVisitorId](Client.md#getvisitorid)
- [hash](Client.md#hash)
- [logPageView](Client.md#logpageview)

## Constructors

### constructor

• **new Client**(`jarId`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `jarId` | `string` |

## Properties

### apiHost

• `Private` `Readonly` **apiHost**: `string`

#### Defined in

index.ts:14

## Methods

### getVisitorId

▸ `Private` **getVisitorId**(`pageView`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `pageView` | [`PageView`](../interfaces/PageView.md) |

#### Returns

`string`

___

### hash

▸ `Private` **hash**(`value`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `string` |

#### Returns

`string`

___

### logPageView

▸ **logPageView**(`pageView`): `Promise`<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `pageView` | [`PageView`](../interfaces/PageView.md) |

#### Returns

`Promise`<`boolean`\>
